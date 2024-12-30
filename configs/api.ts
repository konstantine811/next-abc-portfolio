export const API_PATH = {
  metaData: (locale: string, url: string) =>
    `/${locale}/api/fetchMetadata?url=${encodeURIComponent(url)}`,
};
