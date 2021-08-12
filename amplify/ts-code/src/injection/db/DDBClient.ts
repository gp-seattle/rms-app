import { DBClient } from "./DBClient"
import { AWSError, DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { PromiseResult } from "aws-sdk/lib/request"

export class DDBClient implements DBClient {
    private readonly docClient: DocumentClient

    public constructor(options?: DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration) {
        this.docClient = new DocumentClient(options)
    }

    public delete(params: DocumentClient.DeleteItemInput): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
        return this.docClient.delete(params).promise()
    }
    
    public get(params: DocumentClient.GetItemInput): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>> {
        return this.docClient.get(params).promise()
    }

    public put(params: DocumentClient.PutItemInput): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
        return this.docClient.put(params).promise()
    }

    public update(params: DocumentClient.UpdateItemInput): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> {
        return this.docClient.update(params).promise()
    }

    public scan(params: DynamoDB.DocumentClient.ScanInput): Promise<PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>> {
        return this.docClient.scan(params).promise()
    }
}