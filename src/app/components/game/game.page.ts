import { Component, OnInit } from '@angular/core';
//import { AlertController } from '@ionic/angular';
import { Translation, Word } from 'src/app/model/words.model';
import { WordsService } from 'src/app/services/words/words.service';
import { ToastController } from '@ionic/angular';
import { GameStateService } from 'src/app/services/gameState/gameStateService';
import { ImageService } from 'src/app/services/image/image.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameResultService } from 'src/app/services/gameResult/game-result.service';
import { CreateGameResultRequest } from 'src/app/model/game-result.model';
import { AuthService } from 'src/app/services/authenticate/authService.service';
import { Subscription } from 'rxjs';
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
  gameKnownWords: Word[] = [];
  failedWords: Word[] = [];
  isCorrect = false;
  
  knownWordsCount = 0;
  totalWordsCount = 0;
  
  progress = 0// knownWordsCount }} / {{ totalWordsCount }}
  attempts = 0;

  showHint: boolean = false;
  hintImageUrl: string = '';
  onWordsLoadSubscription?: Subscription

  showingCorrectAnswer: boolean = false;
  lastSelectedOption: Translation | null = null;

  constructor(private router: Router,
    private wordsService: WordsService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private gameStateService: GameStateService,
    private gameResultService: GameResultService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.onWordsLoadSubscription = this.wordsService.onWordsList$.subscribe((response) => {
      if (response)  {
        this.failedWords = [];
        this.gameWords = [];
        this.gameKnownWords = [];
        this.gameWords = response;
        this.totalWordsCount = this.gameWords.length;
        this.loadCurrentWord();
      }
    })
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
    this.wordsService.loadRandomWords();
    this.failedWords = [];
    this.gameKnownWords = [];
    this.currentWordIndex = 0;
    this.score = 0;
    this.streak = 0;
  }

  startFailedWordsGame() {
    this.gameWords = this.failedWords;
    this.failedWords = [];
    this.currentWordIndex = 0;
    this.streak = 0;
    this.loadCurrentWord();
  }

  restartGame() {
    this.gameKnownWords = [];
    this.score = 0;
    this.streak = 0;
    this.knownWordsCount = 0;
    this.progress = 0;
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
      this.prepareGameResult();
      this.router.navigate(['/results']);
    }
  }

  prepareGameResult() {
    
    const wordResults = this.gameResultService.transferWordsToWordResults(this.gameKnownWords, this.failedWords);
      const gameResultIn: CreateGameResultRequest = {
        score: this.score,
        correctWords: this.knownWordsCount,
        totalWords: this.totalWordsCount,
        wordResults: wordResults,
        userEmail: this.authService.getCurrentUserEmail()!
      }
      this.gameResultService.createGameResult(gameResultIn);
      
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
            this.prepareGameResult();
            this.router.navigate(['/results']);
          }
        }
      ]
    });
    toast.present();
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
      this.gameKnownWords.push(this.currentWord!);
      this.knownWordsCount++;
      this.progress = (this.currentWordIndex + 1/ this.totalWordsCount);
      this.score += 10;
      this.streak++;
      this.presentToast('כל הכבוד! קיבלת 10 נקודות', 3000);
    } else {
      this.streak = 0;
      this.score -=5;
      this.failedWords.push(this.currentWord!);
      // Show the correct answer
      this.showingCorrectAnswer = true;
      setTimeout(() => {
        this.showingCorrectAnswer = false;
        
      }, 2900); // Show correct answer for 3 seconds
      const correctTranslation = this.currentWord?.translations.find(t => t.isCorrect);
      this.presentToast(`התשובה הנכונה היא: ${correctTranslation?.hebrew}`, 3000);

    }
    setTimeout(() => {
      this.currentWordIndex++;
      this.loadCurrentWord();
    }, 3000);
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

  async presentToast(message: string, toastAdditionalTime?: number) {
    let duration = 2000;
    if (toastAdditionalTime) {
      duration  += toastAdditionalTime;
    }
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }
}
