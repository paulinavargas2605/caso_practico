using Microsoft.AspNetCore.Mvc;
using caso_practico_backend.Clases;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]

public class EmpleadosController : Controller
{
    private readonly AppDbContext _context;

    public EmpleadosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetEmpleados()
    {
        var empleados = await _context.Empleados.ToListAsync();

        if (empleados == null)
        {
            return NotFound("No hay empleados registrados");
        }
        else
        {
            return Ok(empleados);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEmpleadoById(int id)
    {
        var empleado = await _context.Empleados.FirstOrDefaultAsync(e => e.Id == id);

        if (empleado == null)
        {
            return NotFound("El empleado no se encuentra registrado");
        }
        else
        {
            return Ok(empleado);
        }    
    }

    [HttpPost]
    public async Task<IActionResult> CrearEmpleado([FromBody] Empleados nuevoEmpleado)
    {
        // Verificar que envió el nombre y el correo
        if (nuevoEmpleado.Nombre == null || nuevoEmpleado.Correo == null)
        {
            // Si no están los datos devuelve
            return BadRequest("No se registró correctamente los datos");
        }
        // Si los datos no son nulos
        else
        {
            _context.Empleados.Add(nuevoEmpleado);
            await _context.SaveChangesAsync();
            return Ok(nuevoEmpleado);
        }
    }

    //Actualizar empleado
    [HttpPut("{id}")]
    public async Task<IActionResult> EditarEmpleado(int id, [FromBody] Empleados datosNuevos)
    {
        var empleado = _context.Empleados.FirstOrDefault(e => e.Id == id);
        if (empleado == null)
        {
            // Si el empleado no está, que mande un estado de no encontrado
            return NotFound("El empleado no se encuentra");
        }
        // El empleado si está
        else
        {
            // Verificar que envió el nombre y el correo
            if (empleado.Nombre == null || empleado.Correo == null)
            {
                // Si no están los datos devuelve
                return BadRequest("No se registraron correctamente los datos");
            }
            // Si los datos no son nulos
            else
            {
                empleado.Nombre = datosNuevos.Nombre;
                empleado.Correo = datosNuevos.Correo;
                empleado.Cargo = datosNuevos.Cargo;
                empleado.Departamento = datosNuevos.Departamento;
                empleado.Telefono = datosNuevos.Telefono;
                empleado.FechaIngreso = datosNuevos.FechaIngreso;
                empleado.Activo = datosNuevos.Activo;

                await _context.SaveChangesAsync();
                return Ok(empleado);
            }
        }
    }

    //Eliminar empleado
    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarEmpleado(int id)
    {
        var empleado = _context.Empleados.FirstOrDefault(e => e.Id == id);
        if (empleado == null)
        {
            return NotFound("El empleado no se encuentra");
        }
        else
        {
            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();
            return Ok();
        }      
    }
}
