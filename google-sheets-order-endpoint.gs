const SHEET_NAME = 'Orders';
const LOCK_TIMEOUT_MS = 30000;

function doGet(e) {
  const callback = e.parameter.callback || '';
  const action = e.parameter.action || 'health';

  try {
    if (action === 'health') {
      const sheet = getOrdersSheet_();
      return respond_({
        ok: true,
        message: 'Persona order endpoint is live.',
        sheet: sheet.getName()
      }, callback);
    }

    if (action === 'createOrder') {
      const order = JSON.parse(e.parameter.payload || '{}');
      const result = createOrder_(order);
      return respond_(result, callback);
    }

    if (action === 'updatePayment') {
      const result = updatePayment_(e.parameter.orderId, e.parameter.paymentStatus, e.parameter.orderStatus);
      return respond_(result, callback);
    }

    return respond_({ ok: false, message: 'Unknown action.' }, callback);
  } catch (error) {
    return respond_({
      ok: false,
      message: error && error.message ? error.message : 'Order could not be saved.'
    }, callback);
  }
}

function doPost(e) {
  const callback = e.parameter.callback || '';

  try {
    const rawPayload = e.parameter.payload || e.postData.contents;
    const order = JSON.parse(rawPayload);
    const result = createOrder_(order);
    return respond_(result, callback);
  } catch (error) {
    return respond_({
      ok: false,
      message: error && error.message ? error.message : 'Order could not be saved.'
    }, callback);
  }
}

function createOrder_(order) {
  validateOrder_(order);

  const lock = LockService.getScriptLock();
  lock.waitLock(LOCK_TIMEOUT_MS);

  try {
    const sheet = getOrdersSheet_();
    const existingRow = findOrderRow_(sheet, order.orderId);

    if (existingRow > 0) {
      return { ok: true, orderId: order.orderId, duplicate: true };
    }

    const itemsText = order.items.map(item => {
      return `${item.name} | Size: ${item.size} | Qty: ${item.quantity} | Price: ${item.price}`;
    }).join('\n');

    sheet.appendRow([
      order.createdAt,
      order.orderId,
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.customer.address,
      order.customer.city,
      order.customer.state,
      order.customer.pincode,
      itemsText,
      order.itemCount,
      order.subtotal,
      order.total,
      order.paymentStatus || 'Pending payment',
      order.orderStatus || 'Awaiting payment',
      '',
      order.customer.notes || ''
    ]);

    SpreadsheetApp.flush();
    return { ok: true, orderId: order.orderId, paymentStatus: order.paymentStatus || 'Pending payment' };
  } finally {
    lock.releaseLock();
  }
}

function updatePayment_(orderId, paymentStatus, orderStatus) {
  if (!orderId) throw new Error('Missing order ID.');

  const lock = LockService.getScriptLock();
  lock.waitLock(LOCK_TIMEOUT_MS);

  try {
    const sheet = getOrdersSheet_();
    const row = findOrderRow_(sheet, orderId);

    if (row < 1) {
      throw new Error('Order not found.');
    }

    sheet.getRange(row, 14).setValue(paymentStatus || 'Payment status unknown');
    sheet.getRange(row, 15).setValue(orderStatus || 'Payment update received');
    sheet.getRange(row, 16).setValue(new Date().toISOString());

    SpreadsheetApp.flush();
    return { ok: true, orderId, paymentStatus, orderStatus };
  } finally {
    lock.releaseLock();
  }
}

function validateOrder_(order) {
  if (!order || !order.orderId) throw new Error('Invalid order.');
  if (!order.customer || !order.customer.name || !order.customer.phone || !order.customer.address) {
    throw new Error('Missing customer details.');
  }
  if (!order.items || !order.items.length) throw new Error('Cart is empty.');
}

function getOrdersSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Created At',
      'Order ID',
      'Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'State',
      'PIN Code',
      'Items',
      'Item Count',
      'Subtotal',
      'Total',
      'Payment Status',
      'Order Status',
      'Payment Updated At',
      'Notes'
    ]);
    SpreadsheetApp.flush();
  }

  return sheet;
}

function findOrderRow_(sheet, orderId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  const orderIds = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  for (let index = 0; index < orderIds.length; index += 1) {
    if (String(orderIds[index][0]) === String(orderId)) {
      return index + 2;
    }
  }

  return -1;
}

function respond_(payload, callback) {
  const safeCallback = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback || '') ? callback : '';
  const body = safeCallback
    ? `${safeCallback}(${JSON.stringify(payload)});`
    : JSON.stringify(payload);

  const output = ContentService.createTextOutput(body);
  output.setMimeType(safeCallback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
  return output;
}
