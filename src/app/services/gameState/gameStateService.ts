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

  private selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  private selectedDifficultySubject = new BehaviorSubject<number>(0);
  selectedDifficulty$ = this.selectedDifficultySubject.asObservable();

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

  updateSelectedCategory(selectedCategory: string) {
    this.selectedCategorySubject.next(selectedCategory);
  }

  updateSelectedDifficulty(selectedDifficulty: number) {
    this.selectedDifficultySubject.next(selectedDifficulty);
  }
  
  getNumberOfWords(): number {
    return this.numberOfWordsSubject.value;
  }
  getSelectedCategory(): string {
    return this.selectedCategorySubject.value;
  }
  getSelectedDifficulty(): number {
    return this.selectedDifficultySubject.value;
  }
}