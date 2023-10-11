/*############################################################################
# 
# Module: dread.js
#
# Description:
#     API for handling data read request from Plugin
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

// sread - Read Sensor data
// sdata - Name of the sensor data
// device - ID of the requested device
// gbt   - Group By Time (in minutes)
// fmdate - From Date
// todate - to Date
// aggfn  - Aggregate function (mean, min, max, all)


const request = require('request');
const validfn = require('../misc/validators.js');
const readsens = require('./influx.controller.js');
const { response } = require('express');
const constants = require('../misc/constants.js');

exports.readData = async (req, res)  => {
    if(!req.query.client || !req.query.sdata || !req.query.device || !req.query.gbt || 
        !req.query.fmdate || !req.query.todate || !req.query.aggfn) {
        return res.status(400).send({
            message: "mandatory field missing"
        });
    }

    var fmdttm = req.query.fmdate.replace("T",",");
    var todttm = req.query.todate.replace("T",",");

    var fmdttmstr = req.query.fmdate.split("T")
    var todttmstr = req.query.todate.split("T")

    var fmdate = fmdttmstr[0].trim();
    var fmtime = fmdttmstr[1].trim();
    var todate = todttmstr[0].trim();
    var totime = todttmstr[1].trim();

    if(!validfn.validatedate(fmdate) || !validfn.validatedate(todate) || 
       !validfn.validatetime(fmtime) || !validfn.validatetime(totime))
    {
        return res.status(400).send({
            message: "Invalid date input!"
        });
    }

    const fmdttime = new Date(fmdttm)
    const todttime = new Date(todttm)


    if(fmdttime > todttime)
    {
        return res.status(400).send({
            message: "from date is recent to the to date!"
        });
    }

    // Read HWID of the selected DNC Tags from deviceCID collection
    // Read the corresponding devID/devEUI for the equivalent HWID

    var dncd = {}
    dncd["orgname"] = req.query.client
    dncd["time"] = [fmdttime, todttime]
    dncd["tags"] = {}


    var options = {
        url: constants.DNC_URL+"tagsk",
        method: 'POST', 
        headers: {'Content-Type': 'application/json' },
        form: {'influxd': {'uname': req.query.client}}
    };

    request(options, function(error,resp) {
        if(error)
        {
            res.status(500).send('connect to application failed!');
        }
        else
        {
            if(resp.statusCode == 200)
            {
                var dout = JSON.parse(resp.body)
                var dnctags = dout.message
                var tagvals = req.query.device.split(',')
                
                var dncdict = {}
                for(let i=0; i<dnctags.length; i++){
                    dncd.tags[dnctags[i]] = tagvals[i].trim()
                }

                // Send request to get device map
                var options = {
                    url: constants.DNC_URL+"gdlist",
                    method: 'POST',
                    headers: {'Content-Type': 'application/json' },
                    form: {'dncd': dncd}
                };


                request(options, async function(error,resp) {
                    if(error)
                    {
                        res.status(500).send('connect to application failed!');
                    }
                    else
                    {
                        if(resp.statusCode == 200)
                        {
                            var dout = JSON.parse(resp.body)
                            
                            let sdpromisearr = []

                            for(let i=0; i<dout.message.devices.length; i++){
                                
                                let ifdict = {}
                                ifdict['device'] = dout.message.devices[i]['devid']
                                ifdict['type'] = dout.message.devices[i]['devtype']
                                ifdict['sdata'] = req.query.sdata
                                ifdict['aggfn'] = req.query.aggfn
                                ifdict['gbt'] = req.query.gbt
                                
                                let timespan = maptimespan(dncd["time"], [dout.message.devices[i]['idate'],
                                                            dout.message.devices[i]['rdate']])
                                ifdict['fmdate'] = timespan[0]
                                ifdict['todate'] = timespan[1]
                                if(dout.message.devices[i]['rdate'] == null){
                                    ifdict['todate'] = dout.message.time[1]  
                                }
                                ifdict['aggfn'] = req.query.aggfn
                                ifdict['db'] =  dout.message.dsrc[dout.message.devices[i].dsid]

                                ifdict['math'] = ''
                                if(req.query.math){
                                    var mathstr = req.query.math
                                    var newstr = mathstr.replace("+", "%2B")
                                    ifdict['math'] = newstr
                                }

                                sdpromisearr.push(readsens.readInflux(ifdict))
                            }

                            const sdpromises = Promise.allSettled(sdpromisearr)
                            const dstatuses = await sdpromises

                            let gresult = []
                            for(let rstatus of dstatuses){
                                if(rstatus.status == 'fulfilled'){
                                    gresult.push(rstatus.value)
                                }
                                else{
                                    console.log("Data fetch not success: ", rstatus.reason)
                                }
                            }

                            const finalresult = {
                                Columns: gresult[0].Columns,
                                Values: []
                            }

                            for(let i=0; i<gresult.length; i++){
                                if(gresult.length > (i+1)){
                                    let d1len = gresult[i].Values.length
                                    let d1date = gresult[i].Values[d1len-1]
                                
                                    let d2date = gresult[i+1].Values[0]

                                    if(d1date[0] === d2date[0]){
                                        if(d1date[1] === null && d2date[1] === null){
                                            gresult[i].Values.pop()
                                        }
                                        else
                                        if(d1date[1] != null && d2date[1] != null){
                                            gresult[i].Values.pop()
                                        }
                                        else
                                        if(d1date[1] === null){
                                            gresult[i].Values.pop()
                                        }
                                        else{
                                            gresult[i+1].Values.shift()
                                        }
                                    }
                                }
                                finalresult.Values = finalresult.Values.concat(gresult[i].Values)
                            }

                            res.status(200).send({"results": [finalresult]});
                        
                        }
                        else
                        {
                            res.status(200).send({"message": "Data Read error"});
                        }
                    }
                });


            }
            else
            {
                console.log("Tag Key Receive failed")
                return res.status(200).send({
                    message: "Data not available for the sensor"
                });
            }
        }
    });
}


function maptimespan(reqtime, devtime){
    let fmdate = reqtime[0]
    let todate = reqtime[1]

    let idate = new Date(devtime[0]);
    let rdate = devtime[1] == null ? todate : new Date(devtime[1])

    let influxfmdt = idate, influxtodt = rdate;

    if(idate.getTime() < fmdate.getTime())
    {
        influxfmdt = fmdate; 
    }
    if(rdate.getTime() > todate.getTime())
    {
        influxtodt = todate;
    }

    return [influxfmdt, influxtodt]

}
