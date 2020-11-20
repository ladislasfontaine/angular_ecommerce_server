const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  images: {
    type: String,
    require: false
  },
  price: {
    type: Number,
    require: false
  },
  quantity: {
    type: Number,
    require: false
  },
  category: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('Products', ProductSchema);
