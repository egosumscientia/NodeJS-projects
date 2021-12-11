/* 
Create and export configuration variables
*/

//Container for all the environments
let environments = {};

//Stagng (default) envorinment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d2e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
    }
};

//Production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret': 'thisIsAnotherSecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d2e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
    }
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV)=='string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current environment is one of the envs above, if not, default to string.
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentToExport;