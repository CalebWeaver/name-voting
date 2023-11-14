import { Component, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { Name } from '../name';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnChanges {
  @Input() names: Name[];
  sortedNames: Name[];
  @Input() updateNames: EventEmitter<Name[]>;

  public ngOnInit(): void {
    this.sort();
    this.updateNames.subscribe(this.sort());
  }

  public ngOnChanges() {
    this.sort();
  }

  public sort() {
    this.sortedNames = [];
    this.names.forEach(name => this.sortedNames.push(name));
    this.sortedNames.sort((a:Name, b:Name) => b.elo - a.elo);
  }
}
