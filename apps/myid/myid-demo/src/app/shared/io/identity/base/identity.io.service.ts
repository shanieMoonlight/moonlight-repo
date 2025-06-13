import { RouteUtility } from '@spider-baby/utils-routes';
import { ServerRoutes } from '../../../../config/io/id/id.server.routes';
import { BaseDataService } from '../../base/data.io.service';


export class IdentityIoService extends BaseDataService {

  constructor(controller: string) {
    super(RouteUtility.combine(ServerRoutes.BASE_URL, controller));
  }

}
