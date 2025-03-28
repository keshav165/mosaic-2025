const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Load service account key
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, 'service-account-key.json')));

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// Your Google Sheet ID
const SPREADSHEET_ID = '1FAIpQLSdueREbCkjabd5u0pqCSUWnmBoc3HK6qPYuJSAlwaTP-6SxgA';

// Function to get the next row number
async function getNextRowNumber() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A:A',
            majorDimension: 'COLUMNS'
        });
        return response.data.values[0].length + 1;
    } catch (error) {
        console.error('Error getting next row:', error);
        return 1;
    }
}

// Function to save form data to Google Sheets
async function saveFormData(formData) {
    try {
        // Get next row number
        const rowNumber = await getNextRowNumber();

        // Prepare values
        const values = [
            [
                new Date().toISOString(), // Timestamp
                formData.college_name,    // College Name
                formData.team_name,       // Team Name
                formData.leader_name,     // Team Leader Name
                formData.leader_phone,    // Team Leader Phone
                formData.leader_email,    // Team Leader Email
                formData.hear_about,      // How they heard about us
                formData.transaction_id,  // Transaction ID
                formData.id_proof ? formData.id_proof.name : '' // ID Proof filename
            ]
        ];

        // Save to Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A:I',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values
            }
        });

        return true;
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        return false;
    }
}

// Cloud Function entry point
exports.submitForm = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const formData = req.body;
        const savedToSheets = await saveFormData(formData);

        if (savedToSheets) {
            res.status(200).json({ success: true, message: 'Form submitted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to save to Google Sheets' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
