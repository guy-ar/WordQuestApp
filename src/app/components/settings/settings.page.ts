import { Component, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words/words.service';
import { ToastController } from '@ionic/angular';
import { GameStateService } from 'src/app/services/gameState/gameStateService';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage  implements OnInit {
  numberOfWords!: number;
  
  constructor(
    private wordService: WordsService,
    private gameStateService: GameStateService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.numberOfWords = this.gameStateService.getNumberOfWords();
  }


  updateNumberOfWords() {
    this.gameStateService.updateNumberOfWords(this.numberOfWords);
    this.presentToast('Number of words updated successfully');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
}


