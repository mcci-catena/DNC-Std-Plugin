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
#     V1.0.3 Wed Feb 23 2021 11:24:35 seenivasan
#       Module created
############################################################################*/

const request = require('request');
const tokenfn = require('./auth.js');
const validfn = require('./validators.js');
const readsens = require('./influx.js');
const { response } = require('express');

module.exports = function (app) {
    app.get('/dread', tokenfn.authenticateJWT ,(req, res) => {
        if(!req.query.site || !req.query.pile || !req.query.location || 
            !req.query.fmdate || !req.query.todate || !req.query.fncode) {
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

        var form = {};
        for(var key in req.query)
        {
            form[key] = req.query[key];
        }
        form.uname = req.user.user.uname;
        
        var options = {
            url: 'http://localhost:8082/gdevices',
            method: 'POST', 
            headers: {'Content-Type': 'application/json' },
            form
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
                    if(dout.hasOwnProperty("location"))
                    {
                        if(dout.hasOwnProperty("devices"))
                        {
                            fetchFromInflux(res, resp.body, req.query.fncode, fmdttime, todttime); 
                        }
                        else
                        {
                            res.status(201).send(resp.body);
                        }
                    }
                    else
                    {
                        if(dout.hasOwnProperty("message"))
                        {
                            res.status(200).send(resp.body);
                        }
                        else
                        {
                            res.status(200).send({message: "Location does not exist"});
                        }
                    }
                }
                else
                {
                    res.status(500).send(resp.body);
                }
            }
        });
    });
}



async function fetchFromInflux(res, data, fncode, fmdate, todate)
{
    var valarray = [];
    var finalarray = [];
    var newarray = [];
    var finaldict = {};
    var resultdict = {};
    var sensarray = [];
    var coldict = {};

    var datefm = new Date(fmdate);
    var dateto = new Date(todate);

    var dout = JSON.parse(data)
    
    var influxset = {};

    influxset.server = dout.server;
    influxset.db = dout.db;
    influxset.measure = dout.measure;
    influxset.fncode = fncode;

    resultdict["Site"] = dout.site;
    resultdict["Pile"] = dout.pile;
    resultdict["Location"] = dout.location;
    
    devlist = dout.devices;

    if(devlist.length <= 0)
    {
        return res.status(200).send({
            message : "Device not mapped to the location"
        });
    }
   
    for(var i=0; i<devlist.length; i++)
    {
        //sensarray.push(devlist[i].dname);
        var idate = new Date(devlist[i].idate);
        var rdate = new Date(devlist[i].rdate);
        if(devlist[i].rdate == null)
        {
            rdate = new Date();
         }
              
        var influxfmdt = idate, influxtodt = rdate;
        
        if(idate.getTime() < datefm.getTime())
        {
           influxfmdt = datefm; 
        }
        if(rdate.getTime() > dateto.getTime())
        {
            influxtodt = dateto;
        }
        
        influxset.fmdate = influxfmdt;
        influxset.todate = influxtodt;
        // Adding of HW tag name
        influxset.deviceid = devlist[i].deviceid;  
        influxset.devID = devlist[i].devID;
        influxset.devEUI = devlist[i].devEUI;
        influxset.id = i;

        
        try{
            influxdata = await readsens.readInflux(influxset)
            if(influxdata != 'error')
            {
                //console.log(influxdata);
                coldict["Columns"]=influxdata.Columns;
                for(var k=0; k<influxdata.Values.length; k++)
                {
                    if(influxdata.Values[k][1] != null)
                    {
                        influxdata.Values[k][1] = ((influxdata.Values[k][1])*(1.8)) + 32;
                        valarray.push(influxdata.Values[k]);
                    }
                }
            }

        }catch(err){
            return res.status(200).send({
                message: "Data not available for the sensor"
            });
        }
    }
    //resultdict["Sensor"] = sensarray[0];

    if(valarray.length >= 1)
    { 
        resultdict["Columns"] = coldict.Columns;

        resultdict["Values"] = valarray;

        res.status(200).send({"results": [resultdict]});
    }
    else
    {
        return res.status(200).send({
            message: "Data not available for the sensor"
        });
    }
}

