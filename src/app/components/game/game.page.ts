import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { AlertController } from '@ionic/angular';
import { Translation, Word } from 'src/app/model/words.model';
import { WordsService } from 'src/app/services/words/words.service';
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
  showFeedback = false;
  isCorrect = false;
  feedbackMessage = '';
  knownWords = 0;
  totalWords = 0;
  //['תפוח', 'בננה', 'תות', 'אגס'];
  progress = 0; // {{ knownWords }} / {{ totalWords }}

  constructor(private router: Router,
    private wordsService: WordsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['restart'] === 'true') {
        this.restartGame();
      } else {
        this.initializeGame();
      }
    });
    // this.totalWords = this.wordsService.getTotalWordsCount();
    // this.loadNewWord();
  }

  initializeGame() {
    this.totalWords = this.wordsService.getTotalWordsCount();
    this.knownWords = this.wordsService.getKnownWordsCount();
    this.loadNewWord();
  }

  restartGame() {
    this.wordsService.resetKnownWords();
    this.score = 0;
    this.knownWords = 0;
    this.showFeedback = false;
    this.feedbackMessage = '';
    this.initializeGame();
  }

  loadNewWord() {
    this.currentWord = this.wordsService.getRandomWord();
    if (this.currentWord) {
      this.options = this.shuffleArray([...this.currentWord.translations]);
      this.showFeedback = false;
    } else {
      // All words learned
      this.feedbackMessage = 'כל הכבוד! סיימתם את כל המילים';
      this.showFeedback = true;
      setTimeout(() => this.router.navigate(['/results']), 2000);
      
    }
    // this.showFeedback = false;
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

  // handleAnswer(answer: string) {
  //   // Logic for handling answer
  //   // For now, just navigate to results
  //   this.router.navigate(['/results']);
  // }

  // checkAnswer(translation: Translation) {
  //   if (translation.isCorrect) {
  //     this.score++;
  //     this.streak++;
  //     console.log('Correct!');
  //   } else {
  //     this.streak = 0;
  //     let correctWord = ''
  //     if (this.currentWord && this.currentWord.translations && this.currentWord.translations !== null
  //       && this.currentWord.translations.length > 0) {
  //         let translation = this.currentWord.translations.find((t: Translation) => t.isCorrect);
  //         if (translation)
  //           correctWord = translation.hebrew
  //     }
  //     console.log('Incorrect. The correct answer was: ' + correctWord);
        
  //   }  
  //   this.router.navigate(['/results']);
  //   //this.loadNewWord();
  // }

  async checkAnswer(translation: Translation) {
    this.isCorrect = translation.isCorrect;
    this.showFeedback = true
    if (this.isCorrect) {
      this.score++;
      this.feedbackMessage = 'כל הכבוד!';
      if (this.currentWord) {
        this.wordsService.markWordAsKnown(this.currentWord.englishWord);
        this.streak++;
      }
      // Load new word after a short delay
      setTimeout(() => this.loadNewWord(), 2000);
    } else {
      this.streak = 0;
      this.feedbackMessage = 'שגיאה. נא לנסות שוב ' 
      // this.feedbackMessage = 'Incorrect. The correct answer was: ' + 
      //   this.currentWord?.translations.find(t => t.isCorrect)?.hebrew;

      setTimeout(() => this.showFeedback = false, 2000);
    }
    
    this.knownWords = this.wordsService.getKnownWordsCount();
    // const alert = await this.alertController.create({
    //   header: 'תוצאה',
      
    //   message: this.feedbackMessage,//'A message should be a short, complete sentence.',
    //   buttons: ['סגור'],
    // });

    // await alert.present();
    
    // // Load new word after a short delay
    // setTimeout(() => this.loadNewWord(), 2000);
  }

  resetGame() {
    this.wordsService.resetKnownWords();
    this.score = 0;
    this.knownWords = 0;
    this.loadNewWord();
  }

}
