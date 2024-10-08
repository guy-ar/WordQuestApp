import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainMenuPage } from './components/main-menu/main-menu.page';
import { GamePage } from './components/game/game.page';
import { ResultsPage } from './components/results/results.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'main-menu',
    pathMatch: 'full'
  },
  {
    path: 'main-menu',
    loadChildren: () => import('./components/main-menu/main-menu.module').then(m => m.MainMenuPageModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./components/game/game.module').then( m => m.GamePageModule)
  },
  {
    path: 'results',
    loadChildren: () => import('./components/results/results.module').then( m => m.ResultsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./components/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'words',
    loadChildren: () => import('./components/words/words.module').then( m => m.WordsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./components/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'score-board',
    loadChildren: () => import('./components/score-board/score-board.module').then( m => m.ScoreBoardPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }