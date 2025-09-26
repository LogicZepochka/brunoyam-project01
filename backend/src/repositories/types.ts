import { ObjectId } from "mongoose";
import UserDTO from "../dto/UserDTO"
import { Owner } from "./room.repository.interface";

import { Model } from 'mongoose';


export enum userRoles {
  USER = 'Пользователь',
  BUSINESS = 'Предприятие',
  ADMIN = 'Администратор'
};

export enum roomStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  HIDDEN = 'HIDDEN',
  DELETED = "DELETED"
};

export interface User {
    _id?: string,
    name?: string,
    password?: string,
    phone?: string,
    email?: string,
    lastLogin?: Date,
    role?: userRoles
}

export interface Room {
    _id?: string,
    title?: string,
    address?: string,
    price?: number,
    images?: string[],
    area?: number,
    shortDescription?: string,
    fullDescription?: string,
    owner?: Owner | ObjectId;
    createdAt?: Date,
    status?: roomStatus
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function paginate<T>(
  model: Model<T>,
  query: any = {}, // Partial - говорят что грязь, но пока нет других идей...
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