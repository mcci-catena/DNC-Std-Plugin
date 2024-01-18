/*############################################################################
# 
# Module: keys.controller.js
#
# Description:
#     API for Tag request from Plugin
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

// Import the 'request' module from the npm library
const request = require('request');

// Import the constants from the 'constants' module
const constants = require('../misc/constants.js');

// Import the 'influx' module from controller
const readsens = require('./influx.controller.js');

// The primary purpose of this module is to execute a query on a specified 
// database server to retrieve a list of databases.
// Input parameters : None
// Response : Forwarded the same response received from the Influx Server

exports.getdbs = async (req, res) => {
    
    try{
        influxdata = await readsens.readDBs()
        if(influxdata != 'error')
        {
            return res.status(200).send({
                fields: influxdata.data
            });
           
        }

    }catch(err){
        return res.status(200).send({
            message: "DB info not available"
        });
    }
}

// The primary purpose of this module is to execute a query on a specified 
// database server to retrieve a list of measurements for the given database.
// Input parameters : req.params.dbn
// Response : Forwarded the same response received from the Influx Server

exports.getmeas = async (req, res) => {
    
    if(!req.params.dbn)
    {
        return res.status(400).send({
            message: "DB name missing"
        });
    }

    try{
        influxdata = await readsens.readMeas("show+measurements", req.params.dbn)
        if(influxdata != 'error')
        {
            return res.status(200).send({
                fields: influxdata.data
            });
           
        }

    }catch(err){
        return res.status(200).send({
            message: "Measurement info not available"
        });
    }
}

// The primary purpose of this module is to query field keys from the measurement
// Query with the Client/Org Name will be sent to DNC Server, DNC Server fetch 
// the associated Influx details from the DNC Database, then construct the query 
// to get field keys from the InfluxDB for the given DB name and measurement name.
// Input parameters: req.query.client
// Response: Dict object {"fields": []}

exports.getfields = async (req, res) => {
    
    if(!req.query.client)
    {
        return res.status(400).send({
            message: "Clint name missing"
        });
    }

    var options = {
        url: constants.DNC_URL+"gfields",
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        form: {'cname':req.query.client}
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
                res.status(200).send(resp.body)
            }
            else
            {
                res.status(201).send({error: 'Missing DNC Client Parameters'});
            }
        }
    });
}


// The primary purpose of this module is to query tag keys from the measurement
// to get tag keys from the InfluxDB for the given DB name and measurement name.
// Input parameters: req.query.db, req.query.meas
// Response : Forwarded the same response received from the Influx Server

exports.gettags = async (req, res) => {
    
    if(!req.query.db || !req.query.meas)
    {
        return res.status(400).send({
            message: "Mandatory field missing"
        });
    }

    var indict = {}
    indict["db"] = req.query.db
    indict["meas"] = req.query.meas
    indict["cmd"] = "show tag keys"


    try{
        influxdata = await readsens.readKeys(indict)
        if(influxdata != 'error')
        {
            return res.status(200).send({
                tags: influxdata.data
            });
           
        }

    }catch(err){
        return res.status(200).send({
            message: "Data not available for the sensor"
        });
    }

}


// The primary purpose of this module is to query tag keys from the measurement
// to get tag values from the InfluxDB for the given DB, measurement name  and tag key.
// Input parameters: req.query.db, req.query.meas, req.params.key
// Response : Forwarded the same response received from the Influx Server

exports.gettvals = async (req, res) => {
    
    if(!req.params.tkey || !req.query.db || !req.query.meas)
    {
        return res.status(400).send({
            message: "key field missing"
        });
    }

    var indict = {}
    indict["db"] = req.query.db
    indict["meas"] = req.query.meas
    indict["cmd"] = "show tag values"
    indict["tkey"] = req.params.tkey

    try{
        influxdata = await readsens.readTvals(indict)
        if(influxdata != 'error')
        {
            return res.status(200).send({
                tagvalues: influxdata.data
            });
           
        }

    }catch(err){
        return res.status(200).send({
            message: "Data not available for the sensor"
        });
    }
}