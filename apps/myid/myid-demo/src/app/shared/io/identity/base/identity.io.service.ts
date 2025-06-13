import { ServerRoutes } from '../../../../config/io/id/id.server.routes';
import { ABaseHttpService, combine } from '../../base/data.io.service';


export class IdentityIoService extends ABaseHttpService {

  constructor(controller: string) {
    super(combine(ServerRoutes.BASE_URL, controller));
  }

}
