import { RouteUtility } from '@spider-baby/utils-routes';

//#################################//

const DownloadsDir = 'downloads';

//#################################//

export class HubAppDownloads {

  static ProgImgTutorial = class {
    static readonly Base = 'prog-img-tutorial'
    static readonly CodeSampleZipFile = RouteUtility.combine(DownloadsDir, this.Base, 'code-samples.zip');

  }



}
