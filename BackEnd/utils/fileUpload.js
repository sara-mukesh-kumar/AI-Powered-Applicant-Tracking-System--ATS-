// /**
//  * ============================================
//  * FILE UPLOAD UTILITIES
//  * ============================================
//  * Handles file uploads and storage configuration
//  */

// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import pdf from "pdf-parse";
// import mammoth from "mammoth";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     // Generate unique filename: userId-timestamp-originalname
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${req.user._id}-${uniqueSuffix}${ext}`);
//   },
// });

// // File filter for PDFs and images
// const fileFilter = (req, file, cb) => {
//   const allowedMimes = [
//     "application/pdf",
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//   ];

//   if (allowedMimes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Only PDF, DOC, DOCX, and image files are allowed. Got: ${file.mimetype}`), false);
//   }
// };

// // Create multer instance
// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB max
//   },
// });

// /**
//  * Extract text from PDF file
//  */
// const extractTextFromPDF = async (filePath) => {
//   try {
//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdf(dataBuffer);
//     return data.text || "";
//   } catch (error) {
//     console.error("Error extracting PDF:", error.message);
//     return "";
//   }
// };

// /**
//  * Extract text from DOCX file
//  */
// const extractTextFromDOCX = async (filePath) => {
//   try {
//     const buffer = fs.readFileSync(filePath);
//     const result = await mammoth.extractRawText({ buffer });
//     return result.value || "";
//   } catch (error) {
//     console.error("Error extracting DOCX:", error.message);
//     return "";
//   }
// };

// /**
//  * Extract text from resume file
//  * Supports PDF and DOCX files
//  */
// export const extractResumeText = async (file) => {
//   if (!file) return "";

//   const filePath = file.path;
//   const ext = path.extname(file.originalname).toLowerCase();

//   try {
//     if (ext === ".pdf") {
//       return await extractTextFromPDF(filePath);
//     } else if (ext === ".docx" || ext === ".doc") {
//       return await extractTextFromDOCX(filePath);
//     }
//     return "";
//   } catch (error) {
//     console.error("Error extracting resume text:", error);
//     return "";
//   }
// };

// /**
//  * Parse resume text from filename and metadata
//  */
// export const parseResumeFile = async (file) => {
//   if (!file) {
//     return {
//       text: "",
//       filename: "",
//       originalName: "",
//       path: "",
//       url: "",
//       mimetype: "",
//       size: 0,
//     };
//   }

//   // Extract text from file
//   const resumeText = await extractResumeText(file);

//   return {
//     text: resumeText,
//     filename: file.filename,
//     originalName: file.originalname,
//     path: file.path,
//     url: `/uploads/${file.filename}`,
//     mimetype: file.mimetype,
//     size: file.size,
//   };
// };

// /**
//  * Validate file upload
//  */
// export const validateFileUpload = (file) => {
//   if (!file) {
//     return { valid: false, error: "No file provided" };
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     return { valid: false, error: "File size exceeds 5MB limit" };
//   }

//   const validExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
//   const fileExt = path.extname(file.originalname).toLowerCase();
//   if (!validExtensions.includes(fileExt)) {
//     return { valid: false, error: "File type not supported" };
//   }

//   return { valid: true };
// };

// export default { upload, parseResumeFile, validateFileUpload };


/**
 * ============================================
 * FILE UPLOAD UTILITIES
 * ============================================
 * Handles file uploads and storage configuration
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mammoth from "mammoth";
import { createRequire } from "module";

// FIX: Create a 'require' function to load older CommonJS modules like 'pdf-parse'
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${req.user._id}-${uniqueSuffix}${ext}`);
  },
});

// File filter for PDFs and images
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only PDF, DOC, DOCX, and image files are allowed. Got: ${file.mimetype}`), false);
  }
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/**
 * Extract text from PDF file
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text || "";
  } catch (error) {
    console.error("Error extracting PDF:", error.message);
    return "";
  }
};

/**
 * Extract text from DOCX file
 */
const extractTextFromDOCX = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("Error extracting DOCX:", error.message);
    return "";
  }
};

/**
 * Extract text from resume file
 * Supports PDF and DOCX files
 */
export const extractResumeText = async (file) => {
  if (!file) return "";

  const filePath = file.path;
  const ext = path.extname(file.originalname).toLowerCase();

  try {
    if (ext === ".pdf") {
      return await extractTextFromPDF(filePath);
    } else if (ext === ".docx" || ext === ".doc") {
      return await extractTextFromDOCX(filePath);
    }
    return "";
  } catch (error) {
    console.error("Error extracting resume text:", error);
    return "";
  }
};

/**
 * Parse resume text from filename and metadata
 */
export const parseResumeFile = async (file) => {
  if (!file) {
    return {
      text: "",
      filename: "",
      originalName: "",
      path: "",
      url: "",
      mimetype: "",
      size: 0,
    };
  }

  // Extract text from file
  const resumeText = await extractResumeText(file);

  return {
    text: resumeText,
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    url: `/uploads/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
  };
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file) => {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "File size exceeds 5MB limit" };
  }

  const validExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (!validExtensions.includes(fileExt)) {
    return { valid: false, error: "File type not supported" };
  }

  return { valid: true };
};

export default { upload, parseResumeFile, validateFileUpload };