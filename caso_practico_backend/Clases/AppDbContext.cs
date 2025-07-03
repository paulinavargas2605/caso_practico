using Microsoft.EntityFrameworkCore;

namespace caso_practico_backend.Clases
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Empleados> Empleados { get; set; }
    }
}
