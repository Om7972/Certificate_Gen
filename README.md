# Online Certificate Generator
A web application to generate, customize, download, and email certificates.

## Project Structure
- `Frontend/`: Contains HTML, CSS, and JS files for the UI
- `Backend/`: Contains Node.js/Express server and MongoDB models

## Features
- **Authentication**: User registration and login (JWT based).
- **Certificate Generation**: Create single or bulk certificates using templates.
- **Bulk Upload**: Upload Excel/CSV files for bulk generation.
- **Email**: Send certificates directly to recipients.
- **Download**: Download certificates as PDF.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (already created as `certificat.env` but code expects `.env` or specifying path):
   The server code is already set to use `certificat.env`.
   Ensure `certificat.env` has the following:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password_or_app_password
   MONGODB_URI=mongodb://localhost:27017/certificates
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `Frontend` directory.
2. Open `index.html` in your browser or use Live Server.

## Usage
1. **Register/Login**: Create an account to access protected features like saving to DB and sending emails.
2. **Generate**: Fill out the form to generate a certificate.
3. **Template**: Choose a different design template.
4. **Bulk Generate**: Upload an Excel file with columns: Name, Email, Course, Start Date, End Date.
5. **Save/Send**: Save generated certificates to the database or email them.
