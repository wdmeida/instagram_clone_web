const objectId = require('mongodb').ObjectId;
const fs = require('fs');

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
    const date = new Date();
    const time_stamp = date.getTime();

    const url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;    

    const initial_path = req.files.arquivo.path;
    const end_path = './uploads/' + url_imagem;

    fs.rename(initial_path, end_path, err => {
      if (err) {
        res.status(500).json({error: err});
        return;
      }
    });

    const data = { url_imagem, titulo: req.body.titulo }

    const connection = app.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.insert(data, (err, results) => {
          if (err) {
            res.status(500).json({msg: 'Ocorreu um erro na publicação, por favor tente outra vez!'});
          } else {
            console.log(results);
            res.status(201).json({msg: 'Inclusão realizada com sucesso!'});
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
          { $set : { titulo : req.body.titulo } },
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
