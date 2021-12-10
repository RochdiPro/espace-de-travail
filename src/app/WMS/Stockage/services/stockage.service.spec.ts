/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StockageService } from './stockage.service';

describe('Service: Stockage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockageService]
    });
  });

  it('should ...', inject([StockageService], (service: StockageService) => {
    expect(service).toBeTruthy();
  }));
});
