const fs = require('fs');

module.exports = (api) => {
  api.get('/imagens/:imagem', (req, res) => {
    
    const img = req.params.imagem;

    fs.readFile('./uploads/' + img, (err, contentFile) => {
      if (err) {
        res.status(400).json({error: err});
        return;
      }

      res.writeHead(200, { 'Content-Type' : 'image/jpg' });
      res.end(contentFile);
    });
  });
}