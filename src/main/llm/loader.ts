import { SimpleDirectoryReader } from 'llamaindex';

export const DATA_DIR = './data';

export async function getDocuments(directoryPath: string) {
  return new SimpleDirectoryReader().loadData({
    directoryPath,
  });
}
