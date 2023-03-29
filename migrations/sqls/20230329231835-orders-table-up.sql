CREATE TABLE orders ( 
    id SERIAL PRIMARY KEY, 
    status VARCHAR(10) NOT NULL, 
    user_id BIGINT REFERENCES users(id)
);