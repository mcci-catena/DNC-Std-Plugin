/*############################################################################
# 
# Module: constants.js
#
# Description:
#     Constant decleration
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

// Define constants 
// APP_NAME - Name of the Application
// APP_VERSION - Version of the Application
// APP_PORT - Application Port
// KEY_SECRET - Secret key for generating JWT
// IFDB_URL - InfluxDB Server URL
// DNC_URL - DNC Server URL

module.exports = Object.freeze({
    APP_NAME: 'Excel Plugin API',
    APP_VERSION: '1.1.5',
    APP_PORT: 8892,

    KEY_SECRET: 'mcciradweindiauspvp',

    IFDB_URL: "http://influxdb:8086/",
    DNC_URL: "http://localhost:8891/",

    // HTTPS reponse Status Codes
    OK : 200,
    Not_found : 404,
    Internal_Server_Error : 500,
    Created : 201,
    No_content : 204,
    Modified : 304,
    Bad_request : 400,
    Unauthorized : 401,
    Forbidden: 403,
    Not_implemented: 501
});
