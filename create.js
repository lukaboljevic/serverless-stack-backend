import * as uuid from "uuid";
// import AWS from "aws-sdk";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

// const dynamoDb = new AWS.DynamoDB.DocumentClient();
/*
once we added everything with Cognito, we can stop hardcoding the userID
This is actually NOT the user ID that is assigned in the User Pool.
This is the Federated Identity ID (or the Identity Pool user ID)

the requestContext.identity.cognitoIdentityId can be found within the
[nesto]-event.json files, within the mocks folder
*/

export const main = handler(async (event, context) => {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.tableName,  // name of our DynamoDB table
        Item: {
            // The attributes of the item to be created
            // userID: "123", // The id of the author
            userID: event.requestContext.identity.cognitoIdentityId, // The id of the author
            noteID: uuid.v1(), // A unique uuid generated somehow, see the docs for uuid.v1()
            content: data.content, // Parsed from request body, this is the content of the note
            attachment: data.attachment, // Parsed from request body, attachment to the note (image for example)
            // it's the name of the file uploaded to our S3 bucket notes-webproject-bucket
            createdAt: Date.now(), // Current Unix timestamp
        },
    };

    await dynamoDb.put(params);

    return params.Item;
});

// export async function main(event, context) {
//     // Request body is passed in as a JSON encoded string in 'event.body'
//     const data = JSON.parse(event.body);

//     const params = {
//         TableName: process.env.tableName, // name of our DynamoDB table
//         Item: {
//             // The attributes of the item to be created
//             userID: "123", // The id of the author
//             noteID: uuid.v1(), // A unique uuid
//             content: data.content, // Parsed from request body, this is the content of the note
//             attachment: data.attachment, // Parsed from request body, attachment to the note (image for example)
//             // it's the name of the file uploaded to our S3 bucket notes-webproject-bucket
//             createdAt: Date.now(), // Current Unix timestamp
//         },
//     };

//     try {
//         await dynamoDb.put(params).promise();

//         return {
//             statusCode: 200,
//             body: JSON.stringify(params.Item),
//         };
//     } catch (e) {
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: e.message }),
//         };
//     }
// }