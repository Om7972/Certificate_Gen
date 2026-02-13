
// ==========================================
// STATE MANAGEMENT
// ==========================================
const state = {
  template: 'classic',
  recipientName: 'Alice Johnson',
  courseName: 'Full Stack Web Development',
  description: 'For successfully completing the comprehensive professional development program with distinction.',
  date: new Date().toISOString().split('T')[0],
  certId: 'CERT-' + Math.floor(Math.random() * 1000000),
  organization: 'Tech Academy of Excellence',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2436/2436874.png', // Placeholder
  accentColor: '#C59D45', // Gold default
  qrEnabled: true,
  watermarkEnabled: false,
  zoom: 1
};

// ==========================================
// TEMPLATE DEFINITIONS
// ==========================================
const templates = {
  classic: (data) => `
        <div class="w-full h-full relative bg-white p-12 flex flex-col items-center text-center font-playfair border-[20px] border-double border-[${data.accentColor}]/20">
            <!-- Corner Ornaments -->
            <div class="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-[${data.accentColor}] opacity-50"></div>
            <div class="absolute top-4 right-4 w-24 h-24 border-t-4 border-r-4 border-[${data.accentColor}] opacity-50"></div>
            <div class="absolute bottom-4 left-4 w-24 h-24 border-b-4 border-l-4 border-[${data.accentColor}] opacity-50"></div>
            <div class="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-[${data.accentColor}] opacity-50"></div>

            <!-- Header -->
            <div class="mt-8 max-w-3xl mx-auto z-10 w-full">
                ${data.logoUrl ? `<img src="${data.logoUrl}" class="h-20 mx-auto mb-4 object-contain opacity-90" alt="Logo">` : ''}
                <div class="text-xl font-bold uppercase tracking-widest text-gray-600 font-poppins mb-1">${data.organization}</div>
                <div class="text-xs uppercase tracking-[0.3em] text-gray-400 font-poppins mb-6">Officially Presents This</div>
                
                <h1 class="text-7xl font-cinzel text-gray-800 font-bold mb-2">Certificate</h1>
                <div class="text-4xl font-alex text-[${data.accentColor}] mb-8">of Achievement</div>
            </div>

            <!-- Body -->
            <div class="flex-1 flex flex-col justify-center w-full z-10">
                <p class="text-lg text-gray-500 italic font-poppins mb-2">This certificate is proudly awarded to</p>
                <div class="text-6xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-4 mx-auto min-w-[500px] inline-block font-playfair tracking-wide leading-tight">
                    ${data.recipientName}
                </div>
                
                <div class="mt-4 max-w-4xl mx-auto">
                    <p class="text-gray-500 font-poppins text-sm uppercase tracking-wider mb-2">For outstanding performance in</p>
                    <h2 class="text-4xl font-bold text-[${data.accentColor}] font-playfair mb-6">${data.courseName}</h2>
                    <p class="text-gray-600 leading-relaxed font-poppins text-base px-10 italic">${data.description}</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="w-full flex justify-between items-end px-16 pb-8 z-10 mt-auto">
                <div class="text-center">
                    <div class="w-48 border-b border-gray-400 mb-2 h-10"></div>
                    <p class="text-xs font-bold uppercase tracking-widest text-gray-400 font-poppins">Director Signature</p>
                </div>
                
                <div class="flex flex-col items-center justify-center">
                    ${data.qrEnabled ? `
                    <div class="bg-white p-2 border border-gray-200 shadow-sm mb-2">
                        <div id="qrcode" class="w-20 h-20"></div>
                    </div>` : `<div class="w-20 h-20 rounded-full border-4 border-double border-gray-200 flex items-center justify-center mb-2"><i class="fas fa-certificate text-3xl text-gray-300"></i></div>`}
                    <div class="text-[10px] text-gray-400 font-poppins tracking-widest">ID: ${data.certId}</div>
                </div>

                <div class="text-center">
                    <div class="w-48 border-b border-gray-400 mb-2 font-playfair text-xl text-gray-600 h-10 flex items-end justify-center">${data.date}</div>
                    <p class="text-xs font-bold uppercase tracking-widest text-gray-400 font-poppins">Date Issued</p>
                </div>
            </div>

            <!-- Watermark -->
            ${data.watermarkEnabled ? `
            <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                <img src="${data.logoUrl || 'https://via.placeholder.com/500'}" class="w-[600px] h-[600px] object-contain grayscale">
            </div>` : ''}
        </div>
    `,

  modern: (data) => `
        <div class="w-full h-full relative bg-slate-50 flex overflow-hidden font-poppins">
            <!-- Sidebar -->
            <div class="w-[30%] h-full bg-[${data.accentColor}] text-white p-12 flex flex-col justify-between relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-full bg-black/10 z-0"></div>
                <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 rounded-full z-0"></div>
                
                <div class="z-10 relative">
                    ${data.logoUrl ? `<img src="${data.logoUrl}" class="h-24 w-24 object-contain bg-white p-3 rounded-xl shadow-lg mb-8" alt="Logo">` : ''}
                    <div class="h-1 w-16 bg-white/50 mb-6"></div>
                    <h2 class="text-3xl font-bold leading-tight mb-2">${data.organization}</h2>
                    <p class="text-white/70 text-sm font-medium tracking-wide">Excellence in Education</p>
                </div>

                <div class="text-center z-10 relative mt-auto">
                    ${data.qrEnabled ? `<div id="qrcode" class="bg-white p-3 rounded-xl shadow-lg mb-6 mx-auto w-32 h-32"></div>` : ''}
                    <div class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p class="text-[10px] text-white/80 tracking-widest uppercase mb-1">Certificate ID</p>
                        <p class="text-sm font-mono font-bold">${data.certId}</p>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="flex-1 p-20 flex flex-col justify-center relative bg-white">
                <div class="absolute top-10 right-10 opacity-5">
                    <i class="fas fa-certificate text-9xl"></i>
                </div>

                <div class="mb-16">
                    <h1 class="text-5xl font-bold text-gray-800 mb-4 tracking-tight">Certificate of Completion</h1>
                    <div class="h-2 w-32 bg-[${data.accentColor}]"></div>
                </div>

                <div class="space-y-10">
                    <div>
                        <p class="text-gray-500 uppercase tracking-wider text-sm font-bold mb-3 flex items-center gap-2"><div class="w-4 h-px bg-gray-400"></div> Awarded To</p>
                        <h2 class="text-6xl font-bold text-gray-900 leading-tight">${data.recipientName}</h2>
                    </div>

                    <div>
                        <p class="text-gray-500 uppercase tracking-wider text-sm font-bold mb-3 flex items-center gap-2"><div class="w-4 h-px bg-gray-400"></div> For The Course</p>
                        <h3 class="text-4xl font-bold text-[${data.accentColor}]">${data.courseName}</h3>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-l-xl border-l-4 border-[${data.accentColor}]">
                        <p class="text-gray-600 leading-relaxed text-lg">
                            ${data.description}
                        </p>
                    </div>
                </div>

                <div class="mt-auto flex gap-16 pt-16 border-t border-gray-100">
                    <div class="flex-1">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png" class="h-12 object-contain mb-3 opacity-60">
                        <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Director Signature</p>
                    </div>
                    <div>
                        <p class="h-12 flex items-end font-mono text-xl text-gray-700 mb-3">${data.date}</p>
                        <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Date Issued</p>
                    </div>
                </div>
            </div>
            
             ${data.watermarkEnabled ? `
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
                 <span class="text-[12rem] font-bold uppercase tracking-widest -rotate-45 border-4 border-gray-900 p-10 rounded-[4rem]">verified</span>
            </div>` : ''}
        </div>
    `,

  minimal: (data) => `
        <div class="w-full h-full bg-white p-24 flex flex-col items-center text-center font-poppins relative border border-gray-200">
            
            <div class="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto z-10">
                <div class="mb-12 flex flex-col items-center">
                    ${data.logoUrl ? `<img src="${data.logoUrl}" class="h-16 opacity-80 mb-6 grayscale" alt="Logo">` : ''}
                    <h3 class="text-sm font-semibold tracking-[0.2em] uppercase text-gray-900">${data.organization}</h3>
                </div>
                
                <div class="space-y-6 w-full mb-12">
                    <h1 class="text-xs font-bold tracking-[0.6em] uppercase text-gray-400">Certificate of Completion</h1>
                    <div class="w-full border-t border-gray-200"></div>
                </div>

                <div class="mb-10 w-full">
                    <h2 class="text-7xl font-light text-gray-900 mb-6 tracking-wide">${data.recipientName}</h2>
                    <p class="text-gray-500 font-light text-lg">has successfully completed the requirements for</p>
                </div>

                <div class="mb-12 w-full">
                    <h3 class="text-4xl font-medium text-gray-800 mb-6">${data.courseName}</h3>
                    <p class="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">${data.description}</p>
                </div>
                
                 ${data.qrEnabled ? `<div id="qrcode" class="mb-8 opacity-80"></div>` : ''}

                <div class="flex justify-between items-center w-full max-w-2xl border-t border-gray-100 pt-10 mt-auto">
                     <div class="text-left w-1/3">
                        <p class="text-lg text-gray-900 font-manual">John Doe</p>
                        <p class="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Instructor</p>
                    </div>
                    <div class="text-center w-1/3">
                        <p class="text-xs font-mono text-gray-400">ID: ${data.certId}</p>
                    </div>
                    <div class="text-right w-1/3">
                        <p class="text-lg text-gray-900 font-medium">${data.date}</p>
                        <p class="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Date</p>
                    </div>
                </div>
            </div>

             ${data.watermarkEnabled ? `
            <div class="absolute bottom-0 right-0 opacity-[0.03]">
                 <i class="fas fa-award text-[30rem]"></i>
            </div>` : ''}
        </div>
    `,

  dark: (data) => `
        <div class="w-full h-full bg-[#0F172A] relative p-16 flex flex-col font-cinzel text-gray-100 overflow-hidden border-[16px] border-[#1E293B]">
            <!-- Background Elements -->
            <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div class="relative z-10 h-full flex flex-col justify-between border border-white/10 p-12 bg-white/5 backdrop-blur-sm shadow-2xl">
                
                <!-- Header -->
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-4">
                        ${data.logoUrl ? `<img src="${data.logoUrl}" class="h-16 invert opacity-90" alt="Logo">` : ''}
                        <div class="text-left">
                            <h2 class="text-yellow-500 text-sm tracking-[0.2em] uppercase font-bold">${data.organization}</h2>
                            <p class="text-gray-400 text-[10px] tracking-wider uppercase">Official Certification</p>
                        </div>
                    </div>
                    ${data.qrEnabled ? `<div id="qrcode" class="bg-white p-2 rounded shadow-lg"></div>` : ''}
                </div>

                <!-- Main Content -->
                <div class="text-center space-y-10 my-auto">
                    <h1 class="text-7xl text-white font-bold tracking-tight drop-shadow-2xl">Certificate</h1>
                    
                    <div class="py-6 relative">
                        <!-- Decorative Lines -->
                        <div class="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent"></div>
                        
                        <div class="relative bg-[#0F172A]/80 inline-block px-10 py-2">
                            <p class="text-gray-400 font-poppins text-sm tracking-[0.3em] uppercase">This Honor is Bestowed Upon</p>
                        </div>
                    </div>

                    <div class="text-6xl text-yellow-100 py-4 font-playfair italic drop-shadow-md text-glow">${data.recipientName}</div>

                    <div class="space-y-4">
                        <p class="text-gray-400 font-poppins text-sm tracking-wide">In Recognition of Mastery In</p>
                        <h3 class="text-4xl text-yellow-500 font-bold tracking-wide">${data.courseName}</h3>
                        <p class="text-gray-400 text-sm max-w-2xl mx-auto font-poppins leading-relaxed opacity-80 border-t border-yellow-600/20 pt-4 mt-4">${data.description}</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-between items-end border-t border-white/10 pt-8 mt-4">
                     <div>
                        <div class="h-12 border-b border-gray-600 w-56 mb-2 flex items-end pb-1 overflow-hidden">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png" class="h-10 invert opacity-50">
                        </div>
                        <p class="text-[10px] text-yellow-600 uppercase tracking-widest font-bold">Authorized Signature</p>
                     </div>
                     
                     <div class="text-center">
                        <p class="text-xs text-gray-500 mb-1 font-mono tracking-widest">ID: ${data.certId}</p>
                        <i class="fas fa-shield-alt text-2xl text-yellow-600/50"></i>
                     </div>

                     <div class="text-right">
                        <p class="text-xl text-white font-mono mb-2">${data.date}</p>
                        <p class="text-[10px] text-yellow-600 uppercase tracking-widest font-bold">Date of Issue</p>
                     </div>
                </div>
            </div>
             ${data.watermarkEnabled ? `
            <div class="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                 <i class="fas fa-shield-alt text-[24rem] text-yellow-400"></i>
            </div>` : ''}
        </div>
    `,

  gold: (data) => `
        <div class="w-full h-full bg-gradient-to-br from-[#FFFDF5] to-[#FFFFFF] p-12 flex flex-col relative font-playfair text-[#5C481D]">
            <!-- Gold Frame -->
            <div class="absolute inset-4 border-[3px] border-[#C59D45] z-0 pointer-events-none"></div>
            <div class="absolute inset-6 border border-[#E6C87F] z-0 pointer-events-none"></div>
            
            <!-- Corner Accents -->
            <div class="absolute top-4 left-4 text-5xl text-[#C59D45]"><i class="fab fa-ethereum"></i></div>
            <div class="absolute top-4 right-4 text-5xl text-[#C59D45]"><i class="fab fa-ethereum"></i></div>
            <div class="absolute bottom-4 left-4 text-5xl text-[#C59D45] rotate-180"><i class="fab fa-ethereum"></i></div>
            <div class="absolute bottom-4 right-4 text-5xl text-[#C59D45] rotate-180"><i class="fab fa-ethereum"></i></div>

            <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-16 space-y-8">
                
                <div class="w-full flex justify-between items-start absolute top-16 left-0 px-20">
                    <div class="text-left">
                        <h2 class="font-bold text-lg text-[#8A6E2F] uppercase tracking-widest">${data.organization}</h2>
                    </div>
                </div>

                ${data.logoUrl ? `<img src="${data.logoUrl}" class="h-24 mb-4 drop-shadow-md mt-10" alt="Logo">` : '<div class="h-24"></div>'}
                
                <div>
                    <h1 class="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#b8860b] to-[#ffd700] mb-2 drop-shadow-sm filter" style="-webkit-text-stroke: 1px #8A6E2F;">Certificate</h1>
                    <p class="text-3xl italic text-[#8A6E2F] opacity-90 font-alex">of Appreciation</p>
                </div>

                <div class="w-full max-w-4xl space-y-4 py-8 border-y border-[#E6C87F]/30">
                    <p class="text-sm uppercase tracking-[0.3em] text-[#8A6E2F] font-bold">This is Presented To</p>
                    <div class="text-7xl font-bold text-[#3d2f12] py-2">${data.recipientName}</div>
                </div>

                <div class="mb-4 max-w-3xl">
                    <p class="text-base text-[#8A6E2F] mb-4 italic">For outstanding achievement in</p>
                    <h2 class="text-5xl font-bold text-[#C59D45] mb-6">${data.courseName}</h2>
                    <p class="text-sm text-[#8A6E2F] leading-relaxed font-poppins">${data.description}</p>
                </div>

                <div class="grid grid-cols-3 gap-12 w-full max-w-5xl pt-10 mt-auto items-end">
                    <div class="text-center">
                        <div class="font-alex text-4xl mb-2 text-[#5C481D]">Director</div>
                        <div class="h-px bg-[#C59D45] w-full mb-2"></div>
                        <p class="text-[10px] uppercase tracking-widest text-[#8A6E2F]">Signature</p>
                    </div>
                    <div class="flex flex-col items-center justify-center">
                        ${data.qrEnabled ? `<div id="qrcode" class="border-4 border-white shadow-xl p-1 bg-white mb-2"></div>` :
      `<div class="w-24 h-24 rounded-full border-4 border-[#C59D45] flex items-center justify-center shadow-inner bg-[#fff9c4]/20 mb-2">
                            <i class="fas fa-award text-[#C59D45] text-4xl"></i>
                        </div>`}
                        <div class="text-[9px] font-mono text-[#8A6E2F]">${data.certId}</div>
                    </div>
                     <div class="text-center">
                        <div class="font-poppins text-xl mb-2 font-bold text-[#5C481D]">${data.date}</div>
                        <div class="h-px bg-[#C59D45] w-full mb-2"></div>
                        <p class="text-[10px] uppercase tracking-widest text-[#8A6E2F]">Date</p>
                    </div>
                </div>
            </div>
            
             ${data.watermarkEnabled ? `
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[20px] rounded-full border-[#C59D45] opacity-[0.03] flex items-center justify-center pointer-events-none">
                 <div class="w-[400px] h-[400px] border-[10px] rounded-full border-[#C59D45] flex items-center justify-center">
                    <span class="text-6xl font-bold uppercase tracking-widest rotate-[-30deg] text-[#C59D45]">Premium</span>
                 </div>
            </div>` : ''}
        </div>
    `
};

// ==========================================
// RENDER LOGIC
// ==========================================
function updatePreview() {
  // 1. Update State
  state.recipientName = document.getElementById('recipientName').value || 'Recipient Name';
  state.courseName = document.getElementById('courseName').value || 'Course Name';
  state.description = document.getElementById('description').value;
  state.date = document.getElementById('issueDate').value || new Date().toISOString().split('T')[0];
  state.organization = document.getElementById('organization').value;
  state.logoUrl = document.getElementById('logoUrl').value;
  state.accentColor = document.getElementById('accentColor').value;
  state.qrEnabled = document.getElementById('qrToggle').checked;
  state.watermarkEnabled = document.getElementById('watermarkToggle').checked;

  // 2. Render Template
  const container = document.getElementById('certificate-container');
  const renderFn = templates[state.template] || templates['classic'];
  container.innerHTML = renderFn(state);

  // 3. Render QR Code if enabled
  if (state.qrEnabled) {
    // Find the QR div container injected by the template
    const qrDiv = document.getElementById('qrcode');
    if (qrDiv) {
      qrDiv.innerHTML = ''; // Clear previous
      try {
        // Use qrcode.js library
        new QRCode(qrDiv, {
          text: `https://certgen.com/verify/${state.certId}`, // Mock Verification URL
          width: 80,
          height: 80,
          colorDark: state.template === 'dark' ? "#000000" : state.accentColor,
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (e) { console.error("QR Render Error", e); }
    }
  }

  // 4. Highlight Selected Template in Sidebar
  document.querySelectorAll('.template-btn').forEach(btn => {
    if (btn.dataset.template === state.template) {
      btn.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
      btn.classList.remove('border-transparent');
    } else {
      btn.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
      btn.classList.add('border-transparent');
    }
  });

  // Update Cert ID Display
  document.getElementById('certId').value = state.certId;
}

// ==========================================
// CONTROLS
// ==========================================
function setTemplate(name) {
  state.template = name;
  updatePreview();
}

function handleLogoUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('logoUrl').value = e.target.result; // Set data URL to input
      updatePreview();
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function adjustZoom(delta) {
  state.zoom += delta;
  state.zoom = Math.max(0.3, Math.min(2.0, state.zoom)); // Clamp

  // Apply zoom to the wrapper (scaling logic)
  // We scale the WRAPPER, not the container itself to keep px resolution high
  const wrapper = document.getElementById('preview-wrapper');
  wrapper.style.transform = `scale(${state.zoom})`;

  // Update label
  document.getElementById('zoomLevel').innerText = Math.round(state.zoom * 100) + '%';
}

function toggleFullScreen() {
  const section = document.querySelector('main');
  if (!document.fullscreenElement) {
    section.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

// ==========================================
// EXPORT & SAVE
// ==========================================
async function downloadPDF() {
  const { jsPDF } = window.jspdf;

  const container = document.getElementById('certificate-container');
  const wrapper = document.getElementById('preview-wrapper');

  // 1. Temporarily reset transform/scale to ensure clean capture
  const originalTransform = wrapper.style.transform;
  wrapper.style.transform = 'scale(1)';

  // 2. Show loading (optional: change button text)
  const btn = document.querySelector('button[onclick="downloadPDF()"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  btn.disabled = true;

  try {
    // 3. HTML2Canvas Capture
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution (2x)
      useCORS: true, // Allow cross-origin images
      logging: false,
      backgroundColor: '#ffffff'
    });

    // 4. Create PDF
    const imgData = canvas.toDataURL('image/png');

    // A4 Landscape Dimensions
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Certificate_${state.recipientName.replace(/\s+/g, '_')}.pdf`);

    showToast("Certificate Downloaded!");

    // Record Action in Backend (if certId exists/saved)
    if (state.certId) {
      recordCertificateAction(state.certId, 'DOWNLOADED', `Downloaded PDF for ${state.recipientName}`);
    }

  } catch (err) {
    console.error("PDF Generate Error", err);
    alert("Failed to generate PDF. check console.");
  } finally {
    // Restore UI
    wrapper.style.transform = originalTransform;
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function saveCertificate() {
  const btn = document.querySelector('button[onclick="saveCertificate()"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  try {
    const formData = {
      recipientName: state.recipientName,
      recipientEmail: 'generated@temp.com', // To be filled real or temp
      courseName: state.courseName,
      organization: state.organization,
      description: state.description,
      startDate: state.date,
      endDate: state.date,
      templateUsed: state.template,
      qrEnabled: state.qrEnabled,
      watermarkEnabled: state.watermarkEnabled,
      certificateId: state.certId
    };

    // Since logic might be reused, allow passing explicit email if user provided (not in UI currently)
    // For now, use dummy or prompt
    const email = prompt("Enter recipient email to save record:", "student@example.com");
    if (!email) {
      btn.innerHTML = '<i class="fas fa-save text-green-600"></i> Save to Cloud';
      return;
    }
    formData.recipientEmail = email;

    const res = await fetch('http://localhost:5000/api/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      showToast("Saved to Database!");
    } else {
      const err = await res.json();
      alert("Error: " + err.message);
    }
  } catch (e) {
    console.error(e);
    alert("Network Error");
  } finally {
    btn.innerHTML = '<i class="fas fa-save text-green-600"></i> Save to Cloud';
  }
}

// ==========================================
// LOGGING
// ==========================================
// recordCertificateAction is available globally from js/auth.js

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.querySelector('span').innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Parse URL params for "Edit" mode
  const urlParams = new URLSearchParams(window.location.search);
  const fromSandbox = urlParams.get('from');

  // Check if loading from sandbox data
  if (fromSandbox) {
    const sbData = sessionStorage.getItem('sandboxData');
    if (sbData) {
      try {
        const d = JSON.parse(sbData);
        if (d.name) document.getElementById('recipientName').value = d.name;
        if (d.course) document.getElementById('courseName').value = d.course;
        if (d.desc) document.getElementById('description').value = d.desc;
        if (d.date) document.getElementById('issueDate').value = d.date;

        // Map Sandbox templates to Editor templates
        if (d.template) {
          const templateMap = {
            'professional': 'classic',
            'academic': 'minimal'
          };
          state.template = templateMap[d.template] || (templates[d.template] ? d.template : 'classic');
        }
      } catch (e) {
        console.error("Error parsing sandbox data", e);
      }
      showToast("Loaded Playground Data");
    }
  }

  // Set Date Default if empty
  const dateInput = document.getElementById('issueDate');
  if (!dateInput.value) {
    dateInput.valueAsDate = new Date();
  }

  // Set Font Size Controller (if needed) but we rely on tailwind classes in templates

  // Render
  updatePreview();

  // Initial Zoom Fit (approx 0.6 for standard screens)
  state.zoom = 0.7;
  adjustZoom(0);
});