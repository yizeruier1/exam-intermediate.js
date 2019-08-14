const path = require('path');

module.exports = {
    entry: './exam.js',
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'index.js'
    }
}