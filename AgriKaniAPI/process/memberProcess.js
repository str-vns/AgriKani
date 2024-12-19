const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const Member = require("../models/members");
const User = require("../models/user");
const Coop = require("../models/farm");

exports.CreateMemberProcess = async (req) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId))
        throw new ErrorHandler(`Invalid User ID: ${req.body.userId}`);

    const user = await User
        .findById(req.body.userId)
        .lean()
        .exec();
    if (!user) throw new ErrorHandler(`User not exist with ID: ${req.body.userId}`);

    if (!mongoose.Types.ObjectId.isValid(req.body.userId))
        throw new ErrorHandler(`Invalid User ID: ${req.body.userId}`);

    const farm = await Coop.findById(req.body.coopId).lean().exec();
    if (!farm) throw new ErrorHandler(`Farm not exist with ID: ${req.body.coopId}`);

    let barangayClearance = {};

    if (req.file.barangayClearance) {
        barangayClearance = await uploadImageSingle(req.file.barangayClearance);
    }
    if (!barangayClearance) throw new ErrorHandler("At least barangay clearance is required");

    let validId = {};

    if (req.file.validId) {
        validId = await uploadImageSingle(req.file.validId);
    }
    if (!validId) throw new ErrorHandler("At least one validId  is required");

    const member = await Member.create({
        ...req.body,
        barangayClearance: barangayClearance,
        validId: validId,
    });

    return member;
}

exports.GetMemberProcess = async (req) => {
    const member = await Member
        .findById(req.params.id)
        .populate("userId")
        .populate("coopId")
        .lean()
        .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${req.params.id}`);

    return member;
}

exports.SingleMemberProcess = async (id) => {
    const member = await Member
        .findOne({ userId: id })
        .populate("userId")
        .populate("coopId")
        .lean()
        .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${req.user._id}`);

    return member;
}
   
exports.UpdateMemberProcess = async (id, req) => {

    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Member ID: ${id}`);

    const member = await Member
        .findById(id)
        .lean()
        .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(req.body.userId))
        throw new ErrorHandler(`Invalid User ID: ${req.body.userId}`);

    const user = await User
        .findById(req.body.userId)
        .lean()
        .exec();
    if (!user) throw new ErrorHandler(`User not exist with ID: ${req.body.userId}`);

    if (!mongoose.Types.ObjectId.isValid(req.body.coopId))
        throw new ErrorHandler(`Invalid Coop ID: ${req.body.coopId}`);

    const farm = await Coop.findById(req.body.coopId).lean().exec();
    if (!farm) throw new ErrorHandler(`Farm not exist with ID: ${req.body.coopId}`);

    let barangayClearance = {};

    if (req.file.barangayClearance) {
        barangayClearance = await uploadImageSingle(req.file.barangayClearance);
    }
    if (!barangayClearance) throw new ErrorHandler("At least barangay clearance is required");

    let validId = {};

    if (req.file.validId) {
        validId = await uploadImageSingle(req.file.validId);
    }
    if (!validId) throw new ErrorHandler("At least one validId  is required");

    const updatedMember = await Member
        .findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                barangayClearance: barangayClearance,
                validId: validId,
            },
            {
                new: true,
                runValidators: true,
            }
        )
        .lean()
        .exec();

    return updatedMember;
}

exports.DeleteMemberProcess = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Member ID: ${id}`);

    const member = await Member
        .findById(id)
        .lean()
        .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${id}`);

    const deletedMember = await Member
        .findByIdAndUpdate(
            req.params.id,
            {
                deletedAt: new Date(),
            },
            {
                new: true,
                runValidators: true,
            }
        )
        .lean()
        .exec();

    return deletedMember;
}

exports.ApproveMemberProcess = async (id) => {
   
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Member ID: ${id}`);

        const member = await Member.findById(id).populate("userId").lean().exec();
        if (!member) throw new ErrorHandler(`Member not exist with ID: ${id}`);

        const updatedMember = await Member.findByIdAndUpdate(
            id,
            {
                approvedAt: new Date(),
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .lean()
            .exec();
        
        if(!updatedMember) throw new ErrorHandler(`Member not exist with ID: ${id}`);

       const user = await User.findByIdAndUpdate(member.userId._id).lean().exec();
        if (!user) throw new ErrorHandler(`User not exist with ID: ${member.userId._id}`);

        if (!user.role === ROLE.MEMBER) {
           user.role.push(ROLE.MEMBER);
           await user.save();
        }

        return updatedMember;

    } catch (error) {  
        console.error("An error occurred:", error.message);
        throw new ErrorHandler(error.message || "An unexpected error occurred");
        }
}

exports.DisapproveMemberProcess = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new ErrorHandler(`Invalid Member ID: ${id}`);

        const member = await
            Member.findById(id)
                .populate("userId")
                .lean()
                .exec();

    const updatedMember = await Member.findByIdAndDelete(id).lean().exec();
    if (!updatedMember) throw new ErrorHandler(`Member not exist with ID: ${id}`);
    
    return updatedMember;

} catch (error) {
    console.error("An error occurred:", error.message);
    throw new ErrorHandler(error.message || "An unexpected error occurred");
}
}
