 /**Request handlers */

//Dependencies
const { type } = require('os');
let _data = require('./data');
let helpers = require('./helpers');

//Define the handlers
let handlers = {};

handlers.users = function(data, callback){
    let acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._users[data.method](data, callback);
    }else{
        callback(405);
    }
};

//Container for the users submethods
handlers._users = {};

//Users - post
handlers._users.post = function(data, callback){
    //Check that all required fields are filled out
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0  ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0  ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10  ? data.payload.phone.trim() : false;
    let passw = typeof(data.payload.passw) == 'string' && data.payload.passw.trim().length > 0  ? data.payload.passw.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true  ? true  : false;

    console.log(firstName);
    console.log(lastName);
    console.log(phone);
    console.log(passw);
    console.log(tosAgreement);


    if(firstName && lastName && phone && passw && tosAgreement){
        //Make sure that the user does not already exists
        _data.read('users', phone, function(err,data){
            if(err){
                //Create a new user object
                //Hash the password
                let hashedPassword = helpers.hash(passw);

                if(hashedPassword){
                    //Create the user object
                    let userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true
                    };

                    //Persist or store the user
                    _data.create('users',phone, userObject, function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500, {'Error':'Could not create the new user'});
                        }
                    });

                }else{
                    callback(500, {'Error':'Could not hash the user\'s password'});
                }               
            }else{  
                //The user already exists
                callback(400, {'Error':'That phone number already exists'});
            }
        });
    }else{
        callback(400, {'Error':'Missing required fields'});
    }

};

//Users - get
//Required data: phone - Optional data: None
//@TODO only let an authenticated user access their object. Don't let them access anyone elses
handlers._users.get = function(data, callback){
    //Check that the phone number provided is valid
    let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        //Lookup the user
        _data.read('users',phone,function(err,data){
            if(!err && data){
                //Remove the hased passw from the user object before returning it to the request
                delete data.hashedPassword;
                callback(200, data);
            }else{
                callback(404);
            }
        })
    }else{
        callback(400, {'Error':'Missing the phone number which is a required field'});
    }
};

//Users - put
//Required data: phone - Optional data: fn, ln, passw (at least one must be specfied)
//@TODO only let auth users update their own object. No one else may do that.
handlers._users.put = function(data, callback){ 
    //Check for the required field
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    //Check for the optional fields
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0  ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0  ? data.payload.lastName.trim() : false;
    let passw = typeof(data.payload.passw) == 'string' && data.payload.passw.trim().length > 0  ? data.payload.passw.trim() : false;

    //Error if the phone is invalid
    if(phone){
        if(firstName || lastName || passw){
            //Lookup the user
            _data.read('users', phone, function(err,userData){
                if(!err && userData){
                    //Update the corresponding fields
                    if(firstName){
                        userData.firstName = firstName;
                    }
                    if(lastName){
                        userData.lastName = lastName;
                    }
                    if(passw){
                        userData.hashedPassword = helpers.hash(passw);
                    }
                    //Store or persist the last updates
                    _data.update('users',phone,userData,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500, {'Error':'Could not update the user'});
                        }
                    })
                }else{
                    callback(400, {'Error':'The specfied user does not exist'});
                }
            });
        }else{
            callback(400, {'Error':'Missing fields to update'});
        }

    }else{
        callback(400, {'Error':'Missing required field'});
    }


};

//Users - delete
//Required: phone
//@TODO only let an authenticated user delete their object. Nobody else may do that. Delete any file associated with the deleted user.
handlers._users.delete = function(data, callback){
    //Check that the phone number is valid
    let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        //Lookup the user
        _data.read('users',phone,function(err,data){
            if(!err && data){
                _data.delete('users',phone,function(err){
                    if(!err){
                        callback(200);
                    }else{
                        callback(500, {'Error':'Could not delete the user'});
                    }
                });
            }else{
                callback(400, {'Error':'Could not find the user'});
            }
        })
    }else{
        callback(400, {'Error':'Missing the phone number which is a required field'});
    }
};


//Ping handler
handlers.ping = function(data,callback){
    callback(200);
};

//Not found a handler
handlers.notFound = function(data, callback){
    callback(404)
};

//Export the module
module.exports = handlers