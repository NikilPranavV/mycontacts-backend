const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc register the user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (req,res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        res.status(400);
        throw new Error("User already available");
    }

    //hash password
    const hashedpassword = await bcrypt.hash(password,10);
    console.log("The password is:", hashedpassword);

    const user = await User.create({
        username,
        email,
        password: hashedpassword
    });

    console.log(`user is created ${user}`)

    if(user){
        res.status(201).json({_id: user.id, email: user.email});
    }
    else{
        res.status(400);
        throw new Error ("User is not valid");
    }
});


//@desc login the user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body;
    if (!email || !password){
        res.status(400);
        throw new Error ("All fields are mandatory");
    }

    const user = await User.findOne({email});

    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password, user.password))){
        const accesstoken = jwt.sign({
            user: {
                username : user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "15m"}
    );
        res.status(200).json({ accesstoken })
    }
    else{
        res.status(401); //if the usename not available and password not matched
        throw new Error("email or password is not valid")
    }
});

//@desc current user
//@route POST /api/users/current
//@access private 

const currentUser = asyncHandler(async (req,res) => {
    res.json(req.user)
});


module.exports = {registerUser, loginUser, currentUser};