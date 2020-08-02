var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var adminSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  superuser: Boolean,
}, {
  timestamps: true
});

var Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

Admin.find({}).then(function (docs) {
  if (docs.length === 0) {
    Admin.create({ firstname: 'first', lastname: 'last', email: 'admin@email.com', password: '12345', superuser:true });
  }
});