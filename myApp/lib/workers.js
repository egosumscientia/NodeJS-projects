//Workers-related tasks

//Dependencies
let path = require('path');
let fs = require('fs');
let _data = require('./data');
let https = require('https');
let http = require('http');
let helpers = require('./helpers');
let url = require('url');

//Instantiate the worker object
let workers = {};

//Lookup all checks, get their data, send to validatos
workers.gatherAllChecks = function(){
    //Get all the checks that exist in the system
    _data.list('checks',function(err,checks){
        if(!err && checks && checks.length > 0){
            checks.forEach(function(check){
                //Read in the check's data
                _data.read('checks',check,function(err,originalCheckData){
                    if(!err && originalCheckData){
                        //Pass it ot the check validator and let that function to continue or log error
                        workers.validateCheckData(originalCheckData);
                    }else{
                        console.log('Error reading one of the checks data');
                    }
                });
            });
        }else{
            console.log('Error: We could not find any checks to process')
        };
    });
};

//Sanity-check the check-data
workers.validateCheckData = function(originalCheckData){
    
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
    
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http','https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;

    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;

    originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['post','get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;

    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;

    originalCheckData.timeOutSeconds = typeof(originalCheckData.successCodes) == 'number' && originalCheckData.timeOutSeconds % 1 === 0 && originalCheckData.timeOutSeconds >= 1 && originalCheckData.timeOutSeconds <= 5 ? originalCheckData.timeOutSeconds : false;

    //Set the keys that may not be set if the workers have never seen this check before
    originalCheckData.state =  typeof(originalCheckData.state) == 'string' && ['up','down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';

    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

    console.log(originalCheckData);
    console.log(originalCheckData.id);
    console.log(originalCheckData.userPhone);
    console.log(originalCheckData.protocol);
    console.log(originalCheckData.url);
    console.log(originalCheckData.method);
    console.log(originalCheckData.successCodes);
    console.log(originalCheckData.timeOutSeconds);
    //if all the checks passed, then pass the data along to the next step in the process
    if(originalCheckData.id && 
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeOutSeconds){
            workers.performCheck(originalCheckData);
    }else{
        console.log('Error: One of the checks is not properly formatted. Skipping it.');
    };
};

//Perform the check, send the originalCheckData and the outcome of the check process to the next step in the process
workers.performCheck = function(originalCheckData){
    
    //Prepare the initial outcome
    let checkOutcome = {
        'error' : false,
        'responseCode' : false,
    };
    //Mark that the outcome has not been sent yet
    let outcomeSent = false;
    //Parse the hostname and the path out of the original check data
    let parsedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url,true);
    let hostName = parsedUrl.hostname;
    let path = parsedUrl.path; //Using path but not 'pathname' because we want the query string
    
    //Constructing the request
    let requestDetails = {
        'protocol' : originalCheckData.protocol+':',
        'hostname' : hostName,
        'method' : originalCheckData.method.toUpperCase(),
        'path' : path,
        'timeout' : originalCheckData.timeOutSeconds * 1000
    };
    //Instantiate the request object using either the http or https modules
    let _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
    let req = _moduleToUse.request(requestDetails,function(res){
        //Grab the status of the sent request
        let status = res.statusCode;
        //Update the check outcome and pass the data along
        checkOutcome.responseCode = status;
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData.checkOutcome);
            outcomeSent = true;
        }
    });
    //Bind to the error event so it does not get thrown
    req.on('error',function(e){
        //Update the check outcome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value' : e
        };
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        };
    });
    //Bind to the timeout event
    req.on('timeout',function(e){
        //Update the check outcome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value' : 'timeout'
        };
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        };
    });

    //End the request
    req.end();
};

//Process the check outcome and update the checkdata as needed and then trigger an alert to the user if needed. Special logic for accomodating a check that has been never tested before (do not alert on that one)
workers.processCheckOutcome = function(originalCheckData,checkOutcome){
    //Decide if the check is considered up or down
    let state = checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode > -1 ? 'up' : 'down');
    //Decide if an alert is warranted
    let alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;
    //Update the check data
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();
    //Save the updates
    _data.update('checks',newCheckData.id,newCheckData,function(err){
        if(!err){
            //Send the new check data to the next phase in the process if needed
            if(alertWarranted){
                workers.alertUserToStatusChange(newCheckData);
            }else{
                console.log('Check outcome has not changed, no alert is needed');
            }
        }else{
            console.log('Error trying to save the updates to one of the checks');
        }
    });

};

//Alert the user as to a change in their check status
workers.alertUserToStatusChange = function(newCheckData){
    let msg = 'Alert: Your check for '+newCheckData.method.toUpperCase()+' '+newCheckData.protocol+'://'+newCheckData.url+' is currently '+newCheckData.state; 

    helpers.sendTwilioSms(newCheckData.userPhone,msg,function(err){
        if(!err){
            console.log('Success! the user was alerted to a status change in his/her check via SMS',msg);
        }else{
            console.log('Error: We could not send an SMS alert to the user who had a state change in his/her check');
        }
    });
};

//Timer to exec the worker's process once per minute
workers.loop = function(){
    setInterval(function(){
        workers.gatherAllChecks();
    },1000*60)
};

//Init script
workers.init = function(){
    //Execute all the checks
    workers.gatherAllChecks();
    //Call the loop so the checks will execute later on
    workers.loop();
};


//Export the module
module.exports = workers;