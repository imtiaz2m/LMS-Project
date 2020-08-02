var BookModel = require('../models/book')
var IssueModel = require('../models/issue')
var DepartmentModel = require('../models/depertment')
var AdminModel = require('../models/admin')
const moment = require('moment-timezone');

var AdminModel = require('../models/admin');
const Factory = require('../classes/factory');

exports.index = function (req, res, next) {
    console.log("rendering index");
    res.render('home');
}

exports.profileGet = async function (req, res, next) {
    let admin = await AdminModel.findById(req.session._id);

    console.log('admin: ', admin);
    res.render('profile', { admin });
}

exports.profilePost = async function (req, res, next) {
    const { firstname, lastname, email, password } = req.body;

    let admin = await AdminModel.findById(req.session._id);

    admin.email = email.toLowerCase()
    admin.password = password
    admin.firstname = firstname
    admin.lastname = lastname

    admin.save()
    console.log('admin: ', admin);

    res.json({
        status: 'success',
        msg: 'Admin updated',
        data: null
    });
}

exports.manageAdminGet = async function (req, res, next) {
    let docs = await AdminModel.find({ superuser: false });
    console.log('docs: ', docs);
    res.render('manageAdmins', { docs });
}

exports.manageAdminPost = async function (req, res, next) {
    const { firstname, lastname, email, password } = req.body;

    // create admin
    let admin = await AdminModel.create({ firstname, lastname, email, password, superuser: false });
    let obj = {
        type: 'admin', firstname, lastname, email, password, superuser: false
    }
    const Admin = Factory.create(obj);
    console.log('Admin: ', Admin);
    let adminNew = Admin.createEntry()

    if (admin)
        return res.json({
            status: 'success',
            msg: 'Successfully created admin',
            data: adminNew
        });

    return res.json({
        status: 'error',
        msg: 'Failed to created admin',
        data: null
    });
}

exports.postDeleteAdmin = async function (req, res, next) {
    const { admin_id } = req.body;
    let admin = await AdminModel.findById(admin_id);

    admin.remove();

    res.json({
        status: 'success',
        msg: 'Successfully deleted admin',
        data: admin
    });
}


exports.getAddBooks = async function (req, res) {
    var departments = await DepartmentModel.find({})
    res.render('addBooks', { departments });
}

exports.postAddBooks = async function (req, res) {
    author = []
    var { title, author, department, quantity } = req.body

    let obj = {
        department: department
    }
    const Book = Factory.create(obj);

    obj.title = title
    obj.author = author
    obj.quantity = quantity

    Book.createSetter(obj)
    console.log('Book: ', Book);
    let book = Book.createEntry()

    if (book) {
        res.json({
            status: 'success',
            msg: 'Successfully Added Books',
            data: book
        });
    }
    else {
        res.json({
            status: 'error',
            msg: 'There was an issue try again',
        });
    }
}


exports.getViewBooks = async function (req, res) {
    var docs = await BookModel.find({}).populate('department')

    res.render('viewBooks', { docs });
}

exports.getUpdateBooks = async function (req, res) {
    var docs = await BookModel.find({}).populate('department')

    res.render('updateBooks', { docs });
}

exports.getUpdatePage = async function (req, res) {
    let departmentName = req.params.departmentName
    let bookID = req.params.bookID
    console.log('bookID: ', bookID);


    let obj = {
        department: departmentName
    }

    var Book = Factory.create(obj);

    let updateObj = await Book.updatePage(bookID)
    console.log('updateObj: ', updateObj);
    let newbook = updateObj.book
    let departments = updateObj.departments

    res.render('updatePage', { book: newbook, departments });
}

exports.updateBook = async function (req, res) {
    let { bookID, quantity, title, author, department } = req.body
    console.log('department: ', department);


    let obj = {
        department: department
    }
    var Book = Factory.create(obj);

    let updateobj = {
        bookID, quantity, title, author, department
    }

    let status = await Book.updater(updateobj)

    if (status) {
        res.json({
            status: 'success',
            msg: 'Successfully Updated',
        });
    }
    else {
        res.json({
            status: 'failed',
            msg: 'Book does not exist',
        });
    }


}


exports.issueBook = async function (req, res) {
    var { bookID, name, phone_no, roll_no } = req.body
    console.log('bookID: ', bookID);
    let book = await BookModel.findOne({ _id: bookID })
    console.log('book: ', book);
    if (book) {
        console.log('book.current: ', book.current);
        if (book.current > 0) {
            book.current = book.current - 1;
            let current = book.current
            book.save()
            today = moment().format('YYYY-MM-DD')
            returnDate = moment(today).add('days', 7).format('YYYY-MM-DD')
            IssueModel.create({
                'name': name,
                'roll_no': roll_no,
                'phone_number': phone_no,
                'book_id': bookID,
                'issueDate': today,
                'returnDate': returnDate
            })
            res.json({
                status: 'success',
                msg: 'Successfully Issued',
                current: current
            });
        }
        else {
            res.json({
                status: 'failed',
                msg: 'No books left',
            });
        }
    }
}


exports.returnBook = async function (req, res) {
    var issues = await IssueModel.find({}).populate({
        path: 'book_id',
        model: 'Book',
        populate: {
            path: 'department',
            model: 'Department'
        }
    })

    res.render('returnBook', { issues });
}

exports.returnBookPost = async function (req, res) {
    var issueID = req.body.issueID
    console.log('issueID: ', issueID);

    let issue = await IssueModel.findOne({ _id: issueID }).populate('book_id')
    console.log('issue: ', issue);
    if (issue) {
        console.log('book.current: ', issue.book_id.current);
        if (issue.book_id.current < issue.book_id.quantity) {
            issue.book_id.current = issue.book_id.current + 1;
            let current = issue.book_id.current
            issue.book_id.save()
            issue.remove()
            res.json({
                status: 'success',
                msg: 'Successfully Issued',
                current: current
            });
        }
        else {
            res.json({
                status: 'failed',
                msg: 'No Book Issued',
            });
        }
    }
}

exports.removeBookGet = async function (req, res) {
    let books = await BookModel.find({}).populate('department')

    res.render('removeBook', { docs: books });
}


exports.removeBookPost = async function (req, res) {
    let bookID = req.body.bookID

    console.log('bookID: ', bookID);
    let book = await BookModel.findOne({ _id: bookID })
    console.log('book: ', book);

    if (book) {
        book.remove()
        res.json({
            status: 'success',
            msg: 'Successfully Deleted',
        });
    }
    else {
        res.json({
            status: 'failed',
            msg: 'Book does not exist',
        });
    }
}