'use strict';

let request = require('request');
let AWS = require('aws-sdk');

AWS.config.update({
    region: "us-west-1"
});

let db = new AWS.DynamoDB.DocumentClient();
let data_table = "BroncoExpress";
let recent_table = "BroncoExpressRecent";
let api = "https://rqato4w151.execute-api.us-west-1.amazonaws.com/dev/info";

module.exports.updateInfo = (event, context, callback) =>
{
    request(api, function (error, response, body) {
        if (!error && response.statusCode == 200)
        {
            let data = JSON.parse(body);

            for (let i = 0; i < data.length; i++)
            {
                insertDataIntoDb(data_table, data[i]);
                insertDataIntoDbRecent(recent_table, data[i]);
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

module.exports.getRecent = (event, context, callback) =>
{
    console.log("Getting recent data");

    let params = {
        TableName: recent_table,
    };

    db.scan(params, function(err, data) {
        if (err) {
            console.log("Error getting recent data");

            callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: "Error getting shuttle data"
            });
        }
        else {
            console.log("Data gathered");
            callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(data.Items)
            });
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

function insertDataIntoDbRecent(table, data)
{
    let params = {
        TableName: table,
        Item: {
            "id": data.id,
            "logo": data.logo,
            "lat": data.lat,
            "lng": data.lng,
            "route": data.route
        }
    };

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

