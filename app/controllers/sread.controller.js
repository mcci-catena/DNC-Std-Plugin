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


// Import the 'request' module form NPM library
const request = require('request');

// Import the 'validators' module form local
const validfn = require('../misc/validators.js');

// Import the 'influx' controller module form local
const readsens = require('./influx.controller.js');

// const { response } = require('express');

// Import the constants from the 'constants' module
const constants = require('../misc/constants.js');


// Read Device Data from the InfluxDB
// Flow - Send the request to DNC Server along with the DNC Tags
// DNC Server, extract the HW ID from the given DNC Tags
// and get the quivalent devID/devEUI by referring the DNC device record
// Construct query to InfluxDB with devID/devEUI along with other params
// such as gbt, fmdate, todate and aggfn. Receives the response, replace
// devID/devEUI details with the DNC tags, then send back the response to
// the Client (Excel/Google Plugin)

exports.readData = (req, res)  => {
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

    var options = {
        url: constants.DNC_URL+"gdevmap",
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        form: {'cname':req.query.client, 'tagval': req.query.device}
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
                req.query.device = dout.devices[0]
                req.query.dbdata = dout.dbdata
                fetchFromInflux(req, res, fmdttime, todttime); 
            }
            else
            {
                res.status(500).send(resp.body);
            }
        }
    });

}



// Construct query for making influx request
// Send back the received response to the called function.

async function fetchFromInflux(req, res, fmdate, todate)
{
    var influxset = {};

    var datefm = new Date(fmdate);
    var dateto = new Date(todate);
    
    influxset.server = req.query.dbdata.url;
    influxset.db = req.query.dbdata.dbname;
    influxset.measure = req.query.dbdata.mmtname;
    
    influxset.fncode = "";
    influxset.user = req.query.dbdata.user
    influxset.pass = req.query.dbdata.pwd

    influxset.fmdate = datefm;
    influxset.todate = dateto;

    influxset.sdata = req.query.sdata
    influxset.device = req.query.device
    influxset.aggfn = req.query.aggfn
    influxset.gbt = req.query.gbt


    influxset.math = "";
    if(req.query.math)
    {
        var mathstr = req.query.math
        var newstr = mathstr.replace("+", "%2B")
        influxset.math = newstr
    }
    
    try{
        influxdata = await readsens.readInflux(influxset)
        if(influxdata != 'error')
        {
            res.status(200).send({"results": [influxdata]});
        }
        else
        {
            res.status(200).send({"message": "Data Read error"});
        }

    }catch(err){
        return res.status(200).send({
            message: "Data not available for the sensor"
        });
    }
}