const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        if (fs.existsSync(this.path)) {
            const fileContent = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(fileContent);
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 4));
    }

    addProduct(product) {
        product.id = this.products.length + 1;
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    updateProduct(productId, updatedFields) {
        const productToUpdate = this.products.find(product => product.id === productId);
        if (productToUpdate) {
            Object.assign(productToUpdate, updatedFields);
            this.saveProducts();
            return true;
        }
        return false;
    }

    deleteProduct(productId) {
        this.products = this.products.filter(product => product.id !== productId);
        this.saveProducts();
    }
}

module.exports = ProductManager;

const TestProductManager = require('./ProductManager');

function runTests() {
    const productManager = new TestProductManager('products.json');

    // Prueba 1: Verificar si getProducts devuelve un arreglo vacío al principio
    console.log('Prueba 1:', productManager.getProducts());

    // Prueba 2: Agregar un nuevo producto y verificar si se agrega correctamente
    const newProduct = {
        title: 'producto prueba',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25
    };
    productManager.addProduct(newProduct);
    console.log('Prueba 2:', productManager.getProducts());

    // Prueba 3: Obtener el producto recién agregado por su ID
    const productId = 1; // El ID puede variar dependiendo de la implementación
    console.log('Prueba 3:', productManager.getProductById(productId));

    // Prueba 4: Actualizar el producto con un nuevo precio
    const updatedFields = { price: 250 };
    productManager.updateProduct(productId, updatedFields);
    console.log('Prueba 4:', productManager.getProducts());

    // Prueba 5: Eliminar el producto y verificar si se ha eliminado correctamente
    productManager.deleteProduct(productId);
    console.log('Prueba 5:', productManager.getProducts());
}

runTests();
