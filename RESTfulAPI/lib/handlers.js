 /**Request handlers */

//Dependencies
let _data = require('./data');
let helpers = require('./helpers');
let config = require('./config');

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
        //Get the token from the headers
        let token = typeof(data.headers.token)=='string' ? data.headers.token : false;
        //Verify that the given token from the headers is valid for the phone number
        handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
            if(tokenIsValid){
                //Lookup the user
                _data.read('users',phone,function(err,data){
                    if(!err && data){
                        //Remove the hased passw from the user object before returning it to the request
                        delete data.hashedPassword;
                        callback(200, data);
                    }else{
                        callback(404);
                    }
                });
            }else{
                callback(403,{'Error':'Missing required token in header or the token is invalid'});
            };
        });
    }else{
        callback(400, {'Error':'Missing a required field'});
    };
};

//Users - put
//Required data: phone - Optional data: fn, ln, passw (at least one must be specfied)
handlers._users.put = function(data, callback){ 
    //Check for the required field
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    //Check for the optional fields
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0  ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0  ? data.payload.lastName.trim() : false;
    let passw = typeof(data.payload.passw) == 'string' && data.payload.passw.trim().length > 0  ? data.payload.passw.trim() : false;

    if(phone){
        //Error if the phone is invalid
        if(firstName || lastName || passw){
            //Get the token from the headers
            let token = typeof(data.headers.token)=='string' ? data.headers.token : false;
            handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
                if(tokenIsValid){
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
                            });
                        }else{
                            callback(400, {'Error':'The specfied user does not exist'});
                        }
                    });
                }else{
                    callback(403,{'Error':'Missing required token in header or the token is invalid'});
                };
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
handlers._users.delete = function(data, callback){
    //Check that the phone number is valid
    let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        //Get the token from the headers
        let token = typeof(data.headers.token)=='string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
            if(tokenIsValid){
                //Lookup the user
                _data.read('users',phone,function(err,userData){
                    if(!err && userData){
                        _data.delete('users',phone,function(err){
                            if(!err){
                                //callback(200);
                                //Delete each of the checks associated with the user
                                let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                let checksToDelete = userChecks.length;
                                if(checksToDelete > 0){
                                    let checksDeleted = 0;
                                    let deletionErrors = false;
                                    //Look through the checks
                                    userChecks.forEach(function(checkId){
                                        //Delete the check
                                        _data.delete('checks',checkId,function(err){
                                            if(err){
                                                deletionErrors = true;
                                            }
                                            checksDeleted++;
                                            if(checksDeleted===checksToDelete){
                                                if(!deletionErrors){
                                                    callback(200);
                                                }else{
                                                    callback(500,{'Error':'Something went wrong while attempting to delete all the users check'})
                                                }
                                            }
                                        });
                                    });
                                }else{  
                                    callback(200);
                                }

                            }else{
                                callback(500, {'Error':'Could not delete the user'});
                            }
                        });
                    }else{
                        callback(400, {'Error':'Could not find the user'});
                    }
                });
            }
            else{
                callback(403,{'Error':'Missing required token in header or the token is invalid'});
            }
        });
    }else{
        callback(400, {'Error':'Missing the phone number which is a required field'});
    }
};

//Tokens
handlers.tokens = function(data, callback){
    let acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._tokens[data.method](data, callback);
    }else{
        callback(405);
    }
};

handlers._tokens = {};

//Tokens - post
//Required data: phone, password
//Optional data: None
handlers._tokens.post = function(data,callback){
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10  ? data.payload.phone.trim() : false;
    let passw = typeof(data.payload.passw) == 'string' && data.payload.passw.trim().length > 0  ? data.payload.passw.trim() : false;
    if(phone && passw){
        //Lockup the user who matches that phone number
        _data.read('users',phone,function(err,userData){
            if(!err && userData){
                let hashedPassword = helpers.hash(passw);
                if(hashedPassword == userData.hashedPassword){
                    //if valid, create a new token with a randon name. Set expiration date one (1) hour in the future.
                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now()+1000*60*60;
                    var tokenObject = {
                        'phone':phone,
                        'id':tokenId,
                        'expires': expires
                    }
                    //Store the token
                    _data.create('tokens',tokenId,tokenObject,function(err){
                        if(!err){
                            callback(200,tokenObject);
                        }else{
                            callback(500,{'Error':'Could not create the new token'})
                        }
                    })
                }else{
                    callback(400,{'Error':'Wrong password'});
                }
            }else{
                callback(400,{'Error':'We could not find that user'});
            }
        })
    }else{
        callback(400,{'Error':'missing required fields'});
    }
}

//Tokens - get
//Required data: id
//Optional data: None
handlers._tokens.get = function(data,callback){
    //Check if the sent id is valid
    let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        //Lookup the token
        _data.read('tokens',id,function(err,tokenData){
            if(!err && tokenData){
                callback(200, tokenData);
            }else{
                callback(404);
            };
        })
    }else{
        callback(400, {'Error':'Missing required fields'});
    }
}

//Tokens - put
//Required fields: id, extend
//Optional data: None
handlers._tokens.put = function(data,callback){
    let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20  ? data.payload.id.trim() : false;
    let extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(id && extend){
        //Lookup the token
        _data.read('tokens',id,function(err,tokenData){
            if(!err && tokenData){
                //Check the token isn't already expired
                if(tokenData.expires>Date.now()){
                    //Set the new expiration an hour from now
                    tokenData.expires = Date.now()+1000*60*60;
                    //Store the updates
                    _data.update('tokens',id,tokenData,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            callback(500,{'Error':'Could not update the tokens expiration time'})
                        };
                    });
                }else{
                    callback(400,{'Error':'The token has already expired'})
                };
            };
        });
    }else{
        callback(400,{'Error':'Missing required fields or these are invalid'});
    }
}

//Tokens - delete
//Required data: id
//Optional data: None
handlers._tokens.delete = function(data,callback){
    //Check if the id is valid
    let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        //Lookup the token
        _data.read('tokens',id,function(err,data){
            if(!err && data){
                _data.delete('tokens',id,function(err){
                    if(!err){
                        callback(200);
                    }else{
                        callback(500, {'Error':'Could not delete the token'});
                    }
                });
            }else{
                callback(400, {'Error':'Could not find the token'});
            }
        });
    }else{
        callback(400, {'Error':'Missing a required field'});
    };
};

//Verify is a given id is currently valid for a given user
handlers._tokens.verifyToken = function(id,phone,callback){
    //Lookup the token
    _data.read('tokens',id,function(err,tokenData){
        //Check that the token is for the given user and has not expired
        if(!err && tokenData){
            if(tokenData.phone==phone && tokenData.expires>Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    })
};

//Checks
handlers.checks = function(data, callback){
    let acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._checks[data.method](data, callback);
    }else{
        callback(405);
    }
};

//Container for all the checks methods
handlers._checks = {};

//Checks - post
//Required data: Protocol, url, method, successCodes, timeoutSeconds
//Optional data: None

handlers._checks.post = function(data,callback){
    
    //Validate inputs
    let protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    
    let url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    
    let method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    
    let successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    
    let timeOutSeconds = typeof(data.payload.timeOutSeconds) == 'number' && data.payload.timeOutSeconds % 1 === 0 && data.payload.timeOutSeconds >= 1 && data.payload.timeOutSeconds <= 5 ? data.payload.timeOutSeconds : false;

    if(protocol && url && method && successCodes && timeOutSeconds){
        //Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        //Lookup the user by reading the token
        _data.read('tokens',token,function(err,tokenData){
            if(!err && tokenData){
                let userPhone = tokenData.phone;
                //Lookup the user data
                _data.read('users',userPhone,function(err,userData){
                    if(!err && userData){
                        let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        //Verify that the user has less than the number of max-checks-per-user
                        if(userChecks.length < config.maxChecks){
                            //Create a random id for the check
                            let checkId = helpers.createRandomString(20);
                            //Create the check object and include the user's phone
                            let checkObject = {
                                'id':checkId,
                                'userPhone':userPhone,
                                'protocol':protocol,
                                'url':url,
                                'method':method,
                                'successCodes':successCodes,
                                'timeOutSeconds':timeOutSeconds
                            }
                            //Save the object
                            _data.create('checks',checkId,checkObject,function(err){
                                if(!err){
                                    //Add the checkId to the user's object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);
                                    //Save the new user data
                                    _data.update('users',userPhone,userData,function(err){
                                        if(!err){
                                            //Return the data about the new check to the requester
                                            callback(200,checkObject);
                                        }else{  
                                            callback(500,{'Error':'Could not update the user with the new check'});
                                        }
                                    });
                                }else{
                                    callback(500,{'Error':'Could not create the new check'})
                                }
                            });
                        }else{
                            callback(400,{'Error':'The user already has the max number of checks ('+config.maxChecks+')'})
                        }
                    }else{
                        callback(403);
                    }
                });
            }else{
                callback(403)
            }
        });
    }else{
        return callback(400,{'Error':'Missing required inputs or these are invalid'})
    }
};

//Checks - get
//Required data: id
//Optional data: None
handlers._checks.get = function(data, callback){
    //Check that the id is valid
    let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        //Lookup the check
        _data.read('checks',id,function(err,checkData){
            if(!err && checkData){
                //Get the token from the headers
                let token = typeof(data.headers.token)=='string' ? data.headers.token : false;
                //Verify that the given token from the headers is valid for the phone number and belongs to the user who created the check
                handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
                if(tokenIsValid){
                    //Return the check data
                    callback(200,checkData);
                }else{
                    callback(403);
                };
            });
        }else{
            callback(404);
        };
    });
    }else{
        callback(400,{'Error':'Missing required field'});
    }
};

//Chceks - put
//Required data: id
//Optional data: protocol, url, method, successCodes, timeOutSeconds. (At least one among these must be sent)
handlers._checks.put = function(data,callback){
    //Check for the required field
    let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    //Check for the optional fields
    //Validate inputs
    let protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    
    let url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    
    let method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.protocol : false;
    
    let successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    
    let timeOutSeconds = typeof(data.payload.timeOutSeconds) == 'number' && data.payload.timeOutSeconds % 1 === 0 && data.payload.timeOutSeconds >= 1 && data.payload.timeOutSeconds <= 5 ? data.payload.timeOutSeconds : false;

    //Make sure the id is valid
    if(id){
        //Check to make sure one or more optional fields has/have been sent
        if(protocol || url || method || successCodes || timeOutSeconds){
            //Lookup the check
            _data.read('checks',id,function(err,checkData){
                if(!err && checkData){
                    //Get the token from the headers
                    let token = typeof(data.headers.token)=='string' ? data.headers.token : false;
                    //Verify that the given token from the headers is valid for the phone number and belongs to the user who created the check
                    handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
                        if(tokenIsValid){
                            //Update the check where it is necessary
                            if(protocol){
                                checkData.protocol = protocol;
                            }
                            if(url){
                                checkData.url = url;
                            }
                            if(method){
                                checkData.method = method;
                            }
                            if(successCodes){
                                checkData.successCodes = successCodes;
                            }
                            if(timeOutSeconds){
                                checkData.timeOutSeconds = timeOutSeconds;
                            }
                            //Store the new updates
                            _data.update('checks',id,checkData,function(err){
                                if(!err){
                                    callback(200)
                                }else{
                                    callback(500,{'Error':'Could not update the check'});
                                }
                            });
                        }else{
                            callback(403);
                        }
                    });
                }else{
                    callback(400,{'Error':'Check ID does not exist'});
                }
            });
        }else{
            callback(400,{'Error':'Missing required fields'});
        }
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

//Checks - DELETE
//Required data: id
//Optional data: None
handlers._checks.delete = function(data, callback){
    //Check that the id is valid
    let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        //Lookup the check to delete
        _data.read('checks',id,function(err,checkData){
            if(!err && checkData){
                //Get the token from the headers
                let token = typeof(data.headers.token)=='string' ? data.headers.token : false;
                //Verify that the given token is valid for the phone number
                handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
                    if(tokenIsValid){
                        //Delete the check data
                        _data.delete('checks',id,function(err){
                            if(!err){
                                //Lookup the user
                                _data.read('users',checkData.userPhone,function(err,userData){
                                    if(!err && userData){
                                        let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                        //Remove the deleted check from the list of checks
                                        let checkPosition = userChecks.indexOf(id);
                                        if(checkPosition > -1){
                                            userChecks.splice(checkPosition,1);
                                            //Re-save the users data
                                            _data.update('users',checkData.userPhone,userData,function(err){
                                                if(!err){
                                                    callback(200);
                                                }else{
                                                    callback(500, {'Error':'Could not update the user'});
                                                }
                                            });
                                        }else{  
                                            callback(500,{'Error':'Could not find the check in the user object, it cannot be removed'});
                                        }
                                    }else{
                                        callback(500, {'Error':'Could not find the user who created the check. it cannot be removed from the the list of checks in the user object'});
                                    }
                                });
                            }else{
                                callback(500,{'Error':'Could not delete the check data'})
                            }
                        });
                    }
                    else{
                        callback(403);
                    }
                });
            }else{
                callback(400,{'Error':'The check id does not exist'})
            }
        });
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