# Premium Certificate Generator

A specialized, high-performance module for designing and generating professional certificates.

## Features
- **5 Premium Templates**: Classic, Modern, Minimal, Dark, Gold.
- **Live Vector-Sharp Preview**: Scaled rendering for pixel-perfect editing.
- **High-Res PDF Export**: Generates A4 PDFs using `html2canvas` (2x scale) and `jsPDF`.
- **Customizable**:
    - Colors, Fonts (Playfair, Poppins, Great Vibes).
    - Toggle QR Codes and Watermarks.
    - Dynamic organization and course details.

## Technical Setup

### Backend
The `Certificate` model has been updated to support new fields:
- `organization`: String
- `qrEnabled`: Boolean
- `watermarkEnabled`: Boolean
- `templateUsed`: Enum extended with new styles.

### Frontend
- **Framework**: Tailwind CSS (standalone, no Bootstrap dependency for this page).
- **Libraries**:
    - `html2canvas`: For DOM rasterization.
    - `jspdf`: For PDF document generation.
    - `qrcode.js`: For dynamic QR generation.

## How to Run
1. Ensure the Backend is running:
   ```bash
   cd Backend
   npm start
   ```
2. Serve the Frontend (e.g., using Live Server or local http-server):
   - Navigate to `Frontend/generator.html`.
3. **Login**: You must be logged in (token in localStorage) to save certificates.

## Usage
1. **Select Template**: Click on a style in the left sidebar.
2. **Edit Details**: Type in real-time; the preview updates instantly.
3. **Customize**: Change accent colors or toggle elements.
4. **Download**: Click "Download PDF" for a client-side generated file.
5. **Save**: Click "Save to Cloud" to persist the record in MongoDB.
