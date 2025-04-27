import { Injectable } from '@angular/core';
import { Album, AlbumUtils } from '../../data/album';
import { BaseDummyIoService } from './base-io.service';

@Injectable({
  providedIn: 'root'
})
export class DummyAlbumIoService extends BaseDummyIoService<Album> {


  override generateRandomItem(id: string | number): Album | undefined {
    return Math.random() < 0.1
      ? undefined
      : AlbumUtils.generateRandomAlbum(id)
  }

  override generateRandomItems(count: number): Album[] {
    return AlbumUtils.generateRandomAlbums(count)
  }


}
