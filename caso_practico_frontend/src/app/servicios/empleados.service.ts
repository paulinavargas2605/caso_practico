// src/app/services/empleados.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { environment } from '../env/environment';
import { Observable } from 'rxjs';

export interface Empleado {
  id?: number;
  nombre: string;
  correo: string;
  cargo: string;
  departamento: string;
  telefono: string;
  fechaIngreso?: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}`);
  }

  getEmpleadoById(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.apiUrl}`, empleado);
  }

  actualizarEmpleado(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<void> {
    console.log(this.apiUrl);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}