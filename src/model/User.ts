import mongoose, { Schema } from "mongoose";

const userschema * new Schema({
    name:{
        required:[true,"Name field is required"],
        type:Schema.Types.String,
    },
     email:{
        required:[true,"Email field is required"],
        type:Schema.Types.String,
    },
     pasword:{
        required:[true,"password field is required"],
        type:Schema.Types.String,
    },
})

export const User= mongoose.models.User || mongoose.model("User",userSchema);