import { GeneralResponse } from "./general-response.model";

export interface Translation {
    hebrew: string;
    isCorrect: boolean;
  }
  
export interface Word {
  englishWord: string;
  translations: Translation[];
  difficulty: number;
  category: string;
}
  
export interface WordList {
  words: Word[];
}

export interface AddWordResponse extends GeneralResponse{
  word: Word;
}
  