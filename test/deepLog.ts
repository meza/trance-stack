import * as util from 'util';

export const deepLog = (obj: never) => {
  console.log(util.inspect(obj, false, null, true));
};
