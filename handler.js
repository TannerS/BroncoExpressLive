'use strict';

let request = require('request');
let AWS = require('aws-sdk');

AWS.config.update({
    region: "us-west-1"
});

let db = new AWS.DynamoDB.DocumentClient();
let data_table = "BroncoExpress";
let api = "https://rqato4w151.execute-api.us-west-1.amazonaws.com/dev/info";



module.exports.updateInfo = (event, context, callback) =>
{
    // Contains incoming request data (e.g., query params, headers and more)
    // console.log("EVENT: " + event);

    // load this url
    request(api, function (error, response, body) {
        if (!error && response.statusCode == 200)
        {
            let data = JSON.parse(body);

            for (let i = 0; i < data.length; i++)
            {
                insertDataIntoDb(data_table, data[i]);
            }

            // send back to page
            callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Shuttle data updated!'
                    }),
                    // body: {
                    //     message: "<h1>Data Inserted Sucesfully</h1>"
                    // },
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

        }
    });


};


function insertDataIntoDb(table, data)
{
    let params = {
        TableName: table,
        Item: {
            "id": data.id,
            "timestamp": Date.now(),
            "logo": data.logo,
            "lat": data.lat,
            "lng": data.lng,
            "route": data.route
        }
    };

    // console.log("PARAMS: " + params);

    db.put(params, function(err, data) {
        if (err)
        {
            console.error("Problem adding data: ", JSON.stringify(err));
        }
        else
        {
            console.log("Added item: ", JSON.stringify(data));
        }
    });
}


