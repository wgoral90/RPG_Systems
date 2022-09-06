const coverImagePathFolder = "uploads/bookCovers"
module.exports = (sequelize, DataTypes) => {
    const Edition = sequelize.define("Edition", {

        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: false
            }
        },
        coverImageName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        SystemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            references: {
                model: "Systems",
                key: "id"
            }

        }

    })
    Edition.associate = function (models) {
        Edition.belongsTo(models.System, { foreignKey: 'SystemId', as: 'system' })
    };
    return Edition
}


