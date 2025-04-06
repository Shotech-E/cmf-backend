const { Schema, model } = require("mongoose");
// const bcrypt = require("bcryptjs");

const memberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: String,
      default: "Unknown",
    },
    residentialAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
      },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    maritalStatus: {
      type: String,
      required: true,
    },
    marriageDate: {
      type: String,
      default: "Not Married",
    },
    occupation: {
      type: String,
      required: true,
    },
    officeAddress: {
      type: String,
      required: true,
    },
    society: {
      type: String,
      required: true,
    },
    activityGroup: {
        type: String,
        required: true,
    }
  }
);
const Member = model("Member", memberSchema);
module.exports = Member;
