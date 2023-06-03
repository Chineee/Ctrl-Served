import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerPageComponent } from './makers-page.component';

describe('CookPageComponent', () => {
  let component: MakerPageComponent;
  let fixture: ComponentFixture<MakerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakerPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
