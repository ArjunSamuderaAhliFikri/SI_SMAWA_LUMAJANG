const express = require("express");
const router = express.Router();

const retrieveAllAdminData = require("../controller/retrieveAllAdminData.js");
const retrieveDataAdminById = require("../controller/retrieveDataAdminById.js");

const editDataAdminById = require("../controller/editDataAdminById.js");

const addNewAdmin = require("../controller/addNewAdmin.js");

const deleteDataAdminById = require("../controller/deleteDataAdminById.js");

router.get("/", retrieveAllAdminData);
router.get("/:id", retrieveDataAdminById);

router.put("/:id", editDataAdminById);
// router.put("/change-role-admin/:id", changeRoleAdminById);

router.post("/", addNewAdmin);

router.delete("/:id", deleteDataAdminById);

module.exports = router;
