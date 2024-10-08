import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameResult } from 'src/app/model/game-result.model';
import { GameResultService } from 'src/app/services/gameResult/game-result.service';
@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.page.html',
  styleUrls: ['./score-board.page.scss'],
})
export class ScoreBoardPage implements OnInit, OnDestroy {
  topResults: GameResult[] = [];
  onTopReesultsSubscription?: Subscription;
  constructor(private gameResultService: GameResultService) {}
  ngOnDestroy(): void {
    this.onTopReesultsSubscription?.unsubscribe();
  }

  ngOnInit() {
    this.onTopReesultsSubscription = this.gameResultService.onGetTopResultsResponse$.subscribe(
      results => {
      if(results && results.success && results.topResults) {
        this.topResults = results.topResults;
      }
    });
    this.loadTopResults();
  }

  loadTopResults() {
    this.gameResultService.getTopResults(10)
  }
}