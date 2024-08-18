import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private scoreSubject = new BehaviorSubject<number>(0);
  score$ = this.scoreSubject.asObservable();

  private numberOfWordsSubject = new BehaviorSubject<number>(20); // Default to 20
  numberOfWords$ = this.numberOfWordsSubject.asObservable();


  constructor() {}

  updateScore(score: number) {
    this.scoreSubject.next(score);
  }

  getScore(): number {
    return this.scoreSubject.value;
  }

  resetScore() {
    this.scoreSubject.next(0);
  }

  updateNumberOfWords(numberOfWords: number) {
    this.numberOfWordsSubject.next(numberOfWords);
  }

  getNumberOfWords(): number {
    return this.numberOfWordsSubject.value;
  }
}