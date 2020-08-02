var mongoose = require('mongoose');

var BookHooks = require('./hooks/book')

//Define a schema
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    author: [{type:String}],
    department: {type: Schema.Types.ObjectId, ref: 'Department'},
    quantity:Number,
    current:Number
},{
  timestamps: true
});

bookSchema.pre('remove',BookHooks.removeBook)

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;