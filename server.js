require('dotenv').config(); // Load environment variables from .env file

const app = require('./app');

console.log(process.env.PORT)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
