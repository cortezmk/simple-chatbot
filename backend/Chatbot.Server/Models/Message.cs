namespace Chatbot.Server.Models;

public record Message(int Id, string Content, DateTime Added, MessageAuthor Author, string Reaction = "");
