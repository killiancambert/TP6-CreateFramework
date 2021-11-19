const fs = require('fs')

module.exports = (input) => {return fs.readFileSync(input, 'utf8');}