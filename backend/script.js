var fs = require('fs');
function readWriteSync() {
let env = process.env.ENV;
if (!process.env.ENV) {
          env = 'dev';  //SETTING DEFAULT ENV AS DEV
}
var data = fs.readFileSync(`./environments/environment.${env}.js`, 'utf-8');
fs.writeFileSync('./environments/environment.js', data, 'utf-8');
}
readWriteSync();