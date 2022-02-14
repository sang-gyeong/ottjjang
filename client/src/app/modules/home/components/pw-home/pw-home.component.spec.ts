import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PwHomeComponent} from './pw-home.component';

describe('PwHomeComponent', () => {
  let component: PwHomeComponent;
  let fixture: ComponentFixture<PwHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PwHomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
