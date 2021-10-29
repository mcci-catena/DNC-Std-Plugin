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

module.exports = (app) => {

    app.post('/dbs', keyctrl.getdbs);
    app.post('/meas/:dbn', keyctrl.getmeas);
    app.post('/fields', keyctrl.getfields);
    app.post('/tags', keyctrl.gettags);
    app.post('/tvals/:tkey', keyctrl.gettvals);
}