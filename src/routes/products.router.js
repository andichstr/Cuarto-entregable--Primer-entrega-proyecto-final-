//@ts-check
import { Router } from "express";
import { ProductManager } from "../services/ProductManager.js";

const router = Router();
const service = new ProductManager();
await service.customConstructor();

router.get("/", async (req, res) => {
    let products = await service.getProducts();
    if (!!products){
        if (!!req.query.limit && req.query.limit >= 0 && products.length > req.query.limit) products = products.slice(0, req.query.limit);
        return res.status(200).json(products);
    }else return res.status(404).json({
            status: "Error",
            message: "Products not found",
            data: null
    });
});

router.get('/:pid', async (req, res) => {
    const id = Number.parseInt(req.params.pid);
    const product = service.getProductById(id);
    if (!!product) return res.status(200).json({
        status: "Success",
        message: "Product found",
        data: product
    })
    else return res.status(404).json({
        status: "Error",
        message: `Product with id=${id} not found`,
        data: null
    });
});

router.post("/", async (req, res) => {
    if (!!req.body){
        const product = req.body;
        const addedProduct = await service.addProduct(product);
        if (!!addedProduct){;
            return res.status(201).json({
                status: "Success",
                message: `Product created successfully with id=${addedProduct.getId()}`,
                data: addedProduct
            });
        }else return res.status(400).json({
            status: "Error",
            message: "Invalid product on body request.",
            data: null
    });
    } else return res.status(400).json({
        status: "Error",
        message: "No product found to add on body request.",
        data: null
    });
});

router.put("/:pid", async (req, res) => {
    if (!!req.body){
        const id = Number.parseInt(req.params.pid);
        const product = req.body;
        const updatedProduct = await service.updateProduct(id, product);
        if (!!updatedProduct){;
            return res.status(200).json({
                status: "Success",
                message: "Products found",
                data: updatedProduct
            });
        }else return res.status(400).json({
            status: "Error",
            message: "Invalid product on body request.",
            data: null
    });
    } else return res.status(400).json({
        status: "Error",
        message: "No product found to add on body request.",
        data: null
    });
});

router.delete('/:pid', async (req, res) => {
    const id = Number.parseInt(req.params.pid);
    const product = await service.deleteProduct(id);
    if (!!product) return res.status(200).json({
        status: "Success",
        message: `Product with id=${product.id} was successfully deleted`,
        data: product
    })
    else return res.status(404).json({
        status: "Error",
        message: `Product with id=${id} not found`,
        data: null
    });
});

export default router;