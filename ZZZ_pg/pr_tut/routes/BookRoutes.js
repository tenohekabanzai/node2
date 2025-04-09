const express = require('express')
const { addBook, getAllBooks, getBookById, updateBookByTransaction, deleteBook } = require('../controllers/BookController')

const Router = express.Router()

Router.post('/',addBook);
Router.get('/',getAllBooks);
Router.get('/:id',getBookById);
Router.put('/:id',updateBookByTransaction)
Router.delete('/:id',deleteBook)

module.exports = Router