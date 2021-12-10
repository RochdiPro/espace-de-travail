import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogueEspacaTravailComponent } from './dialogue-espace-travail.component.component';

 
describe('DialogueCartographieComponent', () => {
  let component: DialogueEspacaTravailComponent;
  let fixture: ComponentFixture<DialogueEspacaTravailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogueEspacaTravailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogueEspacaTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
