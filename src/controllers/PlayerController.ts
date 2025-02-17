import { Hono } from 'hono';
import { PlayerService } from '../services/PlayerService';
import { PlayerRole } from '../entities/PlayerEntity';
import { resultHandler } from '../middlewares/resultHandler';

const playerService = new PlayerService();

const playerController = new Hono();

// 📌 Obtener todos los jugadores
playerController.get('/players', async (c) => {
  const players = await playerService.findAll();
  return resultHandler({ status: 200, success: true, result: players }, c);
});

// 📌 Obtener un jugador por ID
playerController.get('/players/:id', async (c) => {
  const { id } = c.req.param();

  const player = await playerService.findById(Number(id));
  return resultHandler({ status: 200, success: true, result: player }, c);
});

// 📌 Crear un nuevo jugador
playerController.post('/players', async (c) => {
  const playerData = await c.req.json();

  const newPlayer = await playerService.create(playerData);
  return resultHandler({ status: 201, success: true, result: newPlayer }, c);
});

// 📌 Actualizar un jugador
playerController.put('/players/:id', async (c) => {
  const { id } = c.req.param();
  const playerData = await c.req.json();

  const updatedPlayer = await playerService.update(Number(id), playerData);
  return resultHandler(
    { status: 200, success: true, result: updatedPlayer },
    c,
  );
});

// 📌 Eliminar un jugador
playerController.delete('/players/:id', async (c) => {
  const { id } = c.req.param();

  await playerService.delete(Number(id));
  return resultHandler(
    { status: 204, success: true, result: 'Jugador eliminado' },
    c,
  );
});

// 📌 Filtrar jugadores por rol
playerController.get('/players/role/:role', async (c) => {
  const { role } = c.req.param();
  if (!Object.values(PlayerRole).includes(role as PlayerRole)) {
    return resultHandler(
      { status: 400, success: false, result: 'Rol no válido' },
      c,
    );
  }
  const players = await playerService.findByRole(role as PlayerRole);
  return resultHandler({ status: 200, success: true, result: players }, c);
});

export default playerController;
