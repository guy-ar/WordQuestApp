import { Component, OnDestroy, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words/words.service';
import { ToastController } from '@ionic/angular';
import { GameStateService } from 'src/app/services/gameState/gameStateService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage  implements OnInit, OnDestroy {
  numberOfWords!: number;
  selectedCategory!: string;
  selectedDifficulty?: number;
  categories: string[] = []; 
  private loadCategoriesSubscription?: Subscription

  
  constructor(
    private wordsService: WordsService,
    private gameStateService: GameStateService,
    private toastController: ToastController
  ) { }
  ngOnDestroy(): void {
    this.loadCategoriesSubscription?.unsubscribe();
  }

  ngOnInit() {
    this.numberOfWords = this.gameStateService.getNumberOfWords();
    this.selectedCategory = this.gameStateService.getSelectedCategory();
    this.selectedDifficulty = this.gameStateService.getSelectedDifficulty();
    this.loadCategories();
  }


  updateDefinitions() {
    this.gameStateService.updateNumberOfWords(this.numberOfWords);
    this.gameStateService.updateSelectedCategory(this.selectedCategory);
    if (this.selectedDifficulty)
      this.gameStateService.updateSelectedDifficulty(this.selectedDifficulty);
    this.presentToast('Definitions were updated successfully.');
  }

  loadCategories() {
    this.loadCategoriesSubscription = this.wordsService.geWordCategories()
      .subscribe({
        next: response => {
          this.categories = response.categories;
        },
        error: error => {
          console.error('Error fetching categories:', error);
          this.presentToast('שגיאה בטעינת הקטגוריות. נסה שוב מאוחר יותר.');
        }
      });
    
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


