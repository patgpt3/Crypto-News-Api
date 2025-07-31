# Privy Integration Setup Guide

## Environment Variables Required

Create a `.env` file in the `Crypto-News-Api` directory with the following variables:

```env
# Database
MONGOURI=mongodb://localhost:27017/crypto-news

# JWT
jwt_secret=your-jwt-secret-here

# Privy Configuration
PRIVY_API_KEY=your-privy-api-key-here
PRIVY_APP_ID=cm4g4hzw102g3hlf5jgx0rxf9

# Server
PORT=3000
```

## Getting Your Privy API Key

1. Go to [Privy Console](https://console.privy.io/)
2. Select your app (App ID: cm4g4hzw102g3hlf5jgx0rxf9)
3. Go to "API Keys" section
4. Create a new API key
5. Copy the API key and add it to your `.env` file

## Testing the Integration

### 1. Health Check
```bash
GET http://localhost:3000/sync/health
```

### 2. Test Connection
```bash
GET http://localhost:3000/sync/test
```

### 3. Create User
```bash
POST http://localhost:3000/sync/create-user
Content-Type: application/json

{
  "privyId": "test-privy-id",
  "username": "testuser"
}
```

## Troubleshooting

### Common Issues:

1. **"Cannot find module '@nestjs/common'"**
   - Run: `npm install` in the Crypto-News-Api directory

2. **"PRIVY_API_KEY not configured"**
   - Make sure you have set the PRIVY_API_KEY in your .env file
   - Restart the server after adding environment variables

3. **"User not found in Privy"**
   - Verify your Privy App ID is correct
   - Check that the privyId being sent matches a real Privy user

4. **Database connection issues**
   - Ensure MongoDB is running
   - Check your MONGOURI connection string

## API Endpoints

- `POST /sync/create-user` - Create a new user with Privy ID
- `GET /sync/test` - Test if the sync endpoint is working
- `GET /sync/health` - Comprehensive health check
- `POST /privy/verify-user` - Verify and create user with Privy
- `GET /privy/user/:privyId` - Get user by Privy ID 