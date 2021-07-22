/*############################################################################
# 
# Module: version.js
#
# Description:
#     API responds for the SW version request
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
#     V1.0.3 Wed Feb 23 2021 11:24:35 seenivasan
#       Module created
############################################################################*/

module.exports = function (app) {
    app.get('/version', function(req, res) {
        res.status(200).json('WakeFiled Server API V1.0.0-2');
    });
}
