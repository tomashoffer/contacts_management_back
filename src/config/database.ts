import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const DB_PORT = process.env.DB_PORT;
if (!DB_PORT) {
  throw new Error('No hay puerto especificado');
}

const sequelize = new Sequelize({
  database: process.env.DB_NAME, 
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  host: process.env.DB_HOST, 
  port: parseInt(DB_PORT, 10) || 5432, 
  dialect: 'postgres', 
});


async function testConnection() {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

testConnection();

export { sequelize };
