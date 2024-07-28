import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
  score = 1520;
  stars = [true, true, true]; // This would be calculated based on performance

  constructor(private router: Router
  ) {}

  navigateToGame() {
    //this.router.navigate(['/game']);
    this.router.navigate(['/game'], { queryParams: { restart: 'true' } });
  }

  navigateToMainMenu() {
    this.router.navigate(['/main-menu']);
  }

  ngOnInit() {
  }

}
