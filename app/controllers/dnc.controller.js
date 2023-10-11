var request = require('request');
const constants = require('../misc/constants');


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