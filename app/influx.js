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
#     V1.0.3 Wed Feb 23 2021 11:24:35 seenivasan
#       Module created
############################################################################*/

const request = require('request');

exports.readKeys  = (keycmd) => {
    return new Promise(function(resolve, reject) {
    //var query = "show field keys from csrbfedsActivityDataNetTime"
    /*query = "https://staging-dashboard.mouserat.io/influxdb:8086/query?db=csrb_activity_db"+
                "&q=show+field+keys+from+csrbfedsActivityDataNetTime"*/
    query = "http://influxdb:8086/query?db=csrb_activity_db"+
                "&q="+keycmd+" from csrbfedsActivityDataNetTime"

    //console.log(query)
    request.get(query,
        {'auth': {'user': 'seenivasanv', 'pass': 'vvasan', 'sendImmediately': false } },
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
                    console.log("Dut:", dout)
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


exports.readTvals  = (keycmd, keyname) => {
    return new Promise(function(resolve, reject) {
    //var query = "show field keys from csrbfedsActivityDataNetTime"
    /*query = "https://staging-dashboard.mouserat.io/influxdb:8086/query?db=csrb_activity_db"+
                "&q=show+field+keys+from+csrbfedsActivityDataNetTime"*/
    query = "http://influxdb:8086/query?db=csrb_activity_db"+
                "&q="+keycmd+" from csrbfedsActivityDataNetTime with key="+keyname

    //console.log(query)
    request.get(query,
        {'auth': {'user': 'seenivasanv', 'pass': 'vvasan', 'sendImmediately': false } },
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
                    console.log("Dut:", dout)
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
        
        console.log("Read Influx Entry")
        
        const count = indata.id;

        var aggfn = "\""+ indata.sdata+"\""

        var devid = "devID+=+'"+indata.device+"'"
    
        var fmdtstr = indata.fmdate.toISOString();
        var todtstr = indata.todate.toISOString();

        query = ""+indata.server+"/query?db="+indata.db+
                "&q=select+mean("+aggfn+")+from+"+
                indata.measure+"+where+"+devid+"+and+time+>=+'"+fmdtstr+
                "'+and+time+<=+'"+todtstr+"'+group+by+time("+indata.gbt+"m)"

        //query = ""+indata.server+"/query?db="+indata.db+
        //        "&q=select+mean("+'"pellets[0].Delta"'+")+from+"+
        //        indata.measure+"+where+"+devid+"+and+time+>=+'"+fmdtstr+
        //        "'+and+time+<=+'"+todtstr+"'+group+by+time("+indata.gbt+"m)"

        console.log("Influx Query: ", query)

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
                        console.log(dout)
                        if(dout.hasOwnProperty("results"))
                        { 
                            resobj = dout.results[0]
                            console.log(resobj)

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