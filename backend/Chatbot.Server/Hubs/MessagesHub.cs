using Chatbot.Server.Models;
using Chatbot.Server.Services;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System.Runtime.CompilerServices;

namespace Chatbot.Server.Hubs;

public class MessagesHub(IMessageService MessageService) : Hub
{
    private static CancellationTokenSource? _cancellationTokenSource;

    public async IAsyncEnumerable<string> Message(
        string message,
        [EnumeratorCancellation]
        CancellationToken cancellationToken)
    {
        _cancellationTokenSource = new CancellationTokenSource();
        var token = _cancellationTokenSource.Token;
        var savedMessage = string.Empty;

        await foreach (var partMessage in MessageService.GetResponse(message))
        {
            if (token.IsCancellationRequested || cancellationToken.IsCancellationRequested)
                break;
            savedMessage = partMessage;
            yield return partMessage;
        }
        await MessageService.UpdateLast(savedMessage);
    }

    public void CancelMessage() => _cancellationTokenSource?.Cancel();
}
