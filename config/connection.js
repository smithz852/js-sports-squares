const Sequelize = require("sequelize");

// Establish connection to PostgreSQL database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Set to false for self-signed certificates
    },
  },
});

module.exports = sequelize;