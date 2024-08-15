import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AddWordResponse, GetWordsResponse, UploadWordsResponse, Word, WordList } from 'src/app/model/words.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WordsService {
  private wordList: Word[] = [];
  private knownWords: Set<string> = new Set();
  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })

  private addWordDetails$ = new Subject<AddWordResponse | null>();
  public onAddWordDetails$ = this.addWordDetails$.asObservable();

  constructor(private http: HttpClient) {
    this.loadWords();
  }

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
          this.wordList = response.words;
        },
        error: error => {
          console.error('Error fetching words:', error);
          // Handle error (e.g., show a toast message)
        }
    });
  }

  // addWord(newWord: {
  //   englishWord: string;
  //   translations: { hebrew: string; isCorrect: boolean }[];
  //   difficulty: number;
  //   category: string;
  // }): Observable<any> {
  //   return this.http.post(environment.apiUrl + 'words/add', newWord);
  // }

  getWords(category?: string, difficulty?: number): Observable<GetWordsResponse> {
    let params: any = {};
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty.toString();
    
    return this.http.get<GetWordsResponse>(environment.apiUrl + 'words', { params });
  }

  uploadWordsFile(formData: FormData): Observable<any> {
    return this.http.post<UploadWordsResponse>(environment.apiUrl + `words/upload`, formData);
  }

  addWord(newWord: {
    englishWord: string;
    translations: { hebrew: string; isCorrect: boolean }[];
    difficulty: number;
    category: string;
  }) {
    const options = {
      headers: this.headers
    }

    this.wordList.push(newWord);

    // Here you would typically save the updated word list to your backend or local storage
    // For this example, we'll just log it to the console
    console.log('Updated word list:', this.wordList);
    
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

  getRandomWord(): Word | undefined {
    const unknownWords = this.wordList.filter(word => !this.knownWords.has(word.englishWord));
    if (unknownWords.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * unknownWords.length);
    return unknownWords[randomIndex];
  }

  getRandomWordsForGame(amount: number): Word[] {
    const wordsForGame: Word[] = [];
    for (let i = 0; i < amount; i++) {
      const word = this.getRandomWord();
      if (word) {
        this.markWordAsKnown(word.englishWord);
        wordsForGame.push(word);
      }
    }
    return wordsForGame;
  }

  markWordAsKnown(word: string) {
    this.knownWords.add(word);
  }
  

  resetKnownWords() {
    this.knownWords.clear();
  }

  getKnownWordsCount(): number {
    return this.knownWords.size;
  }

  getTotalWordsCount(): number {
    return this.wordList.length;
  }

  getWordsByCategory(category: string): Word[] {
    return this.wordList.filter(word => word.category === category);
  }

  getWordsByDifficulty(difficulty: number): Word[] {
    return this.wordList.filter(word => word.difficulty === difficulty);
  }
}