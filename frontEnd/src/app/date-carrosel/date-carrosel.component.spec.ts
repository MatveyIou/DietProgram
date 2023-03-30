import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCarroselComponent } from './date-carrosel.component';

describe('DateCarroselComponent', () => {
  let component: DateCarroselComponent;
  let fixture: ComponentFixture<DateCarroselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateCarroselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateCarroselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
