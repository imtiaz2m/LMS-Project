var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var departmentSchema = new Schema({
    name: String,
    info: String
});

var Department = mongoose.model('Department', departmentSchema);

module.exports = Department;