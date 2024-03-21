module.exports = {
     client: 'mysql2',
     connection: {
          host: process.env.HOST,
          user: process.env.USER,
          password: process.env.CLIENT_KEY,
          database: process.env.HOST_DB
          
     }
};
