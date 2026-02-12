import Cart from "../models/cart.model.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            cart.items.push({ product: productId, quantity });
            await cart.save();
        }

        res.status(201).json({
            success: true,
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId })
            .populate("items.product");

        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
