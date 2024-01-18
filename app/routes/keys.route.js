/*############################################################################
# 
# Module: keys.route.js
#
# Description:
#     Route declaration for InfluxDB measurement , Tag key and Tag value 
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

const keyctrl = require('../controllers/keys.controller');

const tokenfn = require('../misc/auth');

module.exports = (app) => {

    // app.method(Endpoint, Token validation, resource)
    // JWT - JSON Web Token
    //  Get list of database names under Influx 
    app.post('/dbs', tokenfn.authenticateJWT, keyctrl.getdbs);
    app.post('/meas/:dbn', tokenfn.authenticateJWT, keyctrl.getmeas);
    app.post('/fields', tokenfn.authenticateJWT, keyctrl.getfields);
    
    // Get list of tags under the measurement
    app.post('/tags', tokenfn.authenticateJWT, keyctrl.gettags);
    
    // Get Values for the given tag 
    app.post('/tvals/:tkey', tokenfn.authenticateJWT, keyctrl.gettvals);
}