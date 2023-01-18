import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiAdvancedDetailsComponent } from './api-advanced-details.component';

describe('ApiAdvancedDetailsComponent', () => {
  let component: ApiAdvancedDetailsComponent;
  let fixture: ComponentFixture<ApiAdvancedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiAdvancedDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiAdvancedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
