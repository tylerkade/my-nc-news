const app = require("./app.js");
const { PORT = 8000 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
