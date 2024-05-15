const express = require("express");
const {User,Account} = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const {authMiddleware} = require("../middleware");

const router = express.Router();
const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup",async (req,res)=>{
    const {success} = signupBody.safeParse(req.body);
    if(!success){
        res.status(411).json({message: "Incorrect inputs"});
    }

    if(await User.findOne({username: req.body.username})){
        res.status(411).json({message: "Email already taken"});
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    
    await Account.create({
        userId: user._id,
        balance: 1 + Math.random()*10000,
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})

router.post("/signin",async (req,res)=>{
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        res.status(411).json({message: "Incorrect inputs"})
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(!user){
        res.status(411).json({message: "Error while logging in"});
    }

    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);

    res.json({
        token: token
    })
})

const updateUser = zod.object({
    firstName: zod.string().optional(),
	lastName: zod.string().optional(),
	password: zod.string().optional()
})

router.put("/",authMiddleware,async(req,res)=>{
    const {success} = updateUser.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        });
    }
    await User.updateOne(req.body,{_id:req.userId});
    res.json({
        message: "Updated successfully"
    });
})

router.get("/bulk/", async (req,res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    });
    res.json({users});
})

module.exports=router;