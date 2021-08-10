// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Action = {
  "BORROW": "borrow",
  "RETURN": "return"
};

const { Main, Items, Batch, Tags, History, PaginatedMains, PaginatedItems, PaginatedBatches, PaginatedTags, PaginatedHistories } = initSchema(schema);

export {
  Main,
  Items,
  Batch,
  Tags,
  History,
  Action,
  PaginatedMains,
  PaginatedItems,
  PaginatedBatches,
  PaginatedTags,
  PaginatedHistories
};