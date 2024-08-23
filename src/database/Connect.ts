import mongoose from "mongoose"


const connectToDB=async(uri: string | undefined)=>{
    try{
        if (typeof uri === "string") {
            await mongoose.connect(uri)
        }
        else{
            console.log("Uri is missing")
        }

    }
    catch(e){
        console.error(e)
    }
}

export default connectToDB