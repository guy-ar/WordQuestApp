import { Component, OnDestroy, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words/words.service';
import { Word, WordToAdd } from 'src/app/model/words.model';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-words',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss'],
})
export class WordsPage  implements OnInit, OnDestroy {

  words: Word[] = [];
  categories: string[] = []; 
  
  selectedCategory: string = '';
  selectedDifficulty: number | undefined = undefined;

  currentView: 'view' | 'add' | 'upload' | 'edit' = 'view';
  selectedFile: File | null = null;

  editingWord: Word | null = null;
  isEditing = false;

  newWord: WordToAdd = { 
    englishWord: '',
    correctTranslation: '',
    incorrectTranslation1: '',
    incorrectTranslation2: '',
    incorrectTranslation3: '',
    difficulty: 1,
    category: ''
  };

  private subscriptions: Subscription[] = [];

  constructor(private wordsService: WordsService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.onAddWords()
    this.loadWords();
    this.loadCategories();
    this.onUpdateWord();
  }

  loadWords() {
    const sub = this.wordsService.getWords(this.selectedCategory, this.selectedDifficulty)
      .subscribe({
        next: response => {
          this.words = response.words;
        },
        error: error => {
          console.error('Error fetching words:', error);
          this.presentToast('שגיאה בטעינת המילים. נסה שוב מאוחר יותר.');
        }
      });
    this.subscriptions.push(sub);
  }

  loadCategories() {
    const sub = this.wordsService.geWordCategories()
      .subscribe({
        next: response => {
          this.categories = response.categories;
        },
        error: error => {
          console.error('Error fetching categories:', error);
          this.presentToast('שגיאה בטעינת הקטגוריות. נסה שוב מאוחר יותר.');
        }
      });
    this.subscriptions.push(sub);
  }

  onUpdateWord() {
    const sub = this.wordsService.onUpdateWordDetails$
      .subscribe({
        next: (updateWordResponse) => {
          if (updateWordResponse?.success) {
            this.presentToast('המילה עודכנה בהצלחה');
            this.loadWords();
            this.isEditing = false;
            this.editingWord = null;
          } else {
            this.presentToast('שגיאה בעדכון המילה');
          }
        },
        error: (error) => {
          console.error('Error updating word:', error);
          this.presentToast('שגיאה בעדכון המילה. נסה שוב מאוחר יותר.');
        }
      });
    
    this.subscriptions.push(sub);
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
    const sub = this.wordsService.onAddWordDetails$
    .subscribe({
      next: (addWordResponse) => {
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
      },
      error: (error) => {
        console.error('Error adding word:', error);
        this.presentToast('שגיאה בהוספת המילה. נסה שוב מאוחר יותר.');
      }
    });
    
    this.subscriptions.push(sub);
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
      position: 'top'
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

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      if (file.type === 'application/json') {
        this.selectedFile = file;
      } else {
        this.presentToast('אנא בחר קובץ JSON בלבד');
        element.value = '';
      }
    }
  }

  async uploadFile() {
    if (!this.selectedFile) {
      this.presentToast('Please select a file first');
      return;
    }

    const alert = await this.alertController.create({
      header: 'אישור העלאה',
      message: 'האם אתה בטוח שברצונך להעלות את הקובץ?',
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel'
        },
        {
          text: 'אישור',
          handler: () => {
            this.proceedWithUpload();
          }
        }
      ]
    });

    await alert.present();
  }

  proceedWithUpload() {
    const formData = new FormData();
    formData.append('wordsFile', this.selectedFile as File);

    const sub =  this.wordsService.uploadWordsFile(formData)
    .subscribe({
      next: response => {
        if (response.success === false) {
          this.presentToast(response.message);
          return;
        }
        this.presentToast('הקובץ הועלה בהצלחה');
        this.loadWords();
        this.currentView = 'view';
      },
      error: error => {
        console.error('Error uploading file:', error);
        this.presentToast('שגיאה בהעלאת הקובץ');
      }
    });
    this.subscriptions.push(sub);
  }

  startEditing(word: Word) {
    this.editingWord = { ...word };
    this.isEditing = true;
    this.currentView = 'edit';
  }

  cancelEditing() {
    this.editingWord = null;
    this.isEditing = false;
    this.currentView = 'view';
  }

  updateWord() {
    if (!this.editingWord || !this.editingWord._id) {
      this.presentToast('שגיאה בעדכון המילה');
      return;
    }

    const sub = this.wordsService.updateWord(this.editingWord._id, this.editingWord)
      .subscribe();
    
    this.subscriptions.push(sub);
  }
}
