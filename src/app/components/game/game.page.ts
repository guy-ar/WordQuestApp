import { Component, OnInit } from '@angular/core';
//import { AlertController } from '@ionic/angular';
import { Translation, Word } from 'src/app/model/words.model';
import { WordsService } from 'src/app/services/words/words.service';
import { ToastController } from '@ionic/angular';
import { GameStateService } from 'src/app/services/gameState/gameStateService';
import { ImageService } from 'src/app/services/image/image.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  score = 0;
  level = 1;
  streak = 0;
  currentWord?: Word;
  options: Translation[]  = []

  currentWordIndex = 0;
  gameWords: Word[] = [];
  failedWords: Word[] = [];
  isCorrect = false;
  
  knownWords = 0;
  totalWords = 0;
  
  progress = 0; // {{ knownWords }} / {{ totalWords }}
  attempts = 0;

  showHint: boolean = false;
  hintImageUrl: string = '';
  constructor(private router: Router,
    private wordsService: WordsService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private gameStateService: GameStateService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['restart'] === 'true') {
        this.restartGame();
      } else if (params['failedWords'] === 'true') {
        this.startFailedWordsGame();
      } else {
        this.startNewGame();
      }
    });
  }
  
  toggleHint() {
    this.showHint = !this.showHint;
    if (this.showHint && !this.hintImageUrl && this.currentWord) {
      this.imageService.getImageForWord(this.currentWord.englishWord).subscribe(
        (imageUrl) => {
          this.hintImageUrl = imageUrl;
        },
        (error) => {
          console.error('Error fetching image:', error);
          this.presentToast('מצטערים, לא הצלחנו להציג רמז ויזואלי הפעם.');
        }
      );
      // Optionally, you can add a small penalty for using a hint
      this.score -= 1;
      this.gameStateService.updateScore(this.score);
      this.presentToast('הנה רמז! נוכו נקודה אחת מהציון שלך.');
    }
  }

  startNewGame() {
    this.gameWords = this.wordsService.getRandomWordsForGame(20)
    this.failedWords = [];
    this.currentWordIndex = 0;
    this.score = 0;
    this.loadCurrentWord();
  }

  startFailedWordsGame() {
    this.gameWords = this.failedWords;
    this.failedWords = [];
    this.currentWordIndex = 0;
    this.loadCurrentWord();
  }

  restartGame() {
    this.wordsService.resetKnownWords();
    this.score = 0;
    this.knownWords = 0;
    this.failedWords = [];
    this.currentWordIndex = 0;
    
    this.loadCurrentWord();
  }

  loadCurrentWord() {
    if (this.currentWordIndex < this.gameWords.length) {
      this.currentWord = this.gameWords[this.currentWordIndex];
      this.options = this.shuffleArray([...this.currentWord.translations]);
      this.showHint = false;
      this.hintImageUrl = '';
    } else {
      this.endGame();
    }
  }

  endGame() {
    this.gameStateService.updateScore(this.score);
    if (this.failedWords.length > 0) {
      this.presentFailedWordsOption();
    } else {
      this.router.navigate(['/results']);
    }
  }

  async presentFailedWordsOption() {
    const toast = await this.toastController.create({
      message: `יש לך ${this.failedWords.length} מילים שגויות. האם תרצה לנסות שוב?`,
      position: 'middle',
      buttons: [
        {
          side: 'start',
          text: 'כן',
          handler: () => {
            this.startFailedWordsGame();
          }
        }, {
          text: 'לא',
          handler: () => {
            this.router.navigate(['/results']);
          }
        }
      ]
    });
    toast.present();
  }

  initializeGame() {
    this.totalWords = this.wordsService.getTotalWordsCount();
    this.knownWords = this.wordsService.getKnownWordsCount();
    this.loadNewWord();
  }

  // restartGame() {
  //   this.wordsService.resetKnownWords();
  //   this.score = 0;
  //   this.knownWords = 0;
    
  //   this.initializeGame();
  // }

  // for now start and restart ar ethe same
  startGame(){
    this.wordsService.resetKnownWords();
    this.score = 0;
    this.knownWords = 0;
    
    this.initializeGame();
  }

  loadNewWord() {
    this.currentWord = this.wordsService.getRandomWord();
    if (this.currentWord) {
      this.options = this.shuffleArray([...this.currentWord.translations]);
      this.attempts = 0;
      this.showHint = false;
      this.hintImageUrl = ''; // Reset hint image for new word
    } else {
      // All words learned
      this.presentToast('כל הכבוד! סיימתם את כל המילים');
      setTimeout(() => this.router.navigate(['/results']), 2000);
      
    }
  }

  private shuffleArray(array: Translation[]): Translation[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getStreakEmoji() {
    return '🔥'.repeat(this.streak);
  }

  async checkAnswer(translation: Translation) {
    if (translation.isCorrect) {
      this.score += 10;
      this.streak++;
      this.presentToast('כל הכבוד! קיבלת 10 נקודות');
    } else {
      this.streak = 0;
      this.score -=5;
      this.failedWords.push(this.currentWord!);
      const correctTranslation = this.currentWord?.translations.find(t => t.isCorrect);
      this.presentToast(`התשובה הנכונה היא: ${correctTranslation?.hebrew}`);
    }
    
    this.currentWordIndex++;
    setTimeout(() => this.loadCurrentWord(), 2000);
  }
 
  // async checkAnswer(translation: Translation) {
  //   this.isCorrect = translation.isCorrect;
  //   this.attempts++;
  //   if (this.isCorrect) {
  //     if (this.attempts === 1) {
  //       this.score += 10;
  //       this.presentToast('כל הכבוד! קיבלת 10 נקודות');
  //       this.streak++;
  //     } else if (this.attempts === 2) {
  //       this.score += 7;
  //       this.presentToast('טוב מאוד! קיבלת 7 נקודות');
  //       this.streak = 0;
  //     } else {
  //       this.score += 3;
  //       this.presentToast('נכון! קיבלת 3 נקודות');
  //       this.streak = 0;
  //     }
  //     this.gameStateService.updateScore(this.score);
  //     if (this.currentWord) {
  //       this.wordsService.markWordAsKnown(this.currentWord.englishWord);
  //     }
  //     // Load new word after a short delay
  //     setTimeout(() => this.loadNewWord(), 2000);
  //   } else {
  //     if (this.attempts >= 3) {
  //       this.streak = 0;
  //       const correctTranslation = this.currentWord?.translations.find(t => t.isCorrect);
  //       let message = "התשובה הנכונה היא: " + correctTranslation?.hebrew
  //       this.presentToast(message);
  //       if (this.currentWord) 
  //         this.wordsService.markWordAsKnown(this.currentWord.englishWord);

  //       setTimeout(() => this.loadNewWord(), 3000);
  //     }  else {
  //       this.presentToast('שגיאה. נא לנסות שוב '); 
  //     }
  //   }
    
  //   this.knownWords = this.wordsService.getKnownWordsCount();
    
  // }

  resetGame() {
    this.wordsService.resetKnownWords();
    this.score = 0;
    this.knownWords = 0;
    this.attempts = 0;
    this.loadNewWord();
  }
  speakWord() {
    if (this.currentWord && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(this.currentWord.englishWord);
        utterance.lang = 'en-US';
        utterance.rate = 0.5;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error speaking word:', error);
        // You could show a user-friendly error message here
      }
    } else {
      console.warn('Speech synthesis not supported in this browser');
      // You could show a message to the user or fallback to another method
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
}
