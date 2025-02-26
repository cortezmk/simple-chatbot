using Chatbot.Server.Models;

namespace Chatbot.Server.Services;

public interface IMessageService
{
    Task<List<Message>> GetAllMessages();

    Task<Message> AddMessage(string content, MessageAuthor author);

    Task<Message> UpdateMessage(Message message);
    Task<Message> UpdateLast(string content);

    IAsyncEnumerable<string> GetResponse(string message);
}
