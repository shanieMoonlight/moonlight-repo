import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

//###################################################//

interface ColorListData {
  name: string;
  values: string[];
}


//###################################################//

@Component({
  selector: 'sb-theme-variables-showcase',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    ClipboardModule,
    TitleCasePipe
  ],
  templateUrl: './color-vars-display.component.html',
  styleUrls: ['./color-vars-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeVariablesShowcaseComponent {

  protected _systemColorTemplate = [
    '--mat-sys-colortype',
    '--mat-sys-on-colortype',
    '--mat-sys-colortype-container',
    '--mat-sys-on-colortype-container',
    '--mat-sys-colortype-fixed',
    '--mat-sys-colortype-fixed-dim',
    '--mat-sys-on-pricolortypemary-fixed',
    '--mat-sys-on-colortype-fixed-variant',
    '--mat-sys-inverse-colortype'
  ];


  protected _seedColors = [
    '--mat-seed-primary',
    '--mat-seed-secondary:',
    '--mat-seed-tertiary',
    '--mat-seed-error',
  ]

  // Generate all tone values
  protected _colorTypes = ['primary', 'secondary', 'tertiary', 'error', 'neutral', 'neutral-variant'];
  protected _tones = [0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]
    .sort((a, b) => a - b);

  protected _systemColorDataList: ColorListData[] = []

  //-----------------------------//

  constructor() {

    this.buildSystemColotList()
  }

  //-----------------------------//

  private buildSystemColotList() {

    for (let i = 0; i < this._colorTypes.length; i++) {
      const colorValues = this._systemColorTemplate.map((color) => color.replace('colortype', this._colorTypes[i]));
      const colorListData: ColorListData = {
        name: this._colorTypes[i],
        values: colorValues
      }
      this._systemColorDataList.push(colorListData)
    }

    console.log(this._systemColorDataList);


  }


}//Cls