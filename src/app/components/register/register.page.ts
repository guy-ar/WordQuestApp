import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { RegiaterUserRequest } from 'src/app/model/auth.model';
import { AuthService } from 'src/app/services/authenticate/authService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnDestroy {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  registrationSubscription?: Subscription

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}
  ngOnDestroy(): void {
    this.registrationSubscription?.unsubscribe();
  }

  async onSubmit() {
    if (this.email && this.password && this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        this.presentToast('הסיסמאות אינן תואמות');
        return;
      }
      try {
        const request: RegiaterUserRequest = {
          username: this.username,
          email: this.email,
          password: this.password
        }
        this.registrationSubscription = this.authService.register(request)
        .subscribe({
          next: (data) => {
            if (data){
              if (data?.success) {
                this.presentToast('נרשמת בהצלחה!');
                this.router.navigate(['/login']);
              }  else {
                this.presentToast('אירעה שגיאה ברישום');
              }
            }
          },
          error: (error) => {
            if (error.status === 400) {
              this.presentToast('שם משתמש או אימייל כבר קיימים או סיסמה');
            } else {
              this.presentToast('אירעה שגיאה ברישום');
            }
          }
        });
      } catch (error) {
        this.presentToast('אירעה שגיאה בהרשמה');
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