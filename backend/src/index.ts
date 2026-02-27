import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { initDB } from './repository/sqliteRepository';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main API routes
app.use('/api', apiRoutes);

// Error Middleware
app.use(errorHandler);

const startServer = async () => {
    try {
        await initDB();
        console.log("Database initialized successfully.");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
