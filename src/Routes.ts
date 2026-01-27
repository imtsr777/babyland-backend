import * as express from 'express';
import * as multer from 'multer';

import { CheckClientSessionMiddleware } from './middlewares';

import {
    CheckClientExistenceController
} from './controllers';

function nestedRoutes(path, configure) {
    const router = express.Router({mergeParams: true});
    this.use(path, router);
    configure(router);
    return router;
}

const upload = multer();

express.application['prefix'] = nestedRoutes;
express.Router['prefix'] = nestedRoutes;

const routes = express.Router({mergeParams: true});

routes.prefix('/category', (category) => {
    category.get('/list', CheckClientSessionMiddleware(false), CheckClientExistenceController);
});
export default routes;
