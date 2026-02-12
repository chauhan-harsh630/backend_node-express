import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },

    item: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, { timestamp: true });

const Cart = mongoose.model("cart", cartSchema);
export default Cart