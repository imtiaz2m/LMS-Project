const BookModel = require('../models/book');
const DepartmentModel = require('../models/depertment');
const IssuesModel = require('../models/issue');


class Default {
    constructor(obj) {
        this.department = obj.department
    }
    createSetter(obj) {
        this.title = obj.title
        this.author = obj.author
        this.quantity = obj.quantity
    }

    async createEntry() {
        console.log('this.department: ', this.department);
        let department = await DepartmentModel.findOne({ name: this.department })
        console.log('department: ', department);

        let book = await BookModel.create({
            title: this.title,
            author: this.author,
            department: department._id,
            quantity: this.quantity,
            current: this.quantity
        })

        if (book) {
            console.log('book: ', book);
            return book;
        }
        else
            return false;

    }

    async updatePage(bookID) {
        let book = await BookModel.findById(bookID).populate('department')
        let departments = await DepartmentModel.find({})

        let obj = {
            book,
            departments
        }
        return obj
    }

    async updater(updateobj) {
        let book = await BookModel.findById(updateobj.bookID)
        let department = await DepartmentModel.findOne({ name: updateobj.department })
        let issue = await IssuesModel.find({ book_id: updateobj.bookID })
        if (issue.length <= updateobj.quantity){
            if (book) {
                if (updateobj.department)
                book.quantity = updateobj.quantity
                book.current = updateobj.quantity - issue.length
                book.title = updateobj.title
                book.author = updateobj.author
                book.department = department._id
                book.save()
                return true
            }
            else {
                return false
            }
        }
        else{
            return false
        }
    }


}

module.exports = Default;