module.exports = function(req,res,next){
    if(!req.session.name){
        res.send('not logged in')
    }
    else{
        next()
    }
}