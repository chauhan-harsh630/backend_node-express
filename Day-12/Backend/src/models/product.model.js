import mongoose from "mongoose";

const portductSchema = mongoose.Schema({
    title: { type: String, require: true },
    price: { type: Number, require: true },
    stock: { type: Number, require: true },
    discription:String,
},{timeStamp:true});


const Product = mongoose.model("product", portductSchema);

export default Product