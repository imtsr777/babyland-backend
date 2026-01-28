import * as express from 'express';
import * as multer from 'multer';

import { CheckClientSessionMiddleware } from './middlewares';

import {CreateArticleController, GetArticleByIdController, UpdateArticleController} from './controllers';

const upload = multer();


function nestedRoutes(path, configure) {
    const router = express.Router({mergeParams: true});
    this.use(path, router);
    configure(router);
    return router;
}


express.application['prefix'] = nestedRoutes;
express.Router['prefix'] = nestedRoutes;

const routes = express.Router({mergeParams: true});

routes.prefix('/admin', (operator) => {

    operator.prefix('/article', (article) => {

        article.post('/', upload.single('file'), CreateArticleController);
        article.put('/:id', upload.single('file'), UpdateArticleController);
        article.get('/:id', upload.single('file'), GetArticleByIdController);
    });


});
export default routes;
