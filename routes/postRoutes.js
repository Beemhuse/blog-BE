const express = require('express');
const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByCategory,
} = require('../controllers/postController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // Import the upload middleware

const router = express.Router();

router.post('/', upload.single('image'),auth, createPost);
router.get('/', getPosts);
router.get('/category/:category', getPostsByCategory); // Route for fetching posts by category
router.get('/:id', getPostById);
router.put('/:id',  upload.single('image'), auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
