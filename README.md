# Back-end

## Docker commands to setup PhpMyAdmin and MySQL

Install Docker. I use Docker Desktop.
Make sure Docker is installed. From your terminal, run the following commands. You should see the version in response for both.
* `docker -v`
* `docker-compose -v`
Get images from Docker Hub. In your terminal run:
* `docker pull phpmyadmin/phpmyadmin:latest`
* `docker pull mysql:latest`

Launch containers. From the repository where is located the `docker-compose.yml` file, run the following command.
* `docker-compose up -d`
To stop the containers once you are finished, again from the repo where `docker-compose.yml` is located, run one of the following commands:
* `docker-compose stop` to stop the containers
* `docker-compose down` to stop and remove the containers and networks created

## Access PhpMyAdmin

Once both containers running correctly, PhpMyAdmin should be accessible.
* Navigate to `localhost:8080`
* user: `user`
* password: `secret`

You should see `angular-ecommerce` database. If empty, you will have to populate it:
* click on `angular-ecommerce` on the left panel
* go into PhpMyAdmin `Import` section
* import the file `./db/init.sql` located in this repo
* click on `Execute` in PhpMyAdmin to execute the import
* check that `angular-ecommerce` has been populated

## Start the back-end part

From the main repository, run:
* `npm install`
* `npm start`
