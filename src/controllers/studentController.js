const studentModel=require("../models/studentModel")
const validator=require("../validator/validation")
const aws= require("../AWS/aws")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.register=async(req,res)=>{
    const data = req.body;
    const file = req.files;
    try {
        const requiredFields = ['firstName', 'lastName','schoolName','email', 'mobile', 'password'];

        for (let i = 0; i < requiredFields.length; i++) {
            if (data[requiredFields[i]] === undefined) {
                return res.status(400).json({ status: false, message: `${requiredFields[i]} field is required` });
            }
            else if (data[requiredFields[i]].trim() === "null" || data[requiredFields[i]].trim() == '') {
                return res.status(400).send({ status: false, message: ` Please enter valid data` });
            }
        }
        //*******EMAIL*********** */
        if (validator.isValidEmail(data.email)) {
            return res.status(400).send({ status: false, message: 'Enter a valid Email Id' });
        }

        let isDuplicateEmail = await studentModel.findOne({ email: data.email })
        if (isDuplicateEmail) {
            return res.status(400).send({ status: false, msg: "email already exists" })
        }
        //*******PHONE*********** */

        if (validator.isValidNumber(data.mobile)) {
            return res.status(400).send({ status: false, message: 'The mobile number must be 10 digits and should be only Indian number' });
        }

        let duplicateMobile = await studentModel.findOne({ mobile: data.mobile })
        if (duplicateMobile) {
            return res.status(400).send({ status: false, msg: "mobile number already exists" })
        }

        //*******PASSWORD*********** */
        if(!validator.isValidPassword(data.password)) {
            return res.status(400).send({ status: false, msg: "Invalid password"});
        }

        if (file && file.length > 0) {
            if (file[0].mimetype.indexOf('image') == -1) {
                return res.status(400).send({ status: false, message: 'Only image files are allowed !' })
            }
            const profile_url = await aws.uploadFile(file[0]);
            data.photo = profile_url;
        }
        else {
            return res.status(400).send({ status: false, message: 'Profile Image is required !' })
        }
        data.password = bcrypt.hashSync(data.password, 10);

        //*******create*********** */
        const dataRes = await studentModel.create(data);
        console.log(dataRes)
        delete(dataRes.password)
        return res.status(201).send({ status: true, message: "student details created successfully", data: dataRes });

    } catch (error) {
        console.log("errr",error);
        res.status(500).json({status:false,msg:error.msg,})
    }
} 
//****************************************************************************************************** */



exports.login=async(req,res)=>{
    try {
        const data = req.body;
        const { email, password } = data;

        if (Object.keys(data).length == 0) {return res.status(400).send({status: false,message: 'Email and Password fields are required'});
    }

    if (email===undefined || email.trim() == '') {
        return res.status(400).send({status: false,message: 'Email field is required ' });
    }

    if (password===undefined|| password.trim() == '') {
         return res.status(400).send({status: false,message: 'Password field is required '});
    }


       //*******EMAIL*********** */
       if (validator.isValidEmail(data.email)) {
        return res.status(400).send({ status: false, message: 'Enter a valid Email Id' });
    }
    
        const studRes = await studentModel.findOne({ email: email});
        if (!studRes) {
            return res.status(401).send({ status: false,message: 'Document does not exist with this email'});
        }
        bcrypt.compare(password, studRes.password, (err,result) => {
            if (result === true) {
                const studID = studRes._id
            const payLoad = { studId: studID }
            const secretKey = "group17project"

            // creating JWT

            const token = jwt.sign(payLoad, secretKey, { expiresIn: "1min" })

            res.header("Authorization", "bearer" + " " + token)

            res.status(200).send({ status: true, message: " student login successful", data: { studId: payLoad.studId, token: token } })

            } else{
                return res.status(400).send({ status: false, message: "incorrect password" })
            }
        })


    } catch (error) {
        console.log("errr",error);
        res.status(500).json({status:false,msg:error.msg,})
    }
}


exports.uploading=async(req,res)=>{
    try {
        const firstName=req.params.firstName
        const file = req.files;
        
        let fetchedData=await studentModel.find({firstName:firstName})
        if(!fetchedData){
            return res.status(404).json({status:false,msg:"data doesn't exit"})
        }

        if (file && file.length > 0) {
            const profile_url = await aws.uploadFile(file[0]);
            assignment = profile_url;
        }
        else {
            return res.status(400).send({ status: false, message: 'assignment file is required !' })
        }
        const updateDate=await studentModel.findOneAndUpdate(firstName,assignment,{new:true})


        res.json({status:true,data:updateDate})
    } catch (error) {
        console.log("errr",error);
        res.status(500).json({status:false,msg:error.msg,})
    }
}