import { GeneralResponse } from "./general-response.model";

export interface Translation {
    hebrew: string;
    isCorrect: boolean;
  }
  
export interface Word {
  _id?: string;
  englishWord: string;
  translations: Translation[];
  difficulty: number;
  category: string;
}

export interface WordToAdd {
  englishWord: string
  correctTranslation: string
  incorrectTranslation1: string
  incorrectTranslation2: string
  incorrectTranslation3: string
  difficulty: number
  category: string
}
  
export interface WordList {
  words: Word[];
}

export interface AddWordResponse extends GeneralResponse{
  word: Word;
}

export interface GetWordsResponse extends GeneralResponse{
  count: number;
  words: Word[] 
}
export interface UploadWordsResponse extends GeneralResponse {
  results: UploadResult
}
export interface UploadResult {
  added: number
  errors: UploadError[]
  skipped: number
}

export interface UploadError {
  couse: string
  errorMsg?: string
}

export interface GetCategoriesResponse extends GeneralResponse{
  count: number;
  categories: string[] 
}

export interface UpdateWordResponse extends GeneralResponse {
  word: Word;
}