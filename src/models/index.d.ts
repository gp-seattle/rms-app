import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Action {
  BORROW = "borrow",
  RETURN = "return"
}

export declare class Main {
  readonly id: string;
  readonly displayName: string;
  readonly description?: string;
  readonly tags?: string[];
  readonly items?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Main>);
  static copyOf(source: Main, mutator: (draft: MutableModel<Main>) => MutableModel<Main> | void): Main;
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
  constructor(init: ModelInit<Items>);
  static copyOf(source: Items, mutator: (draft: MutableModel<Items>) => MutableModel<Items> | void): Items;
}

export declare class Batch {
  readonly id: string;
  readonly val?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Batch>);
  static copyOf(source: Batch, mutator: (draft: MutableModel<Batch>) => MutableModel<Batch> | void): Batch;
}

export declare class Tags {
  readonly id: string;
  readonly val?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Tags>);
  static copyOf(source: Tags, mutator: (draft: MutableModel<Tags>) => MutableModel<Tags> | void): Tags;
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
  constructor(init: ModelInit<History>);
  static copyOf(source: History, mutator: (draft: MutableModel<History>) => MutableModel<History> | void): History;
}