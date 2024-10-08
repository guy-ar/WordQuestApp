import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap } from 'rxjs';
import { CreateGameResultRequest, TopResultsResponse, WordResult } from 'src/app/model/game-result.model';
import { GeneralResponse } from 'src/app/model/general-response.model';
import { Word } from 'src/app/model/words.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameResultService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })

  private createGameResultResponse$ = new Subject<GeneralResponse | null>();
  public onGreateGameResultResponse$ = this.createGameResultResponse$.asObservable();

  private getTopResultsResponse$ = new Subject<TopResultsResponse | null>();
  public onGetTopResultsResponse$ = this.getTopResultsResponse$.asObservable();

  constructor(private http: HttpClient) { }

  transferWordsToWordResults(knownWords: Word[], failedWords: Word[]) : WordResult[] {
    const wordResults: WordResult[] = [];
    for (let i = 0; i < knownWords.length; i++) {
      const word = knownWords[i];
      wordResults.push({
        englishWord: word.englishWord,
        isCorrect: true
      })
    }
    for(let i = 0; i < failedWords.length; i++) {
      const word = failedWords[i];
      wordResults.push({
        englishWord: word.englishWord,
        isCorrect: false 
      })
    }

    failedWords.forEach(word => {
      wordResults.push({
        englishWord: word.englishWord,
        isCorrect: false
      })  
    });
    return wordResults;
    
  }
  createGameResult(request: CreateGameResultRequest) {
    const options = {
      headers: this.headers
    }

    return this.http.post<GeneralResponse>(environment.apiUrl + 'gameResults/add', request, options)
    .pipe(
      tap(data => {
        if (!data?.success) {
          if (data?.message) {
            console.error(data?.message); 
          } else {
            console.error("createGameResultService: Something went wrong"); 
          }
        }
        this.createGameResultResponse$.next(data?.success === true ? data : null);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this.createGameResultResponse$.next(null)
        throw err;
      })
    ).subscribe();

  }
  getTopResults(quantity: number) {
    
    let params: any = {};
    params.quantity = quantity.toString();
    
    this.http.get<TopResultsResponse>(environment.apiUrl + 'gameResults/topResults', {params})
    .pipe(
      tap(data => {
        if (!data?.success) {
          if (data?.message) {
            console.error(data?.message); 
          } else {
            console.error("topResults: Something went wrong"); 
          }
        }
        this.getTopResultsResponse$.next(data?.success === true ? data : null);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this.getTopResultsResponse$.next(null)
        throw err;
      })
    ).subscribe();

  }
}
