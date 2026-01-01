# Quick Setup Guide - Smart Travel Advisor with MongoDB Compass

This quick guide will help you set up the Smart Travel Advisor application with MongoDB Compass for database management.

## 🚀 Setup Steps

### 1. Install MongoDB Compass

```bash
# Download from official website
# Visit: https://www.mongodb.com/try/download/compass
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from MongoDB website

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod              # Linux
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string from Atlas dashboard

### 3. Configure Environment

Update `.env` file:
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/smart-travel-advisor

# For MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-travel-advisor?retryWrites=true&w=majority
```

### 4. Test Database Connection

```bash
# Test MongoDB connection
npm run test-db
```

### 5. Seed Database with Sample Data

```bash
# Populate database with destinations
npm run seed
```

### 6. Connect MongoDB Compass

**Local MongoDB Connection:**
1. Open MongoDB Compass
2. Connection String: `mongodb://localhost:27017`
3. Click "Connect"

**Atlas Connection:**
1. Open MongoDB Compass
2. Paste your Atlas connection string
3. Click "Connect"

### 7. Start the Application

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔍 Using MongoDB Compass with Smart Travel Advisor

### Connect to Database
- **Connection String**: Use the same as in your `.env` file
- **Database Name**: `smart-travel-advisor`

### Explore Collections
Once connected, you'll see:
- `destinations` - Travel destinations data
- `users` - User accounts (when implemented)
- `travelpreferences` - User travel preferences
- `savedtrips` - Saved travel plans

### Common Tasks

**View Destinations:**
1. Click on `destinations` collection
2. Browse through travel destinations
3. Filter by climate, budget level, or activities

**Monitor Saved Trips:**
1. Click on `savedtrips` collection
2. View user-saved travel plans
3. Check itinerary data structure

**Test Queries:**
1. Use the query bar to test filters
2. Example: `{ climate: "hot", budgetLevel: "medium" }`
3. Copy working queries to your application

**Performance Analysis:**
1. Click "Explain" to analyze query performance
2. Add indexes for frequently queried fields
3. Monitor real-time operations

## 🛠 Development Workflow

### 1. Database Development
```bash
# Test connection
npm run test-db

# Seed data
npm run seed

# View data in Compass
# Open MongoDB Compass and connect
```

### 2. Application Testing
```bash
# Start application
npm run dev

# Test features:
# 1. Fill out travel preferences form
# 2. View filtered destinations
# 3. Save trips to database
# 4. Check saved trips in Compass
```

### 3. Debugging with Compass
- **Real-time Monitoring**: Watch data changes as you use the app
- **Query Testing**: Build and test queries before implementing
- **Schema Analysis**: Understand data structure and relationships
- **Performance Tuning**: Identify slow queries and optimize

## 📊 Database Schema Overview

### Destinations Collection
```json
{
  "name": "Paris",
  "country": "France", 
  "climate": "moderate",
  "activities": ["Culture", "Food & Dining"],
  "budgetLevel": "high"
}
```

### SavedTrips Collection
```json
{
  "userId": "user123",
  "destinationId": "dest123",
  "title": "Paris Adventure",
  "budget": "high",
  "duration": 7,
  "itinerary": [...]
}
```

## 🔧 Troubleshooting

### Connection Issues
```bash
# Check MongoDB status
mongosh --eval "db.version()"

# Test connection
npm run test-db
```

### Compass Connection Problems
- **Local**: Ensure MongoDB is running on port 27017
- **Atlas**: Whitelist your IP address in Atlas settings
- **Auth**: Verify username and password in connection string

### Data Issues
```bash
# Re-seed database
npm run seed

# Check data in Compass
# Verify collections exist and contain data
```

## 🎯 Next Steps

1. **Explore Data**: Use Compass to browse the seeded destinations
2. **Test Features**: Use the application and watch data changes in real-time
3. **Build Queries**: Test complex queries in Compass before implementation
4. **Monitor Performance**: Use Compass performance tools to optimize queries
5. **Extend Schema**: Add new fields or collections as needed

## 📚 Resources

- [MongoDB Compass Documentation](https://docs.mongodb.com/compass/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Smart Travel Advisor Code](./src/)
- [Database Schema](./src/models/)

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ `npm run test-db` shows successful connection
- ✅ `npm run seed` populates 12 destinations
- ✅ MongoDB Compass connects and shows all collections
- ✅ Application runs at `http://localhost:3000`
- ✅ You can save trips and see them in Compass
- ✅ All queries execute without errors

Happy coding with your Smart Travel Advisor and MongoDB Compass! 🚀