using Azure.Core;
using Chatbot.Server.Models;
using Chatbot.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chatbot.Server.Controllers;

public record AddMessageRequest(string Content, MessageAuthor Author);

[Route("api/[controller]")]
[ApiController]
public class MessagesController(IMessageService MessageService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Message>>> Get()
    {
        await Task.Delay(500);
        return Ok(await MessageService.GetAllMessages());
    }

    [HttpPatch]
    public async Task<ActionResult<Message>> Patch([FromBody] Message request)
    {
        var message = await MessageService.UpdateMessage(request);
        return Ok(message);
    }

    [HttpPost]
    public async Task<ActionResult<Message>> Post([FromBody]AddMessageRequest request)
    {
        var message = await MessageService.AddMessage(request.Content, request.Author);
        return Ok(message);
    }
}
