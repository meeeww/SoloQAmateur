import { Hono } from 'hono';
import playerController from './controllers/PlayerController';
import AppDataSource from './config/ormconfig';

const app = new Hono();

app.use('*', async (c, next) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return next();
  } catch (error) {
    return c.json({ message: 'Error en la conexión a la base de datos', error: error }, 500);
  }
});

// Rutas básicas
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Agregar las rutas del controlador de jugadores
app.route('/', playerController);

export default app;
