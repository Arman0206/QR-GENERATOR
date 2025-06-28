document.addEventListener('DOMContentLoaded', function() {
    const qrText = document.getElementById('qrText');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const imgBox = document.getElementById('imgBox');
    const qrImage = document.getElementById('qrImage');
    const errorMsg = document.getElementById('errorMsg');
    const placeholder = document.querySelector('.placeholder');

    // Generate QR Code
    generateBtn.addEventListener('click', generateQR);
    
    // Allow Enter key to generate QR code
    qrText.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateQR();
        }
    });

    // Download QR Code
    downloadBtn.addEventListener('click', function() {
        if (!qrImage.src) return;
        
        const link = document.createElement('a');
        link.href = qrImage.src;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Clear everything
    clearBtn.addEventListener('click', function() {
        qrText.value = '';
        qrImage.src = '';
        qrImage.style.display = 'none';
        placeholder.style.display = 'flex';
        downloadBtn.disabled = true;
        errorMsg.textContent = '';
        imgBox.classList.remove('shake');
    });

    function generateQR() {
        const inputText = qrText.value.trim();
        
        // Validate input
        if (!inputText) {
            showError('Please enter some text or URL');
            imgBox.classList.add('shake');
            return;
        }
        
        // Show loading state
        showLoading();
        
        // Generate QR code using API
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inputText)}`;
        
        qrImage.onload = function() {
            hideLoading();
            placeholder.style.display = 'none';
            qrImage.style.display = 'block';
            downloadBtn.disabled = false;
            errorMsg.textContent = '';
        };
        
        qrImage.onerror = function() {
            hideLoading();
            showError('Failed to generate QR code. Please try again.');
        };
        
        qrImage.src = apiUrl;
    }

    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Generating QR Code...</p>
        `;
        imgBox.appendChild(loadingDiv);
    }

    function hideLoading() {
        const loadingDiv = imgBox.querySelector('.loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    function showError(message) {
        errorMsg.textContent = message;
        setTimeout(() => {
            errorMsg.textContent = '';
            imgBox.classList.remove('shake');
        }, 3000);
    }
});