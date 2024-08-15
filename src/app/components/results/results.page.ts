import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { GameStateService } from 'src/app/services/gameState/gameStateService';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit, OnDestroy {
  score = 0;
  stars = [true, true, true]; // This would be calculated based on performance
  navigationSubscription?: Subscription
  constructor(
    private router: Router,
    private gameStateService: GameStateService // Add this
  ) {}
  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }

  ngOnInit() {
    this.navigationSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.initializePageData();
    });

    // Initialize data on component creation
    this.initializePageData();
  }

  initializePageData() {
    this.score = this.gameStateService.getScore();
    this.calculateStars();
  }
  calculateStars() {
    // This is a simple example. Adjust the logic based on your requirements
    if (this.score >= 1500) {
      this.stars = [true, true, true];
    } else if (this.score >= 1000) {
      this.stars = [true, true, false];
    } else if (this.score >= 500) {
      this.stars = [true, false, false];
    } else {
      this.stars = [false, false, false];
    }
  }

  navigateToGame() {
    //this.router.navigate(['/game']);
    this.router.navigate(['/game']);
  }

  navigateToRestartGame() {
    this.router.navigate(['/game'], { queryParams: { restart: 'true' } });
  }

  navigateToMainMenu() {
    this.router.navigate(['/main-menu']);
  }
}
