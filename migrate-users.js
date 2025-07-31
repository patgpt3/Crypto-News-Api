const mongoose = require('mongoose');

// Connect to your database
const MONGOURI = 'mongodb+srv://s13mcdonald:b1Y1oO4TaBwZJ7ua@toptopnetwork.mi1yzgn.mongodb.net/?retryWrites=true&w=majority&appName=toptopNetwork';

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  username: String,
  privyId: String,
  points: Number,
  isFlagged: Number,
  submissions: Array,
  comments: Array,
  upvotedSubmissions: Array,
  jobs: Array,
  replies: Array
});

const User = mongoose.model('User', userSchema);

async function migrateUsers() {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(MONGOURI);
    console.log('✅ Connected to database');

    // Find all users without privyId
    const usersWithoutPrivyId = await User.find({ privyId: { $exists: false } });
    console.log(`📊 Found ${usersWithoutPrivyId.length} users without Privy IDs`);

    if (usersWithoutPrivyId.length === 0) {
      console.log('✅ All users already have Privy IDs');
      return;
    }

    // Generate Privy IDs for users
    for (let i = 0; i < usersWithoutPrivyId.length; i++) {
      const user = usersWithoutPrivyId[i];
      
      // Generate a temporary Privy ID (this is just for migration)
      // In production, users would need to sign up through Privy to get real IDs
      const tempPrivyId = `migrated-user-${user._id}-${Date.now()}`;
      
      // Update user with Privy ID
      await User.findByIdAndUpdate(user._id, { 
        privyId: tempPrivyId 
      });
      
      console.log(`✅ Updated user ${user.username} with Privy ID: ${tempPrivyId}`);
    }

    console.log('🎉 Migration completed successfully!');
    
    // Show final stats
    const totalUsers = await User.countDocuments();
    const usersWithPrivyId = await User.countDocuments({ privyId: { $exists: true } });
    
    console.log(`📊 Final stats:`);
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Users with Privy IDs: ${usersWithPrivyId}`);
    console.log(`   Users without Privy IDs: ${totalUsers - usersWithPrivyId}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run migration
migrateUsers(); 