// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MongoClient, ServerApiVersion } = require('mongodb');

// Database connection strings
const OLD_DB_URI = 'mongodb+srv://s13mcdonald:b1Y1oO4TaBwZJ7ua@toptopnetwork.mi1yzgn.mongodb.net/?retryWrites=true&w=majority&appName=toptopNetwork';
const NEW_DB_URI = 'mongodb+srv://pm:eqfDUcNdlYTyN2sr@cluster0.ki6hxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create MongoClient objects
const oldClient = new MongoClient(OLD_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const newClient = new MongoClient(NEW_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function migrateData() {
  try {
    console.log('🔗 Connecting to old database...');
    await oldClient.connect();
    
    console.log('🔗 Connecting to new database...');
    await newClient.connect();
    
    const oldDb = oldClient.db();
    const newDb = newClient.db();
    
    console.log('📋 Getting list of collections from old database...');
    const collections = await oldDb.listCollections().toArray();
    
    console.log(`Found ${collections.length} collections to migrate:`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    let totalDocuments = 0;
    
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\n🔄 Migrating collection: ${collectionName}`);
      
      // Get all documents from old collection
      const documents = await oldDb.collection(collectionName).find({}).toArray();
      console.log(`  Found ${documents.length} documents`);
      
      if (documents.length > 0) {
        // Insert documents into new collection
        const result = await newDb.collection(collectionName).insertMany(documents);
        console.log(`  ✅ Successfully migrated ${result.insertedCount} documents`);
        totalDocuments += result.insertedCount;
      } else {
        console.log(`  ⚠️  No documents to migrate`);
      }
    }
    
    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`📊 Total documents migrated: ${totalDocuments}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Ensures that the clients will close when you finish/error
    await oldClient.close();
    console.log('🔌 Closed connection to old database');
    await newClient.close();
    console.log('🔌 Closed connection to new database');
  }
}

// Run the migration
migrateData().catch(console.dir);
