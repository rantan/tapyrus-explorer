const app = require("./app.js");
require ("./actions/block_detail.js");
require ("./actions/block_list.js");


app.listen(3001, () => console.log('Listening on port 3001!'));