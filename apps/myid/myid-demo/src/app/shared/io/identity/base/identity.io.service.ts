import { ServerRoutes } from '../../../../config/io/id/id.server.routes';
import { ABaseHttpService, combine } from '../../base/data.io.service';


export class IdentityIoService extends ABaseHttpService {

  constructor(controller: string) {
    super(combine(ServerRoutes.BASE_URL, controller));

    console.log(`IdentityIoService initialized with controller: ${controller}`);
    console.log(`ServerRoutes.BASE_URL: ${ServerRoutes.BASE_URL}`);
    console.log(`combine(ServerRoutes.BASE_URL, controller): ${ServerRoutes.BASE_URL}`);
    
  }

}
