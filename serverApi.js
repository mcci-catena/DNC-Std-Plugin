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

const appconst = require('./app/misc/constants');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json())

require('./app/routes/keys.route.js')(app);
require('./app/routes/other.route.js')(app);

var server = app.listen(appconst.APP_PORT, function () {
  var host = server.address().address
  var port = server.address().port
  console.log(""+appconst.APP_NAME+" v"+appconst.APP_VERSION+" Listening http://%s:%s", host, port)
});