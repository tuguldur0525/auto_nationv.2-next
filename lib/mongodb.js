const uri = `${process.env.MONGODB_URI}`;
const options = {
  appName: 'AutoNation Web App',
  maxPoolSize: 10,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
};

