const ErrorHandler = require("../utils/success-errorHandler")
const { RESOURCE } = require("../constants/index")

const FieldMonitor = (req, res, next) => {
    const missingField =  field.filter((field) => field === RESOURCE.IMAGE ?
!req.file.image && !req.files : !req.body[field]);

if (missingField.length)

    return next( 
        new ErrorHandler(
            JSON.stringify(
                missingField.map((field) => ({ [field]: ` ${field}  is required` }))
              ).replace(/[{}\[\]\\"]/g, "")
        )
    )
    next()
}

module.exports = FieldMonitor