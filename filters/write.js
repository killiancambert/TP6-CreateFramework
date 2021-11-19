const fs = require('fs')
module.exports = (input,path) => {
    try {
        fs.writeFileSync(path, input);
    } catch (err) {
        console.error(err)
    }
}