const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Use PostgreSQL connection URL from Heroku's environment variable
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Needed for Heroku SSL connections
      },
    },
  });
} else {
  // Local PostgreSQL connection
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.SESSION_SECRECT,
    {
      host: 'localhost',
      dialect: 'postgres', // Use 'postgres' instead of 'mysql'
      port: 5432, // Default PostgreSQL port
    }
  );
}

module.exports = sequelize;