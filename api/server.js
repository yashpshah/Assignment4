/* eslint linebreak-style: ["error","windows"] */
const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.DB_URL || 'mongodb+srv://yashpshah:yash9997@cluster0-tnmog.mongodb.net/Inventory_Management?retryWrites=true&w=majority';
let db;

async function productList() {
  const productDB = await db.collection('products').find({}).toArray();
  return productDB;
}


async function getNextProduct(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productAdd(_, { product }) {
  const newProduct = product;
  newProduct.id = await getNextProduct('products');
  const result = await db.collection('products').insertOne(product);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    productAdd,
  },
};

async function DbConnection() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer(
  {
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
    resolvers,
  },
);

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.API_SERVER_PORT || 3000;
(async () => {
  try {
    await DbConnection();
    app.listen(port, () => {
      console.log(`API Server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();