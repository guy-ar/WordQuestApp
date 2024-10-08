import { GeneralResponse } from "./general-response.model";

export interface CreateGameResultRequest {
    userEmail: string
    score: number
    totalWords: number
    correctWords: number
    wordResults: WordResult[]
}

export interface WordResult {
    englishWord: string
    isCorrect: boolean
}

export interface GameResult {
  id: string;
  userName: string;
  createdAt: Date;
  score: number;
  correctWords: number;
  incorrectAnswers: number;
  totalWords: number;
}
export interface CreateGameResutResponse extends GeneralResponse {

}

export interface TopResultsResponse extends GeneralResponse {
  topResults: GameResult[]
}