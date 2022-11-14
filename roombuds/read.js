var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    // TODO: remember to input before running the application :)
    "accessKeyId": "", "secretAccessKey": ""
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
const read = function (email, password) {
    var params = {
        TableName: "signup",
        Key: {
            "email": email
        }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::read::error - " + JSON.stringify(err, null, 2));
        }
        else {
            if (data["Item"] == null) {
                console.log("Wrong username")
            } else if (data["Item"]["password"] == password) {
                console.log("users::read::success - " + JSON.stringify(data, null, 2));
            } else {
                console.log("Wrong password")
            }
        }
    })
}

export {read}