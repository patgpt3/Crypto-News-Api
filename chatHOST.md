To host a NestJS API with a MongoDB database on Heroku, follow these steps:

### Prerequisites:
1. **NestJS API**: Ensure your NestJS project is set up and working locally.
2. **MongoDB Database**: You can use a cloud-based MongoDB provider like **MongoDB Atlas** or an external MongoDB service.
3. **Heroku Account**: You’ll need an account with Heroku.

### Steps to Deploy the NestJS API:

#### 1. **Prepare your NestJS Application:**

- **Create a `Procfile`**:
   Heroku needs a `Procfile` to know how to start your app. In the root of your project, create a file named `Procfile` and add the following line:
   ```
   web: npm run start:prod
   ```

- **Set up Environment Variables**:
   You'll need to configure your app to use environment variables for the MongoDB URI and any other sensitive information. In your `app.module.ts` or wherever the MongoDB connection is set up, make sure it reads from environment variables like this:
   ```typescript
   MongooseModule.forRoot(process.env.MONGO_URI)
   ```

- **Install Required Packages**:
   If you're using MongoDB with NestJS, make sure you have installed the required packages:
   ```bash
   npm install @nestjs/mongoose mongoose
   ```

#### 2. **Create a MongoDB Database (Using MongoDB Atlas):**

   1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   2. Sign up (if you haven’t) and create a new cluster.
   3. Once the cluster is ready, click on **Connect** and then follow the instructions to allow IP addresses and get the connection string. 
   4. Replace `<username>` and `<password>` in the connection string with your MongoDB credentials.

#### 3. **Deploy to Heroku:**

   - **Login to Heroku**:
     If you haven’t already, log into Heroku through the CLI:
     ```bash
     heroku login
     ```

   - **Create a Heroku App**:
     In your project folder, run:
     ```bash
     heroku create your-app-name
     ```

   - **Set Environment Variables**:
     You need to set your MongoDB connection string (and other env variables) in Heroku:
     ```bash
     heroku config:set URIMONGO_="your-mongodb-connection-string"
     ```

   - **Push Code to Heroku**:
     Initialize a Git repository if you haven’t done so:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     ```

     Push the code to Heroku:
     ```bash
     git push heroku master
     ```

   - **Build and Run the App**:
     Once the code is pushed, Heroku will automatically detect your Node.js app and install the necessary dependencies. After the build is complete, the app will be hosted and accessible via the Heroku URL provided.

#### 4. **Testing and Scaling:**

   - After the deployment, visit your Heroku app URL to ensure it’s running properly.
   - Heroku provides free and paid dyno tiers. If your app grows in scale, consider upgrading to a paid plan for better performance.

#### 5. **Optional: Add-ons**:
   Heroku offers some MongoDB add-ons like **mLab** (now part of MongoDB Atlas). Instead of using MongoDB Atlas separately, you can add it via the Heroku dashboard or CLI:
   ```bash
   heroku addons:create mongolab
   ```

This approach will allow you to host your NestJS API with a MongoDB database on Heroku successfully.