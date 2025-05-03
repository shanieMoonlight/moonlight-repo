import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GitComponent } from './git.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { IconsService } from '../../../../utils/icons/icons.service';
import { MainHomeComponent } from '../../home.component';

describe('GitComponent', () => {
  let component: GitComponent;
  let fixture: ComponentFixture<GitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GitComponent,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
        MainHomeComponent,
        MatIconTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        IconsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GitComponent);
    fixture.componentRef.setInput('sectionNumber', 1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
