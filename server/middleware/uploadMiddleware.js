const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "ExamPlatform/ProfilePhotos",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],

    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
      },
    ],
  },
});

const upload = multer({
  storage,
});

module.exports = upload;