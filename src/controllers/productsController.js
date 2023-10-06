import Product from '../models/Product.js';
import {modeloUsuarios} from '../models/usuarios.models.js';

const getProducts = async (req, res) => {
  try {
    let {
      limit = 5, page = 1, sort, query
    } = req.query;

    let pagina = req.query.pagina;
    if (!pagina) pagina = 1;

    const filter = {};
    if (query) {

      if (query === 'disponibles') {
        filter.availability = true;
      }
      if (query === 'Carne') {
        filter.category = "Carne";
      }
      if (query === 'Pollo') {
        filter.category = "Pollo";
      }
      if (query === 'Saludable') {
        filter.category = "Saludable";
      }
      if (query === 'Dieta') {
        filter.category = "Dieta";
      }
    }

    let sortOptions = {};
    if (sort) {
      // Si se proporciona 'sort', verifica si es 'asc' o 'desc' y ordena por precio en consecuencia.
      if (sort === 'asc') {
        sortOptions = {
          price: 1
        };
      } else if (sort === 'desc') {
        sortOptions = {
          price: -1
        };
      }
    }


    let productos = await Product.paginate(filter, {
      limit,
      lean: true,
      page: pagina,
      sort: sortOptions
    });

    let {
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage
    } = productos;

    // Verificar si la página solicitada es válida
    if (isNaN(pagina) || pagina <= 0 || pagina >totalPages) {
      return res.render('error', { message: 'Página no válida' });
    }

    res.render('products', {
      status: 'success',
      payload: productos.docs,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page: productos.page,
      prevLink: hasPrevPage ? `/products?pagina=${prevPage}` : null,
      nextLink: hasNextPage ? `/products?pagina=${nextPage}` : null
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message
    });
  }
  

};
const showProducts = async (req, res) => {
  try {
    const usuarios = await modeloUsuarios.find({});
    const Use = req.session.usuarios;
    res.render('productos', { usuarios });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    

    if (!product) {
      return res.json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      status: 'success',
      payload: product
    });
  } catch (error) {
    return res.json({
      status: 'error',
      message: error.message
    });
  }
};


const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      availability
    } = req.body;

    const product = new Product({
      name,
      category,
      price,
      availability,
    });

    await product.save();

    res.json({
      status: 'success',
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message
    });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  showProducts
};