import { ABaseHttpService } from '../../data-service/a-base-data.io.service';
import { UrlUtils } from '../../data-service/url-utils';

export abstract class AServerIoService extends ABaseHttpService {

  constructor(baseUrl:string, controller: string) {
    super(UrlUtils.combine(baseUrl, controller));
  }
  
}
