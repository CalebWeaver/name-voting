import { RoundManagerService } from './services/round-manager.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Name } from './name';
import { NameListService } from './services/name-list.service';
import { SaveService } from './services/save.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Name Voting';
  candidateA: Name;
  candidateB: Name;
  showResults: boolean = false;

  constructor(public nameListService: NameListService) {}

  ngOnInit(): void {
    this.nextMatch();
  }

  public toggleShowResults() {
    this.showResults = !this.showResults;
  }

  public nextMatch() {
    let nextPairing = this.nameListService.getNextPair();
    this.candidateA = this.nameListService.getName(nextPairing.nameA);
    this.candidateB = this.nameListService.getName(nextPairing.nameB);
  }

  public chooseName(winner: Name, loser: Name) {
    this.updateElo(winner, loser);
    this.nameListService.round++;
    this.nameListService.set(this.nameListService.get());
    this.nextMatch();
  }

  private updateElo(winner: Name, loser: Name) {
    let winnerElo = this.getNewRating(winner.elo, loser.elo, 1);
    let loserElo = this.getNewRating(loser.elo, winner.elo, 0);
    winner.elo = winnerElo;
    loser.elo = loserElo;
  }

  private getNewRating(myRating: number, opponentRating: number, myGameResult: number) {
    return myRating + this.getRatingDelta(myRating, opponentRating, myGameResult);
  }

  private getRatingDelta(myRating: number, opponentRating: number, myGameResult: number) {
    var myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));
    return Math.round(32 * (myGameResult - myChanceToWin));
  }
}
