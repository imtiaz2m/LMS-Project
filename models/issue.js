var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var issueSchema = new Schema({
    name: String,
    roll_no: Number,
    phone_number:Number,
    book_id: {type: Schema.Types.ObjectId, ref: 'Book'},
    issueDate:String,
    returnDate:String
},{
  timestamps: true
});

var Issue = mongoose.model('issue', issueSchema);

module.exports = Issue;
