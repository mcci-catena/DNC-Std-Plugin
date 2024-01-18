/*############################################################################
# 
# Module: version.js
#
# Description:
#     Endpoint for showing version
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
const appconst = require('./constants');

// The primary purpose of this module is to respond for the version endpoint
// Input parameter - None
// Response - Application Name and Version.

exports.getVersion = (req, res) => {
    res.status(200).json(""+appconst.APP_NAME+" v"+appconst.APP_VERSION);
}