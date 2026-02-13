document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const form = document.getElementById('certificateForm');
  const preview = document.getElementById('certificatePreview');
  const actions = document.getElementById('actions');
  const bulkGenerateBtn = document.getElementById('bulkGenerate');
  const downloadBtn = document.getElementById("download-pdf-btn");
  const certificate = document.getElementById("certificate-container");

  // Initialize
  if (actions) {
    actions.style.display = 'none';
  }

  // Single Certificate Generation
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      generateCertificateFromForm();
    });
  }

  // Bulk Certificate Generation
  if (bulkGenerateBtn) {
    bulkGenerateBtn.addEventListener('click', handleBulkGeneration);
  }

  // Core Functions
  async function generateCertificateFromForm() {
    const data = {
      name: document.getElementById('recipientName').value,
      email: document.getElementById('recipientEmail').value,
      course: document.getElementById('courseName').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      signature: document.getElementById('signatureUpload').files[0]
    };

    await generateCertificate(data);
    if (actions) {
      actions.style.display = 'block';
    }
  }

  async function handleBulkGeneration() {
    const file = document.getElementById('excelUpload').files[0];
    if (!file) {
      alert('Please upload an Excel/CSV file first');
      return;
    }

    try {
      const data = await parseExcel(file);
      if (!data || data.length === 0) {
        throw new Error('No valid data found in the file');
      }

      // Generate IDs for each item to ensure QR codes match database records
      data.forEach(item => {
        if (!item.id) {
          item.id = `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        }
      });

      // Generate and download the list of names
      downloadNamesList(data);

      // Clear the previous preview
      const previewSection = document.getElementById('certificatePreview');
      previewSection.innerHTML = '';

      // Create a container for all certificates
      const certificatesContainer = document.createElement('div');
      certificatesContainer.className = 'certificates-container';
      previewSection.appendChild(certificatesContainer);

      // Process each row and display certificates
      for (const item of data) {
        // Create certificate element by calling the helper function
        // This ensures consistent design and adds features like QR codes
        const certificateDiv = await generateBulkCertificate(item);
        certificateDiv.className = 'preview-certificate';
        // Note: innerHTML is already set by generateBulkCertificate

        // Add the certificate to the container
        certificatesContainer.appendChild(certificateDiv);

        // Add a download button for this certificate
        const downloadButton = document.createElement('button');
        downloadButton.className = 'btn-action';
        downloadButton.innerHTML = `<span class="material-icons">download</span> Download Certificate`;
        downloadButton.onclick = () => {
          const filename = `${item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.pdf`;
          generatePDF(filename, certificateDiv);
        };
        certificatesContainer.appendChild(downloadButton);

        // Add some spacing between certificates
        const spacer = document.createElement('div');
        spacer.style.height = '30px';
        certificatesContainer.appendChild(spacer);
      }

      // Add a "Save All to Database" button after all certificates are generated
      const saveAllButton = document.createElement('button');
      saveAllButton.className = 'btn-action save-all-btn';
      saveAllButton.innerHTML = `<span class="material-icons">save</span> Save All to Database`;
      saveAllButton.onclick = async () => {
        try {
          saveAllButton.disabled = true;
          saveAllButton.innerHTML = `<span class="material-icons">hourglass_empty</span> Saving...`;

          // Save all certificates to database (Bulk)
          const user = JSON.parse(localStorage.getItem('user'));
          const token = user ? user.token : '';

          if (!token) {
            alert('Please login to save certificates.');
            window.location.href = 'login.html';
            return;
          }

          // Transform data to match schema if necessary
          const bulkData = data.map(item => ({
            recipientName: item.name,
            recipientEmail: item.email,
            courseName: item.course,
            startDate: item.startDate,
            endDate: item.endDate,
            certificateId: item.id || undefined
          }));

          const response = await fetch('http://localhost:5000/api/certificates/bulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bulkData)
          });

          if (response.ok) {
            showToast(`Successfully saved ${data.length} certificates to database!`);
            saveAllButton.innerHTML = `<span class="material-icons">check_circle</span> Saved to Database`;
            saveAllButton.disabled = true;
            saveAllButton.style.backgroundColor = '#4CAF50';
          } else {
            throw new Error('Failed to save bulk data');
          }

        } catch (error) {
          console.error('Error saving to database:', error);
          showToast('Error saving certificates to database. Please try again.');
          saveAllButton.innerHTML = `<span class="material-icons">save</span> Save All to Database`;
          saveAllButton.disabled = false;
        }
      };

      // Add the save all button to the preview section
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'bulk-actions';
      actionsContainer.appendChild(saveAllButton);
      previewSection.appendChild(actionsContainer);

      alert(`Successfully generated ${data.length} certificates! Scroll down to view and download them.`);

    } catch (error) {
      alert('Error during bulk generation: ' + error.message);
      console.error('Bulk generation error:', error);
    }
  }

  // Helper function to format dates
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  async function parseExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          // Map Excel columns to our certificate data structure
          const mappedData = jsonData.map(row => ({
            name: row['Name'] || row['Recipient Name'] || row['Student Name'] || '',
            email: row['Email'] || row['Email Address'] || row['Contact'] || '',
            course: row['Course'] || row['Course Name'] || row['Program'] || '',
            startDate: row['Start Date'] || row['Course Start'] || '',
            endDate: row['End Date'] || row['Course End'] || '',
            grade: row['Grade'] || row['Score'] || '',
            id: row['ID'] || row['Student ID'] || ''
          }));

          resolve(mappedData);
        } catch (error) {
          reject(new Error('Error parsing Excel file: ' + error.message));
        }
      };

      reader.onerror = function (error) {
        reject(new Error('Error reading file: ' + error.message));
      };

      reader.readAsBinaryString(file);
    });
  }

  async function generateBulkCertificate(data) {
    const certificate = document.createElement('div');
    certificate.className = 'certificate pdf-export';

    certificate.innerHTML = `
        <div class="certificate-content">
            <div class="ornate-border ornate-border-top"></div>
            <div class="ornate-border ornate-border-bottom"></div>
            <div class="ornate-border ornate-border-left"></div>
            <div class="ornate-border ornate-border-right"></div>
            <div class="corner-decoration top-left"></div>
            <div class="corner-decoration top-right"></div>
            <div class="corner-decoration bottom-left"></div>
            <div class="corner-decoration bottom-right"></div>
            
            <div class="institute-header">
                <div class="logo-container">
                    <img src="logo.png" alt="VIIT Logo" class="viit-logo" crossorigin="anonymous">
                </div>
                <div class="institute-details">
                    <h2 class="institute-name">
                        <span>VISHWAKARMA INSTITUTE OF</span>
                        <span>INFORMATION TECHNOLOGY, PUNE</span>
                    </h2>
                    <h3 class="department-name">DEPARTMENT OF COMPUTER ENGINEERING</h3>
                    <div class="institute-address">(An Autonomous Institute Affiliated to Savitribai Phule Pune University), Pune</div>
                </div>
            </div>
            
            <div class="certificate-header">
                <h1>CERTIFICATE</h1>
                <div class="subtitle">of Achievement</div>
            </div>
            
            <div class="certificate-body">
                <p>This certificate is proudly presented to:</p>
                <div class="recipient-name">${data.name}</div>
                <p>in recognition of outstanding performance and dedication in</p>
                <div class="course-name">${data.course}</div>
                <p>Your exceptional contributions and commitment to excellence have significantly advanced our team's success.</p>
            </div>
            
            <div class="signature-section">
                <div class="signature-box">
                    <img src="sign.jpg" alt="Authorized Signature" class="signature-img">
                    <div class="signature-line"></div>
                    <p>Authorized Signature</p>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <p class="date-text">${formatDate(data.startDate)} - ${formatDate(data.endDate)}</p>
                </div>
            </div>
        </div>
    `;



    // Generate QR Code Link
    // In production, this would be your actual deployed URL
    const verifyUrl = `http://localhost:5000/verify.html?id=${data.id || ''}`;

    // QR Code Container
    const qrDiv = document.createElement('div');
    qrDiv.className = "qrcode-container";
    qrDiv.style.position = "absolute";
    qrDiv.style.bottom = "40px";
    qrDiv.style.right = "40px";
    qrDiv.style.width = "70px";
    qrDiv.style.height = "70px";

    // We append the QR Logic to the element after it's created
    certificate.querySelector('.certificate-content').appendChild(qrDiv);

    // Create QR Code (Requires qrcodejs library)
    if (window.QRCode) {
      new QRCode(qrDiv, {
        text: verifyUrl,
        width: 70,
        height: 70
      });
    }

    return certificate;
  }

  function generateCertificate({ name, course, startDate, endDate }) {
    const preview = document.getElementById('certificatePreview');
    preview.innerHTML = '';

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const formattedStartDate = startDate ? formatDate(startDate) : '';
    const formattedEndDate = endDate ? formatDate(endDate) : '';
    const dateRange = formattedStartDate && formattedEndDate
      ? `${formattedStartDate} - ${formattedEndDate}`
      : (formattedStartDate ? `Date: ${formattedStartDate}` : 'Date of Issue: ' + formatDate(new Date()));

    const certificate = document.createElement('div');
    certificate.className = 'certificate';
    certificate.id = 'certificate-container';
    certificate.innerHTML = `
        <div class="certificate-content">
            <div class="ornate-border ornate-border-top"></div>
            <div class="ornate-border ornate-border-bottom"></div>
            <div class="ornate-border ornate-border-left"></div>
            <div class="ornate-border ornate-border-right"></div>
            <div class="corner-decoration top-left"></div>
            <div class="corner-decoration top-right"></div>
            <div class="corner-decoration bottom-left"></div>
            <div class="corner-decoration bottom-right"></div>
            
            <div class="institute-header">
                <div class="logo-container">
                    <img src="logo.png" alt="VIIT Logo" class="viit-logo" crossorigin="anonymous">
                </div>
                <div class="institute-details">
                    <h2 class="institute-name">
                        <span>VISHWAKARMA INSTITUTE OF</span>
                        <span>INFORMATION TECHNOLOGY, PUNE</span>
                    </h2>
                    <h3 class="department-name">DEPARTMENT OF COMPUTER ENGINEERING</h3>
                    <div class="institute-address">(An Autonomous Institute Affiliated to Savitribai Phule Pune University), Pune</div>
                </div>
            </div>
            
            <div class="certificate-header">
                <h1>CERTIFICATE</h1>
                <div class="subtitle">of Achievement</div>
            </div>
            
            <div class="certificate-body">
                <p>This certificate is proudly presented to:</p>
                <div class="recipient-name">${name}</div>
                <p>in recognition of outstanding performance and dedication in</p>
                <div class="course-name">${course}</div>
                <p>Your exceptional contributions and commitment to excellence have significantly advanced our team's success.</p>
            </div>
            
            <div class="signature-section">
                <div class="signature-box">
                    <img src="sign.jpg" alt="Authorized Signature" class="signature-img">
                    <div class="signature-line"></div>
        <p>Authorized Signature</p>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <p class="date-text">${dateRange}</p>
                </div>
            </div>
      </div>
    `;

    preview.appendChild(certificate);
  }

  // UPDATED PDF GENERATION FUNCTION
  async function generatePDF(filename = 'certificate.pdf', certificateElement) {
    try {
      // Add PDF export class for special styling
      certificateElement.classList.add('pdf-export');

      // Ensure all images are fully loaded before proceeding
      const images = certificateElement.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      });

      // Wait for all images to load
      await Promise.all(imagePromises);

      // Improved html2canvas options
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        backgroundColor: '#ffffff',
        onclone: function (clonedDoc) {
          const clonedElement = clonedDoc.getElementById('certificate-container');
          // Ensure borders are visible in the cloned element
          if (clonedElement) {
            clonedElement.style.border = '2px solid #1a4b8c';
            clonedElement.style.padding = '20px';
            clonedElement.style.margin = '0';
            clonedElement.style.boxSizing = 'border-box';
          }
        }
      });

      // Create PDF with proper dimensions
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('landscape');

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate proper scaling to maintain aspect ratio
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Add the image with proper scaling
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save(filename);

      // Remove PDF export class after generation
      certificateElement.classList.remove('pdf-export');

      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }

  async function saveToDatabase(data) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user ? user.token : '';

      if (!token) {
        alert('Please login to save certificates.');
        window.location.href = 'login.html';
        return;
      }

      const response = await fetch('http://localhost:5000/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Database save error:', error);
    }
  }
  document.getElementById('saveToDb').addEventListener('click', async () => {
    const name = document.getElementById('recipientName').value;
    const email = document.getElementById('recipientEmail').value;
    const course = document.getElementById('courseName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user ? user.token : '';

      if (!token) {
        alert('Please login to save certificates.');
        window.location.href = 'login.html';
        return;
      }

      const response = await fetch('http://localhost:5000/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientName: name,
          recipientEmail: email,
          courseName: course,
          startDate,
          endDate
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Saved to database!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save to database.');
    }
  });
  document.getElementById('download-pdf-btn').addEventListener('click', async () => {
    try {
      // Get recipient name for filename
      const recipientName = document.getElementById('recipientName').value || 'certificate';
      const filename = `${recipientName.replace(/\s+/g, '_')}_certificate.pdf`;

      // Get the certificate element
      const certificateElement = document.getElementById('certificate-container');
      if (!certificateElement) {
        throw new Error('Certificate element not found');
      }

      // Generate and download the PDF
      await generatePDF(filename, certificateElement);

      // Show success message
      showToast('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to download certificate. Please try again.');
    }
  });
  document.getElementById('sendEmailBtn').addEventListener('click', async () => {
    try {
      // Get form data
      const name = document.getElementById('recipientName').value;
      const email = document.getElementById('recipientEmail').value;
      const course = document.getElementById('courseName').value;
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;

      // Validate required fields
      if (!name || !email || !course) {
        showToast('Please fill in all required fields');
        return;
      }

      // Show loading state
      const emailBtn = document.getElementById('sendEmailBtn');
      emailBtn.disabled = true;
      emailBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Sending...';

      // Get the certificate element
      const certificateElement = document.getElementById('certificate-container');
      if (!certificateElement) {
        throw new Error('Certificate element not found');
      }

      // Wait for all images to be loaded
      const images = certificateElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Generate PDF data
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const pdfData = canvas.toDataURL('image/png').split(',')[1]; // base64

      // Send email request
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user ? user.token : '';

      if (!token) {
        alert('Please login to send emails.');
        window.location.href = 'login.html';
        return;
      }

      const response = await fetch('http://localhost:5000/api/send-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          name,
          course,
          startDate,
          endDate,
          pdfData,
          certificateId: generateCertificateId()
        })
      });

      const result = await response.json();

      if (result.success) {
        showToast('Certificate sent successfully!');

        // Add success status indicator
        const statusDiv = document.createElement('div');
        statusDiv.className = 'email-status success';
        statusDiv.innerHTML = `
          <span class="material-icons">check_circle</span>
          Certificate sent to ${email}
        `;
        emailBtn.parentNode.appendChild(statusDiv);

        // Remove status after 5 seconds
        setTimeout(() => statusDiv.remove(), 5000);
      } else {
        throw new Error(result.error || 'Failed to send certificate');
      }
    } catch (error) {
      console.error('Email send error:', error);
      showToast('Failed to send certificate. Please try again.');

      // Add error status indicator
      const statusDiv = document.createElement('div');
      statusDiv.className = 'email-status error';
      statusDiv.innerHTML = `
        <span class="material-icons">error</span>
        ${error.message}
      `;
      document.getElementById('sendEmailBtn').parentNode.appendChild(statusDiv);

      // Remove status after 5 seconds
      setTimeout(() => statusDiv.remove(), 5000);
    } finally {
      // Reset button state
      const emailBtn = document.getElementById('sendEmailBtn');
      emailBtn.disabled = false;
      emailBtn.innerHTML = '<span class="material-icons">email</span> Send via Email';
    }
  });

  // Helper function to generate unique certificate ID
  function generateCertificateId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `CERT-${timestamp}-${random}`;
  }

  // Template Selection and Navigation
  function scrollToTemplates() {
    const templatesSection = document.getElementById('templates');
    if (templatesSection) {
      templatesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  function scrollToGenerator() {
    const generatorSection = document.getElementById('generator');
    if (generatorSection) {
      generatorSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  function selectTemplate(templateType) {
    // Remove active class from all templates
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.remove('active');
    });

    // Add active class to selected template
    const selectedCard = document.querySelector(`.template-card[onclick*="${templateType}"]`);
    if (selectedCard) {
      selectedCard.classList.add('active');
    }

    // Store selected template type
    localStorage.setItem('selectedTemplate', templateType);

    // Scroll to generator section
    setTimeout(() => {
      scrollToGenerator();
    }, 500);

    // Update preview with selected template
    updateCertificatePreview(templateType);
  }

  function updateCertificatePreview(templateType) {
    const preview = document.querySelector('.preview-certificate');
    if (!preview) return;

    // Remove all previous template classes
    preview.className = 'preview-certificate';

    // Add new template class
    preview.classList.add(`template-${templateType}`);

    // Apply template-specific styles
    switch (templateType) {
      case 'classic':
        preview.style.background = '#fdfbf7';
        preview.style.border = '35px solid transparent';
        preview.style.borderImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'none\' stroke=\'%234169E1\' stroke-width=\'2\' d=\'M0,0 L100,0 L100,100 L0,100 Z\'/%3E%3Cpath fill=\'none\' stroke=\'%234169E1\' stroke-width=\'1\' d=\'M10,10 L90,10 L90,90 L10,90 Z\'/%3E%3C/svg%3E") 35';
        break;

      case 'modern':
        preview.style.background = '#ffffff';
        preview.style.boxShadow = '0 0 30px rgba(0,0,0,0.1)';
        preview.style.border = '5px solid #2563eb';
        break;

      case 'professional':
        preview.style.background = 'linear-gradient(45deg, #fdfbf7 0%, #ffffff 100%)';
        preview.style.border = '15px solid #1a237e';
        break;

      case 'creative':
        preview.style.background = '#ffffff';
        preview.style.borderRadius = '20px';
        preview.style.border = '10px solid';
        preview.style.borderImage = 'linear-gradient(45deg, #2563eb, #7c3aed) 1';
        break;

      case 'academic':
        preview.style.background = '#fdfbf7';
        preview.style.border = '40px solid transparent';
        preview.style.borderImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'none\' stroke=\'%231a237e\' stroke-width=\'2\' d=\'M0,0 C30,20 70,20 100,0 M0,100 C30,80 70,80 100,100\'/%3E%3C/svg%3E") 40';
        break;

      case 'achievement':
        preview.style.background = 'linear-gradient(135deg, #fdfbf7 0%, #ffffff 100%)';
        preview.style.border = '20px solid #2563eb';
        preview.style.borderRadius = '10px';
        break;
    }
  }

  function applyCustomization() {
    const colorOption = document.querySelector('.color-option:checked');
    const borderStyle = document.querySelector('.style-select[name="border"]').value;
    const fontStyle = document.querySelector('.style-select[name="font"]').value;

    const preview = document.getElementById('certificatePreview');
    if (!preview) return;

    const certificate = preview.querySelector('.preview-certificate');
    if (!certificate) return;

    // Apply color
    if (colorOption) {
      const color = colorOption.style.background;
      certificate.style.setProperty('--primary-color', color);
    }

    // Apply border style
    certificate.dataset.borderStyle = borderStyle;

    // Apply font style
    certificate.dataset.fontStyle = fontStyle;

    // Show success message
    showToast('Changes applied successfully!');
  }

  function resetCustomization() {
    const preview = document.getElementById('certificatePreview');
    if (!preview) return;

    // Reset to default template styles
    const templateType = preview.className.replace('preview-certificate template-', '');
    updateCertificatePreview(templateType);

    // Reset form selections
    document.querySelectorAll('.color-option').forEach(option => option.checked = false);
    document.querySelectorAll('.style-select').forEach(select => select.selectedIndex = 0);

    // Show reset message
    showToast('Customization reset to default!');
  }

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Displays a temporary toast message on the screen.
 * The toast fades in, stays visible for a few seconds, and then fades out.
 * 

/*******  e2407e52-2973-4fea-8013-ebc51aae77ee  *******/  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 100);
  }

  // Add these styles to ensure proper signature and border display
  const style = document.createElement('style');
  style.textContent = `
      .signature-img {
          max-width: 150px;
          max-height: 60px;
          margin-bottom: 10px;
          object-fit: contain;
      }

      .certificate-content {
          position: relative;
          border: 2px solid #1a4b8c;
          padding: 40px;
          margin: 20px;
          background: #fff;
      }

      .ornate-border {
          position: absolute;
          background: #1a4b8c;
      }

      .ornate-border-top, .ornate-border-bottom {
          height: 2px;
          left: 10px;
          right: 10px;
      }

      .ornate-border-left, .ornate-border-right {
          width: 2px;
          top: 10px;
          bottom: 10px;
      }

      .ornate-border-top { top: 5px; }
      .ornate-border-bottom { bottom: 5px; }
      .ornate-border-left { left: 5px; }
      .ornate-border-right { right: 5px; }

      .corner-decoration {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #1a4b8c;
      }

      .top-left {
          top: 5px;
          left: 5px;
          border-right: none;
          border-bottom: none;
      }

      .top-right {
          top: 5px;
          right: 5px;
          border-left: none;
          border-bottom: none;
      }

      .bottom-left {
          bottom: 5px;
          left: 5px;
          border-right: none;
          border-top: none;
      }

      .bottom-right {
          bottom: 5px;
          right: 5px;
          border-left: none;
          border-top: none;
      }
  `;
  document.head.appendChild(style);

  // Function to generate and download the list of names
  function downloadNamesList(data) {
    // Create a CSV string with headers
    let csvContent = "Recipient Name\n";

    // Add each name to the CSV
    data.forEach(item => {
      // Properly escape the name field
      const name = `"${item.name.replace(/"/g, '""')}"`;
      csvContent += name + "\n";
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Set the link properties
    link.setAttribute("href", url);
    link.setAttribute("download", "certificate_recipients.csv");
    link.style.visibility = 'hidden';

    // Add the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show a toast message
    showToast(`Downloaded list of ${data.length} recipients`);
  }
});