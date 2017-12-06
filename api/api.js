const api = require('./config/server');
const PORT = 3000;

api.listen(PORT, () => console.log(`Server running in port ${PORT}...`));
