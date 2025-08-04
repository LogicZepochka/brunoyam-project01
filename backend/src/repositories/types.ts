

export enum userRoles {
  USER = 'Пользователь',
  BUSINESS = 'Предприятие',
  ADMIN = 'Администратор'
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
    owner?: User,
    createdAt?: Date
}