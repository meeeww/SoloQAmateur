import { Request, Response } from 'express';
import { PlayerService } from '../services/PlayerService';
import { NotFoundError } from '../middlewares/appError';
import { resultHandler } from '../middlewares/resultHandler';
import tryCatch from '../utils/tryCatch';

const playerService = new PlayerService();

export class PlayerController {
  static createPlayer = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const player = await playerService.createPlayer(req.body);
      resultHandler({ status: 201, success: true, result: player }, res);
    },
  );

  static getPlayerById = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const player = await playerService.getPlayerById(
        parseInt(req.params.id, 10),
      );
      if (!player) {
        throw new NotFoundError('Jugador no encontrado.');
      }
      resultHandler({ status: 200, success: true, result: player }, res);
    },
  );

  static updatePlayer = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const player = await playerService.updatePlayer(
        parseInt(req.params.id, 10),
        req.body,
      );
      if (!player) {
        throw new NotFoundError('Jugador no encontrado.');
      }
      resultHandler({ status: 200, success: true, result: player }, res);
    },
  );

  static deletePlayer = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      await playerService.deletePlayer(parseInt(req.params.id, 10));
      resultHandler(
        {
          status: 204,
          success: true,
          result: 'Jugador eliminado con éxito.',
        },
        res,
      );
    },
  );

  static getAllPlayers = tryCatch(
    async (_: Request, res: Response): Promise<void> => {
      const players = await playerService.getAllPlayers();
      resultHandler({ status: 200, success: true, result: players }, res);
    },
  );

  static createPlayersFromMultiOpgg = tryCatch(
    async (req: Request, res: Response): Promise<void> => {
      const { multiOpggUrl, teamName } = req.body;

      if (!multiOpggUrl) {
        throw new Error('El enlace de MultiOPGG es obligatorio.');
      }

      if(!teamName){
        throw new Error('El equipo es obligatorio.');
      }

      console.log(multiOpggUrl)

      const players = await playerService.createPlayersFromMultiOpgg(
        multiOpggUrl,
        teamName
      );
      resultHandler({ status: 201, success: true, result: players }, res);
    },
  );
}
