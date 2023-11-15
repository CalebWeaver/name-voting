import { Injectable } from '@angular/core';
import { RoundManagerService } from './round-manager.service';
import { NameListService } from './name-list.service';
import { Name } from '../name';
import { NamePairing } from '../name-pairing';

@Injectable({
  providedIn: 'root'
})
export class SaveService {
  nameListService: NameListService;

  constructor(private roundManagerService: RoundManagerService) {}

  public setDependency(nameListService: NameListService) {
    this.nameListService = nameListService;
    this.nameListService.nameMap.subscribe(nameMap => {
      if (nameMap.size > 0) {
        localStorage.setItem('namePrefs', JSON.stringify(this.nameListService.get(), this.replacer));
      }
      if (this.nameListService.round > 0) {
        localStorage.setItem('round', this.nameListService.round + '');
      }
    });
  }

  public saveNamePairings(namePairings: NamePairing[]) {
    localStorage.setItem('namePairings', JSON.stringify(namePairings));
  }

  public load() {
    if (localStorage.getItem('namePrefs')) {
      this.nameListService.set(JSON.parse(localStorage.getItem('namePrefs'), this.reviver));
      this.nameListService.round = parseInt(localStorage.getItem('round'));
      this.nameListService.namePairings = JSON.parse(localStorage.getItem('namePairings'));
    }
  }

  reviver(key: string, value: any) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  replacer(key: string, value: any) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()),
      };
    } else {
      return value;
    }
  }
}
