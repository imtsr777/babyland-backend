import * as express from 'express';
import * as multer from 'multer';

import { CheckClientSessionMiddleware } from './middlewares';

import {
    ChangeArticleStatusController, CreateArticleContentController,
    CreateArticleController, DeleteArticleContentController,
    GetArticleByIdController, GetArticleContentByIdController, GetArticleContentListController,
    GetArticleListController, LoginController,
    UpdateArticleController
} from './controllers';

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

    operator.post('/login', LoginController);

    operator.use(CheckClientSessionMiddleware())

    operator.prefix('/article', (article) => {

        article.post('/', upload.single('file'), CreateArticleController);
        article.put('/:id', upload.single('file'), UpdateArticleController);
        article.get('/list', GetArticleListController);
        article.get('/:id', GetArticleByIdController);
        article.put('/change-status/:id', ChangeArticleStatusController);
    });

    operator.prefix('/article-content', (articleContent) => {
        articleContent.post('/:id', upload.single('file'), CreateArticleContentController);
        articleContent.get('/list', GetArticleContentListController);
        articleContent.get('/:id', GetArticleContentByIdController);
        articleContent.delete('/:id', DeleteArticleContentController);
    });


});
export default routes;
