/*############################################################################
# 
# Module: auth.js
#
# Description:
#     API for token validation
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

// Import jsonwebtoken module from npm library
const jwt = require('jsonwebtoken');

// Import the constants from the 'constants' module 
const constants = require('./constants');

// The primary purpose of this module is to verify the JWT 
// received from the client 
// Input parameter - JWT in the request header
// Proceed to execute the next function if the JWT is valid one.
// Otherwise send response with the error code

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, constants.KEY_SECRET, (err, user) => {
            if(err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });        
    }
    else
    {
        res.sendStatus(401);
    }
};