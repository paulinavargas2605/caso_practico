import { Routes } from '@angular/router';
import { EmpleadosComponent } from './empleados/empleados.component';
import { CrearEmpleadoComponent } from './crear-empleado/crear-empleado.component';
import { EditarEmpleadoComponent } from './editar-empleado/editar-empleado.component';

export const routes: Routes = [
    { path: 'empleados', component: EmpleadosComponent },
    { path: 'crear-empleado', component: CrearEmpleadoComponent },
    { path: 'editar-empleado/:id', component: EditarEmpleadoComponent },
    { path: '', redirectTo: 'empleados', pathMatch: 'full' },
    { path: '**', redirectTo: 'empleados' }
];
