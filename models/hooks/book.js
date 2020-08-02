var IssueModel = require('../issue')

exports.removeBook = async function () {
    let bookID = this._id
    console.log('bookID TO REMOVE: ', bookID);
    
    IssueModel.find({ book_id: bookID }).then((issues) => {
        console.log('issues: ', issues);
        issues.forEach(doc => doc.remove())
    })


}