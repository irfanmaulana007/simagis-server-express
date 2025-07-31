/**
 * Server Entry Point
 * Starts the Express server and handles environment setup
 */

import app from '~/app';
import { prisma } from '~/config/database';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Function to start the server
async function startServer() {
  try {
    // Test database connection
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start the HTTP server
    const server = app.listen(PORT, () => {
      console.log('🚀 Server started successfully!');
      console.log(`📍 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API info: http://localhost:${PORT}/api`);

      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode active');
        console.log(`🔑 Auth endpoints: http://localhost:${PORT}/api/auth`);
        console.log(`👥 User endpoints: http://localhost:${PORT}/api/users`);
      }
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      console.log(`\n📴 Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        console.log('🔒 HTTP server closed');

        // Close database connection
        try {
          await prisma.$disconnect();
          console.log('🔗 Database connection closed');
        } catch (error) {
          console.error('⚠️  Error closing database connection:', error);
        }

        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      });

      // If graceful shutdown takes too long, force exit
      setTimeout(() => {
        console.error('⚠️  Graceful shutdown timed out, forcing exit');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', error => {
      console.error('💥 Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);

    // Try to disconnect from database if connection was established
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('⚠️  Error disconnecting from database:', disconnectError);
    }

    process.exit(1);
  }
}

// Start the server
startServer();
