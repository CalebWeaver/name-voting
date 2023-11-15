import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoundManagerService {
  public round: number = 0;

  constructor() {}
}
