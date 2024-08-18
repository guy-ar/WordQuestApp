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
export interface CreateGameResutResponse extends GeneralResponse {

}