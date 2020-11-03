const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { database } = require('../config/helpers');

const jsonParser = bodyParser.json()

/* GET ALL ORDERS */
router.get('/', (req, res) => {
  database.table('orders_details as od')
    .join([
      {
        table: 'orders as o',
        on: 'o.id = od.order_id'
      },
      {
        table: 'products as p',
        on: 'p.id = od.product_id'
      },
      {
        table: 'users as u',
        on: 'u.id = o.user_id'
      }
    ])
    .withFields([
      'o.id', 
      'p.title as name', 
      'p.description', 
      'p.price', 
      'u.username'
    ])
    .sort({id: 1})
    .getAll()
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({message: 'No orders found.'});
      }
    }).catch(err => console.log(err));
});

/* GET SINGLE ORDER */
router.get('/:id', async (req, res) => {
  const orderId = req.params.id;

  database.table(`orders_details as od`)
    .join([
      {
        table: 'orders as o',
        on: 'o.id = od.order_id'
      },
      {
        table: 'products as p',
        on: 'p.id = od.product_id'
      },
      {
        table: 'users as u',
        on: 'u.id = o.user_id'
      }
    ])
    .withFields([
      'o.id',
      'p.title as name',
      'p.description',
      'p.price',
      'u.username'
    ])
    .filter({'o.id': orderId})
    .getAll()
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({message: `No order found with id ${orderId}`})
      }
    }).catch(err => console.log(err));
});

/* PLACE A NEW ORDER */
router.post('/new', jsonParser, async (req, res) => {
  let { userId, products } = req.body;

  if (userId !== null && userId > 0 && !isNaN(userId)) {
    database.table('orders')
      .insert({
        user_id: userId
      })
      .then(newOrderId => {
        if (newOrderId > 0) {
          products.forEach(async (p) => {
            let data = await database.table('products')
              .filter({id: p.id})
              .withFields(['quantity'])
              .get();
            let inCart = parseInt(p.incart);

            // deduct the number of products ordered from the quantity column
            if (data.quantity > 0) {
              data.quantity -= inCart;
              if (data.quantity < 0) {
                data.quantity = 0;
              }
            } else {
              data.quantity = 0;
            }
            // insert order details with the newly generated order id
            database.table('orders_details')
              .insert({
                order_id: newOrderId,
                product_id: p.id,
                quantity: inCart
              }).then(newId => {
                database.table('products')
                  .filter({id: p.id})
                  .update({
                    quantity: data.quantity
                  }).then(successNum => {
                    console.log(`Number returned by product quantity update: ${successNum}`);
                  }).catch(err => console.log(err));
              }).catch(err => console.log(err));
          });
        } else {
          res.json({message: 'new order failed while adding order details', success: false});
        }
        res.json({
          message: `Order successfully placed with orderId ${newOrderId}`,
          success: true,
          order_id: newOrderId,
          products: products
        })
      }).catch(err => console.log(err));
  } else {
    res.json({message: 'New order failed', success: false});
  }
});

/* FAKE PAYMENT GATEWAY CALL */
router.post('/payment', (req, res) => {
  setTimeout(() => {
    res.status(200).json({success: true});
  }, 3000); 
});

module.exports = router;
