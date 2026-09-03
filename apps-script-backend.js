// Google Apps Script Backend for Yuva Mandal App
// Deploy this as a Web App in your Google Sheet

const SHEET_NAMES = {
  members: 'Members',
  mashikJama: 'Mashik Jama',
  sahyog: 'Sahyog',
  expense: 'Expense',
  udharChanda: 'Udhar Chanda'
};

function doGet(e) {
  try {
    if (e.parameter.action === 'all') {
      return ContentService.createTextOutput(JSON.stringify(getAllData()))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { type, data } = payload;

    if (!type || !data) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Missing type or data' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const result = addRow(type, data);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {
    ok: true,
    members: getSheetData(ss, SHEET_NAMES.members),
    mashikJama: getSheetData(ss, SHEET_NAMES.mashikJama),
    sahyog: getSheetData(ss, SHEET_NAMES.sahyog),
    expense: getSheetData(ss, SHEET_NAMES.expense),
    udharChanda: getSheetData(ss, SHEET_NAMES.udharChanda)
  };
  return result;
}

function getSheetData(ss, sheetName) {
  try {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];

    const data = sheet.getDataRange().getValues();
    if (data.length === 0) return [];

    const headers = data[0];
    const rows = data.slice(1);

    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    }).filter(row => row.ID || row.SN); // Filter out empty rows
  } catch (err) {
    Logger.log(`Error reading ${sheetName}: ${err}`);
    return [];
  }
}

function addRow(type, data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = SHEET_NAMES[type];

    if (!sheetName) {
      return { ok: false, error: `Unknown type: ${type}` };
    }

    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return { ok: false, error: `Sheet ${sheetName} not found` };
    }

    // Get headers
    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Build new row based on headers
    const newRow = headerRow.map(header => {
      if (header === 'ID' || header === 'SN') {
        // Auto-generate ID or SN
        const lastRow = sheet.getLastRow();
        if (lastRow === 1) return 1;
        const lastID = sheet.getRange(lastRow, 1).getValue();
        return (Number(lastID) || 0) + 1;
      }
      return data[header] || '';
    });

    // Append row
    sheet.appendRow(newRow);

    return { ok: true, message: `Row added to ${sheetName}` };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
}

function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create Members sheet
  createSheetIfNotExists(ss, SHEET_NAMES.members, [
    ['ID', 'Name', 'Pad', 'Age', 'Mobile', 'Address', 'Photo', 'Status']
  ]);

  // Create Mashik Jama sheet
  createSheetIfNotExists(ss, SHEET_NAMES.mashikJama, [
    ['SN', 'दिनांक', 'माह', 'सदस्य का नाम', 'फोन नंबर', 'पद', 'राशि (₹)', 'भुगतान माध्यम', 'एंट्री दिनांक', 'एंट्री समय']
  ]);

  // Create Sahyog sheet
  createSheetIfNotExists(ss, SHEET_NAMES.sahyog, [
    ['SN', 'Date', 'Name', 'Amount', 'Paid Status', 'Remark', 'Paid Date']
  ]);

  // Create Expense sheet
  createSheetIfNotExists(ss, SHEET_NAMES.expense, [
    ['ID', 'Date', 'Category', 'Description', 'Amount', 'PaidTo']
  ]);

  // Create Udhar Chanda sheet
  createSheetIfNotExists(ss, SHEET_NAMES.udharChanda, [
    ['SN', 'Date', 'Name', 'Amount', 'Paid Status', 'Remark', 'Paid Date']
  ]);

  Logger.log('Sheets initialized successfully');
}

function createSheetIfNotExists(ss, sheetName, headers) {
  try {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers[0]);
      Logger.log(`Created sheet: ${sheetName}`);
    }
  } catch (err) {
    Logger.log(`Error creating sheet ${sheetName}: ${err}`);
  }
}

// Run this once to set up your Google Sheet
// Copy this code to Apps Script, run initializeSheets(), then Deploy as Web App
