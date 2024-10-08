import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoreBoardPage } from './score-board.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreBoardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreBoardPageRoutingModule {}
