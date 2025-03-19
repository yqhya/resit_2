const sqlite= require('sqlite3')
const db= new sqlite.Database('books.db')
const createUserTable= `CREATE TABLE IF NOT EXISTS USER (ID INTEGER PRIMARY KEY AUTOINCREMENT,
NAME TEXT NOT NULL,
EMAIL TEXT UNIQUE NOT NULL,
PASSWORD TEXT NOT NULL,
ISADMIN INT)`

const createBookTable=`CREATE TABLE IF NOT EXISTS BOOK (ID INTEGER PRIMARY KEY AUTOINCREMENT,
TITLE TEXT NOT NULL,
PRICE REAL NOT NULL,
QUANTITY INT NOT NULL)`

const createOrderTable =`CREATE TABLE IF NOT EXISTS ORDERS (ID INTEGER PRIMARY KEY AUTOINCREMENT,
USER_ID INT,
BOOK_ID INT,
QUANTITY INT NOT NULL,
FOREIGN KEY (USER_ID) REFERENCES USER(ID),
FOREIGN KEY (BOOK_ID) REFERENCES BOOK(ID))`

module.exports={db,createUserTable,createBookTable,createOrderTable}