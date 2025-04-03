const express = require('express')
const {createPost,getAllPosts,getPost,deletePost} = require('../controllers/postController')
const {authenticateRequest} = require('../middleware/authMiddleware')
const router = express.Router()

router.use(authenticateRequest)
router.post('/create-post',createPost)
router.get('/posts',getAllPosts)
router.get('/:id',getPost)
router.delete('/delete/:id',deletePost)

module.exports = router