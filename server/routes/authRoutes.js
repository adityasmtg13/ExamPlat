const express=require("express");

const router=express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const{

registerStudent,
verifyOtp,
resendOtp,
forgotPassword,
resetPassword,
loginStudent,
logoutStudent,
qrLogin

}=require("../controllers/authController");

router.post("/register",registerStudent);
router.post("/verify-otp",verifyOtp);
router.post("/resend-otp",resendOtp);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);
router.post("/login",loginStudent);
router.post("/qr-login",qrLogin);
router.post("/logout", authMiddleware, logoutStudent);

module.exports=router;
