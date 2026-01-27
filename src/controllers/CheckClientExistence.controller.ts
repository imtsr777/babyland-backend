import * as express from 'express';
import { sendError, sendSuccess, sendValidationError } from '../services';

export async function CheckClientExistenceController(req: express.Request, res: express.Response) {
  // let params: CheckClientExistenceParams;
  // try {
  //   params = await new CheckClientExistenceParams(req.body).validate();
  // } catch (err) {
  //   return sendValidationError(err, res);
  // }
  try {
      sendSuccess(
        {
          exists: false,
          nextStep: 'Hello',
        },
        res,
      );
  } catch (error) {
    sendError(error, res);
  }
}
