import { GetResponse, PutResponse } from './types'

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

/**
 *
 * @param data data to insert into table (e.g. {"email": "test@test.com", "password": "pass"})
 * @param table table name (e.g. "Users")
 * @returns PutResponse {success: boolean, errorMessage?: string}
 */
export const put = async (data: any, table: string): Promise<PutResponse> => {
  let params = {
    TableName: table,
    Item: data,
  }

  await docClient.put(params, function (err: any, data: any) {
    if (err) {
      console.log('users::save::error - ' + JSON.stringify(err, null, 2))
      return {
        success: false,
        errorMessage: `users::save::error: ${JSON.stringify(err, null, 2)}`,
      }
    } else {
      console.log('users::save::success')
      return { success: true }
    }
  })
  return { success: false, errorMessage: 'unknown error' }
}

/**
 *
 * @param keyName key name of lookup (e.g. "email")
 * @param keyVal key value of lookup (e.g. "test@test.com")
 * @param table table name (e.g. Users)
 * @returns GetResponse {success: boolean, data: any, errorMessage?: string}
 */
export const get = async (
  keyName: string,
  keyVal: any,
  table: string
): Promise<GetResponse> => {
  var params = {
    TableName: table,
    Key: {
      [keyName]: keyVal,
    },
  }

  try {
    const resp = await docClient.get(params).promise()
    return { success: true, data: resp.Item }
  } catch (err) {
    console.log('users::read::error - ' + JSON.stringify(err, null, 2))
    return {
      success: false,
      errorMessage: `users::read::error: ${JSON.stringify(err, null, 2)}`,
    }
  }
}
