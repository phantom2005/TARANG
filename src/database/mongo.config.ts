import mongoose from "mongoose";

export function connect(){
    mongoose
    .connect(process.env.MONGO_URL!,{
    tls:true,
})
.then(()=>console.log("Database Connected Sussesfully"))
.catch((err)=>console.log("hey there is an error"))

}