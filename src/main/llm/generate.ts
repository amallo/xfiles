/* eslint-disable import/prefer-default-export */
import { VectorStoreIndex, storageContextFromDefaults } from 'llamaindex';

import * as dotenv from 'dotenv';

import path from 'path';
import { getDocuments } from './loader';

// Load environment variables from local .env file
dotenv.config();

export async function generateCustomerDatasource(customerDir: string) {
  const storageContext = await storageContextFromDefaults({
    persistDir: path.join(customerDir, 'index'),
  });
  console.log('create storage context at', path.join(customerDir, 'index'));
  const documents = await getDocuments(path.join(customerDir, 'data'));
  return VectorStoreIndex.fromDocuments(documents, {
    storageContext,
  });
}
