import { accessKeyId, secretAccessKey } from './secrets'
import { GetResponse, PutResponse } from './types'

var AWS = require('aws-sdk')
let awsConfig = {
  region: 'us-east-1',
  endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
}

let docClient = new AWS.DynamoDB.DocumentClient(awsConfig)

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
  console.log(table)

  try {
    await docClient.put(params).promise()
    console.log('users::save::success')
    return { success: true }
  } catch (err) {
    console.log('users::save::error - ' + JSON.stringify(err, null, 2))
    return {
      success: false,
      errorMessage: `users::save::error: ${JSON.stringify(err, null, 2)}`,
    }
  }
}

/**
 *
 * @param keyName key name of lookup (e.g. "email")
 * @param keyVal key value of lookup (e.g. "test@test.com")
 * @param table table name (e.g. Users)
 * @param attribute? attribute name of lookup (e.g. "firstName")
 * @returns GetResponse {success: boolean, data: any, errorMessage?: string}
 */
export const get = async (
  keyName: string,
  keyVal: any,
  table: string,
  attribute?: string
): Promise<GetResponse> => {
  var params = {
    TableName: table,
    Key: {
      [keyName]: keyVal,
    },
  }
  if (attribute !== undefined) {
    params = { ...params, ... { ProjectionExpression: attribute } }
  }
  try {
    const resp = await docClient.get(params).promise()
    var data = resp.Item
    if (attribute !== undefined) {
      data = data[attribute]
    }
    return { success: true, data: data }
  } catch (err) {
    console.log('users::read::error - ' + JSON.stringify(err, null, 2))
    return {
      success: false,
      errorMessage: `users::read::error: ${JSON.stringify(err, null, 2)}`,
    }
  }
}

/**
 *
 * @param data data to update into table (e.g. {"verified": "true"})
 * @param keyName key name of lookup (e.g. "email")
 * @param keyVal key value of lookup (e.g. "test@test.com")
 * @param table table name (e.g. "Users")
 * @returns PutResponse {success: boolean, errorMessage?: string}
 */

export const update = async (
  data: Record<string, any>,
  keyName: string,
  keyVal: any,
  table: string
): Promise<PutResponse> => {
  let updateExpression = 'set'
  let ExpressionAttributeNames: Record<string, string> = {}
  let ExpressionAttributeValues: Record<string, any> = {}
  for (const property in data) {
    updateExpression += ` #${property} = :${property} ,`
    ExpressionAttributeNames['#' + property] = property
    ExpressionAttributeValues[':' + property] = data[property]
  }

  updateExpression = updateExpression.slice(0, -1)
  let params = {
    TableName: table,
    Key: {
      [keyName]: keyVal,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
  }

  try {
    await docClient.update(params).promise()
    console.log('users::update::success')
    return { success: true }
  } catch (err) {
    console.log('users::update::error - ' + JSON.stringify(err, null, 2))
    return {
      success: false,
      errorMessage: `users::update::error: ${JSON.stringify(err, null, 2)}`,
    }
  }
}

export const scanTable = async (table: string) => {
  const params = {
    TableName: table,
  }

  const scanResults = []
  var items
  do {
    items = await docClient.scan(params).promise()
    items.Items.forEach((item) => scanResults.push(item))
    params.ExclusiveStartKey = items.LastEvaluatedKey
  } while (typeof items.LastEvaluatedKey !== 'undefined')

  return scanResults
}

// TODO: generalize
export const mergeTables = async (
  table1: string,
  table2: string,
  table3: string
) => {
  const res1 = await scanTable(table1)
  const res2 = await scanTable(table2)
  const res3 = await scanTable(table3)

  const scanResults = []

  // TODO: add error checls
  for (var i = 0; i < res1.length; i++) {
    var curr = res1[i]
    for (var j = 0; j < res2.length; j++) {
      if (curr.email == res2[j].email) {
        curr.firstName = res2[j].firstName
      }
    }

    for (var j = 0; j < res3.length; j++) {
      if (curr.email == res3[j].email) {
        curr.profilePicPath = res3[j].profilePicPath
      }
    }

    scanResults.push(curr)
  }

  console.log('banana')
  console.log(scanResults)
  return scanResults
}
