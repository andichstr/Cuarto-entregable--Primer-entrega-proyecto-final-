export class Product{
    constructor(title, description, code, price, stock, category, status=true, thumbnails=[]) {
        if (!!title && !!description && !!code && !!price && !!stock && !!category) {
            this.id = null;
            this.status = status;
            this.title = title;
            this.description = description;
            this.code = code;
            this.price = price;
            this.stock = stock;
            this.category = this.category;
            this.thumbnails = thumbnails;
        } else throw new Error("All properties except thumbnails must be set");
    }

    // GETTERS
    getId() {
        return this.id;
    }
    getStatus() {
        return this.status;
    }
    getTitle() {
        return this.title;
    }
    getDescription() {
        return this.description;
    }
    getCode() {
        return this.code;
    }
    getPrice() {
        return this.price;
    }
    getStock() {
        return this.stock;
    }
    getCategory() {
        return this.category;
    }
    getThumbnails() {
        return this.thumbnails;
    }

    // SETTERS 
    setId(id) {
        this.id = id;
    }
    setStatus(status) {
        this.status = status;
    }
    setTitle(title) {
        this.title = title;
    }
    setDescription(description) {
        this.description = description;
    }
    setCode(code) {
        this.code = code;
    }
    setPrice(price) {
        this.price = price;
    }
    setStock(stock) {
        this.stock = stock;
    }
    setCategory(category) {
        this.category = category;
    }
    setThumbnail(thumbnails) {
        this.thumbnail = thumbnails;
    }
}