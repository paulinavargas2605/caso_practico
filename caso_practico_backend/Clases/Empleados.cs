using System.ComponentModel.DataAnnotations;
using System;

namespace caso_practico_backend.Clases
{
    public class Empleados
    {
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        [EmailAddress]
        public string Correo { get; set; }
        public string Cargo { get; set; }
        public string Departamento { get; set; }
        public string Telefono { get; set; }

        [DataType(DataType.Date)]
        public DateTime FechaIngreso { get; set; }
        public bool Activo { get; set; }
    }
}