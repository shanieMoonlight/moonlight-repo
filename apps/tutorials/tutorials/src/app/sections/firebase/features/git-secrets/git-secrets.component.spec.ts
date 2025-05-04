import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseGitSecretsComponent } from './git-secrets.component';

describe('FirebaseGitSecretsComponent', () => {
  let component: FirebaseGitSecretsComponent;
  let fixture: ComponentFixture<FirebaseGitSecretsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebaseGitSecretsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirebaseGitSecretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
