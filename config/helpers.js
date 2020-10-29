const MySqli = require('mysqli');

let conn = new MySqli({
  host: 'localhost',
  port: 3308,
  user: 'user',
  passwd: 'secret',
  db: 'angular-ecommerce'
});

let db = conn.emit(false, '');

module.exports = {
  database: db
};
