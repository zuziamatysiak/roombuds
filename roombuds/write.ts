var AWS = require('aws-sdk')
let awsConfig = {
  region: 'us-east-1',
  endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
  // TODO: remember to input before running the application :)
  accessKeyId: '',
  secretAccessKey: '',
}
AWS.config.update(awsConfig)

let docClient = new AWS.DynamoDB.DocumentClient()

const write = (data: any): String | boolean => {
  let params = {
    TableName: 'signup',
    Item: data,
  }
  docClient.put(params, function (err: any, data: any) {
    if (err) {
      console.log('users::save::error - ' + JSON.stringify(err, null, 2))
      return `users::save::error: ${JSON.stringify(err, null, 2)}`
    }
  })
  console.log('users::save::success')
  return true
}

export { write }
