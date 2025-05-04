import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GitSecretsComponent } from './git-secrets.component';

describe('GitSecretsComponent', () => {
  let component: GitSecretsComponent;
  let fixture: ComponentFixture<GitSecretsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GitSecretsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GitSecretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
