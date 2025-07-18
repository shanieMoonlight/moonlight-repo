import { RouteUtility } from '@spider-baby/utils-routes';

//#################################//

const DownloadsDir = 'downloads';

//#################################//

export class HubAppDownloads {

  static ProgImgTutorial = class {
    static readonly Base = 'prog-img-tutorial'
    static readonly CodeSampleZipFile = RouteUtility.combine(DownloadsDir, this.Base, 'code-samples.zip');

  }


  static PortalTutorial = class {
    static readonly Base = 'portal-tutorial'
    static readonly CodeSampleZipFile = RouteUtility.combine(DownloadsDir, this.Base, 'code-samples.zip');

  }

  static MiniStateTutorial = class {
    static readonly Base = 'mini-state-tutorial'
    static readonly CodeSampleZipFile = RouteUtility.combine(DownloadsDir, this.Base, 'code-samples.zip');

  }

  static MatThemingTutorial = class {
    static readonly Base = 'mat-theming-tutorial'
    static readonly CodeSampleZipFile = RouteUtility.combine(DownloadsDir, this.Base, 'code-samples.zip');

  }
  static FirstErrorTutorial = class {
    static readonly Base = 'first-error-tutorial'
    static readonly CodeSampleZipFile = RouteUtility.combine(DownloadsDir, this.Base, 'code-samples.zip');

  }

  
  static AuthServiceTutorial = class {
    static readonly Base = 'auth-service-tutorial'
    static readonly CodeSampleZipFile = RouteUtility.combine(DownloadsDir, this.Base, 'code-samples.zip');

  }



}
