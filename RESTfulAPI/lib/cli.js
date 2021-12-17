//CLI related tasks

//Dependencies
let readLine = require('readline');
let util = require('util');
let debug = util.debuglog('cli');
let events = require('events');
class _events extends events{};
let e = new _events();

//Instantiate the CLI module object
let cli = {};
//Input processor
cli.processInput = function(str){
    str = typeof(str) == 'String' && str.trim().length > 0 ? str.trim() : false;
    if(str){
        //Codify the unique string that identify the unique questions allowed to be asked
        let uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info',
        ];
        //Go through the possible inputs, emit an event when match is found
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some(function(input){
            if(str.toLowerCase().indexOf(input) > -1){
                matchFound = true;
                //Emit an event matching the unique input, and include the full str given by the user
                e.emit(input,str);
                return true;
            };
        });
        //If no match is found, tell the user to try again
        if(!matchFound){
            console.log('Sorry, try again');
        };
    };
};


//Init script
cli.init = function(){
    //Set the start message to the console in dark blue
    console.log('\x1b[36m%s\x1b[0m',"The CLI is running...");
    //Start the interface
    let _interface = readLine.createInterface({
        input:process.stdin,
        output:process.stdout,
        prompt:''
    });
    //Create an initial prompt
    _interface.prompt();

    //Handling each line of input separately
    _interface.on('line',function(str){
        //Send to the input processor
        cli.processInput(str);
        //Re-initialize the prompt afterwards
        _interface.prompt();
    });
    //If the user starts the CLI, kill the associated process
    _interface.on('close',function(){
        process.exit(0);
    });

};



//Export the module
module.exports = cli;