const express = require("express");
const Member = require("./memberModel");
const router = express.Router();

// Register Endpoint
router.post("/add_member", async (req, res) => {
  try {
    const { name, dateOfBirth, residentialAddress, phoneNumber, email, maritalStatus, marriageDate, occupation, officeAddress, society, activityGroup } = req.body;
    const member = new Member({ name, dateOfBirth, residentialAddress, phoneNumber, email, maritalStatus, marriageDate, occupation, officeAddress, society, activityGroup });
    await member.save();
    res.status(201).send({ message: "Member created successfully" });
  } catch (error) {
    console.log("Error in creating member", error);
    res.status(500).send({ message: "Error in creating member" });
  }
});

// Delete member Endpoint
router.delete("/members/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).send({ message: "Member not found" });
    }
    res.status(200).send({ message: "Member deleted successfully" });
  } catch (error) {
    console.log("Error in deleting member", error);
    res.status(500).send({ message: "Error in deleting member" });
  }
});

// Get All Members Endpoint
router.get("/members", async (req, res) => {
  try {
    const members = await Member.find({}, "id name dateOfBirth residentialAddress phoneNumber email maritalStatus marriageDate occupation officeAddress society activityGroup").sort({ createdAt: -1 });
    res.status(200).send(members);
  } catch (error) {
    console.log("Error in getting members", error);
    res.status(500).send({ message: "Error in getting members" });
  }
});

// Update member Profile Endpoint
router.patch("/edit-profile", async (req, res) => {
  try {
    const { memberId, name, dateOfBirth, residentialAddress, phoneNumber, email, maritalStatus, marriageDate, occupation, officeAddress, society, activityGroup } = req.body;
    if (!memberId) {
      return res.status(404).send({ message: "Member Id not found" });
    }
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found" });
    }
    // Update member profile
    if (name !== undefined) {
      member.name = name;
    }
    if (dateOfBirth !== undefined) {
      member.dateOfBirth = dateOfBirth;
    }
    if (residentialAddress !== undefined) {
      member.residentialAddress = residentialAddress;
    }
    if (phoneNumber !== undefined) {
      member.phoneNumber = phoneNumber;
    }
    if (email !== undefined) {
      member.email = email;
    }
    if (maritalStatus !== undefined) {
      member.maritalStatus = maritalStatus;
    }
    if (marriageDate !== undefined) {
      member.marriageDate = marriageDate;
    }
    if (occupation !== undefined) {
      member.occupation = occupation;
    }
    if (officeAddress !== undefined) {
      member.officeAddress = officeAddress;
    }
    if (society !== undefined) {
      member.society = society;
    }
    if (activityGroup !== undefined) {
      member.activityGroup = activityGroup;
    }

    await member.save();
    res.status(200).send({
      message: "Member updated successfully",
      member: {
        _id: member._id,
        name: member.name,
        dateOfBirth: member.dateOfBirth,
        residentialAddress: member.residentialAddress,
        phoneNumber: member.phoneNumber,
        email: member.email,
        maritalStatus: member.maritalStatus,
        marriageDate: member.marriageDate,
        occupation: member.occupation,
        officeAddress: member.officeAddress,
        society: member.society,
        activityGroup: member.activityGroup
      },
    });
  } catch (error) {
    console.error("Error in updating member", error);
    res.status(500).send({ message: "Error in updating member" });
  }
});

module.exports = router;