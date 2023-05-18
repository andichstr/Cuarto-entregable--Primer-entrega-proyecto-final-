//@ts-check
import { Router } from "express";
import { CartManager } from "../services/CartManager.js";

const router = Router();
const service = new CartManager();
await service.customConstructor();

router.post("/", async (req, res) => {
    if (!!req.body) {
        const products = req.body;
        const addedCart = await service.addCart(products);
        if (!!addedCart.data) {
            return res.status(201).json({
                status: "Success",
                message: "Cart created successfully",
                data: addedCart
            });
        } else if (addedCart == -1) return res.status(400).json({
            status: "Error",
            message: "Invalid products on body request.",
            data: null
        });
        else if (addedCart == -2) return res.status(400).json({
            status: "Error",
            message: "Products on body request has no stock.",
            data: null
        });
    } else return res.status(400).json({
        status: "Error",
        message: "No products found on body request.",
        data: null
    });
});

router.get('/:cid', async (req, res) => {
    const id = req.params.cid;
    const cart = await service.getCartById(id);
    if (!!cart) return res.status(200).json({
        status: "Success",
        message: "Cart found",
        data: cart.products
    })
    else return res.status(404).json({
        status: "Error",
        message: `Cart with id=${id} not found`,
        data: null
    });
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = Number.parseInt(req.params.cid);
    const productId = Number.parseInt(req.params.pid);
    const addedProduct = await service.addProductToCart(cartId, productId);
    if (!!addedProduct.data) {
        return res.status(201).json({
            status: "Success",
            message: "Product added successfully",
            data: addedProduct.data
        });
    } else if (addedProduct == -1){ 
        return res.status(404).json({
            status: "Error",
            message: `Cart with id: ${cartId} not found.`,
            data: null
        });
    } else if (addedProduct == -2) {
        return res.status(404).json({
            status: "Error",
            message: `Product with id: ${productId} not found.`,
            data: null
        });
    } else if (addedProduct == -3){
        return res.status(400).json({
            status: "Error",
            message: `Product with id: ${productId} has no stock.`,
            data: null
        });
    } else return res.status(400).json({
        status: "Error",
        message: `Invalid request.`,
        data: null
    });
});

export default router;