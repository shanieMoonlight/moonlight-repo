import { isPlatformServer } from '@angular/common';
import { ErrorHandler, inject, Injectable, isDevMode, PLATFORM_ID, Provider, DOCUMENT } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';
import { ToastData, SbToastService } from '@spider-baby/ui-toast';
import { ErrorDownloadService } from './error-download.service';

//############################//

const ChunkFailedMessage = /Loading chunk .* failed/
const NOT_FOUND = '404'
const UNAUTHORIZED = '401'

//############################//

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  private _toastService = inject(SbToastService);
  private _errorDownloadService = inject(ErrorDownloadService);
  private _doc = inject(DOCUMENT);
  private _platformId = inject(PLATFORM_ID);


  //--------------------------//


  handleError(error: any): void {

      console.log('error()', error);
      console.log('isDevMode()', isDevMode());
    if (isPlatformServer(this._platformId)) {
      console.log('SSR-Error', error)
      console.trace()
      return
    }

    devConsole.log('HandleError-DEV?', isDevMode(), error)
    devConsole.trace()

    //Chunk load errors are fixed by reloading
    if (this.isChunkLoadError(error)) {
      devConsole.log('isChunkLoadError', error)
      this.showToast('isChunkLoadError Something went wrong. Try refreshing!')
      this._doc.location.reload()
      return
    }

    //Post Error
    //Don't report unauthorized errors
    const statusCode = String(error?.statusCode);
    if (statusCode !== NOT_FOUND && statusCode !== UNAUTHORIZED) {
      this.showToast(error?.message)
      console.log('isDevMode()', isDevMode());

      if (isDevMode())
        this._errorDownloadService.bufferErrorForDownload(error)
    }

  }


  //--------------------------//


  private isChunkLoadError(error: any): boolean {

    if (`${error.name}`?.toLowerCase().trim() === "chunkloaderror")
      return true

    return ChunkFailedMessage.test(`${error.message}`)

  }

  //--------------------------//


  private showToast(msg: string) {

    msg ??= 'An unknown error occurred';

    const safeMsg = msg.length > 60 ? msg.substring(0, 57) + '...' : msg

    const errorToastData = ToastData.Error(safeMsg)
      .positionTopRight()
      .withSlide()
    this._toastService.show(errorToastData, 6000)
  }

} //Cls


//############################//

export function provideAppErrorHandler(): Provider {
  return {
    provide: ErrorHandler,
    useClass: AppErrorHandler,
  }
}

//############################//