/**Helpers for varoious tasks */

//Dependencies
let crypto = require('crypto');
let config = require('./config');

//Create a container for all the helpers
let helpers = {};

//Create a SHA256 hash
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        let hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
};

//Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str){
    try{
        let obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
};

//Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        //Define all the possible characters that could go into the string
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        //Start the final string
        let str = '';
        for(let i=1; i<=strLength; i++){
            //Get a random char from the possible ones
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));
            //Append the random char to the string
            str+=randomCharacter;
        }
        //Return the final string
        return str;
    }else{
        return false;
    }
};


module.exports = helpers;