module.exports = (app) => {
  
  app.get('/posts', (req, res) => {
    const connection = app.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.find().toArray((err, results) => {
          if (err) {
            res.json(err);
          } else {
            res.json(results);
          }
        });

        mongoClient.close();
      });
    });
  });

  app.post('/posts', (req, res) => {
    const formData = req.body;

    const connection = app.config.dbConnection();
    connection.open( (err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.insert(formData, (err, results) => {
          if (err) {
            res.json(err);
          } else {
            res.json(results.ops);
          }
        });

        mongoClient.close();
      });
    });
  });
}