import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private scoreSubject = new BehaviorSubject<number>(0);
  score$ = this.scoreSubject.asObservable();

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
}