/*############################################################################
# 
# Module: tagkey.controller.js
#
# Description:
#     Endpoint for getting Tag keys fron the InfluxDB
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

var request = require('request');

const constants = require('../misc/constants');

exports.tagkey = async function (req, res) {

    var influxd = {}
    influxd.uname = uname;
    influxd.pwd = pwd;
    influxd.dbname = req.query.db
    influxd.query = req.body.q

    var options = {
        url: constants.BASE_URL+"tagsk",
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        form: { 'influxd': influxd }
    };

    request(options, function (error, resp, body) {
        if (error) {
            res.status(500).send('Connect to DNC failed!');
        }

        else {
            if (resp.statusCode == 200) {
                serdict = {};
                resdict = {};
                findict = {};

                var data = JSON.parse(resp.body);

                serdict["name"] = "HeatData";
                serdict["columns"] = ["tagKey"];
                serdict["values"] = data.message;
                resdict["statement_id"] = 0;
                resdict["series"] = [serdict];

                findict["results"] = [resdict];

                res.status(200).send(findict);
            }

            else {
                console.log("Tag Key Read Error")
                res.sendStatus(401);
            }
        }
    }

    );

}