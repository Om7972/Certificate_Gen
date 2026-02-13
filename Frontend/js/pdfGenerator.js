/**
 * PDF Generator Module
 * Uses html2canvas and jsPDF to generate high-quality PDF certificates.
 */

window.PDFGenerator = (function () {

    // A4 Landscape dimensions in mm
    const A4_WIDTH_MM = 297;
    const A4_HEIGHT_MM = 210;

    // Scale factor for high resolution (higher = better quality, larger file size)
    // 2 is usually sufficient for screen, 4 for print.
    const SCALE_FACTOR = 3;

    /**
     * Generates a PDF from an HTML element
     * @param {HTMLElement} element - The DOM element to convert
     * @param {string} filename - The name of the downloaded file
     */
    async function generate(element, filename = 'certificate.pdf') {
        if (!element) {
            console.error('PDFGenerator: Element not found');
            return;
        }

        // Show loading indicator if you have one
        const originalCursor = document.body.style.cursor;
        document.body.style.cursor = 'wait';

        try {
            // 1. Prepare element for capture
            // We clone the node to modify styles without affecting the visible page
            // However, cloning with images helps only if images are loaded.
            // html2canvas works best on visible elements.

            // Hack: Temporarily fix width to A4 ratio to ensure content fits perfectly
            // 1123px is approx A4 width at 96DPI, but we rely on scaling.
            // Let's assume the certificate-container is responsive or fixed width.

            // Store original styles
            const originalStyle = {
                transform: element.style.transform,
                width: element.style.width,
                margin: element.style.margin,
                borderRadius: element.style.borderRadius,
                boxShadow: element.style.boxShadow
            };

            // Reset specific styles for clean capture
            element.style.transform = 'none';
            element.style.margin = '0';
            element.style.borderRadius = '0';
            element.style.boxShadow = 'none';

            // Ensure no scrollbars in capture
            element.style.overflow = 'hidden';

            // 2. Capture with html2canvas via promise
            const canvas = await html2canvas(element, {
                scale: SCALE_FACTOR,
                useCORS: true, // Important for external images
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff', // Ensure white background
                imageTimeout: 15000,
                onclone: (clonedDoc) => {
                    // You can manipulate the cloned document here if needed
                    // e.g., make text darker for print
                    const clonedElement = clonedDoc.querySelector('.certificate-content');
                    if (clonedElement) {
                        // Apply print-specific adjustments here
                    }
                }
            });

            // 3. Initialize jsPDF
            const { jsPDF } = window.jspdf;
            // 'l' for landscape, 'mm' for millimeters, 'a4' format
            const doc = new jsPDF('l', 'mm', 'a4');

            // 4. Calculate dimensions to fit A4 perfectly
            const imgData = canvas.toDataURL('image/jpeg', 0.95); // JPEG is smaller than PNG, 0.95 quality

            // Add image to PDF (x, y, width, height)
            doc.addImage(imgData, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

            // 5. Save
            doc.save(filename);

            // Restore original styles
            element.style.width = originalStyle.width;
            element.style.transform = originalStyle.transform;
            element.style.margin = originalStyle.margin;
            element.style.borderRadius = originalStyle.borderRadius;
            element.style.boxShadow = originalStyle.boxShadow;

        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. check console for details.');
        } finally {
            document.body.style.cursor = originalCursor;
        }
    }

    return {
        generate: generate
    };

})();
