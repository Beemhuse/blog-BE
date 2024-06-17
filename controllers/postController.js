const Post = require('../models/postModel');

// Create a new post
exports.createPost = async (req, res) => {
    const { title, content, author } = req.body;
    const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image

    try {
        const newPost = new Post({
            title,
            content,
            image,
            author,
            category,
            user: req.user.id,
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', ['username']).populate('category', ['name']); // Populate category details
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get posts by category
exports.getPostsByCategory = async (req, res) => {
    const category = req.params.category.toLowerCase();

    try {
        const posts = await Post.find({}).populate({
            path: 'category',
            match: { name: category }
        }).populate('user', ['username']);

        if (!posts || posts.length === 0) {
            return res.status(404).json({ msg: 'No posts found in this category' });
        }
        res.json(posts.filter(post => post.category !== null)); // Filter out posts without matching category
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// Get a single post
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', ['username']);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    const { title, content } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
};
