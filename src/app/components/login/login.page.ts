import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authenticate/authService.service';
import { ToastController } from '@ionic/angular';
import { AuthRequest } from 'src/app/model/auth.model';
import { debounce, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';
  authSubscription?: Subscription

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}
  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
  
  ngOnInit(): void {
    
  }


  async onSubmit() {
    if (this.username && this.password) {
      try {
        const authRequest: AuthRequest = {
          email: this.username,
          password: this.password
        }
        this.authSubscription = this.authService.login(authRequest)
          .subscribe({
            next: (data) => {
              if (data?.success) {
                setTimeout(() => this.router.navigate(['/'],  { queryParams: { loggedIn: 'true' } } ) , 200);

                //this.router.navigate(['/']);
              } 
            },
            error: (error) => {
              if (error.status === 401) {
                this.presentToast('שם משתמש או סיסמה שגויים');
              } else {
                this.presentToast('אירעה שגיאה בהתחברות');
              }
            }
          });
        // if (success) {
        //   this.router.navigate(['/']);
        // } else {
        //   this.presentToast('שם משתמש או סיסמה שגויים');
        // }
      } catch (error) {
        this.presentToast('אירעה שגיאה בהתחברות');
      }
    } else {
      this.presentToast('אנא מלא את כל השדות');
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