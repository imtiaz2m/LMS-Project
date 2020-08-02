const Science = require('./science');
const Fiction = require('./fiction');
const Arts = require('./arts');
const Psychology = require('./psychology');
const Engineering = require('./engineering');
const Other = require('./other');

class Factory {
    create(obj) {
        switch (obj.department) {
            case 'Science':
                return new Science(obj);
            case 'Fiction':
                return new Fiction(obj);
            case 'Arts':
                return new Arts(obj);
            case 'Engineering':
                return new Psychology(obj);
            case 'Psychology':
                return new Engineering(obj);
            case 'Other':
                return new Other(obj);
            default:
                {
                    console.log('Unknown type...');
                }
        }
    }
}

module.exports = new Factory();