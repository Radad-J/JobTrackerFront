const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { Readable } = require("stream");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name_cloudinary,
  api_key: process.env.api_key_cloudinary,
  api_secret: process.env.api_secret_cloudinary,
});

const uploadToCloudinary = (ressourceType, folderPath, buffer) => {
  return new Promise((resolve, reject) => {
    const streamTransformer = cloudinary.uploader.upload_stream(
      { ressource_type: ressourceType, folder: folderPath },
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
    let str = Readable.from(buffer);
    str.pipe(streamTransformer);
  });
};

const uploadCVpdf = async (buffer) => {
  try {
    return await uploadToCloudinary(
      "application/pdf",
      "JobApplyTracker/CVpdf",
      buffer
    );
  } catch (err) {
    err = { cloudinaryError: { formatError: "Not valid format for CV pdf" } };
    throw err;
  }
};

const uploadProfilePicture = async (buffer) => {
  try {
    return await uploadToCloudinary(
      "image/png",
      "JobApplyTracker/profilePicture",
      buffer
    );
  } catch (err) {
    err = {
      cloudinaryError: {
        formatError: "Not valid format for profile picture. png required",
      },
    };
    throw err;
  }
};

const removeFileFromCloudinary = async (url) => {
  try {
    // transforme un lien comme celui-ci
    // https://res.cloudinary.com/dolkoshze/image/upload/v1722420320/JobApplyTracker/CVpdf/zpfyhnh8ijsjcskqpxwg.pdf
    // en ceci
    // JobApplyTracker/CVpdf/zpfyhnh8ijsjcskqpxwg
    const publicID = url.split("/").slice(-3).join("/").split(".")[0];
    const result = await cloudinary.uploader.destroy(publicID);
    console.log("Delete result:", result);
    return result;
  } catch (err) {
    if (err.message.includes("Missing required parameter")) {
      err = {
        cloudinaryError: {
          URLerror: "No file hosted here",
        },
      };
    }
    throw err;
  }
};

const updateProfilePictureFromCloudinary = async (url, buffer) => {
  try {
    await removeFileFromCloudinary(url);
  } catch (err) {
    console.log(err);
  }
  const result = await uploadProfilePicture(buffer);
  return result;
};

const updateCVFromCloudinary = async (url, buffer) => {
  try {
    await removeFileFromCloudinary(url);
  } catch (err) {
    console.log(err);
  }
  const result = await uploadCVpdf(buffer);
  return result;
};

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: "CVpdf", maxCount: 1 },
  { name: "pictureProfile", maxCount: 1 },
]);

module.exports = {
  uploadFields,
  uploadCVpdf,
  uploadProfilePicture,
  removeFileFromCloudinary,
  updateProfilePictureFromCloudinary,
  updateCVFromCloudinary,
};
