import fs from 'fs/promises';
import { Cart } from '../models/Cart.js';

export class CartManager {
    constructor () {}

    async customConstructor(path){
        this.path = path;
        this.carts = await this.getCarts();
    }

    async getLastId() {
        const carts = await this.getCarts();
        if(carts.length!=0) return carts[carts.length-1].id;
        else return -1;
    }

    async getCarts() {
            const carts = await fs.readFile(this.path, 'utf8');
            return JSON.parse(carts);
        }

    async addCart(products){
        const lastId = await this.getLastId();
        const cart = new Cart(products);
        cart.setId(lastId+1);
        this.carts.push(cart);
        await fs.writeFile(this.path, JSON.stringify(this.carts));
        return cart;
    }
    
    async getCartById(id){
        const foundCart = this.getCart(id);
        if(!!foundCart) return foundCart;
        else {
            console.error(`Cart with id: ${id} not found.`);
            return null;
        }
    }

    async addProductToCart(cartId, productId, product){
        const cartIndex = this.getCartIndex(cartId);
        if (!!cartIndex) {
            const productIndex = this.getProductIndex(cartIndex, productId);
            if (!!productIndex) this.carts[cartIndex].products[productIndex].quantity++;
            else this.carts[cartIndex].products.push({"idProduct": productId, "quantity": 1})
            await fs.writeFile(this.path, JSON.stringify(this.carts));

        } else {
            console.error(`Cart with id: ${cartId} not found.`);
            return null;
        }
    }

    getCart(id) {
        let foundCart;
        for (let i = 0; i<this.carts.length; i++) {
            if (this.carts[i].id == id){
                foundCart = this.carts[i];
                i = this.carts.length;
            }
        }
        return foundCart;
    }

    getCartIndex(id) {
        for (let i = 0; i<this.carts.length; i++) {
            if (this.carts[i].id == id){
                return i;
            }
        }
        return null;
    }
    getProductIndex(cartIndex, productId) {
        for (let i = 0; i<this.carts[cartIndex].products.length; i++) {
            if (this.carts[cartIndex].products[i].idProduct == productId){
                return i;
            }
        }
        return null;
    }
}