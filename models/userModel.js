const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please enter the username"]
    },
    email: {
        type: String,
        required: [true, "Please enter the email"],
        unique: [true, "Email already taken"]
    },
    password: {
        type: String,
        required: [true, "Please enter the password"]
    },
},{
timestamps : true,
}
);

module.exports = mongoose.model("User", userSchema);