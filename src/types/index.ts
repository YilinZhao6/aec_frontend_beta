export interface SearchParams {
  query: string;
  conceptFamiliarity: number;
  referenceBook?: File;
  additionalComments?: string;
  selectedBooks?: string[];
}