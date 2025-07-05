using System.ComponentModel.DataAnnotations;
using System;

namespace caso_practico_backend.Clases
{
    public class Empleados : IValidatableObject
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
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (FechaIngreso > DateTime.Now)
            {
                yield return new ValidationResult(
                    "La fecha de ingreso no puede ser mayor a la fecha actual.",
                    new[] { nameof(FechaIngreso) }
                );
            }
        }
        public bool Activo { get; set; }
    }
}