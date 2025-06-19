import { inject, Injectable } from '@angular/core';
import { JwtStorageService } from '../jwt-storage/jwt-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthTeamsService {

  protected jwtStore = inject(JwtStorageService);

  logOut() {
    this.jwtStore.removeJwt();
    console.log('Logged out successfully');
    
  }
  
  
  logIn(accessToken: string) {
    this.jwtStore.storeJwt(accessToken);
    console.log('Logged in successfully with token:', accessToken);
    
  }

}
