module.exports = (sequelize, DataTypes) => {
    const System = sequelize.define("System", {

        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })
    return System
}

