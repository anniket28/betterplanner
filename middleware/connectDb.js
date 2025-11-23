import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
    mongoose.set('strictQuery', false)

    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }

    mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI)
        .then(() => {
            console.log('Connected to database')
            return handler(req, res);
        })
        .catch((err) => {
            console.log("Error conntecting to db: " + err)
            return res.send(err)
        })
};

export default connectDB;