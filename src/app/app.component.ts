import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NAMES } from '../assets/name-list';
import { Name } from './name';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Name Voting';
  names: Name[] = [];
  round = 0;
  namesInCurrentRound = 0;
  matchCount = 0;
  candidateA: Name;
  candidateB: Name;
  showResults: boolean = false;

  @Output() voteEvent = new EventEmitter<Name[]>();

  ngOnInit(): void {
    this.names = JSON.parse(localStorage.getItem('namePrefs'));
    let savedRound = localStorage.getItem('currentRound');
    if (savedRound) {
      this.round = parseInt(savedRound);
      this.matchCount = parseInt(localStorage.getItem('matchCount'));
      this.namesInCurrentRound = parseInt(localStorage.getItem('namesInCurrentRound'));
    }
    if (!this.names) {
      this.names = [];
      NAMES.forEach(name => {
        this.names.push({
          name: name,
          elo: 1000,
          round: 0
        });
      });
    }

    this.nextMatch();
  }

  public toggleShowResults() {
    this.showResults = !this.showResults;
  }

  public nextMatch() {
    this.nextCandidateInRound();
    this.save();
  }

  private nextCandidateInRound() {
    let acceptNextRound = false;
    if (this.namesInCurrentRound >= this.names.length) {
      this.round++;
      this.namesInCurrentRound = 0;
      this.shuffle();
    }
    if (this.namesInCurrentRound == this.names.length - 1) {
      acceptNextRound = true;
    }

    let i = 0;
    while (!this.candidateA || !this.candidateB) {
      let candidateName = this.names[i];
      if (!this.candidateA) {
        if (candidateName.round == this.round) {
          this.candidateA = candidateName;
        }
      } else {
        if ((candidateName.round == this.round || acceptNextRound)
          && this.isGoodMatch(candidateName)
          && this.candidateA.name != candidateName.name) {
          this.candidateB = candidateName;
          break;
        }
      }

      i++;
      i %= this.names.length;
    }
  }

  private shuffle() {
    for (var i = this.names.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = this.names[i];
      this.names[i] = this.names[j];
      this.names[j] = temp;
    }
  }

  private isGoodMatch(candidateName: Name) {
    let eloDiff = this.candidateA.elo - candidateName.elo;
    if (eloDiff < 0) {
      eloDiff *= -1;
    }

    if (eloDiff < 300) {
      return true;
    }

    return false;
  }

  public chooseName(winner: Name, loser: Name) {
    this.updateElo(winner, loser);
    this.matchCount++;
    if (winner.round == this.round) {
      this.namesInCurrentRound++;
      winner.round++;
    }
    if (loser.round == this.round) {
      this.namesInCurrentRound++;
      loser.round++;
    }
    console.log('winner', winner);
    console.log('loser', loser);
    console.log('match', this.matchCount);
    this.candidateA = null;
    this.candidateB = null;

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

  private save() {
    localStorage.setItem('namePrefs', JSON.stringify(this.names));
    localStorage.setItem('currentRound', this.round + '');
    localStorage.setItem('matchCount', this.matchCount + '');
    localStorage.setItem('namesInCurrentRound', this.namesInCurrentRound + '');
  }
}
