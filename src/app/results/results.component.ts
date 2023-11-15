import { Component, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { Name } from '../name';
import { NameListService } from '../services/name-list.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  sortedNames: Name[];

  constructor(private nameListService: NameListService) {}

  public ngOnInit(): void {
    this.nameListService.nameMap.subscribe(newMap => {
      this.sort(Array.from(newMap.values()));
    });
  }

  public sort(unsortedNames: Name[]) {
    this.sortedNames = [];
    unsortedNames.forEach(name => this.sortedNames.push(name));
    this.sortedNames.sort((a:Name, b:Name) => b.elo - a.elo);
  }
}
