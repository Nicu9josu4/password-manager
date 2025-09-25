using Microsoft.AspNetCore.Mvc;

namespace PasswordManger.Controllers
{
    public class MainController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [Route("/adminRequest")]
        public IActionResult AdminRequest()
        {
            return View();
        }

        [Route("/login")]
        public IActionResult Login()
        {
            return View();
        }

        [Route("/passwords")]
        public IActionResult Passwords()
        {
            return View();
        }
    }
}
