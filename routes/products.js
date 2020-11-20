const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
const bodyParser = require('body-parser');
const Product = require('../models/Product');

const jsonParser = bodyParser.json();

/* GET ALL PRODUCTS */
router.get('/', function(req, res) {
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // set the current page number
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; // set the limit of items per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = (page * limit) - limit; // 0, 10, 20, 30
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: 'c.id = p.cat_id'
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.description',
      'p.id'
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(products => {
      if (products.length > 0) {
        res.status(200).json({
          count: products.length,
          products: products
        })
      } else {
        res.json({ message: 'No products founds.'});
      }
    }).catch(err => console.log(err));
});

/* ADD A PRODUCT TO MONGODB */
router.post('/mongo/new', jsonParser, async (req, res) => {
  console.log(req.body);
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    images: req.body.images,
    // price: parseInt(req.body.price),
    // quantity: parseInt(req.body.quantity),
    category: req.body.category
  });
  console.log('TEST1');
  try {
    console.log('TEST2');
    const savedProduct = await product.save();
    console.log('TEST3');
    res.status(200).json(savedProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

/* GET ALL PRODUCTS FROM MONGODB */
/* GET ONE PRODUCT FROM MONGODB */

/* GET SINGLE PRODUCT */
router.get('/:prodId', (req, res) => {
  const productId = req.params.prodId;

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: 'c.id = p.cat_id'
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.images',
      'p.description',
      'p.id'
    ])
    .filter({'p.id' : productId})
    .get()
    .then(product => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.json({message: `No product found with product id ${productId}`});
      }
    }).catch(err => console.log(err));
});

/* GET ALL PRODUCTS FROM ONE CATEGORY */
router.get('/category/:catName', (req, res) => {
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // set the current page number
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; // set the limit of items per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = (page * limit) - limit; // 0, 10, 20, 30
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  const categoryName = req.params.catName; // fetch category name from the url

  database.table('products as p')
    .join([{
      table: 'categories as c',
      on: `c.id = p.cat_id WHERE c.title LIKE '%${categoryName}%'`
    }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.description',
      'p.id' 
    ])
    .slice(startValue, endValue)
    .sort({id: .1})
    .getAll()
    .then(products => {
      if (products.length > 0) {
        res.status(200).json({
          count: products.length,
          products: products
        })
      } else {
        res.json({ message: `No products founds from ${categoryName} category.`});
      }
    }).catch(err => console.log(err));
});

module.exports = router;
