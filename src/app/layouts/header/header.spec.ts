import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: AuthService, useValue: { user: () => null, logout: vi.fn() } },
        { provide: ThemeService, useValue: { mode: () => 'dark', setMode: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
