/*############################################################################
# 
# Module: login2.js
#
# Description:
#     API for login request from Plugin
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

const jwt = require('jsonwebtoken');
var request = require('request');
const constants = require('./constants');


module.exports = function(app) {
    app.post('/login',  verifyAccount, function(req, res) {
    
    const user = req.query
    
    jwt.sign({user}, constants.KEY_SECRET, {expiresIn: '1800s'}, (err, token) => {
            if(token)
            {
                var apidata = JSON.parse(req.apidata);
                var apires = apidata.results;
                var resdict = {};
                for(var key in apires)
                {
                    resdict[key] = apires[key];
                }
                resdict["token"] = token;
                res.status(200).send(resdict); 
            }
            else
            {
                res.status(500).send("Token creation failed");
            }
        });
    });   
}


function verifyAccount(req, res, next){

    const { uname, pwd } = req.query;
    
    if(!uname || !pwd)
    {
        res.status(406).send("input data missing");
    }
    else
    {
        var options = {
            url: 'http://localhost:8891/plogin',
            method: 'POST', 
            headers: {'Content-Type': 'application/json' },
            form: {'uname':uname,'pwd':pwd }
        };
 
        request(options, function(error, resp) {
            if(error)
            {
                res.status(500).send('connect to application failed!');
            }
            else
            {
                console.log("Reply received from Plugin")
                if(resp.statusCode == 200)
                {
                    console.log("Resp code 200: ", resp.body)
                    req.apidata = resp.body;
                    next();
                }
                else
                {
                    //console.error(resp.body)
                    console.log("Resp code != 200: ", resp.body)
                    res.status(401).send(resp.body);
                }
            }
        });
    }
}