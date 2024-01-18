/*############################################################################
# 
# Module: login.js
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
#     V1.0.0 Fri Oct 22 2021 11:24:35 seenivasan
#       Module created
############################################################################*/

// Import the 'jsonwebtoken' module form NPM library
const jwt = require('jsonwebtoken');

// Import the 'request' module form NPM library
var request = require('request');

// Import the constants from the 'constants' module
const constants = require('../misc/constants');

// End point for login into DNC Server application
// Input parameter - req.query.uname, req.query.pwd
// Response - If it is admin user - JWT and {"clients": []}
// contains list of all clients
// If it is General user - JWT and {"clients": []}
// Contains a client name associated with the user.

exports.getLogin = (req, res) => {
    const { uname, pwd } = req.query;
    
    if(!uname || !pwd)
    {
        res.status(406).send("input data missing");
    }
    else
    {
        var options = {
            url: constants.DNC_URL+"plogin",
            method: 'POST', 
            headers: {'Content-Type': 'application/json' },
            form: {'uname':uname,'pwd':pwd }
        };
 
        request(options, function(error, resp) {
            if(error)
            {
                res.status(500).send('connect to DNC Server failed!');
            }
            else
            {
                //console.log("Reply received from Plugin")
                if(resp.statusCode == 200)
                {
                    req.apidata = resp.body;
                    addToken(req, res)
                }
                else
                {
                    res.status(401).send(resp.body);
                }
            }
        });
    }
}


// Once the User credentials are validated
// this will create the JWT
// Response - Send JWT with the Client details

function addToken(req, res) {
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
}