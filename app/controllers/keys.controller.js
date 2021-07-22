const readsens = require('../influx.js');

exports.getfields = async (req, res) => {
    
    console.log("Request Fields")

    try{
        influxdata = await readsens.readKeys("show field keys")
        if(influxdata != 'error')
        {
            console.log(influxdata);
            return res.status(200).send({
                fields: influxdata.data
            });
           
        }

    }catch(err){
        return res.status(200).send({
            message: "Data not available for the sensor"
        });
    }
}

exports.gettags = async (req, res) => {
    
    console.log("Request Tags")

    try{
        influxdata = await readsens.readKeys("show tag keys")
        if(influxdata != 'error')
        {
            console.log(influxdata);
            return res.status(200).send({
                tags: influxdata.data
            });
           
        }

    }catch(err){
        return res.status(200).send({
            message: "Data not available for the sensor"
        });
    }

}


exports.gettvals = async (req, res) => {
    
    console.log("Request Tag Value")
    if(!req.params.tkey)
    {
        return res.status(400).send({
            message: "key field missing"
        });
    }

    try{
        influxdata = await readsens.readTvals("show tag values", req.params.tkey)
        if(influxdata != 'error')
        {
            console.log(influxdata);
            return res.status(200).send({
                tagvalues: influxdata.data
            });
           
        }

    }catch(err){
        return res.status(200).send({
            message: "Data not available for the sensor"
        });
    }

}