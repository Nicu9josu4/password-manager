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

        [Route("/admin")]
        public IActionResult Admin()
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
