import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
/*
List all the notes a user has
*/
export const main = handler(async (event, context) => {
    const params = {
        TableName: process.env.tableName,
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId'
        //   partition key
        KeyConditionExpression: "userID = :userID",
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be the id of the author
        ExpressionAttributeValues: {
            // again, once we have added everything with Cognito, we can
            // stop hardcoding the user ID.
            // ":userID": "123"
            ":userID": event.requestContext.identity.cognitoIdentityId, // The id of the author,
        },
    };

    const result = await dynamoDb.query(params);

    // Return the matching list of items in response body
    return result.Items;
});