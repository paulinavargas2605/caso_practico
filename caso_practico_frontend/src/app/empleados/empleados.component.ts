import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadosService, Empleado } from '../servicios/empleados.service';
import { provideHttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent implements OnInit {
  title = "Gestión de empleados";

  empleados: Empleado[] = [];
  filtros: String[] = [];

  empleado = {
    id: 0,
    nombre: '',
    correo: '',
    cargo: '',
    departamento: '',
    telefono: '',
    fechaIngreso: '', 
    activo: true
  };

  idEmpleado!: number;
  mensaje: string = '';
  mostrarMensajeExito: boolean = false;
  mostrarMensajeError: boolean = false;
  valorSeleccionado: string = '';
  valorFiltroSeleccionado: string = '';
  cargando = true;

  empleadosPaginados: Empleado[] = [];
  paginaActual: number = 1;
  empleadosPorPagina: number = 5;

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private empleadosService: EmpleadosService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Trae el estado de la creación del empleado
    const state = history.state;

    if(state){
      this.mensaje = state['mensaje'] ?? null;
      this.mostrarMensajeExito = state['mostrarMensajeExito'] ?? false;
      this.mostrarMensajeError = state['mostrarMensajeError'] ?? false;
    }

    history.replaceState({}, '', this.router.url);

    this.cargarEmpleados();
  }

  tipoDeFiltro(event: Event) {
    this.valorSeleccionado = (event.target as HTMLSelectElement).value;
    this.valorFiltroSeleccionado = '';

    this.empleadosService.getEmpleados().subscribe(data => {
      // Filtros de nombre y de departamento
      if(this.valorSeleccionado == 'nombre'){
        this.filtros = [...new Set(data.map(emp => emp.nombre).filter(c => c))];
      }else if(this.valorSeleccionado == 'departamento'){
        this.filtros = [...new Set(data.map(emp => emp.departamento).filter(d => d))];
      }
    });
  }

  filtrarDatos(){
    if(this.valorSeleccionado && this.valorFiltroSeleccionado){
      this.empleadosService.getEmpleados().subscribe(data => {

        const valorSeleccionado = this.valorSeleccionado as keyof Empleado;

        this.empleados = data.filter(emp => {
          const campo = emp[valorSeleccionado];
          return campo === this.valorFiltroSeleccionado;
        });
      })
    }else{
      this.cargarEmpleados();
    }
  }

  cargarEmpleados(){
    this.empleadosService.getEmpleados().subscribe(data => {
      this.empleados = data;
      this.cargando = false;

      // Filtros de nombre y de departamento
      if(this.valorSeleccionado == 'nombre'){
        this.filtros = [...new Set(data.map(emp => emp.nombre).filter(c => c))];
      }else if(this.valorSeleccionado == 'departamento'){
        this.filtros = [...new Set(data.map(emp => emp.departamento).filter(d => d))];
      }

      this.actualizarEmpleadosPaginados();
    });
  }

  actualizarEmpleadosPaginados() {
    const inicio = (this.paginaActual - 1) * this.empleadosPorPagina;
    const fin = inicio + this.empleadosPorPagina;
    this.empleadosPaginados = this.empleados.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number) {
    this.paginaActual = nuevaPagina;
    this.actualizarEmpleadosPaginados();
  }

  get totalPaginas(): number[] {
    const total = Math.ceil(this.empleados.length / this.empleadosPorPagina);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  eliminarEmpleado(id: number): void {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este empleado?');

    if (confirmar) {
      this.idEmpleado = id;
      
      this.empleadosService.eliminarEmpleado(this.idEmpleado).subscribe({
        next: () => {
          this.mensaje = 'El empleado fue eliminado correctamente';
          this.mostrarMensajeExito = true;

          this.cargarEmpleados();
        },
        error: (error) => {
          console.error('Error al eliminar el empleado', error);

          this.mensaje = 'Hubo un error al eliminar el empleado';
          this.mostrarMensajeExito = true;
        }
      });
    }
  }

  cerrarMensaje() {
    this.mostrarMensajeExito = false;
    this.mostrarMensajeError = false;
    // Verifica detección de cambios, y forza la actualización, para que se 
    // cierre el mensaje
    this.cdr.detectChanges();
  }
}
