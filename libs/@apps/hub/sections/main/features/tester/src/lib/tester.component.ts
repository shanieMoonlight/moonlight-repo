import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastData, ToastService } from '@spider-baby/ui-toast';
import { ToastDynamicSetup } from '@spider-baby/ui-toast/dynamic-provider';
import { matToastConfig } from '@spider-baby/ui-toast/setup';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
// import { IconsService } from '@sb-hub-main-features-tester/shared-utils/icons';

@Component({
  standalone: true,
  imports: [
    MatEverythingModule     
  ],
  providers: [
    ToastDynamicSetup.getProviders(matToastConfig)
  ],
  selector: 'sb-hub-main-features-tester',
  templateUrl: './tester.component.html',
  styleUrl: './tester.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubMainTesterComponent {
 
  private _toast = inject(ToastService);

  static count = 0;


  showToast() {
    const errorToastData = ToastData.Create(
      'info',
      'This is an ERROR toast message! ' + HubMainTesterComponent.count++,
      {
        positionVertical: 'bottom',
      }
    )

    // throw new Error('This is a simulated error to show the toast! ' + HubMainTesterComponent.count++);
    this._toast.show(errorToastData, 6000);


  }
  showErrorToast() {
    const errorToastData = ToastData.Error('This is a Error toast message! ' + HubMainTesterComponent.count++)
      .positionTopCenter()
      .withWobble()

    this._toast.show(errorToastData, 600000)
  }




  showSuccessToast() {
    const successToastData = ToastData.Success('This is a SUCCESS toast message! ' + HubMainTesterComponent.count++)
      .positionTopCenter()
      .withRubber()


    this._toast.show(successToastData, 2000);
  }

  showinfoToast() {
    const infoToastData = ToastData
      .Info('This is an INFO toast message!' + HubMainTesterComponent.count++,
        {
          dismissible: false,
          showIcon: true
        }
      )
      .positionCenter()
      .withSpin()

    this._toast.show(infoToastData, 5000);
  }



  showWarnToast() {
    const warnToastData = ToastData
      .Warning('This is a WARNING toast message! ' + HubMainTesterComponent.count++)
      .positionBottomRight()
      .withFade()
    this._toast.show(warnToastData, 600000);
  }



  clearAllToasts() {
    this._toast.clearAll()
  }



}
