import { FilterQuery } from 'mongoose';
import { PaginationInterface } from '../interfaces';

export interface BaseListParams {
    pagination: PaginationInterface;
    filter: FilterQuery<any>;
    sort: any;
}
