# MongoDB Compass Setup Guide for Smart Travel Advisor

MongoDB Compass is a powerful GUI for MongoDB that allows you to visualize, explore, and manage your data with an intuitive interface. This guide will help you connect Compass to your Smart Travel Advisor database.

## What is MongoDB Compass?

MongoDB Compass is the official GUI for MongoDB that provides:
- Visual schema exploration
- Query building and execution
- Real-time performance monitoring
- Data visualization and manipulation
- Index management
- Aggregation pipeline builder

## Installation

### Download MongoDB Compass
1. Go to [MongoDB Compass Download Page](https://www.mongodb.com/try/download/compass)
2. Select your operating system (Windows, macOS, or Linux)
3. Download and install the application

### System Requirements
- **Windows**: Windows 8.1 or later
- **macOS**: macOS 10.13 or later
- **Linux**: Ubuntu 18.04+, RHEL 8+, Debian 10+

## Connecting to Your Database

### Option 1: Local MongoDB Connection

1. **Open MongoDB Compass**
2. **Fill in the connection details**:
   ```
   Host: localhost
   Port: 27017
   Authentication: None (for local development)
   ```

3. **Connection String**:
   ```
   mongodb://localhost:27017
   ```

4. **Click "Connect"**

### Option 2: MongoDB Atlas Connection

1. **Open MongoDB Compass**
2. **Choose "I have MongoDB Atlas"**
3. **Paste your Atlas connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/smart-travel-advisor?retryWrites=true&w=majority
   ```
4. **Click "Connect"**

### Option 3: Using SRV Connection String

If you're using Atlas, you can also connect using the SRV address:

1. **Copy connection string from Atlas**
2. **In Compass**:
   - Click "New Connection"
   - Choose "Connection String"
   - Paste your Atlas connection string
   - Click "Connect"

## Navigating the Smart Travel Advisor Database

Once connected, you'll see the `smart-travel-advisor` database with the following collections:

### 1. Destinations Collection
- **Purpose**: Stores all travel destinations
- **Key Fields**: name, country, climate, activities, budgetLevel
- **Sample Document**:
  ```json
  {
    "_id": ObjectId("..."),
    "name": "Paris",
    "country": "France",
    "city": "Paris",
    "climate": "moderate",
    "activities": ["Culture", "Food & Dining", "Historical Sites"],
    "budgetLevel": "high",
    "latitude": 48.8566,
    "longitude": 2.3522
  }
  ```

### 2. Users Collection
- **Purpose**: Stores user account information
- **Key Fields**: email, name, image
- **Sample Document**:
  ```json
  {
    "_id": ObjectId("..."),
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://example.com/avatar.jpg"
  }
  ```

### 3. TravelPreferences Collection
- **Purpose**: Stores user travel preferences
- **Key Fields**: userId, budget, duration, climate, activities
- **Sample Document**:
  ```json
  {
    "_id": ObjectId("..."),
    "userId": ObjectId("..."),
    "budget": "medium",
    "duration": 7,
    "climate": "moderate",
    "activities": ["Culture", "Adventure", "Food & Dining"]
  }
  ```

### 4. SavedTrips Collection
- **Purpose**: Stores user-saved travel plans
- **Key Fields**: userId, destinationId, title, itinerary
- **Sample Document**:
  ```json
  {
    "_id": ObjectId("..."),
    "userId": ObjectId("..."),
    "destinationId": ObjectId("..."),
    "title": "Paris Adventure",
    "budget": "high",
    "duration": 7,
    "climate": "moderate",
    "activities": ["Culture", "Food & Dining"],
    "itinerary": [
      {
        "day": 1,
        "activities": ["Morning: Explore Paris's culture", "Afternoon: Visit local attractions"]
      }
    ]
  }
  ```

## Common Tasks in MongoDB Compass

### 1. Viewing and Exploring Data

**Browse Documents**:
- Click on a collection name
- Use the pagination to navigate through documents
- Switch between List, JSON, and Table views

**Filter Documents**:
- Use the filter bar to query documents
- Example: `{ climate: "hot", budgetLevel: "medium" }`
- Click "Apply" to see filtered results

### 2. Building Queries

**Simple Query**:
```json
{ climate: "moderate" }
```

**Complex Query**:
```json
{ 
  climate: "moderate",
  activities: { $in: ["Culture", "Adventure"] },
  budgetLevel: { $in: ["medium", "high"] }
}
```

**Using Query Builder**:
1. Click the "Query" button
2. Add filters using the visual interface
3. Compass will generate the MongoDB query automatically

### 3. Creating Indexes

**Create Single Field Index**:
1. Select the collection
2. Go to the "Indexes" tab
3. Click "Create Index"
4. Enter field name (e.g., `climate`)
5. Click "Create"

**Create Compound Index**:
1. In the "Indexes" tab, click "Create Index"
2. Add multiple fields (e.g., `climate` and `budgetLevel`)
3. Set the order for each field
4. Click "Create"

**Recommended Indexes for Smart Travel Advisor**:
```json
// For destinations collection
{ climate: 1 }
{ budgetLevel: 1 }
{ activities: 1 }
{ climate: 1, budgetLevel: 1 }

// For savedtrips collection
{ userId: 1 }
{ destinationId: 1 }
{ userId: 1, createdAt: -1 }
```

### 4. Data Manipulation

**Insert New Document**:
1. Select the collection
2. Click "Insert Document"
3. Enter the document data in JSON format
4. Click "Insert"

**Update Document**:
1. Find the document you want to update
2. Click the edit icon (pencil)
3. Modify the fields
4. Click "Update"

**Delete Document**:
1. Find the document you want to delete
2. Click the delete icon (trash can)
3. Confirm the deletion

### 5. Schema Analysis

**View Schema**:
1. Select the collection
2. Go to the "Schema" tab
3. View field types, frequencies, and relationships

**Analyze Data Patterns**:
- Use the schema analysis to understand data distribution
- Identify missing fields or data inconsistencies
- Optimize your data model based on usage patterns

### 6. Aggregation Pipeline

**Build Aggregation**:
1. Select the collection
2. Go to the "Aggregations" tab
3. Add stages using the visual builder
4. Preview results at each stage

**Example Aggregation - Count Destinations by Climate**:
```json
[
  {
    $group: {
      _id: "$climate",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
]
```

## Performance Monitoring

### 1. Real-time Performance

**View Performance Metrics**:
- Connect to your database
- Click on the "Performance" tab
- View real-time operation statistics
- Monitor query performance

### 2. Explain Plans

**Analyze Query Performance**:
1. Write or select a query
2. Click "Explain"
3. Review the execution plan
4. Look for:
   - Number of documents examined
   - Index usage
   - Execution time

### 3. Slow Query Detection

**Identify Slow Queries**:
- Use the Performance tab to identify slow operations
- Look for queries with high execution time
- Optimize by adding appropriate indexes

## Import/Export Data

### 1. Export Data

**Export Collection**:
1. Select the collection
2. Click "Export Collection"
3. Choose format (JSON or CSV)
4. Select fields to export
5. Click "Export"

### 2. Import Data

**Import Destinations**:
1. Select the destinations collection
2. Click "Import Collection"
3. Choose the JSON file
4. Configure import options
5. Click "Import"

## Security Best Practices

### 1. Connection Security

**Use SSL/TLS**:
- Enable SSL in connection settings
- Use `mongodb+srv://` protocol for Atlas connections
- Verify SSL certificate

**Authentication**:
- Always use username/password authentication for production
- Store credentials securely
- Use environment variables

### 2. Data Security

**Sensitive Data**:
- Avoid storing sensitive information in documents
- Use encryption for sensitive fields
- Implement proper access controls

**Network Security**:
- Use VPN for remote connections
- Whitelist IP addresses for Atlas access
- Enable network encryption

## Troubleshooting Common Issues

### 1. Connection Issues

**Connection Timeout**:
- Check if MongoDB is running
- Verify the connection string
- Check network connectivity
- Ensure firewall allows MongoDB port (27017)

**Authentication Failed**:
- Verify username and password
- Check authentication database
- Ensure user has proper permissions

### 2. Performance Issues

**Slow Queries**:
- Use Explain to analyze query performance
- Add appropriate indexes
- Optimize query structure
- Consider data modeling improvements

**High Memory Usage**:
- Monitor connection pool size
- Optimize query patterns
- Consider read preferences for large datasets

### 3. Data Issues

**Invalid Documents**:
- Use schema validation
- Check for missing required fields
- Validate data types
- Use Compass schema analysis

**Duplicate Data**:
- Create unique indexes
- Use aggregation to find duplicates
- Implement data cleanup procedures

## Tips for Smart Travel Advisor Development

### 1. Development Workflow

**Seed Database**:
```bash
npm run seed
```
Then verify data in Compass:
1. Connect to your database
2. Check the destinations collection
3. Verify all 12 destinations are present

**Test Queries**:
- Build queries in Compass first
- Test with different filter combinations
- Verify results match expectations
- Copy working queries to your application

### 2. Debugging

**Check Data Structure**:
- Use Compass to verify document structure
- Compare with expected schema
- Identify missing or incorrect fields

**Monitor Operations**:
- Watch real-time operations while testing the app
- Identify slow or inefficient queries
- Optimize based on performance metrics

### 3. Data Management

**Backup Before Changes**:
- Export collections before major updates
- Keep backup of seed data
- Document data structure changes

**Version Control for Data**:
- Store seed data in version control
- Document schema changes
- Use migration scripts for schema updates

## Integration with Application Development

### 1. Query Development

**Test in Compass First**:
1. Build and test queries in Compass
2. Verify results and performance
3. Copy queries to application code
4. Test in application context

**Optimize Queries**:
- Use Compass Explain to analyze performance
- Add indexes based on query patterns
- Monitor query performance in production

### 2. Schema Evolution

**Schema Validation**:
- Use Compass schema analysis
- Identify data patterns and inconsistencies
- Implement schema validation rules
- Plan schema evolution strategy

**Data Migration**:
- Test migration scripts in Compass
- Verify data integrity after migration
- Rollback procedures for failed migrations

## Resources

- [MongoDB Compass Documentation](https://docs.mongodb.com/compass/)
- [MongoDB University Courses](https://university.mongodb.com/)
- [MongoDB Community Forums](https://community.mongodb.com/)
- [Smart Travel Advisor Code Repository](https://github.com/your-repo/smart-travel-advisor)

By following this guide, you'll be able to effectively use MongoDB Compass to manage and monitor your Smart Travel Advisor database, making development and debugging much easier!