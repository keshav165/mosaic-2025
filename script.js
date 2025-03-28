// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Registration form handling
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
                // Send data to Formspree
                const formData = new FormData(this);
                
                // Add email field for Formspree
                formData.append('_replyto', formData.get('email'));
                
                const response = await fetch('https://formspree.io/f/xldjwgwj', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    // Redirect to thank you page
                    window.location.href = 'thank-you.html';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Show error message
                alert('Error: ' + error.message);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // File upload preview
    const idProofInput = document.getElementById('idProof');
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

    // Scroll to top button functionality
    const scrollBtn = document.getElementById('scrollBtn');
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 200) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    // Smooth scroll to top
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
