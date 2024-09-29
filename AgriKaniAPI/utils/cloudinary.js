const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { RESOURCE } = require('../constants/index');
const { v4: uuidv4 } = require('uuid');

const DEFAULT_WITDH = 500;
const DEFAULT_HEIGHT = 500;
const LIMIT = "limit";

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY ,
        api_secret: process.env.CLOUDINARY_SECRET
    });

    function getCurrentDate() {
        const now = new Date();
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      }

const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req, file) => {
            const fileName = file.originalname.replace(/\.[^/.]+$/, "");
            const uniqueSuffix = getCurrentDate() + "-" + uuidv4();
            return{
                folder: RESOURCE.IMAGES,
                transformation: [
                    { width: DEFAULT_WITDH, height: DEFAULT_HEIGHT, crop: LIMIT },
                ],
                public_id: `${fileName}-${uniqueSuffix}`,
            };
        },
    });

const upload = multer ({storage: storage})
module.exports = {cloudinary, upload}
