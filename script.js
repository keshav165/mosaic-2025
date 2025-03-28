// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Registration form handling
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            // Create a hidden iframe for form submission
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // Create a new form
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = 'https://docs.google.com/forms/d/e/1FAIpQLSdueREbCkjabd5u0pqCSUWnmBoc3HK6qPYuJSAlwaTP-6SxgA/formResponse';
            tempForm.target = iframe.name;

            // Copy all form fields
            Array.from(this.elements).forEach(element => {
                if (element.type !== 'submit' && element.type !== 'button') {
                    const newElement = element.cloneNode(true);
                    tempForm.appendChild(newElement);
                }
            });

            // Submit the form
            document.body.appendChild(tempForm);
            tempForm.submit();

            // Clean up
            tempForm.remove();
            iframe.remove();

            // Redirect to thank you page after a short delay
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 1000); // 1 second delay
        });
    }

    // File upload preview
    const idProofInput = document.getElementById('entry.1473213429');
    const filePreview = document.getElementById('filePreview');

    if (idProofInput) {
        idProofInput.addEventListener('change', function(e) {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    filePreview.src = e.target.result;
                    filePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Mobile number validation
    function validateMobileAndRedirect() {
        const mobileInput = document.getElementById('mobileNumber');
        const mobileNumber = mobileInput.value.trim();
        
        // Validate mobile number format
        if (!mobileNumber.match(/^[6-9][0-9]{9}$/)) {
            alert('Please enter a valid Indian mobile number starting with 6-9');
            return;
        }

        // Redirect to registration page
        window.location.href = 'register.html';
    }

    // Rules page handling
    const rulePhoneInput = document.getElementById('rulePhone');
    const acceptRulesButton = document.getElementById('acceptRules');

    if (rulePhoneInput && acceptRulesButton) {
        rulePhoneInput.addEventListener('input', function() {
            acceptRulesButton.disabled = !this.value.trim();
        });

        acceptRulesButton.addEventListener('click', validateMobileAndRedirect);
    }
});
