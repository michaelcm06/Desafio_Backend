const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 8080;

const productManager = new ProductManager('products.json');

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getAllProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    const product = products.find(p => p.id === req.params.pid);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto No Existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
