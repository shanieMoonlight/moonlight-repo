import { Pipe, PipeTransform, inject } from '@angular/core';
import { TeamPositionService } from './team-position-info';

@Pipe({
  name: 'teamPositionName',
  standalone: true,
})
export class TeamPositionNamePipe implements PipeTransform {

  private _utils = inject(TeamPositionService);


  transform(value: number): string {

    return this._utils.getTeamPositionByValue(value)?.name ?? ''

  }

}
