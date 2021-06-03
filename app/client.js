/*############################################################################
# 
# Module: client.js
#
# Description:
#     API for get client details
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
#     V1.0.2 Wed Feb 17 2021 11:24:35 seenivasan
#       Module created
############################################################################*/

const tokenfn = require('./auth.js');
var request = require('request');
const constants = require('./constants');

module.exports = function (app) {
    app.get('/client', tokenfn.authenticateJWT ,(req, res) => {
        var options = {
            url: 'http://localhost:8082/gclient',
            method: 'POST', // Don't forget this line
            headers: {'Content-Type': 'application/json' },
            form: {'cname':req.query.cname, 'uname': req.user.user.uname }
            //form: {'cname':req.query.cname}
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
                  res.status(500).send(resp.body);
               }
            }
        });     
    });
}