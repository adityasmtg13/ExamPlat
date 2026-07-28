const express=require("express");

const router=express.Router();

const{

registerStudent,
verifyOtp,
resendOtp,
forgotPassword,
resetPassword,
loginStudent

}=require("../controllers/authController");

router.post("/register",registerStudent);
router.post("/verify-otp",verifyOtp);
router.post("/resend-otp",resendOtp);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);
router.post("/login",loginStudent);

module.exports=router;