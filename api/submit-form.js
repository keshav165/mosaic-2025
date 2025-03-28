const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
    try {
        const formData = req.body;
        const fileData = req.files ? JSON.stringify(req.files) : '';

        // Save form data temporarily
        const tempPath = path.join(__dirname, 'temp', 'form-data.json');
        fs.writeFileSync(tempPath, JSON.stringify(formData));

        // Trigger GitHub Actions workflow
        exec('gh workflow run form-submission.yml --ref main --inputs "{\"formData\":\"' + 
            JSON.stringify(formData).replace(/"/g, '\"') + '\",\"fileData\":\"' + 
            fileData.replace(/"/g, '\"') + '\"}"',
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    res.status(500).json({ error: 'Failed to process form submission' });
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                res.json({ success: true, message: 'Form submitted successfully' });
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
