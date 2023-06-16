

module.exports = myFunc => (req, res, next) => {
    // using this insipite of using try catch on each of the request
    // Promise.resolve(myFunc(req, res, next)).catch(res.json({message:'some error occured'}));

    //  catch(next) will call next middle ware i.e error handler with error occured and staus code of 500(default )
    // also the err.message is given due to validator on schema
    Promise.resolve(myFunc(req, res, next)).catch(next);
}