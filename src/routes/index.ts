import express from 'express';
import { PlayerController } from '../controllers/PlayerController';

const router = express.Router();

router.get('/players', PlayerController.getAllPlayers);

export default router;
