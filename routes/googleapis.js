const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

async function updateUserSheet(spreadsheetId, range, values, accessToken) {
  const oauth2Client = new OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });

  let data = [];
  data.push({
    range: range,
    values: values,
  });

  let resource = {
    data: data,
    valueInputOption: "USER_ENTERED",
  };

  const response = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: spreadsheetId,
    resource: resource,
  });

  return response.data;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: true, message: "Not authorized" });
}

function extractSheetId(url) {
  const match = /#gid=(\d+)/.exec(url);
  return match ? match[1] : null;
}


function extractSpreadSheetId(url) {
  const regex = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);

  if (match && match.length > 1) {
    return match[1];
  } else {
    return null;
  }
}

function columnToLetter(column) {
  let temp,
    letter = "";
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

async function getUserSheetsData(sheetId, sheetIndex, accessToken) {
  const oauth2Client = new OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const spreadsheetId = sheetId;
  const range = sheetIndex;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    return rows;
  } catch (error) {
    console.log("Error accessing user's Google Sheet:", error);
    return null;
  }
}

// ROUTE - get spreadsheet metadata
router.post("/getmetadata", ensureAuthenticated, async (req, res) => {
  const { url } = req.body;
  const spreadsheetId = extractSpreadSheetId(url);

  const oauth2Client = new OAuth2();
  oauth2Client.setCredentials({ access_token: req.user.accessToken });
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    res.send(response.data);
  } catch (error) {
    if (error.code === 403) {
      res.status(403);
    } else {
      res.status(500).send(error);
    }
  }
});

// ROUTE - load table values
router.post("/loadsheet", ensureAuthenticated, async (req, res) => {
  const { name, url, sheetIndex } = req.body;
  try {
    const rows = await getUserSheetsData(
      extractSpreadSheetId(url),
      sheetIndex,
      req.user.accessToken
    );
    res.send(rows);
  } catch (error) {
    if (error.code === 403) {
      res.status(403);
    } else {
      res.status(500).send(error);
    }
  }
});

// ROUTE - edit sheet values
router.post("/updatesheet", ensureAuthenticated, async (req, res) => {
  const { name, url, range, values } = req.body;
  const spreadsheetId = extractSpreadSheetId(url);
  try {
    const response = await updateUserSheet(
      spreadsheetId,
      range,
      values,
      req.user.accessToken
    );
    res.send(response);
  } catch (error) {
    if (error.code === 403) {
      res.status(403);
    } else {
      res.status(500).send(error);
    }
  }
});


module.exports = router;
