import { DataTypes } from 'sequelize'
import sequelize from '../config/orm.js'

const Usuarios = sequelize.define('Usuario', {

    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }

},
{
    tableName: 'usuarios',
    timestamps: false,
    charset: 'utf8'
})

export default Usuarios
