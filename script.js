// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google API
    gapi.load('client:auth2', function() {
        gapi.client.init({
            'apiKey': 'YOUR_API_KEY',
            'clientId': 'YOUR_CLIENT_ID',
            'scope': 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
        }).then(function() {
            // API client is ready
            // You can now use gapi.client.sheets.spreadsheets.values.append()
            // to submit form data to your Google Sheet
        });
    });

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

            // Submit the form directly
            this.submit();

            // Redirect to thank you page after a short delay
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 1000);
        });
    }

    // Handle ID proof upload
    function uploadIdProof() {
        const fileInput = document.getElementById('idProof');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        // Create a form data object
        const formData = new FormData();
        formData.append('file', file);

        // Get the Google Drive API client ID from your Google Cloud Console
        const CLIENT_ID = 'YOUR_CLIENT_ID';
        const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

        // Initialize the Google API client
        gapi.client.init({
            'apiKey': 'YOUR_API_KEY',
            'clientId': CLIENT_ID,
            'scope': SCOPES.join(' ')
        }).then(function() {
            // Upload the file to Google Drive
            gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: {
                    uploadType: 'multipart'
                },
                uploadData: formData
            }).then(function(response) {
                console.log('File uploaded successfully:', response.result);
                alert('ID proof uploaded successfully!');
                // You can store the file ID in your Google Sheet if needed
            }, function(error) {
                console.error('Error uploading file:', error);
                alert('Error uploading ID proof. Please try again.');
            });
        });
    }

    // File upload preview
    const idProofInput = document.getElementById('id_proof');
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

    // Mobile number validation
    const mobileInput = document.getElementById('leader_phone');
    mobileInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });

    // Form submission validation
    const acceptRulesButtonNew = document.getElementById('accept-rules-btn');
    if (acceptRulesButtonNew) {
        acceptRulesButtonNew.addEventListener('click', function() {
            const mobile = mobileInput.value;
            if (mobile.length !== 10) {
                alert('Please enter a valid 10-digit mobile number');
                return;
            }
            window.location.href = 'register.html';
        });
    }
});
