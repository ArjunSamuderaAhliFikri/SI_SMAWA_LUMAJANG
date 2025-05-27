const express = require("express");
const router = express.Router();
const multer = require("multer");

const addNewBilling = require("../controller/addNewBilling.js");
const getAllBilling = require("../controller/getAllBilling.js");
const retrieveDataById = require("../controller/retrieveDataById.js");
const retrieveDataByUsername = require("../controller/retrieveDataByUsername.js");
const deleteBillingStudent = require("../controller/deleteBillingStudent.js");
const updateBillingStudent = require("../controller/updateBillingStudent.js");
const confirmPayment = require("../controller/confirmPayment.js");
const adminConfirmPayment = require("../controller/adminConfirmPayment.js");
const paymentViaAdmin = require("../controller/paymentViaAdmin.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/test");
  },
  filename: function (req, file, cb) {
    file.setUniq = Math.random() * 1200;
    cb(null, `${file.setUniq}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

router.get("/", authMiddleware, getAllBilling);
router.get("/:id", retrieveDataById);

router.get("/by-username/:username", retrieveDataByUsername);

router.put("/:id", updateBillingStudent);

router.put("/admin-confirm-payment/:id", adminConfirmPayment);

router.put(
  "/via-admin-with-photo/:id/:username/:nominal",
  upload.single("avatar"),
  paymentViaAdmin
);

router.put("/confirm-payment/:id", upload.single("avatar"), confirmPayment);

router.post("/", addNewBilling);

router.delete("/:id", deleteBillingStudent);

module.exports = router;
