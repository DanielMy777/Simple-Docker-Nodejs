# Simple Docker Application

This app is meant to be a REST api server giving you the 'feel' of creating and deploying docker images.
Written entirely in Typescript, under the node.js runtime environment.
Express.js was used as the web framework, MongoDB as the database. 

## ⚡️ Quick Start

> To start the app using docker-compose

1. Clone the repository (Or download the files).
2. In the terminnal, reach the root directory of this project. 
3. run `docker-compose up`.

> To start the app with node

1. Clone the repository (Or download the files).
2. In the terminnal, run `npm start:dev <path-to-file>`.
3. To run the tests, run `npm test`.

## 👨‍💻 Technical Features
* Swagger documentation. (exposed on the root /api/doc endpoint)
* Two types of data storage. (local & remote)
* Authentication & Security
* Atomicity.
* Containerization. (Currently pulling the image from docker hub but you can use the dockerfile as well)
* Tests

## 😁 Behavioural Features
* Logging in as a user.
* Creating a new Image.
* Deploy an existing image.

## ⚙️ Configurations To Docker-Compose
* In case port 3000 is already in use on your machine: 
    1. Change the app ports to `<new_port>:3000`.
* In case port 3001 is already in use on your machine: 
    1. Change the auth ports to `<new_port>:3001`.
* In case port 27017 is already in use on your machine:
    1. Change the mongo ports to `<new_port>:27017`.
    2. Change env var `DATABASE_CON_LOCAL` to accordingly.

## 📖 Manual!
* To login, you must enter a valid (registered) username & password.
* To create an image, you must provide a unique name, a valid repo, and valid version. Metadata is optional.
* To use any of the endpoints, you need to add an 'Authorization' header to your requests. Get one from the 'token' field of the login response and use the 'Authorization' header with the value `Bearer <token>`.
* Editing an existing image will override all existing relevant fields except metadata, which will perform a deep unique merge on its attributes.
* To create a new deployment, you must enter an existing image ID.
* Use 'sort', 'page', and 'limit' query params for sorting and pagination.


## ⭐️ Contributors

* Daniel Malky

> Feel free to add any contribution, it will be blessed.
