const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const memberProcess = require("../process/memberProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.CreateMember = [
    upload.fields([
        { name: "barangayClearance", maxCount: 1 },
        { name: "validId", maxCount: 1 },
    ]),
    CheckField([
        "userId",
        "address",
        "barangay",
        "city",
        "coopId",
    ]),
    
    asyncHandler(async (req, res) => {
        const member = await memberProcess.CreateMemberProcess(req);
    
        return SuccessHandler(
        res,
        `Member has been created successfully`,
        member
        );
    }),
    ];

exports.GetMember = asyncHandler(async (req, res, next) => {
    const member = await memberProcess.GetMemberProcess(req);
    
    return member?.length === STATUSCODE.ZERO
        ? next(new ErrorHandler("No Member Found"))
        : SuccessHandler(res, `Member has been fetched Successfully`, member);
    }
);

exports.GetMemberList = asyncHandler(async (req, res, next) => {

    const member = await memberProcess.GetMemberListProcess(req.params.id, req);

    return member?.length === STATUSCODE.ZERO
        ? next(new ErrorHandler("No Member Found"))
        : SuccessHandler(res, `Member has been fetched Successfully`, member);
    }
);

exports.GetMemberListInactive = asyncHandler(async (req, res, next) => {
    const member = await memberProcess.GetMemberListInactiveProcess(req.params.id, req);

    return member?.length === STATUSCODE.ZERO
        ? next(new ErrorHandler("No Member Found"))
        : SuccessHandler(res, `Member has been fetched Successfully`, member);
    }
);

exports.UpdateMember = [
    upload.fields([
        { name: "barangayClearance", maxCount: 1 },
        { name: "validId", maxCount: 1 },
    ]),
    CheckField([
        "userId",
        "address",
        "barangay",
        "city",
        "coopId",
    ]),
    
    asyncHandler(async (req, res) => {
        const member = await memberProcess.UpdateMemberProcess(req);
    
        return SuccessHandler(
        res,
        `Member has been created successfully`,
        member
        );
    }),
    ];

exports.DeleteMember = asyncHandler(async (req, res, next) => {

    const member = await memberProcess.DeleteMemberProcess(req.params.id);

    return member?.length === STATUSCODE.ZERO
        ? next(new ErrorHandler("No Member Found"))
        : SuccessHandler(res, `Member has been fetched Successfully`, member);
    }
);

exports.SingleMember = asyncHandler(async (req, res, next) => {
    const member = await memberProcess.SingleMemberProcess(req.params.id);
    
    return member?.length === STATUSCODE.ZERO
        ? next(new ErrorHandler("No Member Found"))
        : SuccessHandler(res, `Member has been fetched Successfully`, member);
    }
);

exports.ApprovedMember = asyncHandler(async (req, res, next) => {
    const member = await memberProcess.ApproveMemberProcess(req.params.id, req);
     
    return member?.length === STATUSCODE.ZERO
        ? next(new ErrorHandler("No Member Found"))
        : SuccessHandler(res, `Member has been fetched Successfully`, member);
    }
);

exports.DisapprovedMember = asyncHandler(async (req, res, next) => {
    const member = await memberProcess.DisapproveMemberProcess(req.params.id, req);
    
    return member?.length === STATUSCODE.ZERO
        ? next(new ErrorHandler("No Member Found"))
        : SuccessHandler(res, `Member has been fetched Successfully`, member);
    }
);
