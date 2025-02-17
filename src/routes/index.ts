import express from 'express';
import { PlayerController } from '../controllers/PlayerController';

const router = express.Router();

router.get('/players', PlayerController.getAllPlayers);
router.post('/players', PlayerController.createPlayersFromMultiOpgg);

export default router;
