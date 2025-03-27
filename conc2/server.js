const express = require('express')
const cors = require('cors')
const {configureCors} = require('./config/corsConfig')
const { requestLogger, addTimeStamp } = require('./middleware/customMiddleware')
const { globalErrorHandler } = require('./middleware/errorHandler')
const { urlVersioning } = require('./middleware/apiVersioning')
const { createBasicRateLimiter } = require('./middleware/rateLimiting')
const itemRoutes = require('./routes/itemRoutes.js')

const app = express()


app.use(configureCors())

// ALLOW RATE OF 100 REQS PER 15 MIN FOR EVERY CLIENT
app.use(createBasicRateLimiter(100,15*60*1000)) 
app.use(express.json())

app.use(requestLogger) // middleware for logging requests
app.use(addTimeStamp) // middleware to add timestamp to request

app.use(urlVersioning('v1'))

app.use('/api/v1',itemRoutes);
app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.use(globalErrorHandler) // manages error using customr errorHandler middleware


app.listen(8080,()=>{
    console.log('Server running on PORT 8080')
})
