import { Model } from 'mongoose';
import { PaginationOptions, PaginationResult } from '../types';

export async function paginate<T extends Document>(
  model: Model<T>,
  query: any = {},
  options: PaginationOptions
): Promise<PaginationResult<T>> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(query).skip(skip).limit(limit).exec(),
    model.countDocuments(query).exec()
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages
  };
}