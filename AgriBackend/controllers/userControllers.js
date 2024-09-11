const { upload } = require("../utils/Cloudinary")

exports.SignUp = [
    upload.single("image"),
]