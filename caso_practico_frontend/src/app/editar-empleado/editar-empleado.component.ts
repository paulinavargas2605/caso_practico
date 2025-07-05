import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from '../servicios/empleados.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-empleado',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-empleado.component.html',
  styleUrl: './editar-empleado.component.css'
})
export class EditarEmpleadoComponent {
  empleado = {
    id : 0,
    nombre: '',
    correo: '',
    cargo: '',
    departamento: '',
    telefono: '',
    fechaIngreso: '',
    activo: true
  };

  idEmpleado!: number;
  mensajeErrorCorreo: string = '';
  mostrarError: boolean = false;

  mensaje: string = '';
  mostrarMensaje: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private empleadosService: EmpleadosService) {}

  ngOnInit(): void {
    this.idEmpleado = Number(this.route.snapshot.paramMap.get('id'));

    this.empleado.id = this.idEmpleado;
  
    this.empleadosService.getEmpleadoById(this.idEmpleado).subscribe(data => {
      this.empleado = {
        ...data,
        id: data.id ?? 0,
        nombre: data.nombre ?? '',
        correo: data.correo ?? '',
        cargo: data.cargo ?? '',
        departamento: data.departamento ?? '',
        telefono: data.telefono ?? '',
        fechaIngreso: data.fechaIngreso ?? '',
        activo: data.activo ?? true
      };
    });
  }

  editarEmpleado() {
    if(this.empleado.nombre != null || this.empleado.correo != null){
      if (this.validarCorreo(this.empleado.correo)) {
        this.empleadosService.actualizarEmpleado(this.idEmpleado, this.empleado).subscribe({
          next: () => {
            this.router.navigate(['/empleados'], {
              state: { mensaje: 'El empleado se ha editado correctamente',
                        mostrarMensajeExito: true
                      }
            });
          },
          error: (error) => {
            console.error('Error al editar el empleado', error);

            this.router.navigate(['/empleados'], {
              state: { mensaje: 'Hubo un error al editar el empleado',
                        mostrarMensajeError: true
                      }
            });
          }
        })
      }else{
        this.mensajeErrorCorreo = "El formato del correo no es válido.";
        this.mostrarError = true;
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
    // this.mostrarError = true;
    location.reload();
  }
}
