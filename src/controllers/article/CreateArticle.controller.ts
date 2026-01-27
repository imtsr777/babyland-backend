import * as express from 'express';
import {CreateArticleParams, GetArticleResponse} from '../../defenitions';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { Repository } from '../../core';
import * as path from "path";
import FileExtensions from "../../utils/FileExtensions";
import * as fs from 'fs';
import {UploadImageUtil} from "../../utils";

export async function CreateArticleController(req: express.Request, res: express.Response) {
    let params: CreateArticleParams;
    let response: GetArticleResponse;

    try {
        // params = await new CreateArticleParams(req.body).validate();
    } catch (error) {
        return sendValidationError(error, res);
    }
    try {

        const uploadedImage = await UploadImageUtil(req.file);
        console.log(uploadedImage);
        // const bankLogo = new BankEntity()
        //     .buildLegalName(params.legalName)
        //     .buildShortName(params.shortName)
        //     .buildBankLogoPath(uploadedImg?.file?.filename)
        //     .buildBankSmallLogoPath(smallImage?.file?.filename)
        //     .buildCode(params?.code);
        //
        // const created = await Repository.Bank().create(bankLogo);
        // response = new GetBankResponse(created);
        sendSuccess( { good: true } , res);
    } catch (error) {
        sendError(error, res);
    }
}
