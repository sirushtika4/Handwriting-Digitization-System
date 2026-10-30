# Ink2Digital – Handwriting Digitization and PDF Conversion System
---

## 📖 Project Overview

**Ink2Digital** is a full-stack web application designed to convert handwritten notes and documents into editable digital text using Optical Character Recognition (OCR).

The application allows users to upload handwritten JPG, PNG and PDF files, extract text, manually correct recognition errors, and generate downloadable PDF documents.

It also provides secure user authentication and complete CRUD operations for managing documents.

## 🎯 Project Objectives

- Develop a modern full-stack web application using the MERN stack.
- Implement secure registration, login and JWT-based authentication.
- Support handwritten JPG, PNG and PDF document uploads.
- Extract text using Tesseract.js OCR.
- Allow users to edit and save recognized text.
- Generate PDF documents from corrected digital text.
- Implement complete Create, Read, Update and Delete operations.
- Provide document searching, filtering and sorting.
- Store user and document information persistently in MongoDB.

## 🛠️ Technologies Used

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| File Upload | Multer |
| Text Recognition | Tesseract.js |
| API Communication | Axios, RESTful APIs |
| Navigation | React Router |
| Icons | Lucide React |
| Version Control | Git and GitHub |

## ✨ Main Features

### 1. User Authentication
Users can register, log in and log out. Protected routes restrict access to authenticated users.

### 2. Dashboard
Displays document statistics, recently uploaded documents and quick navigation actions.

### 3. Document Upload
Allows users to upload JPG, PNG and PDF documents with file validation and a maximum file size of 10 MB.

### 4. Handwriting Digitization
Uses an OCR processing pipeline to extract text from uploaded images and PDF pages.

### 5. Editable Digital Text
Displays recognized text in an editable area. Users can manually correct errors with browser spelling assistance.

### 6. PDF Generation
Converts corrected digital text into a downloadable PDF document.

### 7. Document Management
Users can view, search, filter, sort and delete their uploaded documents.

### 8. Secure Data Storage
Document metadata and corrected text are stored in MongoDB and associated with their respective user accounts.

## 🔄 CRUD Operations

| Operation | Functionality |
|---|---|
| Create | Upload a new document and save its record |
| Read | View, search, filter and sort documents |
| Update | Edit and save recognized text |
| Delete | Delete an uploaded document |

The **Document** collection is the primary entity used to demonstrate CRUD operations.

## 🏗️ System Architecture

```text
React Frontend
      |
      | RESTful API / Axios
      v
Node.js + Express Backend
      |
      +------ JWT Authentication
      |
      +------ Multer File Upload
      |
      +------ OCR Processing (Tesseract.js)
      |
      +------ PDF Generation
      |
      v
MongoDB Database
      |
      +------ Users Collection
      |
      +------ Documents Collection
```

## 🗄️ Database Design

The application uses two main MongoDB collections.

**Users Collection**

Stores user information including:

- `_id`
- `name`
- `email`
- `password` (hashed)
- `authProvider`
- `profileImage`
- `createdAt`
- `updatedAt`

**Documents Collection**

Stores document information including:

- `_id`
- `user`
- `title`
- `originalFileName`
- `storedFileName`
- `filePath`
- `fileType`
- `fileSize`
- `recognizedText`
- `status`
- `tags`
- `createdAt`
- `updatedAt`

**Relationship:** One user can upload many documents, while each document belongs to one user.

## 🔌 REST API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Retrieve authenticated user |

### Documents

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload document |
| GET | `/api/documents` | Retrieve documents |
| GET | `/api/documents/:id` | View document details |
| POST | `/api/documents/:id/digitize` | Digitize handwriting |
| PUT | `/api/documents/:id/text` | Save corrected text |
| GET | `/api/documents/:id/pdf` | Generate/download PDF |
| DELETE | `/api/documents/:id` | Delete document |

Document endpoints use JWT authentication and ownership checks.

## 📁 Project Structure

```text
Handwriting-Digitization-System/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── htr-service/
│   └── Experimental handwriting recognition service
│
└── README.md
```

The optional `htr-service` directory contains experimental work for future handwriting-recognition improvements. The core MERN application uses Tesseract.js.

## 💻 Installation and Setup

### Prerequisites

Install:

- Node.js and npm
- MongoDB Community Server
- Git
- VS Code or another code editor

### 1. Clone the Repository

```bash
git clone https://github.com/sirushtika4/Handwriting-Digitization-System.git
cd Handwriting-Digitization-System
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the environment variables required by your server.

Use `server/.env.example` as a reference where available. Keep real secrets private and do not commit `.env`.

Start the backend:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Frontend Setup

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend normally runs at:

`http://localhost:5173`

### 4. Database

Ensure your local MongoDB server is running.

The application database is named:

`handwriting_digitizer`

MongoDB stores users, document metadata and corrected OCR text.

## 🔐 Security

The application uses:

- JWT-based authentication
- Hashed passwords using bcryptjs
- Protected REST API endpoints
- Document ownership checks
- File type and file size validation
- Error handling for invalid requests

**Note:** The application is primarily intended for local academic demonstration. Deployment security, especially authenticated access to uploaded originals, should be reviewed before production hosting.

## 🧪 Testing

The following workflows were manually tested during development:

- User registration and login
- Protected dashboard navigation
- JPG, PNG and PDF uploads
- Viewing uploaded documents
- Image and PDF digitization
- Editing recognized text
- Saving text to MongoDB
- Generating downloadable PDFs
- Searching and filtering documents
- Deleting documents
- Browser spelling assistance

## ⚠️ Limitations

- OCR accuracy depends on handwriting clarity and document quality.
- Complex tables and cursive writing may reduce recognition accuracy.
- Browser spelling assistance does not identify every OCR error.
- The Python-based handwriting-recognition service is experimental and not required for the core application.

## 🚀 Future Enhancements

- More accurate AI-based handwriting recognition
- Cloud document storage
- Improved support for handwriting layouts and tables
- Authenticated document preview streaming
- Deployment and automated testing

## 👩‍💻 Developer

**Sirushtika P.**  
**EG/2023/5903**  
University of Ruhuna – Faculty of Engineering

**Module:** EC4307 – Web Application Development

---

**Ink2Digital — Transforming Handwritten Notes into Digital Documents.**
