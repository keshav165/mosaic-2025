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

            // Submit the form to the hidden iframe
            this.submit();

            // Check iframe content after a short delay
            setTimeout(() => {
                const iframe = document.getElementById('hidden_iframe');
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc.body.textContent === "Thank you for registering!") {
                        window.location.href = 'thank-you.html';
                    } else {
                        alert('Error submitting form');
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                } catch (error) {
                    alert('Error: Unable to verify form submission');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 1000);
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
