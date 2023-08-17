const express = require('express');
const { ApolloServer } = require('apollo-server-express'); // Import Apollo Server
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./schemas'); // Import your typeDefs and resolvers

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

// Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs, // Pass in your typeDefs
  resolvers, // Pass in your resolvers
});

// Apply Apollo Server as middleware to Express
server.start().then(() => {
  server.applyMiddleware({ app });
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
