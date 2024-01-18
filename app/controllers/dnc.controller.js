// Import the 'request' module form NPM library
var request = require('request');

// Import the constants from the 'constants' module
const constants = require('../misc/constants');


// The getDevices method is a part of our API designed to 
// retrieve device information based on the provided client name. 
// This endpoint is crucial for obtaining a list of devices associated 
// with a particular client in our system.

// Default Input parameters : req, res
// Query parameter: client
// Response : Provide device list with Hardware ID and associated tags

exports.getDevices = (req, res) => {

    if(!req.query.client)
    {
        return res.status(400).send({
            message: "Client name missing"
        });
    }

    var options = {
        url: constants.DNC_URL+"gdevices",
        method: 'POST', 
        headers: {'Content-Type': 'application/json' },
        form: {'cname':req.query.client}
    };
    request(options, function(error,resp) {
        if(error)
        {
            res.status(500).send('connect to application failed!');
        }
        else
        {
            if(resp.statusCode == 200)
            {
                res.status(200).send(resp.body)
            }
            else
            {
                res.status(500).send(resp.body);
            }
        }
    });
}