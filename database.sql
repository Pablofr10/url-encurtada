CREATE DATABASE url_database;

CREATE TABLE url_encurtada (
    id SERIAL PRIMARY KEY,
    url_longa VARCHAR(255),
    url_curta VARCHAR(255),
    encurtada_em DATE
);