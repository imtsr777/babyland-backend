import { FilterQuery, Types } from 'mongoose';
import { PaginationInterface } from '../Pagination.interface';

export interface BaseRepositoryInterface<K> {
  getById(id: Types.ObjectId): Promise<K>;
  list(pagination?: PaginationInterface, filter?: FilterQuery<any>, sort?: any): Promise<Array<K>>;
}
