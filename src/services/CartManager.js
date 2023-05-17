//@ts-check
import fs from 'fs/promises';
import { Cart } from '../models/Cart.js';
import { ProductManager } from './ProductManager.js';
import path from 'path';

export class CartManager {
    constructor() { }

    async customConstructor() {
        this.path = path.resolve() + "\\src\\db\\carts.json";
        this.carts = await this.getCarts();
    }

    async getLastId() {
        const carts = await this.getCarts();
        if (carts.length != 0) return carts[carts.length - 1].id;
        else return -1;
    }

    async getCarts() {
        const carts = await fs.readFile(this.path, 'utf8');
        return JSON.parse(carts);
    }

    async addCart(products) {
        const lastId = await this.getLastId();
        if (!await this.productsExists(products)) return null;
        const cart = new Cart(products);
        cart.setId(lastId + 1);
        this.carts.push(cart);
        await fs.writeFile(this.path, JSON.stringify(this.carts));
        return cart;
    }

    async getCartById(id) {
        const foundCart = this.getCart(id);
        if (!!foundCart) return foundCart;
        else {
            console.error(`Cart with id: ${id} not found.`);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        const cartIndex = this.getCartIndex(cartId);
        const productManager = new ProductManager();
        await productManager.customConstructor();
        if (cartIndex < 0) {
            console.error(`Cart with id: ${cartId} not found.`);
            return null;
        }
        if (!productManager.getProductById(productId)) {
            console.error(`Product with id: ${productId} not found.`);
            return null;
        }
        const productIndex = this.getProductIndex(cartIndex, productId);
        console.log(`${productIndex}`);
        if (!!productIndex && productIndex>=0) this.carts[cartIndex].products[productIndex].quantity++;
        else this.carts[cartIndex].products.push({ "id": productId, "quantity": 1 })
        await fs.writeFile(this.path, JSON.stringify(this.carts));
    }

    getCart(id) {
        let foundCart;
        for (let i = 0; i < this.carts.length; i++) {
            if (this.carts[i].id == id) {
                foundCart = this.carts[i];
                i = this.carts.length;
            }
        }
        return foundCart;
    }

    getCartIndex(id) {
        for (let i = 0; i < this.carts.length; i++) {
            if (this.carts[i].id == id) {
                return i;
            }
        }
        return null;
    }
    getProductIndex(cartIndex, productId) {
        for (let i = 0; i < this.carts[cartIndex].products.length; i++) {
            if (this.carts[cartIndex].products[i].id == productId) {
                return i;
            }
        }
        return null;
    }
    async productsExists(products){
        if (products.length==0) return false;
        const productManager = new ProductManager();
        await productManager.customConstructor();
        let productExist = true;
        let i=0;
        while (productExist && i < products.length) {
            if (!productManager.getProductById(products[i].id)) productExist = false;
            i++
        }
        return productExist;
    }
}