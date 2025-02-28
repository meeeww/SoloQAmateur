import { GetIdJob } from './GetIdJob';
import { GetNameJob } from './GetNameJob';
import { GetPlayerRolesJob } from './GetPlayerRole';
import { GetRankJob } from './GetRankJob';

export const startAllJobs = () => {
  GetRankJob();
  GetNameJob();
  GetIdJob();
  GetPlayerRolesJob();
};
