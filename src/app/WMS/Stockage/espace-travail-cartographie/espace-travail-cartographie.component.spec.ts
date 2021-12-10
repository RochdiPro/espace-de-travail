import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceTravailCartographieComponent } from './espace-travail-cartographie.component';

describe('EspaceTravailCartographieComponent', () => {
  let component: EspaceTravailCartographieComponent;
  let fixture: ComponentFixture<EspaceTravailCartographieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspaceTravailCartographieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceTravailCartographieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
