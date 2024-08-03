import { Component, OnDestroy, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words/words.service';
import { Word, WordToAdd } from 'src/app/model/words.model';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-words',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss'],
})
export class WordsPage  implements OnInit, OnDestroy {

  words: Word[] = [];
  categories: string[] = ['Animals', 'Food', 'Technology', 'Sports']; // Add more categories as needed
  difficulties: number[] = [1, 2, 3];
  selectedCategory: string = '';
  selectedDifficulty: number | undefined = undefined;

  currentView: 'view' | 'add' = 'view';
  newWord: WordToAdd = { 
    englishWord: '',
    correctTranslation: '',
    incorrectTranslation1: '',
    incorrectTranslation2: '',
    incorrectTranslation3: '',
    difficulty: 1,
    category: ''
  };

  addWordSubscription?: Subscription

  constructor(private wordsService: WordsService,
    private toastController: ToastController
  ) { }
  ngOnDestroy(): void {
    this.addWordSubscription?.unsubscribe();
  }

  ngOnInit() {
    this.onAddWords()
    this.loadWords();
  }

  loadWords() {
    this.wordsService.getWords(this.selectedCategory, this.selectedDifficulty)
      .subscribe(
        response => {
          this.words = response.words;
        },
        error => {
          console.error('Error fetching words:', error);
          // Handle error (e.g., show a toast message)
        }
      );
  }

  onCategoryChange() {
    this.loadWords();
  }

  onDifficultyChange() {
    this.loadWords();
  }

  resetFilters() {
    this.selectedCategory = '';
    this.selectedDifficulty = undefined;
    this.loadWords();
  }

  validateForm(): boolean {
    return !!(this.newWord.englishWord &&
      this.newWord.correctTranslation &&
      this.newWord.incorrectTranslation1 &&
      this.newWord.incorrectTranslation2 &&
      this.newWord.incorrectTranslation3);
  }

  onAddWords() {
    this.addWordSubscription = this.wordsService.onAddWordDetails$.subscribe(
      addWordResponse => {
        if (addWordResponse && addWordResponse.success === true) {
          console.log('Word added successfully');
          this.presentToast('המילה נוספה בהצלחה');
          this.resetForm();
          this.currentView = 'view';
          this.loadWords();
        } else {
          this.presentToast('המילה לא נוספה');
          console.error('Error adding word:', addWordResponse?.message);
        }
      }
    );
  }
  addWord() {
    if (this.validateForm()) {
      const wordToAdd = {
        englishWord: this.newWord.englishWord,
        translations: [
          { hebrew: this.newWord.correctTranslation, isCorrect: true },
          { hebrew: this.newWord.incorrectTranslation1, isCorrect: false },
          { hebrew: this.newWord.incorrectTranslation2, isCorrect: false },
          { hebrew: this.newWord.incorrectTranslation3, isCorrect: false }
        ],
        difficulty: this.newWord.difficulty,
        category: this.newWord.category
      };
      this.wordsService.addWord(wordToAdd);
    } else {
      this.presentToast('אנא מלא את כל השדות');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  resetForm() {
    this.newWord = {
      englishWord: '',
      correctTranslation: '',
      incorrectTranslation1: '',
      incorrectTranslation2: '',
      incorrectTranslation3: '',
      difficulty: 1,
      category: ''
    };
  }

}
