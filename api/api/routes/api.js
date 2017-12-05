const objectId = require('mongodb').ObjectId;

module.exports = (app) => {
  
  app.get('/posts', (req, res) => {
    const connection = app.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.find().toArray((err, results) => {
          if (err) {
            res.status(500).json(err);
          } else {
            let status = (results.length > 0) ? 200 : 204;
            res.status(status).json(results);
          }
        });
      });

      mongoClient.close();
    });
  });

  app.get('/posts/:id', (req, res) => {
    const connection = app.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.find(objectId(req.params.id)).toArray((err, results) => {
          if (err) {
            res.status(500).json(err);
          } else {
            let status = (results.length > 0) ? 200 : 204;
            res.status(status).json(results);
          }
        });
      });

      mongoClient.close();
    });
  });

  app.post('/posts', (req, res) => {
    const formData = req.body;

    const connection = app.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.insert(formData, (err, results) => {
          if (err) {
            res.status(500).json(err);
          } else {
            let status = (results.length > 0) ? 201 : 400;
            res.status(status).json(results);
          }
        });
      });

      mongoClient.close();
    });
  });

  app.put('/posts/:id', (req, res) => {
    const connection = app.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.update(
          { _id : objectId(req.params.id) },
          { $set : { title : req.body.title } },
          {},
          (err, results) => {
            if (err) {
              res.status(500).json(err);
            } else {
              res.status(200).json(results);
            }
          }
        );
      });
  
      mongoClient.close();
    });
  });

  app.delete('/posts/:id', (req, res) => {
    const connection = app.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.remove({ _id : objectId(req.params.id)}, (err, results) => {
            if (err) {
              res.status(500).json(err);
            } else {
              let status = (results.length > 0) ? 200 : 204;
              res.status(status).json(results);
            }
          }
        );
      });
  
      mongoClient.close();
    });
  });

}
