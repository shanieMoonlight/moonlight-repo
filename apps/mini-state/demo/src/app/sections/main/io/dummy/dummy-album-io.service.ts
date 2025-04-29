import { Injectable, Injector } from '@angular/core';
import { Album, AlbumUtils } from '../../data/album';
import { BaseDummyIoService } from './base-io.service';

@Injectable({
  providedIn: 'root'
})
export class DummyAlbumIoService extends BaseDummyIoService<Album> {

  constructor(injector: Injector) {
    super(injector); // Pass the Injector to the base class
  }


  override generateRandomItem(id: string | number, searchTerm?: string): Album | undefined {
    return Math.random() < 0.1
      ? undefined
      : AlbumUtils.generateRandomAlbum(id, searchTerm)
  }


  override generateRandomItems(count: number): Album[] {
    return AlbumUtils.generateRandomAlbums(count)
  }

  
}
