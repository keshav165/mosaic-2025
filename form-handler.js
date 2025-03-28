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

            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }

            // Generate unique filename
            const timestamp = new Date().toISOString();
            const filename = `response_${timestamp}.json`;
            const filePath = `responses/${filename}`;

            // Save response to file
            try {
                // Create blob from JSON data
                const blob = new Blob([JSON.stringify(formObject, null, 2)], { type: 'application/json' });
                
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
