import { DocumentClient } from "aws-sdk/clients/dynamodb"

export const MAIN_TABLE: string = process.env.STORAGE_MAIN_NAME

/**
 * @param name Name of item type. This needs to be unique.
 * @param description Optional description of item.
 * @param tags Tags to categorize item.
 * @param items List of IDs of all items of this item type.
 * @param id ID of item. User specified.
 */
export interface MainSchema {
    name: string,
    description: string,
    tags?: DocumentClient.StringSet,
    items: { [id: string]: ItemSchema }
}

/**
 * @param owner Name of the owner of the item or where the item is stored.
 * @param notes Notes specific to this item.
 * @param borrower Current borrower of item. Blank if available. Initialized as blank.
 * @param history List of entries in the history table
 * @param schedule List of entries in the schedule table [TODO: Implement Schedule]
 * @param batch List of batches this item is part of.
 */
export interface ItemSchema {
    owner: string,
    borrower: string,
    batch?: DocumentClient.StringSet,
    history?: DocumentClient.StringSet,
    schedule?: DocumentClient.StringSet,
    notes: string
}

export const ITEMS_TABLE: string = process.env.STORAGE_ITEMS_NAME
export interface SecondaryIndexSchema {
    key: string,
    val: string
}

export const BATCH_TABLE: string = process.env.STORAGE_BATCH_NAME
export const TAGS_TABLE: string = process.env.STORAGE_TAGS_NAME
export interface SearchIndexSchema {
    key: string,
    val?: DocumentClient.StringSet
}

export const HISTORY_TABLE: string = process.env.STORAGE_HISTORY_NAME
/**
 * @param key Random Time Related Unique Key, where the first part of the key is the creation time.
 * @param name Name of Item
 * @param id ID of Item
 * @param borrower Name of Borrower
 * @param action Either borrow or return the specified.
 * @param notes Optional notes about this action.
 * @param timestamp Time when item was created (in epoch milliseconds)
 */
export interface HistorySchema {
    key: string,
    name: string,
    id: string,
    borrower: string,
    action: "borrow" | "return",
    notes: string,
    timestamp: number
}

export const TRANSACTIONS_TABLE: string = process.env.STORAGE_TRANSACTIONS_NAME
/**
 * @param number Phone Number being used for response.
 * @param type Type of transaction being performed
 * @param scratch Scratch space used by transactions. Initialized as empty.
 */
export interface TransactionsSchema {
    number: string,
    type: string,
    scratch: any
}