// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Action = {
  "BORROW": "borrow",
  "RETURN": "return"
};

const { Main, Items, Batch, Tags, History } = initSchema(schema);

export {
  Main,
  Items,
  Batch,
  Tags,
  History,
  Action
};