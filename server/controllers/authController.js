const Student=require("../models/Student");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
exports.registerStudent=async(req,res)=>{

try{

const{
fullName,
email,
password,
phone,
aadhaar
}=req.body;

const studentExists=await Student.findOne({email});

if(studentExists){

return res.status(400).json({

message:"Student already exists"

});

}

const hashedPassword=await bcrypt.hash(password,10);

const student=await Student.create({

fullName,
email,
password:hashedPassword,
phone,
aadhaar

});

res.status(201).json({

success:true,
message:"Registration Successful",
student

});

}

catch(err){

res.status(500).json({

success:false,
message:err.message

});

}

}

exports.loginStudent = async (req, res) => {
    console.log("Request Body:", req.body);
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password"
            });
        }

        const student = await Student.findOne({ email });

        console.log(student);

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            token,
            student
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};