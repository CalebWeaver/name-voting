import { NamePairing } from './../name-pairing';
import { RoundManagerService } from './round-manager.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Name } from '../name';
import { NAMES } from '../../assets/name-list';
import { SaveService } from './save.service';

@Injectable({
  providedIn: 'root',
})
export class NameListService {
  private nameMapSubject = new BehaviorSubject<Map<string, Name>>(new Map<string, Name>);
  public nameMap = this.nameMapSubject.asObservable();
  public namePairings: NamePairing[] = [];
  public round = 0;

  constructor(private saveService: SaveService) {
    saveService.setDependency(this);
    saveService.load();
    if (this.get().size == 0) {
      let names: Map<string, Name> = new Map<string, Name>();
      NAMES.forEach(name => {
        names.set(name, {
          name: name,
          elo: 1000,
          round: 0
        });
      });
      this.set(names);
      this.generateNamePairings();
    }
  }

  public getName(name: string): Name {
    return this.nameMapSubject.getValue().get(name);
  }

  generateNamePairings() {
    let names = Array.from(this.nameMapSubject.getValue().keys());
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        this.namePairings.push({ nameA: names[i], nameB: names[j] });
      }
    }
    this.shufflePairings();
    this.saveService.saveNamePairings(this.namePairings);
  }

  set(newMap: Map<string, Name>) {
    this.nameMapSubject.next(newMap);
  }

  get(): Map<string, Name> {
    return this.nameMapSubject.getValue();
  }

  shufflePairings() {
    let namePairings = this.namePairings;

    for (var i = namePairings.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = namePairings[i];
      namePairings[i] = namePairings[j];
      namePairings[j] = temp;
    }

    this.namePairings = namePairings;
  }

  getNextPair(): NamePairing {
    return this.namePairings[this.round];
  }
}
