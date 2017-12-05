const app = require('./config/server');
const PORT = 3000;

app.listen(PORT, () => console.log(`Server running in port ${PORT}...`));
