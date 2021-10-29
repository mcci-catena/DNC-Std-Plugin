/*############################################################################
# 
# Module: keyread.controller.js
#
# Description:
#     API for read list of fields and keys from InfluxDB
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
const tokenfn = require('../misc/auth');
const readsens = require('./influx.controller');

module.exports = function (app) {
    app.post('/fields', async (req, res) => {

        try{
            influxdata = await readsens.readFields()
            if(influxdata != 'error')
            {
                console.log(influxdata);
                return res.status(200).send({
                    fields: influxdata.data
                });
               
            }

        }catch(err){
            return res.status(200).send({
                message: "Data not available for the sensor"
            });
        }
    })    
}


module.exports = function (app) {
    app.post('/tags', async (req, res) => {

        try{
            influxdata = await readsens.readFields()
            if(influxdata != 'error')
            {
                console.log(influxdata);
                return res.status(200).send({
                    tags: influxdata.data
                });
               
            }

        }catch(err){
            return res.status(200).send({
                message: "Data not available for the sensor"
            });
        }
    })    
}