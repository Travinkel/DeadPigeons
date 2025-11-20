using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok" });
}

[ApiController]
[Route("version")]
public class VersionController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { version = "0.1.0" });
}
