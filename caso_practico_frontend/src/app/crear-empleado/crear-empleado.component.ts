import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from '../servicios/empleados.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CrearEmpleadoComponent {
  empleado = {
    nombre: '',
    correo: '',
    cargo: '',
    departamento: '',
    telefono: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    activo: true
  };

  constructor(private router: Router, 
              private empleadosService: EmpleadosService,
              private cdr: ChangeDetectorRef) {}

  mensaje: string = '';
  mostrarMensaje: boolean = false;

  crearEmpleado() {
    if(this.empleado.nombre != null || this.empleado.correo != null){
      if (this.validarCorreo(this.empleado.correo)) {
        this.empleadosService.crearEmpleado(this.empleado).subscribe({
          next: () => {
            this.router.navigate(['/empleados'], {
              state: { mensaje: 'El empleado se ha creado correctamente',
                        mostrarMensajeExito: true
                      }
            });
          },
          error: (error) => {
            console.error('Error al crear el empleado', error);

            this.router.navigate(['/empleados'], {
              state: { mensaje: 'Hubo un error al crear el empleado',
                        mostrarMensajeError: false
                      }
            });
          }
        })
      }else{
        this.mensaje = "El formato del correo no es válido.";
        this.mostrarMensaje = true;
      }
    }
  }

  cancelar() {
    this.router.navigate(['/empleados']);
  }

  validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  cerrarMensaje() {
    this.mostrarMensaje = false;
    // Verifica detección de cambios, y forza la actualización, para que se 
    // cierre el mensaje
    this.cdr.detectChanges();
  }
}