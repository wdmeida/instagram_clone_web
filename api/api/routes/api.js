const objectId = require('mongodb').ObjectId;
const fs = require('fs');

module.exports = (api) => {
  
  api.get('/posts', (req, res) => {
    const connection = api.config.dbConnection();
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

  api.get('/posts/:id', (req, res) => {
    const connection = api.config.dbConnection();
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

  api.post('/posts', (req, res) => {
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

    const connection = api.config.dbConnection();
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

  api.put('/posts/:id', (req, res) => {
    const connection = api.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.update(
          { _id : objectId(req.params.id) },
          { $push : 
            { comentarios: {
                id_comentario: new objectId(),
                comentario : req.body.comentario
              } 
            } 
          },
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

  api.delete('/posts/:id', (req, res) => {
    const connection = api.config.dbConnection();
    connection.open((err, mongoClient) => {
      mongoClient.collection('posts', (err, collection) => {
        collection.update(
          {},
          {
            $pull: {
              comentarios: {
                id_comentario: objectId(req.params.id)
              }
            }
          },
          { multi: true },
          (err, results) => {
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
