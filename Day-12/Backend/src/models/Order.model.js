import Order from '../models/Order.model.js';
import Cart from "../models/cart.model.js";

export const createOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        // 1️⃣ Find user's cart
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        let totalPrice = 0;

        // 2️⃣ Validate stock + calculate total + deduct stock
        for (const item of cart.items) {

            const product = item.product;

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.title}`
                });
            }

            totalPrice += product.price * item.quantity;

            // Deduct stock
            product.stock -= item.quantity;
            await product.save();
        }

        // 3️⃣ Create order
        const order = await Order.create({
            user: userId,
            items: cart.items,
            totalPrice
        });

        // 4️⃣ Clear cart
        await Cart.deleteOne({ user: userId });

        res.status(201).json({
            success: true,
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
