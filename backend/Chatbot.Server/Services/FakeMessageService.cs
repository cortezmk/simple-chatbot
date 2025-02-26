using Chatbot.Server.Models;
using Microsoft.EntityFrameworkCore;
using NLipsum.Core;
using System.Linq;


namespace Chatbot.Server.Services;

public class FakeMessageService(MessageContext DbContext) : IMessageService
{
    private readonly MessageContext _dbContext = DbContext;

    private readonly LipsumGenerator _lorem = new();

    public async Task<Message> AddMessage(string content, MessageAuthor author)
    {
        var newMessage = new Message(0, content, DateTime.Now, author, string.Empty);
        _dbContext.Messages.Add(newMessage);
        await _dbContext.SaveChangesAsync();
        return newMessage;
    }

    public async Task<List<Message>> GetAllMessages()
    {
        return await _dbContext.Messages.ToListAsync();
    }

    public async IAsyncEnumerable<string> GetResponse(string message)
    {
        var length = Random.Shared.Next(3) + 1;
        var generated = _lorem.GenerateLipsum(length);
        for (var i = 0; i < generated.Length; i += 3)
        {
            i = Math.Min(i, generated.Length);
            yield return generated.Substring(0, i + 1);
            await Task.Delay(20);
        }
        yield return generated;
    }

    public async Task<Message> UpdateLast(string content)
    {
        var found = await _dbContext.Messages.AsNoTracking().OrderBy(m => m.Id).LastOrDefaultAsync();
        if (found == null)
            return null;
        found = found with { Content = content };
        _dbContext.Messages.Update(found);
        await _dbContext.SaveChangesAsync();
        return found;
    }

    public async Task<Message> UpdateMessage(Message message)
    {
        var found = await _dbContext.Messages.AsNoTracking().FirstOrDefaultAsync(m => m.Id == message.Id);
        if (found == null)
        {
            var newMessage = await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();
            return newMessage.Entity;
        }
        _dbContext.Messages.Update(message);
        await _dbContext.SaveChangesAsync();
        return message;
    }
}
