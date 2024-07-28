import { Component, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words/words.service';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage  implements OnInit {
  newWord = {
    englishWord: '',
    correctTranslation: '',
    incorrectTranslation1: '',
    incorrectTranslation2: '',
    incorrectTranslation3: '',
    difficulty: 1,
    category: ''
  };
  addWordSubscription?: Subscription

  constructor(
    private wordService: WordsService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.addWordSubscription = this.wordService.onAddWordDetails$.subscribe(
      addWordResponse => {
        if (addWordResponse && addWordResponse.success === true) {
          this.presentToast('המילה נוספה בהצלחה');
          this.resetForm();
        } else {
          this.presentToast('המילה לא נוספה');
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
      this.wordService.addWord(wordToAdd);
    } else {
      this.presentToast('אנא מלא את כל השדות');
    }
  }
  validateForm(): boolean {
    return !!(this.newWord.englishWord &&
      this.newWord.correctTranslation &&
      this.newWord.incorrectTranslation1 &&
      this.newWord.incorrectTranslation2 &&
      this.newWord.incorrectTranslation3);
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}

