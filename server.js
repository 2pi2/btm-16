/* eslint no-console: 0 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;

const CONTACTS_COLLECTION = 'contacts';

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Create a database variable outside of the database
// connection callback to reuse the connection pool in your app.
let db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log('Database connection ready');

  // Initialize the app.
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log('App now running on port', port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({error: message});
}

/*  '/contacts'
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get('/contacts', (req, res) => {
  db.collection(CONTACTS_COLLECTION).find({}).toArray((err, docs) => {
    if (err)
      handleError(res, err.message, 'Failed to get contacts.');
    else
      res.status(200).json(docs);
  });
});

app.post('/contacts', (req, res) => {
  const newContact = req.body;
  newContact.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName))
    handleError(res, 'Invalid user input', 'Must provide a first or last name.', 400);

  db.collection(CONTACTS_COLLECTION).insertOne(newContact, (err, doc) => {
    if (err)
      handleError(res, err.message, 'Failed to create new contact.');
    else
      res.status(201).json(doc.ops[0]);
  });
});

/*  '/contacts/:id'
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get('/contacts/:id', (req, res) => {
  db.collection(CONTACTS_COLLECTION)
    .findOne({_id: new ObjectID(req.params.id)}, (err, doc) => {
      if (err)
        handleError(res, err.message, 'Failed to get contact');
      else
        res.status(200).json(doc);
    });
});

app.put('/contacts/:id', (req, res) => {
  const updateDoc = req.body;
  delete updateDoc._id;

  db.collection(CONTACTS_COLLECTION)
    .updateOne({_id: new ObjectID(req.params.id)}, updateDoc, (err) => {
      if (err)
        handleError(res, err.message, 'Failed to update contact');
      else
        res.status(204).end();
    });
});

app.delete('/contacts/:id', (req, res) => {
  db.collection(CONTACTS_COLLECTION)
    .deleteOne({_id: new ObjectID(req.params.id)}, (err) => {
      if (err)
        handleError(res, err.message, 'Failed to delete contact');
      else
        res.status(204).end();
    });
});
