import { NextFunction, Request, Response } from "express";
import APIAnswer from "../builders/api/answer.builder";
import { ApiError } from "../builders/api/errors.enum";


export default function ProtectedRoute(req: Request, res: Response, next: NextFunction) {
    if(!req.session.user) {
        res.status(401).json(
            new APIAnswer(401).setError(ApiError.AuthorizationRequired,"Требуется авторизация")
        )
        return;
    }
    
    next();
}