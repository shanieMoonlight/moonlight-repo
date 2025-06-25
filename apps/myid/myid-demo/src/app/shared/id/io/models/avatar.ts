import { ImageSrcTypes } from './image-src-types';

export interface Avatar {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  srcType?: ImageSrcTypes;
  b64?: string;
  url?: string;
}
