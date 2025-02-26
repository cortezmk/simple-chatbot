# Simple Chatbot Application

This is a simple single-user chatbot application designed with future LLM (Large Language Model) integration in mind. The application consists of a .NET backend and a frontend web interface.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js and npm](https://nodejs.org/)
- SQL Server (Local or Remote)
- PowerShell

## Quick Start

1. Clone this repository
2. Run the setup script:
   ```powershell
   .\setup.ps1
   ```
   This will:
   - Install all necessary dependencies
   - Set up the database
   - Launch both frontend and backend applications

## Manual Setup

If you prefer to set up components manually:

### Backend
1. Navigate to the backend directory:
   ```
   cd backend/Chatbot.Server
   ```
2. Restore dependencies:
   ```
   dotnet restore
   ```
3. Update the database connection string in `appsettings.json`
4. Run database migrations:
   ```
   dotnet ef database update
   ```
5. Start the backend:
   ```
   dotnet run
   ```

### Frontend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend:
   ```
   npm start
   ```

## Project Structure

- `backend/` - .NET backend application
- `frontend/` - Web frontend application
- `setup.ps1` - Setup and launch script

## Development

- Backend runs on http://localhost:5037
- Frontend runs on http://localhost:3000

## What I'd like to add if had more time

- Auto scroll to bottom of chat
- Ollama integration
- Multi-user support


## License

[MIT License](LICENSE)
