const express = require('express')
const AuthorRouter = require('./routes/AuthorRoutes')
const BookRouter = require('./routes/BookRoutes')
const app = express()
app.use(express.json())

app.use('/author',AuthorRouter)
app.use('/book',BookRouter)

app.listen(3000,()=>{
    console.log('App running on PORT 3000')
})