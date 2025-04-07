const express = require('express')
const {searchPostController} = require('../controllers/searchController')
const {authenticateRequest} = require('../middleware/authMiddleware')

const router = express.Router()
router.use(authenticateRequest)
router.get('/',searchPostController)
module.exports = router;