using Chatbot.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatbot.Server;

public class MessageContext : DbContext
{
    public MessageContext(DbContextOptions<MessageContext> options)
        : base(options) { }

    public DbSet<Message> Messages { get; set; }
}
