import { Context } from 'hono';
import { PoolConnection } from 'mariadb';
import Result from '../interfaces/result';

const resultHandler = (result: Result, c: Context, conn?: PoolConnection) => {
  if (conn) conn.end();

  const safeResult = JSON.parse(
    JSON.stringify(result, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v,
    ),
  );

  return c.json(safeResult, safeResult.status);
};

export { resultHandler };
