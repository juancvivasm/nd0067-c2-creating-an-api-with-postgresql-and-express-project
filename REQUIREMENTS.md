# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
><span style="color:green">
><strong>GET</strong>
></span> Inicio
>
>```
> http://localhost:3000/
>```

### Products
><span style="color:green">
><strong>GET</strong>
></span> Get products
>
>```
> http://localhost:3000/products/
>```

><span style="color:orange">
><strong>POST</strong>
></span> Add a product
>
>```
> http://localhost:3000/products/
>```
>**Authorization** Bearer Token
>
>**Body** raw (json)
>```json
>{
>    "name": "Test Product 01",
>    "price": 10,
>    "category": "Category 01"
>}
>```

><span style="color:blue">
><strong>PUT</strong>
></span> Update a product
>
>```
> http://localhost:3000/products/
>```
>**Authorization** Bearer Token
>
>**Body** raw (json)
>```json
>{
>    "id": 1,
>    "name": "Test Product 01",
>    "price": 11,
>    "category": "Category 02"
>}
>```

><span style="color:red">
><strong>DELETE</strong>
></span> Delete a product
>
>```
> http://localhost:3000/products/7
>```
>**Authorization** Bearer Token

><span style="color:green">
><strong>GET</strong>
></span> Find a product
>
>```
> http://localhost:3000/products/1
>```

><span style="color:green">
><strong>GET</strong>
></span> Get products by category
>
>```
> http://localhost:3000/products/category/Category 01
>```

#### Users
><span style="color:green">
><strong>GET</strong>
></span> Get users
>
>```
> http://localhost:3000/users/
>```
>**Authorization** Bearer Token

><span style="color:orange">
><strong>POST</strong>
></span> Add a user
>
>```
> http://localhost:3000/users/
>```
>**Authorization** Bearer Token
>
>**Body** raw (json)
>```json
>{ 
>    "firstname": "Juan David",
>    "lastname": "Vivas Navas",
>    "username": "juandvivasn",
>    "password": "12345"
>}
>```

><span style="color:green">
><strong>GET</strong>
></span> Find a user
>
>```
> http://localhost:3000/users/1
>```
>**Authorization** Bearer Token

><span style="color:blue">
><strong>PUT</strong>
></span> Change Password
>
>```
> http://localhost:3000/users/
>```
>**Authorization** Bearer Token
>
>**Body** raw (json)
>```json
>{ 
>    "username": "juandvivasn",
>    "password": "1234567"
>}
>```

><span style="color:orange">
><strong>POST</strong>
></span> Authentication
>
>```
> http://localhost:3000/users/authenticate
>```
>**Authorization** Bearer Token
>
>**Body** raw (json)
>```json
>{ 
>    "username": "juandvivasn",
>    "password": "1234567"
>}
>```


#### Orders
><span style="color:green">
><strong>GET</strong>
></span> Get orders
>
>```
> http://localhost:3000/orders/
>```
>**Authorization** Bearer Token

><span style="color:orange">
><strong>POST</strong>
></span> Add Order
>
>```
> http://localhost:3000/orders/
>```
>**Authorization** Bearer Token
>
>**Body** raw (json)
>```json
>{
>    "status": "active",
>    "user_id": 1
>}
>```

><span style="color:green">
><strong>GET</strong>
></span> Get order by id
>
>```
> http://localhost:3000/orders/1
>```
>**Authorization** Bearer Token

><span style="color:green">
><strong>GET</strong>
></span> Get order by user id
>
>```
> http://localhost:3000/orders/user/1
>```
>**Authorization** Bearer Token

><span style="color:orange">
><strong>POST</strong>
></span> Add product to order
>
>```
> http://localhost:3000/orders/1/products
>```
>**Authorization** Bearer Token
>
>**Body** raw (json)
>```json
>{
>    "productId": 2,
>    "quantity": 7
>}
>```

><span style="color:blue">
><strong>PUT</strong>
></span> Order complete
>
>```
> http://localhost:3000/orders/1
>```
>**Authorization** Bearer Token
>

#### Dashboard
><span style="color:green">
><strong>GET</strong>
></span> Top 05 most popular products
>
>```
> http://localhost:3000/five_most_popular_products
>```

><span style="color:green">
><strong>GET</strong>
></span> Users with order completed
>
>```
> http://localhost:3000/users_order_completed
>```
>**Authorization** Bearer Token

><span style="color:green">
><strong>GET</strong>
></span> Top 05 most expensive products
>
>```
> http://localhost:3000/five_most_expensive_products
>```

## Data Shapes
#### Product
```sql
CREATE TABLE products ( 
    id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	price INTEGER NOT NULL,
    category VARCHAR(50) NULL
);
```

#### User
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NULL,
    password VARCHAR(255) NOT NULL
);
```

#### Orders
```sql
CREATE TABLE orders ( 
    id SERIAL PRIMARY KEY, 
    status VARCHAR(10) NOT NULL, 
    user_id BIGINT REFERENCES users(id)
);
```

#### Order - Products
```sql
CREATE TABLE order_products ( 
    id SERIAL PRIMARY KEY, 
    quantity INTEGER NOT NULL, 
    order_id BIGINT REFERENCES orders(id), 
    product_id BIGINT REFERENCES products(id) 
);
```

