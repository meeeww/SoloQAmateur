import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apicache from 'apicache';
import { initializePickEmSocket } from './sockets/PlayerSocket';
import http from 'http';

import router from './routes/index';
import  errorHandler  from './middlewares/errorHandler';

const app = express();
const server = http.createServer(app); // Crear servidor HTTP
// const io = new Server(server, {
//     cors: {
//         origin: [
//             'https://duoqchallenge.com',
//             'https://www.duoqchallenge.com',
//         ],
//         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//         allowedHeaders: ['Content-Type', 'x-auth-token'],
//     },
// });

// Socket
const io = initializePickEmSocket(server);

// Configuración de middleware
const cache = apicache.middleware;
app.use(cache('10 minutes'));

const publicPath = path.resolve('public');
app.use('/assets', express.static(publicPath));

app.use(
  cors({
    origin: ['https://duoqchallenge.com', 'https://www.duoqchallenge.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'x-auth-token'],
  }),
);

app.options('*', cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

app.use(router);
app.use(errorHandler);

// Exportar tanto `app` como `server` y `io`
export { app, server, io };
