export const API_PATH = {
  metaData: (url: string) =>
    `/api/fetchMetadata?url=${encodeURIComponent(url)}`,
};
