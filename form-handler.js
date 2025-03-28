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
                const files = {};
                
                // Convert FormData to object
                for (let [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        // Handle file upload
                        files[key] = value;
                        formObject[key] = {
                            name: value.name,
                            type: value.type,
                            size: value.size
                        };
                    } else {
                        // Handle regular form fields
                        formObject[key] = value;
                    }
                }

                // Send data to API endpoint
                const response = await fetch('https://api.github.com/repos/keshav165/mosaic-2025/dispatches', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `token ${process.env.GITHUB_TOKEN}`
                    },
                    body: JSON.stringify({
                        event_type: 'form_submission',
                        client_payload: {
                            formData: formObject,
                            files: files
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit form');
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
