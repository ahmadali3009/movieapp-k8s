let mongoose = require('mongoose');
async function connect (url)
{
    try {
        await mongoose.connect(url);
        console.log('connected to database');
    } catch (error) {
        console.log(error);
    }
}
module.exports = connect;