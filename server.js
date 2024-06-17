if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = require('./app');

// Use the PORT environment variable, defaulting to 5000 if not set
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
