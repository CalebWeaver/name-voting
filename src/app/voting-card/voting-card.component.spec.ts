import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingCardComponent } from './voting-card.component';

describe('VotingCardComponent', () => {
  let component: VotingCardComponent;
  let fixture: ComponentFixture<VotingCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VotingCardComponent]
    });
    fixture = TestBed.createComponent(VotingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
