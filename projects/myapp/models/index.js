const Sequelize = require('sequelize');
const config = require('../config/config.json');
const db = {};

const sequelize = new Sequelize(
    config.db.database, config.db.user, config.db.password, config.db,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);

module.exports = db;