/**This library is for storing and editing data */

//Dependencies
let fs = require('fs');
let path = require('path');
let helpers = require('./helpers');

//Container for the module to be exported
let lib = {};

//Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');

//Writing data to a file
lib.create = function(dir, file, data, callback){

    //Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //Convert data to string (always I have to convert the JSON objects to string)
            let stringData = JSON.stringify(data);

            //Write in the file and close it.
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing the file');
                        }
                    });
                }else{
                    callback('Error writing to the new file');
                }
            });

        }else{
            callback('Could not create the new file, it may already exists');
        }
    });
};

//Read data from a file
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8', function(err, data){
        if(!err && data){
            let parsedData = helpers.parseJsonToObject(data);
            callback(false,parsedData);
        }else{
            callback(err,data);
        }  
    });
};

//Update the data inside a file
lib.update = function(dir,file,data,callback){
    //Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            //Convert data to string
            let stringData = JSON.stringify(data);
            //Truncate the file (in case there is content inside before updating it)
            fs.ftruncate(fileDescriptor,function(err){
                if(!err){
                    //Write to the file and close it
                    fs.writeFile(fileDescriptor,stringData,function(err){
                        if(!err){
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false);
                                }else{  
                                    callback('Error closing the existing file');
                                }
                            });
                        }else{
                            callback('Error writing to the existing file')
                        }
                    });
                }else{
                    callback('Error truncating the file');
                }
            });
        }else{
            callback('Could not open the file, it may not exist.');
        }
    });
};

//Delete a file
lib.delete = function(dir,file,callback){
    //Unlink the file from the file system
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        }else{
            callback('Error deleting the file');
        }
    });
};

//List all the items in a directory
lib.list = function(dir,callback){
    fs.readdir(lib.baseDir+dir+'/',function(err,data){
        if(!err && data && data.length > 0){
            let trimmedFileNames = [];
            data.forEach(function(fileName){
                trimmedFileNames.push(fileName.replace('.json',''));
            });
            callback(false,trimmedFileNames);
        }else{
            callback(err,data);
        }
    });
};

//Exports the module
module.exports = lib;