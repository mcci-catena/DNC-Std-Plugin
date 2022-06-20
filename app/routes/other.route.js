/*############################################################################
# 
# Module: other.route.js
#
# Description:
#     Route declaration for Other Endpoints 
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

const verctrl = require('../misc/version');
const loginctrl = require('../controllers/login.controller')
const readctrl = require('../controllers/sread.controller')
const dncctrl = require('../controllers/dnc.controller')

const tokenfn = require('../misc/auth');

module.exports = (app) => {
    app.get('/version', verctrl.getVersion);
    app.post('/login', loginctrl.getLogin);   // Client login
    app.get('/sread', tokenfn.authenticateJWT, readctrl.readData);    // Read Sensor Data
    app.post('/devices', tokenfn.authenticateJWT, dncctrl.getDevices); 
}