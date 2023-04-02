# Storefront Backend Project

This repository contains a Node and Express app. An API for an online store to showcase your great product ideas. Users should be able to sign in and browse an index of all products, view details for a single product, add products, add products to an order, view order status, and even view the most popular products, among other features.


## Getting Started

To get started, clone this repository and run `yarn` or `npm install` in your terminal at the root of the project.


## Technologies
The application uses the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- bcrypt from npm for passwords
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing


## Steps to Completion

### 1. Meet Requirements

In this repo there is a `REQUIREMENTS.md` document which outlines what this API needs to supply for the frontend, as well as the agreed upon data shapes to be passed between front and backend. 


### 2.  DB Creation and Migrations

You must create two databases and an user with full permissions on the databases for the API (dev and test). Example:

Add the `.env` file with the environment variables

POSTGRES_HOST=127.0.0.1<br>
POSTGRES_DB=shopping<br>
POSTGRES_TEST_DB=shopping_test<br>
POSTGRES_USER=shopping_user<br>
POSTGRES_PASSWORD=password123<br>
POSTGRES_PORT=5432<br>
BCRYPT_PASSWORD=secret-password<br>
SALT_ROUNDS=10<br>
TOKEN_SECRET=secret-token<br>
ENV=dev

At the database server (postgres and debian):
In a terminal tab, create and run the database:
- switch to the postgres user `su postgres`
- start psql `psql postgres`
- in psql run the following:
    - `CREATE USER shopping_user WITH PASSWORD 'password123';`
    - `CREATE DATABASE shopping;`
    - `\c shopping`
    - `GRANT ALL PRIVILEGES ON DATABASE shopping TO shopping_user;`
- to test that it is working run `\dt` and it should output "No relations found."

If you use docker you can use the file: `docker-compose.yml` for postgres
- `docker compose up`

In your terminal at the root of the project
- Bring the migration up `db-migrate up`
- Bring the migration down `db-migrate down`

### 3. QA 

Run `npm test ` in your terminal at the root of the project to run the tests.


### 4. Run API

To start the server initially, run `yarn watch`. This will kick off the watcher library and start running the application on the port specified in server.ts.


