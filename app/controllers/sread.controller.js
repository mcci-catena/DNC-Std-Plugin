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

exports.readData = (req, res)  => {
    if(!req.query.db || !req.query.meas || !req.query.sdata || !req.query.device || !req.query.gbt || 
        !req.query.fmdate || !req.query.todate || !req.query.aggfn) {
        return res.status(400).send({
            message: "mandatory field missing"
        });
    }
    var fmdate = req.query.fmdate.trim();
    var todate = req.query.todate.trim();

    if(!validfn.validatedate(fmdate) || !validfn.validatedate(todate))
    {
        return res.status(400).send({
            message: "Invalid date input!"
        });
    }

    const fmdttime = new Date(fmdate).setHours(00,00,00);
    const todttime = new Date(todate).setHours(23,59,59);

    if(fmdttime > todttime)
    {
        return res.status(400).send({
            message: "from date is recent to the to date!"
        });
    }

    fetchFromInflux(req, res, fmdttime, todttime); 

}


async function fetchFromInflux(req, res, fmdate, todate)
{
    var influxset = {};

    var datefm = new Date(fmdate);
    var dateto = new Date(todate);
    
    influxset.server = constants.IFDB_URL;
    influxset.db = req.query.db;
    influxset.measure = req.query.meas;
    
    influxset.fncode = "";
    influxset.user = ""
    influxset.pass = ""

    influxset.fmdate = datefm;
    influxset.todate = dateto;

    influxset.sdata = req.query.sdata
    influxset.device = req.query.device
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