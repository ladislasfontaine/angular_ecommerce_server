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
* user: `root`
* password: `AngularEcommerceDev2020!`

You should see `angular_ecommerce` database. If empty, you will have to populate it, going into PhpMyAdmin `Import` section and using the file in `./db/init.sql`.
