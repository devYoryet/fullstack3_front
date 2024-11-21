// src/app/models/user.model.ts
export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: {
      id: number;
      nombre: string;
    };
  }
  
  export interface AuthResponse {
    id: number;
    nombre: string;
    email: string;
    rol: {
      id: number;
      nombre: string;
    };
  }