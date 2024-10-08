import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AddWordResponse, GetCategoriesResponse, GetWordsResponse, UpdateWordResponse, UploadWordsResponse, Word, WordList } from 'src/app/model/words.model';
import { environment } from 'src/environments/environment';
import { GameStateService } from '../gameState/gameStateService';


@Injectable({
  providedIn: 'root'
})
export class WordsService {
  private allWordsList: Word[] = [];
  private  wordsList$ = new Subject<Word[] | null>();
  public onWordsList$ = this.wordsList$.asObservable();

  private knownWords: Set<string> = new Set();
  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })

  private addWordDetails$ = new Subject<AddWordResponse | null>();
  public onAddWordDetails$ = this.addWordDetails$.asObservable();

  private updateWordDetails$ = new Subject<UpdateWordResponse | null>();
  public onUpdateWordDetails$ = this.updateWordDetails$.asObservable();

  constructor(private http: HttpClient,
    private gameStateService: GameStateService
  ) {}

  // private loadWords() {
  //   this.http.get<WordList>('assets/json/wordsList.json').subscribe(
  //     data => this.wordList = data.words,
  //     error => console.error('Error loading word list:', error)
  //   );
  // }

  loadWords() {
    this.getWords() //this.selectedCategory, this.selectedDifficulty
      .subscribe({
        next: response => {
          this.allWordsList = response.words;
        },
        error: error => {
          console.error('Error fetching words:', error);
          // Handle error (e.g., show a toast message)
        }
    });
  }

  loadRandomWords() {
    const quantity = this.gameStateService.getNumberOfWords();
    let category:string | undefined = this.gameStateService.getSelectedCategory();
    if (category === 'הכל') {
      category = undefined;
    }
    let difficulty: number | undefined = this.gameStateService.getSelectedDifficulty();
      let params: any = {};
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty.toString();
      if (quantity) params.quantity = quantity.toString();
      
      this.http.get<GetWordsResponse>(environment.apiUrl + 'words/random', { params })
        .pipe(
          tap(data => {
            if (!data?.success) {
              if (data?.message) {
                console.error(data?.message); 
              } else {
                console.error("addWordService: Something went wrong"); 
              }
              this.wordsList$.next(null);
            } else {
              this.wordsList$.next(data?.words);
            }
          }),
          catchError((err: HttpErrorResponse) => {
            console.error(err);
            this.addWordDetails$.next(null)
            throw err;
          })
        ).subscribe();
    
  }
  getWords(category?: string, difficulty?: number): Observable<GetWordsResponse> {
    let params: any = {};
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty.toString();
    
    return this.http.get<GetWordsResponse>(environment.apiUrl + 'words', { params });
  }

  uploadWordsFile(formData: FormData): Observable<any> {
    return this.http.post<UploadWordsResponse>(environment.apiUrl + `words/upload`, formData);
  }

  addWord(newWord: Word) {
    const options = {
      headers: this.headers
    }

    this.allWordsList.push(newWord);

    // Here you would typically save the updated word list to your backend or local storage
    // For this example, we'll just log it to the console
    console.log('Updated word list:', newWord);
    
    return this.http.post<AddWordResponse>(environment.apiUrl + 'words/add', newWord, options)
    .pipe(
      tap(data => {
        if (!data?.success) {
          if (data?.message) {
            console.error(data?.message); 
          } else {
            console.error("addWordService: Something went wrong"); 
          }
        }
        this.addWordDetails$.next(data?.success === true ? data : null);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this.addWordDetails$.next(null)
        throw err;
      })
    ).subscribe();
    
  }

  updateWord(wordId: string, updatedWord: Word): Observable<UpdateWordResponse> {
    const options = {
      headers: this.headers
    };

    return this.http.put<UpdateWordResponse>(`${environment.apiUrl}words/${wordId}`, updatedWord, options)
      .pipe(
        tap(data => {
          if (!data?.success) {
            console.error(data?.message || "updateWordService: Something went wrong");
          }
          this.updateWordDetails$.next(data?.success === true ? data : null);
        }),
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.updateWordDetails$.next(null);
          throw err;
        })
      );
  }

  getWordsByCategory(category: string): Word[] {
    return this.allWordsList.filter(word => word.category === category);
  }

  getWordsByDifficulty(difficulty: number): Word[] {
    return this.allWordsList.filter(word => word.difficulty === difficulty);
  }

  geWordCategories(): Observable<GetCategoriesResponse> {
    return this.http.get<GetCategoriesResponse>(environment.apiUrl + 'words/categories');
  }
}