import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Action {
  BORROW = "borrow",
  RETURN = "return"
}

export declare class PaginatedMains {
  readonly mains: Main[];
  readonly nextToken?: string;
  constructor(init: ModelInit<PaginatedMains>);
}

export declare class PaginatedItems {
  readonly items: Items[];
  readonly nextToken?: string;
  constructor(init: ModelInit<PaginatedItems>);
}

export declare class PaginatedBatches {
  readonly batches: Batch[];
  readonly nextToken?: string;
  constructor(init: ModelInit<PaginatedBatches>);
}

export declare class PaginatedTags {
  readonly tags: Tags[];
  readonly nextToken?: string;
  constructor(init: ModelInit<PaginatedTags>);
}

export declare class PaginatedHistories {
  readonly histories: History[];
  readonly nextToken?: string;
  constructor(init: ModelInit<PaginatedHistories>);
}

type MainMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ItemsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BatchMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TagsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type HistoryMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Main {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly description?: string;
  readonly tags?: string[];
  readonly items?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Main, MainMetaData>);
  static copyOf(source: Main, mutator: (draft: MutableModel<Main, MainMetaData>) => MutableModel<Main, MainMetaData> | void): Main;
}

export declare class Items {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly borrower: string;
  readonly batch?: string[];
  readonly history?: string[];
  readonly schedule?: string[];
  readonly notes?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Items, ItemsMetaData>);
  static copyOf(source: Items, mutator: (draft: MutableModel<Items, ItemsMetaData>) => MutableModel<Items, ItemsMetaData> | void): Items;
}

export declare class Batch {
  readonly id: string;
  readonly key: string;
  readonly val?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Batch, BatchMetaData>);
  static copyOf(source: Batch, mutator: (draft: MutableModel<Batch, BatchMetaData>) => MutableModel<Batch, BatchMetaData> | void): Batch;
}

export declare class Tags {
  readonly id: string;
  readonly key: string;
  readonly val?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Tags, TagsMetaData>);
  static copyOf(source: Tags, mutator: (draft: MutableModel<Tags, TagsMetaData>) => MutableModel<Tags, TagsMetaData> | void): Tags;
}

export declare class History {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly itemId: string;
  readonly borrower: string;
  readonly action: Action | keyof typeof Action;
  readonly notes?: string;
  readonly timestamp: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<History, HistoryMetaData>);
  static copyOf(source: History, mutator: (draft: MutableModel<History, HistoryMetaData>) => MutableModel<History, HistoryMetaData> | void): History;
}