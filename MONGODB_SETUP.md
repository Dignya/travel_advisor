# MongoDB Setup Guide for Smart Travel Advisor

This guide will help you set up MongoDB for the Smart Travel Advisor application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Option 1: Local MongoDB Installation

### 1. Install MongoDB
Follow the official MongoDB installation guide for your operating system:
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### 2. Start MongoDB Service
```bash
# For macOS (using Homebrew)
brew services start mongodb-community

# For Linux (using systemctl)
sudo systemctl start mongod

# For Windows (using Services)
Start the MongoDB service from Windows Services
```

### 3. Verify MongoDB is Running
```bash
mongosh --eval "db.version()"
```

## Option 2: MongoDB Atlas (Cloud)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is available)

### 2. Get Connection String
1. In your Atlas dashboard, go to your cluster
2. Click "Connect" button
3. Choose "Connect your application"
4. Select Node.js driver and copy the connection string

### 3. Update Environment Variables
Replace the connection string in your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-travel-advisor?retryWrites=true&w=majority
```

## Environment Configuration

Update your `.env` file with the MongoDB connection string:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/smart-travel-advisor

# For MongoDB Atlas (replace with your actual connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-travel-advisor?retryWrites=true&w=majority
```

## Database Seeding

After setting up MongoDB, you can seed the database with initial destination data:

```bash
npm run seed
```

This will:
1. Connect to your MongoDB database
2. Clear existing destinations
3. Insert 12 sample destinations with comprehensive information

## Database Schema

The application uses the following MongoDB collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Destinations Collection
```javascript
{
  _id: ObjectId,
  name: String,
  country: String,
  city: String,
  description: String,
  latitude: Number,
  longitude: Number,
  image: String,
  climate: String, // 'hot', 'moderate', 'cold'
  activities: [String],
  budgetLevel: String, // 'low', 'medium', 'high'
  bestSeason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### TravelPreferences Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  budget: String, // 'low', 'medium', 'high'
  duration: Number,
  climate: String, // 'hot', 'moderate', 'cold'
  activities: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### SavedTrips Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  destinationId: ObjectId,
  title: String,
  startDate: Date,
  endDate: Date,
  budget: String, // 'low', 'medium', 'high'
  duration: Number,
  climate: String, // 'hot', 'moderate', 'cold'
  activities: [String],
  itinerary: [{
    day: Number,
    activities: [String]
  }],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Destinations
- `GET /api/destinations` - Get all destinations
- `POST /api/destinations` - Filter destinations by preferences

### Saved Trips
- `GET /api/saved-trips?userId=<userId>` - Get user's saved trips
- `POST /api/saved-trips` - Create a new saved trip
- `PUT /api/saved-trips/<id>` - Update a saved trip
- `DELETE /api/saved-trips/<id>` - Delete a saved trip

## Troubleshooting

### Connection Issues
If you encounter connection errors:

1. **Check MongoDB is running**:
   ```bash
   mongosh --eval "db.version()"
   ```

2. **Verify connection string**:
   - Ensure the connection string is correct
   - Check that the database name is included
   - Verify credentials (for Atlas)

3. **Check network connectivity**:
   - For local MongoDB: ensure MongoDB is running on the specified port
   - For Atlas: ensure your IP address is whitelisted

### Database Seeding Issues
If seeding fails:

1. **Check MongoDB connection**:
   ```bash
   mongosh "mongodb://localhost:27017/smart-travel-advisor"
   ```

2. **Manual seeding**:
   ```javascript
   // In MongoDB shell
   use smart-travel-advisor
   db.destinations.insertMany([/* your destination data */])
   ```

### Common Errors

**MongoNetworkError**: Connection timeout
- Check if MongoDB is running
- Verify the connection string
- Check firewall settings

**MongoServerError**: Authentication failed
- Verify username and password
- Check if user has proper permissions
- Ensure authentication database is correct

## Best Practices

1. **Environment Variables**: Never commit your MongoDB connection string to version control
2. **Indexing**: Add appropriate indexes for frequently queried fields
3. **Backup**: Regular backup your database, especially for production use
4. **Security**: Use strong passwords and enable authentication in production
5. **Performance**: Monitor database performance and optimize queries as needed

## Production Considerations

For production deployment:

1. **Use MongoDB Atlas** for scalability and reliability
2. **Enable SSL/TLS** for secure connections
3. **Set up proper indexing** for better performance
4. **Configure backup and monitoring**
5. **Use environment-specific configurations**
6. **Implement proper error handling and retry logic**

## Support

If you encounter any issues:
1. Check MongoDB documentation
2. Review the application logs
3. Ensure all dependencies are properly installed
4. Verify network connectivity to your MongoDB instance