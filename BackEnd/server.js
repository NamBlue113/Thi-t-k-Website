require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

let dbConnection;

const ensureDB = () => {
    if (!dbConnection) {
        dbConnection = connectDB();
    }

    return dbConnection;
};

if (require.main === module) {
    ensureDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error("Failed to connect to MongoDB:", err.message);
            process.exit(1);
        });
} else {
    ensureDB().catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
    });
}

module.exports = app;
