const express = require('express')
const { addAuthor, deleteAuthor } = require('../controllers/AuthorController')

const Router = express.Router()

Router.post('/',addAuthor);
Router.delete('/:id',deleteAuthor);

module.exports = Router