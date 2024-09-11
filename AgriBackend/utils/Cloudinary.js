const cloudinary = required('cloudinary').v2;
const { CloudinaryStorage } = required('multer-storage-cloudinary');
const multer = required('multer');
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

const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req, file) => {
            const fileName = file.originalname.replace(/\.[^/.]+$/, "");
            const uniqueSuffix = Date.now() + "-" + uuidv4();
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
