const MySqli = require('mysqli');

let conn = new MySqli({
  host: 'localhost',
  port: 3308,
  user: 'root',
  passwd: 'AngularEcommerceDev2020!',
  db: 'angular_ecommerce'
});

let db = conn.emit(false, '');

module.exports = {
  database: db
};
