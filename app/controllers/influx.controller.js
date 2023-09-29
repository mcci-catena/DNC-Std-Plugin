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

const request = require('request');

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
                    console.log("Read DB E-1")
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
                                console.log("Read DB E-2")
                                reject("error");
                            }
                        }
                        else
                        {
                            console.log("Read DB E-3")
                            reject("error");
                        }
                    }
                    catch(err)
                    {
                        console.log("Read DB E-4")
                        reject("error");
                    }
                }
            }
        );
        
    });
}

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

exports.readInflux = (indata) => {
    return new Promise(function(resolve, reject) {
        
        const count = indata.id;

        var paramarr = indata.sdata.split(",")

        var selparam = ""
        for(let i=0; i<paramarr.length; i++){
            selparam = selparam + indata.aggfn+"("+paramarr[i]+")"
            if(paramarr.length > (i+1)){
                selparam = selparam + ","
            }
        }

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

        query = ""+indata.server+"/query?db="+indata.db+
                "&q=select+"+selparam+"+"+indata.math+"+from+"+
                "\""+indata.measure+"\""+"+where+"+devid+"+and+time+>=+'"+fmdtstr+
                "'+and+time+<=+'"+todtstr+"'+group+by+time("+indata.gbt+"m)"

        request.get(query,
            {'auth': {'user': indata.user, 'pass': indata.pass, 'sendImmediately': false } },
            function(error, response)
            {
                if(error)
                {
                    console.log("Error-1")
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
                                var resdict = {};
                                resdict["id"] = count;
                                resdict["Columns"] = resobj.series[0].columns;
                                resdict["Values"] = resobj.series[0].values;
                                resolve(resdict);
                            }
                            else
                            {
                                console.log("Error-2")
                                reject("error");
                            }
                        }
                        else
                        {
                            console.log("Error-3")
                            reject("error");
                        }
                    }
                    catch(err){
                        console.log("Error-4")
                        reject("error");
                    }
                        
                }
        });
    });
}