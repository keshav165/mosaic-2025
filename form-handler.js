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
                const formObject = {};
                
                // Convert FormData to object
                for (let [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        // Handle file upload
                        const file = value;
                        const timestamp = new Date().toISOString();
                        const fileName = `${key}_${timestamp}_${file.name}`;
                        const filePath = `uploads/${fileName}`;
                        
                        // Create blob from file
                        const blob = new Blob([file], { type: file.type });
                        
                        // Create URL for blob
                        const url = window.URL.createObjectURL(blob);
                        
                        // Create hidden iframe for file download
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = url;
                        document.body.appendChild(iframe);
                        
                        // Clean up
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                            window.URL.revokeObjectURL(url);
                        }, 1000);
                        
                        // Store file info in form object
                        formObject[key] = {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            path: filePath
                        };
                    } else {
                        // Handle regular form fields
                        formObject[key] = value;
                    }
                }

                // Generate unique filename for response
                const responseTimestamp = new Date().toISOString();
                const responseFilename = `response_${responseTimestamp}.json`;
                const responsePath = `responses/${responseFilename}`;

                // Save response to file
                const responseBlob = new Blob([JSON.stringify(formObject, null, 2)], { type: 'application/json' });
                const responseUrl = window.URL.createObjectURL(responseBlob);
                
                // Create hidden iframe for response download
                const responseIframe = document.createElement('iframe');
                responseIframe.style.display = 'none';
                responseIframe.src = responseUrl;
                document.body.appendChild(responseIframe);
                
                // Clean up response
                setTimeout(() => {
                    document.body.removeChild(responseIframe);
                    window.URL.revokeObjectURL(responseUrl);
                }, 1000);

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
