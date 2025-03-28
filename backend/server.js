const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { saveFormData } = require('./google-sheets');
const path = require('path');

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString();
        cb(null, `${file.fieldname}_${timestamp}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Form submission endpoint
app.post('/api/submit', upload.single('id_proof'), async (req, res) => {
    try {
        // Get form data
        const formData = req.body;
        
        // Save to Google Sheets
        const savedToSheets = await saveFormData(formData);
        
        if (!savedToSheets) {
            throw new Error('Failed to save to Google Sheets');
        }

        // Save uploaded file if exists
        if (req.file) {
            // Save file path in Google Sheets
            const rowNumber = await getNextRowNumber();
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `I${rowNumber}`,
                valueInputOption: 'RAW',
                resource: {
                    values: [[req.file.filename]]
                }
            });
        }

        res.json({ success: true, message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to save form submission' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});