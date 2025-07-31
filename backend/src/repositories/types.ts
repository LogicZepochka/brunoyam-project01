

export enum userRoles {
  USER = 'Пользователь',
  BUSINESS = 'Предприятие',
  ADMIN = 'Администратор'
};

export interface User {
    _id?: string,
    name?: string,
    password?: string,
    email?: string,
    lastLogin?: Date,
    role?: userRoles
}