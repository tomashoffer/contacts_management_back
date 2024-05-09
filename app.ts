import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
// import errorHandler from './utils/errorHandler';
import authRoutes from './src/routes/authRoutes';
import contactRoutes from './src/routes/contactRoutes';
import { sequelize } from './src/config/database'; 

dotenv.config();
console.log('DB_PORT', process.env.DB_PORT); 
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// Sincroniza el modelo de usuario con la base de datos
async function syncDatabase() {
    try {
      await sequelize.sync({ force: false }); // Cambia a true si quieres que Sequelize elimine y vuelva a crear la tabla en cada sincronización
      console.log('Base de datos sincronizada correctamente');
    } catch (error) {
      console.error('Error al sincronizar la base de datos:', error);
    }
  }
  
  // Llama a la función para sincronizar la base de datos
  syncDatabase().then(() => {
    // Inicia el servidor después de sincronizar la base de datos
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  });