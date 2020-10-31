const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');

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
