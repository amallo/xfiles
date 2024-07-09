/* eslint-disable import/prefer-default-export */
import { Ollama, OllamaEmbedding, Settings } from 'llamaindex';

const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 20;

export const initSettings = async () => {
  Settings.llm = new Ollama({
    model: process.env.MODEL as string,
  });
  Settings.chunkSize = CHUNK_SIZE;
  Settings.chunkOverlap = CHUNK_OVERLAP;
  Settings.embedModel = new OllamaEmbedding({
    model: process.env.EMBEDDING_MODEL as string,
  });
};
