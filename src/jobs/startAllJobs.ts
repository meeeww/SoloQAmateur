import { GetIdJob } from './GetIdJob';
import { GetNameJob } from './GetNameJob';
import { GetRankJob } from './GetRankJob';

export const startAllJobs = () => {
  GetRankJob();
  GetNameJob();
  GetIdJob();
};
