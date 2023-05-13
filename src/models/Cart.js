export class Cart{
    constructor(products=[]) {
        this.id = null;
        this.products = products;
    }

    // GETTERS
    getId() {
        return this.id;
    }
    getProducts() {
        return this.products;
    }
    // SETTERS 
    setId(id) {
        this.id = id;
    }
    setProducts(products) {
        this.products = products;
    }
}