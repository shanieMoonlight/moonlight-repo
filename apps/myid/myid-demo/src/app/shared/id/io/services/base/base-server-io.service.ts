import { ServerRoutes } from '../../controllers/all-server-routes';
import { ABaseHttpService } from '../../data-service/a-base-data.io.service';
import { UrlUtils } from '../../data-service/url-utils';

export abstract class AServerIoService extends ABaseHttpService {
  constructor(controller: string) {
    super(UrlUtils.combine(ServerRoutes.BASE_URL, controller));
  }
}
