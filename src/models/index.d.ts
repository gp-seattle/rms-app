import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Action {
  BORROW = "borrow",
  RETURN = "return"
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

type ScheduleMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Main {
  readonly id: string;
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
  readonly val?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Batch, BatchMetaData>);
  static copyOf(source: Batch, mutator: (draft: MutableModel<Batch, BatchMetaData>) => MutableModel<Batch, BatchMetaData> | void): Batch;
}

export declare class Tags {
  readonly id: string;
  readonly val?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Tags, TagsMetaData>);
  static copyOf(source: Tags, mutator: (draft: MutableModel<Tags, TagsMetaData>) => MutableModel<Tags, TagsMetaData> | void): Tags;
}

export declare class History {
  readonly id: string;
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

export declare class Schedule {
  readonly id: string;
  readonly borrower: string;
  readonly itemId: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly notes?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Schedule, ScheduleMetaData>);
  static copyOf(source: Schedule, mutator: (draft: MutableModel<Schedule, ScheduleMetaData>) => MutableModel<Schedule, ScheduleMetaData> | void): Schedule;
}