const request = require('request');
const tokenfn = require('./auth.js');
const readsens = require('./influx.js');

module.exports = function (app) {
    //app.post('/fields', tokenfn.authenticateJWT ,(req, res) => {
    app.post('/fields', async (req, res) => {

        /*var influxd = {}
        influxd.uname = "seenivasanv";
        influxd.pwd = "vvasan";
        influxd.dbname = "csrb_activity_db"
        influxd.query = "Show field keys"*/
        console.log("Request Fields")

        try{
            influxdata = await readsens.readFields()
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
    })    
}


module.exports = function (app) {
    //app.post('/fields', tokenfn.authenticateJWT ,(req, res) => {
    app.post('/tags', async (req, res) => {

        /*var influxd = {}
        influxd.uname = "seenivasanv";
        influxd.pwd = "vvasan";
        influxd.dbname = "csrb_activity_db"
        influxd.query = "Show field keys"*/
        console.log("Request Tags")

        try{
            influxdata = await readsens.readFields()
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
    })    
}