# Back-end

## Docker commands to setup PhpMyAdmin and MySQL

Install Docker Desktop for macOS users.
Get images from Docker Hub:
* `docker pull phpmyadmin/phpmyadmin:latest`
* `docker pull mysql:latest`

Launch containers:
* `docker-compose up -d`
To stop containers use:
* `docker-compose stop`

## Access PhpMyAdmin

* Navigate to `localhost:8080`
* user: `user`
* password: `secret`

You should see `angular-ecommerce` database. If empty, you will have to populate it :
* click on `angular-ecommerce` on the left panel
* go into PhpMyAdmin `Import` section
* import the file `./db/init.sql`
* click on `Execute`
* check that `angular-ecommerce` has been populated
