import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegFinalComponent } from './reg-final.component';

describe('RegFinalComponent', () => {
  let component: RegFinalComponent;
  let fixture: ComponentFixture<RegFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
