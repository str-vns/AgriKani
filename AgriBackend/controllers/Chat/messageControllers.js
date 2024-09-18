const asyncHandler = require('express-async-handler')
const massageProcess = require('../../process/Chat/messagesProcess')
const SuccessHandler = require('../../utils/successHandler')
const { STATUSCODE } = require('../../constants/index')
const { upload } = require('../../utils/cloudinary')

exports.newMessage = [
    upload.array("image"),
    asyncHandler(async (req, res) =>
    {
        const message = await massageProcess.newMessage(req)

        SuccessHandler(
            res,
             `Successfully created new Message ${message?._id}`,
             {
                message,
             }
           );
    })
]


exports.getMessages = asyncHandler(async (req, res) =>
    {
        const message = await massageProcess.getMesssages(req.params.id)
    
        SuccessHandler(
            res,
            `Successfully fetched Message`,
            message
        )
    }
    
    )

exports.unsentMessage = asyncHandler(async (req, res) =>
        {
            const message = await massageProcess.unsentMessage(req.params.id)
        
            SuccessHandler(
                res,
                `Successfully Unsent Message`,
                message
            )
        }
        
        )    