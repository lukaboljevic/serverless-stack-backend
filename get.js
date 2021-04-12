import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

// We want to retrieve/get a note object given the userID
// (which atm is hard coded) and a noteID that is passed
// in through the request

export const main = handler(async (event, context) => {
    const params = {
        TableName: process.env.tableName,
        // 'Key' defines the partition key and sort key of the item to be retrieved
        Key: {
            userID: event.requestContext.identity.cognitoIdentityId, // The id of the author
            noteID: event.pathParameters.id, // The id of the note from the path
        },
    };

    const result = await dynamoDb.get(params);
    if (!result.Item) {
        throw new Error("Item not found.");
    }

    // Return the retrieved item
    return result.Item;
});
// everything we wrote inside handler() is the lambda function
// that retrieves one note from the DynamoDB called 'notes'