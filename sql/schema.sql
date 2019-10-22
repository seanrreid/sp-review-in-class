create table parks ( id serial primary key, name varchar(200), address varchar(200), street varchar(200), city varchar(200), state varchar(50), picture varchar(500) -- NEVER try to store images in your database
 -- instead, store a URL
 -- parks have many reviews
 -- but I don't put a foreign key here.
 -- That FK goes in the reviews table.
);


create table users ( id serial primary key, first_name varchar(100), -- "varchar" is equivalent to "character varying"
 last_name varchar(100), -- "varying" just means that it won't be filled with spaces
 email varchar(200), password varchar(200));


create table reviews ( id serial primary key, score integer, content text, -- a single review belongs to a single restaurant
 park_id integer references parks(id), -- a single review belongs to a single user
 user_id integer references users(id));

