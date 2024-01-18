/*############################################################################
# 
# Module: serverApi.js
#
# Description:
#     Endpoint implementation for Excel Plugin requests, initialize routes
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

// Import the constants from the 'constants' module
const appconst = require('./app/misc/constants');

// Import the 'express' module
const express = require('express');

// Import the 'body-parser' module
const bodyParser = require('body-parser');

// Create instance of the 'express' application
const app = express();

// Let the express application to use the 
// middleware to parse JSON in the request body
app.use(bodyParser.json())

// Import the routes declared in the respective modules
require('./app/routes/keys.route.js')(app);
require('./app/routes/other.route.js')(app);

// Start the API Server to Listen to the given Port
var server = app.listen(appconst.APP_PORT, function () {
  var host = server.address().address
  var port = server.address().port
  console.log(""+appconst.APP_NAME+" v"+appconst.APP_VERSION+" Listening http://%s:%s", host, port)
});