import { GeneralResponse } from "./general-response.model"

export interface AuthRequest {
    email: string, 
    password: string
}

export interface AuthResponse extends GeneralResponse {
    token: string
}

export interface RegiaterUserRequest extends AuthRequest {
    username: string
}

export interface RegisterUserResponse extends GeneralResponse {
    user: User 
}
export interface User {
    id: number
    username: string
    email: string
}