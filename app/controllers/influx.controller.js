/*############################################################################
# 
# Module: influx.js
#
# Description:
#     InfluxDB read module
#
# Copyright notice:
#     This file copyright (c) 2021 by
#
#         MCCI Corporation
#         3520 Krums Corners Road
#         Ithaca, NY  14850
#
#     Released under the MCCI Corporation.
#
# Author:
#     Seenivasan V, MCCI Corporation February 2021
#
# Revision history:
#     V1.0.0 Fri Oct 22 2021 11:24:35 seenivasan
#       Module created
############################################################################*/

// Import the 'request' module form NPM library
const request = require('request');

// The primary purpose of this module is to execute a query on a specified 
// database server to retrieve a list of databases.
// Input parameters : None
// Response : Dict object {"data": []}

exports.readDBs = () => {
    return new Promise(function(resolve, reject) {
        server = constants.IFDB_URL
        query = ""+server+"query?q=show+databases"
        
        request.get(query,
            {'auth': {'user': '', 'pass': '', 'sendImmediately': false } },
            function(error, response)
            {
                if(error)
                {
                    reject("error");
                }
                else
                {
                    try{
                        var dout = JSON.parse(response.body)
                        if(dout.hasOwnProperty("results"))
                        {
                            resobj = dout.results[0];
                            if(resobj.hasOwnProperty("series"))
                            {
                                var finarray = []
                                var farray =  resobj.series[0].values
                                for(i=0; i<farray.length; i++)
                                {
                                    finarray.push(farray[i][0])
                                }   
                                var resdict = {};
                                resdict["data"] = finarray
                                resolve(resdict);
                            }
                            else
                            {
                                reject("error");
                            }
                        }
                        else
                        {
                            reject("error");
                        }
                    }
                    catch(err)
                    {
                        reject("error");
                    }
                }
            }
        );
        
    });
}


// The primary purpose of this module is to execute a query on a specified 
// database server to retrieve a list of measurements for the given database.
// Input parameters: "show measurements", database name
// Response : Dict object {"data": []}

exports.readMeas = (infcmd, dbname) => {
    return new Promise(function(resolve, reject) {
        server = constants.IFDB_URL
        query = ""+server+"query?db="+dbname+"&q="+infcmd

        request.get(query,
            {'auth': {'user': '', 'pass': '', 'sendImmediately': false } },
            function(error, response)
            {
                if(error)
                {
                    reject("error");
                }
                else
                {
                    try{
                        var dout = JSON.parse(response.body)
                        if(dout.hasOwnProperty("results"))
                        {
                            resobj = dout.results[0];
                            if(resobj.hasOwnProperty("series"))
                            {
                                var finarray = []
                                var farray =  resobj.series[0].values
                                for(i=0; i<farray.length; i++)
                                {
                                    finarray.push(farray[i][0])
                                }   
                                var resdict = {};
                                resdict["data"] = finarray
                                resolve(resdict);
                            }
                            else
                            {
                                reject("error");
                            }
                        }
                        else
                        {
                            reject("error");
                        }
                    }
                    catch(err)
                    {
                        reject("error");
                    }
                }
            }
        );
        
    });
}


// The primary purpose of this module is to send a query to an InfluxDB server, 
// execute a specified command, and retrieve keys (field names) from a specific 
// measurement.
// Input Parameters: indict.cmd, indict.db, indict.meas
// Response : Dict object {"data": []}

exports.readKeys  = (indict) => {
    return new Promise(function(resolve, reject) {
        server = constants.IFDB_URL
        query = ""+server+"query?db="+indict.db+"&q="+indict.cmd+" from "+"\""+indict.meas+"\""

        request.get(query,
        {'auth': {'user': '', 'pass': '', 'sendImmediately': false } },
        function(error, response)
        {
            if(error)
            {
                reject("error");
            }
            else
            {
                try
                {
                    var dout = JSON.parse(response.body)
                    if(dout.hasOwnProperty("results"))
                    {
                        resobj = dout.results[0]
                        if(resobj.hasOwnProperty("series"))
                        {
                            var finarray = []
                            var farray =  resobj.series[0].values
                            for(i=0; i<farray.length; i++)
                            {
                                finarray.push(farray[i][0])
                            }   
                            var resdict = {};
                            resdict["data"] = finarray
                            resolve(resdict);
                        }
                        else
                        {
                            reject("error");
                        }
                    }
                    else
                    {
                        reject("error");
                    } 
                }
                catch(err){
                    reject("error");
                }
            }
        });
    });
}


// The primary purpose of this module is to send a query to an InfluxDB server,
// execute a specified command, and retrieve timestamped values associated with a 
// specific key from a specific measurement.
// Input parameters: indict.db, indict.cmd, indict.meas, indict.tkey
// Response: Dict object {"data": []}

exports.readTvals  = (indict) => {
    return new Promise(function(resolve, reject) {
    server = constants.IFDB_URL
    query = ""+server+"query?db="+indict.db+"&q="+indict.cmd+" from "+"\""+indict.meas+"\""+" with key="+indict.tkey

    request.get(query,
        {'auth': {'user': '', 'pass': '', 'sendImmediately': false } },
        function(error, response)
        {
            if(error)
            {
                reject("error");
            }
            else
            {
                try
                {
                    var dout = JSON.parse(response.body)
                    if(dout.hasOwnProperty("results"))
                    {
                        resobj = dout.results[0]
                        if(resobj.hasOwnProperty("series"))
                        {
                            var finarray = []
                            var farray =  resobj.series[0].values
                            for(i=0; i<farray.length; i++)
                            {
                                finarray.push(farray[i][1])
                            }   
                            var resdict = {};
                            resdict["data"] = finarray
                            resolve(resdict);
                        }
                        else
                        {
                            reject("error");
                        }
                    }
                    else
                    {
                        reject("error");
                    } 
                }
                catch(err){
                    reject("error");
                }
            }
        });
    });
}


// The primary purpose of this module is to send a query to get devicedata 
// to an InfluxDB server, and retrieve timestamped values associated with a 
// specific key and value pairs from a specific measurement for the given 
// time span.
// Input parameters: indata.aggfn, indata.fmdate, indata.todate, indata.db
// indata.measure, indata.server, indata.math, indata.gbt
// (indata.device.deviceid || indata.device.devID || indata.device.devEUI)
// Response: Dict object {"Columns": [], "Values": []}

exports.readInflux = (indata) => {
    return new Promise(function(resolve, reject) {
        
        const count = indata.id;

        // Split when user requesting for multiple params
        // Example vBat, Temp, Pressure, RH, etc
        var paramarr = indata.sdata.split(",")

        // Framing SELECT Clause 
        var selparam = ""
        for(let i=0; i<paramarr.length; i++){
            selparam = selparam + indata.aggfn+"("+paramarr[i]+")"
            if(paramarr.length > (i+1)){
                selparam = selparam + ","
            }
        }

        // Choose type of the ID for device (Network based ex. Sigfox, TTN)
        let devid = "("
        orflg = 0

        if(indata.device.deviceid != "")
        {
            devid = devid+"deviceid+=+'"+indata.device.deviceid+"'"
            orflg = 1
        }
        if(indata.device.devID != "")
        {
            if(orflg)
            {
                devid = devid+"+or+"
            }
            devid = devid+"devID+=+'"+indata.device.devID+"'"
            orflg = 1
        }
        if(indata.device.devEUI != "")
        {
            if(orflg)
            {
                devid = devid+"+or+"
            }
            devid = devid+"devEUI+=+'"+indata.device.devEUI+"'"
        }
        devid = devid + ")"


        var fmdtstr = indata.fmdate.toISOString();
        var todtstr = indata.todate.toISOString();

        // Framing complete Influx query
        query = ""+indata.server+"/query?db="+indata.db+
                "&q=select+"+selparam+"+"+indata.math+"+from+"+
                "\""+indata.measure+"\""+"+where+"+devid+"+and+time+>=+'"+fmdtstr+
                "'+and+time+<=+'"+todtstr+"'+group+by+time("+indata.gbt+"m)"

        // Making Influx Request
        request.get(query,
            {'auth': {'user': indata.user, 'pass': indata.pass, 'sendImmediately': false } },
            function(error, response)
            {
                if(error)
                {
                    // Influx server responded with error
                    console.log("Error: ", error)
                    reject("error");
                }
                else
                {
                    try
                    {
                        //  Once response received from the Influx Server
                        //  Need to parse the response data
                        var dout = JSON.parse(response.body)
                        if(dout.hasOwnProperty("results"))
                        { 
                            resobj = dout.results[0]
                            
                            if(resobj.hasOwnProperty("series"))
                            {
                                var resdict = {};
                                resdict["id"] = count;
                                resdict["Columns"] = resobj.series[0].columns;
                                resdict["Values"] = resobj.series[0].values;
                                resolve(resdict);
                            }
                            else
                            {
                                reject("error");
                            }
                        }
                        else
                        {
                            reject("error");
                        }
                    }
                    catch(err){
                        //  When parsing was failed
                        reject("error");
                    }
                        
                }
        });
    });
}