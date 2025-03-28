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
                        formObject[key] = {
                            name: value.name,
                            type: value.type,
                            size: value.size
                        };
                    } else {
                        formObject[key] = value;
                    }
                }

                // Send data to cloud function
                const response = await fetch('https://us-central1-your-project-id.cloudfunctions.net/submitForm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formObject)
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
