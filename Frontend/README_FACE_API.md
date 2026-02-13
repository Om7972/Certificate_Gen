# Face Recognition Setup

To enable Face Verification features, you must download the AI models and place them in the correct folder.

## Steps:

1. **Create Models Directory**:
   - Inside the **Frontend** folder, create a new folder named `models`.

2. **Download Model Files**:
   - Download the model shard files from the official repository or a reliable source.
   - You can find them here: [https://github.com/justadudewhohacks/face-api.js/tree/master/weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - Download *all files* (or at least the ones below) and place them in `Frontend/models/`.

   **Required Models:**
   - `ssd_mobilenet_v1_model-weights_manifest.json`
   - `ssd_mobilenet_v1_model-shard1`
   - `ssd_mobilenet_v1_model-shard2`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`

   *(Ensure filenames are exactly as listed in the manifests)*

3. **Verify**:
   - Open `verify-face.html` in your browser (via Live Server).
   - The status should change from "Loading Models" to "Models Ready".

## Usage:

1. **Generate Certificate**:
   - Go to Generator.
   - Fill details and **Upload Recipient Photo**.
   - Click Save.

2. **Verify**:
   - Go to `verify-face.html`.
   - Enter the Certificate ID (e.g., `CERT-123...`).
   - Click "Load Data".
   - The stored photo should appear.
   - Allow Camera access.
   - Position your face in the camera view.
   - Click "Scan & Verify".

## Troubleshooting

- **Models not loading**: Check the browser console (F12) for 404 errors. Ensure the path is correct (`Frontend/models/`).
- **CORS Error**: Ensure Backend is running on port 5000 and has CORS enabled (it is enabled by default in this project).
- **No Face Detected**: Ensure good lighting and face the camera directly.
