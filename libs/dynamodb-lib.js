import AWS from "aws-sdk";
/*
Here we are creating a convenience object that exposes the DynamoDB client
methods that we are going to need in this guide.
*/
const client = new AWS.DynamoDB.DocumentClient();

export default {
    get: (params) => client.get(params).promise(),
    put: (params) => client.put(params).promise(),
    query: (params) => client.query(params).promise(),
    update: (params) => client.update(params).promise(),
    delete: (params) => client.delete(params).promise(),
};