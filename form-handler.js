// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            try {
                // Get form data
                const formData = new FormData(this);
                
                // Convert FormData to object
                const formObject = {};
                for (let [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        // Handle file upload separately
                        formObject[key] = {
                            name: value.name,
                            type: value.type,
                            size: value.size
                        };
                    } else {
                        formObject[key] = value;
                    }
                }

                // Submit to Google Sheets API
                const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values:append', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        range: 'Sheet1!A:A',
                        values: [[
                            new Date().toISOString(), // Timestamp
                            formObject.college_name,    // College Name
                            formObject.team_name,       // Team Name
                            formObject.leader_name,     // Team Leader Name
                            formObject.leader_phone,    // Team Leader Phone
                            formObject.leader_email,    // Team Leader Email
                            formObject.hear_about,      // How they heard about us
                            formObject.transaction_id,  // Transaction ID
                            formObject.id_proof ? formObject.id_proof.name : '' // ID Proof filename
                        ]],
                        valueInputOption: 'RAW'
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }

                // Handle file upload if exists
                if (formObject.id_proof) {
                    // Upload file to Google Drive
                    const file = formData.get('id_proof');
                    const fileResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                        },
                        body: file,
                        params: {
                            uploadType: 'multipart'
                        }
                    });

                    if (!fileResponse.ok) {
                        throw new Error('Failed to upload file');
                    }
                }

                // Redirect to thank you page
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 1000);

            } catch (error) {
                console.error('Error saving response:', error);
                alert('Error saving your response. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
