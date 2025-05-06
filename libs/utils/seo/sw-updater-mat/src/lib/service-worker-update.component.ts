import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'sb-service-worker-update-mat',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: ``,
  styles: `
  :host {
    display: none;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceWorkerUpdateMatComponent {

  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);

  //----------------------------------//

  constructor() {
    this.checkForUpdates();
  }

  //----------------------------------//

  /**
   * Check for service worker updates and show notification when available
   */
  private checkForUpdates(): void {

    this.showUpdateNotification()
    
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker is not enabled');
      return;
    }

    // Subscribe to update available events
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(evt => {
        console.log(`Current version: ${evt.currentVersion.hash}`);
        console.log(`Available version: ${evt.latestVersion.hash}`);

        // Show update notification
        this.showUpdateNotification();
      });

    // Check for updates every 6 hours
    setInterval(() => {
      this.swUpdate.checkForUpdate()
        .then(() => console.log('Checking for updates'))
        .catch(err => console.error('Error checking for updates', err));
    }, 6 * 60 * 60 * 1000);
  }

  //----------------------------------//

  /**
   * Show a notification that an update is available
   */
  private showUpdateNotification(): void {
    const snackBarRef = this.snackBar.open(
      'A new version is available',
      'Update now',
      {
        duration: 0, // Don't auto-dismiss
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'update-notification'
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.activateUpdate();
    });
  }

  //----------------------------------//

  /**
   * Activate the update and reload the application
   */
  private activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => {
      window.location.reload();
    });
  }


}//Cls