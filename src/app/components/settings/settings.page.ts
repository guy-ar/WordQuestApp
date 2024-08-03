import { Component, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words/words.service';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage  implements OnInit {
  
  constructor(
    private wordService: WordsService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }
}

