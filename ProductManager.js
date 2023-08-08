class ProductManager {
    constructor() {
        this.products = [];
        this.nextProductId = 1;
    }

    addProduct(product) {
        if (!this.isProductValid(product)) {
            console.error("Invalid product data");
            return;
        }

        if (this.isCodeDuplicate(product.code)) {
            console.error("Product code already exists");
            return;
        }

        product.id = this.nextProductId++;
        this.products.push(product);
        console.log("Producto añadido:", product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Product not found");
        }
    }

    isProductValid(product) {
        return (
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        );
    }

    isCodeDuplicate(code) {
        return this.products.some(product => product.code === code);
    }
}

// Test
const productManager = new ProductManager();

const initialProducts = productManager.getProducts();
console.log("Initial products:", initialProducts); 

productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
});

productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 300,
    thumbnail: "Sin imagen",
    code: "abc456",
    stock: 5
});

const productsAfterAdding = productManager.getProducts();
console.log("Products after adding:", productsAfterAdding); 

productManager.addProduct({
    title: "producto repetido",
    description: "Este es otro producto repetido",
    price: 150,
    thumbnail: "No hay imagen",
    code: "abc123",
    stock: 10
});

const productsAfterDuplicationAttempt = productManager.getProducts();
console.log("Products after duplication attempt:", productsAfterDuplicationAttempt);

const productById = productManager.getProductById(1);
console.log("Product by ID (valid):", productById);

const productNotFound = productManager.getProductById(999); 
console.log("Product by ID (invalid):", productNotFound);
