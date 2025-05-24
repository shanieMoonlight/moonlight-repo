export const AdvancedPatternsCode = `// Portal with dynamic content
@Component({
  template: \`
    <sb-portal-input [name]="portalName()">
      <ng-container [ngSwitch]="contentType()">
        <div *ngSwitchCase="'text'">{{ textContent() }}</div>
        <img *ngSwitchCase="'image'" [src]="imageUrl()" [alt]="altText()">
        <ng-container *ngSwitchDefault>
          <ng-content></ng-content>
        </ng-container>
      </ng-container>
    </sb-portal-input>
  \`
})
export class DynamicPortalComponent {
  portalName = input.required<string>();
  contentType = input<'text' | 'image' | 'custom'>('custom');
  textContent = input<string>('');
  imageUrl = input<string>('');
  altText = input<string>('');
}`;

export const PortalManagerServiceCode = `// Advanced portal manager service
@Injectable()
export class PortalManagerService {
  private _portalBridge = inject(SbPortalBridgeService);

  /**
   * Create a portal programmatically
   */
  createComponentPortal<T>(
    component: ComponentType<T>,
    injector?: Injector
  ): ComponentPortal<T> {
    return new ComponentPortal(component, null, injector);
  }

  /**
   * Create a template portal
   */
  createTemplatePortal<T>(
    template: TemplateRef<T>,
    viewContainer: ViewContainerRef,
    context?: T
  ): TemplatePortal<T> {
    return new TemplatePortal(template, viewContainer, context);
  }

  /**
   * Register and attach a component portal
   */
  attachComponentPortal<T>(
    name: string,
    component: ComponentType<T>,
    injector?: Injector
  ): void {
    const portal = this.createComponentPortal(component, injector);
    this._portalBridge.setPortal(name, portal);
  }

  /**
   * Batch portal operations
   */
  batchPortalOperations(operations: Array<{
    name: string;
    portal: Portal<any> | null;
  }>): void {
    operations.forEach(({ name, portal }) => {
      this._portalBridge.setPortal(name, portal);
    });
  }
}`;

export const ConditionalPortalDirectiveCode = `// Conditional portal directive
@Directive({
  selector: '[sbConditionalPortal]',
  standalone: true
})
export class ConditionalPortalDirective implements OnInit, OnDestroy {
  private _portalBridge = inject(SbPortalBridgeService);
  private _templateRef = inject(TemplateRef);
  private _viewContainer = inject(ViewContainerRef);

  @Input() sbConditionalPortal!: string;
  @Input() sbConditionalPortalWhen = true;

  private _templatePortal?: TemplatePortal;

  ngOnInit() {
    this._templatePortal = new TemplatePortal(
      this._templateRef,
      this._viewContainer
    );

    if (this.sbConditionalPortalWhen) {
      this._portalBridge.setPortal(this.sbConditionalPortal, this._templatePortal);
    }
  }

  @HostListener('sbConditionalPortalWhenChange')
  onConditionChange() {
    if (this.sbConditionalPortalWhen && this._templatePortal) {
      this._portalBridge.setPortal(this.sbConditionalPortal, this._templatePortal);
    } else {
      this._portalBridge.removePortal(this.sbConditionalPortal);
    }
  }

  ngOnDestroy() {
    this._portalBridge.removePortal(this.sbConditionalPortal);
  }
}`;
