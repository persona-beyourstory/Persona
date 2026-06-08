const SHEET_NAME = 'Orders';

function doPost(e) {
  const rawPayload = e.parameter.payload || e.postData.contents;
  const order = JSON.parse(rawPayload);
  const sheet = getOrdersSheet_();
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
    order.paymentStatus,
    order.customer.notes
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, orderId: order.orderId }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = getOrdersSheet_();
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: 'Persona order endpoint is live.',
      sheet: sheet.getName()
    }))
    .setMimeType(ContentService.MimeType.JSON);
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
      'Notes'
    ]);
  }

  return sheet;
}
