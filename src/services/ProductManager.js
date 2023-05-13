import fs from 'fs/promises';
import { Product } from '../models/Product.js';

export class ProductManager {
    constructor () {}

    async customConstructor(path){
        this.path = path;
        this.products = await this.getProducts();
    }

    async getLastId() {
        const products = await this.getProducts();
        if(products.length!=0) return products[products.length-1].id;
        else return -1;
    }

    async addProduct(product) {
        if (this.isValidProduct(product)) {
            const products = await this.getProducts();
            const newProduct = new Product(product.title, product.description, product.price, product.thumbnail, product.code, product.stock);
            const id = await this.getLastId() + 1;
            newProduct.setId(id);
            products.push(newProduct);
            this.products = products;
            await fs.writeFile(this.path, JSON.stringify(this.products), "utf-8");
            return newProduct;
        } else {
            console.log(`Todos los campos deben ser seteados`);
            return null;
        }
    }

    async getProducts() {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            if (response) {
                return JSON.parse(response);
            } else {
                return [];
            }
        } catch (error) {
            console.error(`Error al leer el archivo de productos: ${error.message}`);
            return [];
        }
    }

    async getProductById(id) {
        let foundProduct;
        const products = await this.getProducts();
        for (let i = 0; i<products.length; i++) {
            if (products[i].id == id){
                foundProduct = products[i];
                i = products.length;
            }
        }
        if(!!foundProduct) return foundProduct;
        else {
            console.error(`Product with id: ${id} not found.`);
            return null;
        }
    }

    async updateProduct(id, product) {
        if (this.hasValidProp(product)) {
            const products = await this.getProducts();
            let found = false;
            let i = 0;
            while (i < products.length || !found) {
                if (products[i].id == id) {
                    found = true;
                    const title = product.title ? product.title : products[i].title;
                    const description = product.description? product.description : products[i].description;
                    const price = product.price? product.price : products[i].price;
                    const thumbnail = product.thumbnail? product.thumbnail : products[i].thumbnail;
                    const code = product.code? product.code : products[i].code;
                    const stock = product.stock? product.stock : products[i].stock;
                    const newProduct = new Product(title, description, price, thumbnail, code, stock);
                    newProduct.setId(id);
                    products[i] = newProduct;
                }
                i++;
            }
            if (found) {
                this.products = products;
                await fs.writeFile(this.path, JSON.stringify(this.products));
            } else {
                console.log(`Product with id: ${id} not found.`);
                throw new Error(`Product with id: ${id} not found.`);
            }
        } else {
            console.log(`El producto ${JSON.stringify(product)} no contiene ninguna propiedad valida para actualizar`);
            throw new Error(`El producto ${JSON.stringify(product)} no contiene ninguna propiedad valida para actualizar`);
        };
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        let found = false;
        let i = 0;
        let product;
        while (i < products.length || !found) {
            if (products[i].id == id) {
                product = products[i];
                products.splice(i, 1);
                found = true;
            }
            i++;
        }
        if (found) {
            this.products = products;
            await fs.writeFile(this.path, JSON.stringify(this.products));
            return product;
        } else {
            console.log(`Product with id: ${id} not found.`);
            return null;
        }
    }
    isValidProduct(product) {
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnails) {
            return false;
        }
        return true;
    }
    hasValidProp(product) {
        if (!!product.title || !!product.description || !!product.code || !!product.price || !!product.stock || !!product.category || !!product.thumbnails) {
            return true;
        }
        return false;
    }
}