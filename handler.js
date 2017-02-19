'use strict';

let request = require('request');
let AWS = require('aws-sdk');

AWS.config.update({
    region: "us-west-1"
});

// let db = new AWS.DynamoDB.DocumentClient();
// let table = "BroncoExpress";

module.exports.updateInfo = (event, context, callback) =>
{
    // Contains incoming request data (e.g., query params, headers and more)
    console.log(event);

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Shuttle data updated!'
        }),
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
    };



    // send back to page
    callback(null, response);
};
