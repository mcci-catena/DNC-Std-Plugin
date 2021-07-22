/*############################################################################
# 
# Module: serverApi.js
#
# Description:
#     Server API entry point, initialize routes, responds for Plugin requests
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
#     V1.0.3 Wed Feb 17 2021 11:24:35 seenivasan
#       Module created
############################################################################*/

const express = require('express');
/*var request = require('request');*/

const app = express();

require('./app/routes/keys.route.js')(app);

require('./app/version.js')(app);
require('./app/client.js')(app);  // Read data of a Client
require('./app/login.js')(app);  // Once Read Sensor Data, this should replace the existing login.
require('./app/sread.js')(app);   // Read Data of a Location/Sensor with DNC


var server = app.listen(8892, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("WakeField Server API V1.0.0-2 - Listening http://%s:%s", host, port)
});

