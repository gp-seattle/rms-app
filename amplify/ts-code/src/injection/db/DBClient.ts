import { AWSError } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { PromiseResult } from "aws-sdk/lib/request"

/**
 * Database client following pattern of DynamoDB DocumentClient
 *
 * ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
 */
export interface DBClient {
    /**
     * Deletes a single item in a table by primary key by delegating to AWS.DynamoDB.deleteItem().
     */
    delete(params: DocumentClient.DeleteItemInput): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>>;
    /**
     * Returns a set of attributes for the item with the given primary key by delegating to AWS.DynamoDB.getItem().
     */
    get(params: DocumentClient.GetItemInput): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>>;
    /**
     * Creates a new item, or replaces an old item with a new item by delegating to AWS.DynamoDB.putItem().
     */
    put(params: DocumentClient.PutItemInput): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>>;
    /**
     * Edits an existing item's attributes, or adds a new item to the table if it does not already exist by delegating to AWS.DynamoDB.updateItem().
     */
    update(params: DocumentClient.UpdateItemInput): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>>;
    /**
     * Returns one or more items and item attributes by accessing every item in a table or a secondary index.
     */
    scan(params: DocumentClient.ScanInput): Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>>;
}