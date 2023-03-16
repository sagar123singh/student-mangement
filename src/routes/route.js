const { register, login, uploading } = require("../controllers/studentController");
const express=require("express")
const router= express.Router()

router.post("/student/register", register)
router.post("/student/login",login)
router.put("/student/:firstName",uploading)
module.exports=router;