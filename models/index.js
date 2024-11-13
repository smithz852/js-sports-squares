const User = require('./user');
const Games = require('./games')
const GameDates = require('./gameDates')

User.hasMany(Games, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Games.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(GameDates, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

GameDates.belongsTo(User, {
    foreignKey: 'user_id'
});

Games.hasMany(GameDates, {
    foreignKey: 'game_id',
    onDelete: 'CASCADE'
});

GameDates.belongsTo(Games, {
    foreignKey: 'game_id'
});


module.exports = { User, Games, GameDates };