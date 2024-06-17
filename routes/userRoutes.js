const express = require('express');
const { getUser, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', auth, getUser);
router.put('/', auth, updateUser);
router.delete('/', auth, deleteUser);

module.exports = router;
