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

exports.readInflux = (indata) => {
    return new Promise(function(resolve, reject) {
        const count = indata.id;

        var aggfn = 'max(tWater)'
    
        fncode = indata.fncode;
        fncode = fncode.toLowerCase()
        
        if(fncode == 'min' || fncode == 'max' || fncode == 'mean' || 
           fncode == 'median' || fncode == 'first' || fncode == 'last')
        {
            aggfn = fncode+"(tWater)"
        }  
    
        /*devid = ''
        if(indata.devid != 'all')
            //devid = "deviceid+=+'"+indata.devid+"'+and+"
            //adding of HW tag name
            devid = ""+indata.hwtag+"+=+'"+indata.devid+"'+and+"*/

        orflg = 0
        devid = ''
        if(indata.devid != 'all')
        {
            if(indata.deviceid != "")
            {
                devid = devid+"(deviceid+=+'"+indata.deviceid+"'"
                orflg = 1
            }
            if(indata.devID != "")
            {
                if(orflg)
                {
                    devid = devid+"+or+"
                }
                devid = devid+"devID+=+'"+indata.devID+"'"
                orflg = 1
            }
            if(indata.devEUI != "")
            {
                if(orflg)
                {
                    devid = devid+"+or+"
                }
                devid = devid+"devEUI+=+'"+indata.devEUI+"'"
            }
            devid = devid + ")+and+"
        }

        var fmdtstr = indata.fmdate.toISOString();
        var todtstr = indata.todate.toISOString();

        query = ""+indata.server+"/query?db="+indata.db+
                "&q=select+"+aggfn+"+from+"+
                indata.measure+"+where+"+devid+"time+>=+'"+fmdtstr+
                "'+and+time+<=+'"+todtstr+"'+group by time(1d)"

        request.get(query,
            {'auth': {'user': 'ezra', 'pass': '1millioncompost', 'sendImmediately': false } },
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
                        reject("error");
                    }
                        
                }
        });
    });
}