import { accessKeyId, secretAccessKey } from './secrets'

var AWS = require('aws-sdk')

export const uploadS3 = async (
  file: File,
  key: string,
  bucket = 'roombuds'
) => {
  let awsConfig = {
    region: 'us-east-1',
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  }
  let s3 = new AWS.S3(awsConfig)

  try {
    await s3.putObject({ Bucket: bucket, Key: key, Body: file }).promise()
    return { success: true }
  } catch (err) {
    console.log('profpic::upload::error - ' + err)
    return {
      success: false,
      errorMessage: `profpic::upload::error: ${err}`,
    }
  }
}

export const deleteS3 = async (key: string, bucket = 'roombuds') => {
  let awsConfig = {
    region: 'us-east-1',
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  }
  let s3 = new AWS.S3(awsConfig)

  try {
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise()
    return { success: true }
  } catch (err) {
    console.log('profpic::delete::error - ' + err)
    return {
      success: false,
      errorMessage: `profpic::delete::error: ${err}`,
    }
  }
}
