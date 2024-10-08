import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authenticate/authService.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.page.html',
  styleUrls: ['./main-menu.page.scss']
})
export class MainMenuPage implements OnInit {
  isLoggedIn: boolean = false;
  username = 'נושה';
  constructor(private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['loggedIn'] === 'true') {
        this.isLoggedIn = this.authService.IsAuthenticated
      }
    });
  }

  navigateToGame() {
    this.router.navigate(['/game']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  navigateToScoreboard() {
    this.router.navigate(['/score-board']);
  }

  navigateToWords() {
    this.router.navigate(['/words']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/']);
    });
  }
}