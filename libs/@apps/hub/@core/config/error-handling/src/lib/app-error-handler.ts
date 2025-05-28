import { DOCUMENT, isPlatformServer } from '@angular/common';
import { ErrorHandler, inject, Injectable, isDevMode, PLATFORM_ID, Provider } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';
import { ToastData, ToastService } from '@spider-baby/ui-toast';
import { FileDownloadService } from '@spider-baby/utils-file-saver';
import { ErrorHelpers } from './error-helpers';

//############################//

const ChunkFailedMessage = /Loading chunk .* failed/
const NOT_FOUND = '404'
const UNAUTHORIZED = '401'

//############################//

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  private _toastService = inject(ToastService)
  private _blobHandler = inject(FileDownloadService)
  private _errorhelpers = inject(ErrorHelpers)
  private _doc = inject(DOCUMENT)
  private _platformId = inject(PLATFORM_ID)

  //--------------------------//

  handleError(error: any): void {

    if (isPlatformServer(this._platformId)) {
      console.log('SSR-Error?', error)
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
      this.showToast(error.message)

      const errorInfoObject = this._errorhelpers.CreateErrorInfoObject(error);

      if (isDevMode())
        this.downloadTxtFile(errorInfoObject)
    }

  }

  //--------------------------//


  private downloadTxtFile(errorInfoObject: any) {

    const errorString = JSON.stringify(errorInfoObject)
      .replace(new RegExp('\\\\n', 'g'), '\r\n')

    this._blobHandler.downloadText(errorString, `Errors_${this.formatYearMonthDay()}.txt`)

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

    const errorToastData = ToastData.Success(safeMsg)
      .positionTopRight()
      .withSlide()
    this._toastService.show(errorToastData, 5000)

  }

  //--------------------------//

  private formatYearMonthDay(date: Date = new Date(), separator = '-') {

    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;

    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join(separator);
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