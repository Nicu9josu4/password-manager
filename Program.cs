var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseFileServer();
app.UseAuthorization();

app.MapDefaultControllerRoute();
app.MapControllerRoute(
                "Default",                                              // Route name
                "{controller}/{action}/{id}",                           // URL with parameters
                new { controller = "Main", action = "Index", id = "" }  // Parameter defaults
            );
app.Run();
