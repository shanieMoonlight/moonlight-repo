export const BasicUsageExample = `<!-- Basic Portal Usage -->
<sb-portal-input name="my-content">
  <h2>This content will be teleported!</h2>
  <p>Any Angular content can go here - components, directives, pipes, etc.</p>
</sb-portal-input>

<!-- Display the portal content elsewhere -->
<sb-portal-outlet name="my-content"></sb-portal-outlet>`;

export const MultiplePortalsExample = `<!-- Multiple Named Portals -->
<sb-portal-input name="header-content">
  <h1>Header Content</h1>
</sb-portal-input>

<sb-portal-input name="sidebar-content">
  <nav>
    <a href="/home">Home</a>
    <a href="/about">About</a>
  </nav>
</sb-portal-input>

<!-- Display in different locations -->
<header>
  <sb-portal-outlet name="header-content"></sb-portal-outlet>
</header>

<aside>
  <sb-portal-outlet name="sidebar-content"></sb-portal-outlet>
</aside>`;

export const ConditionalPortalExample = `<!-- Conditional Portal Rendering -->
<sb-portal-input name="dialog-content" *ngIf="showDialog">
  <div class="dialog">
    <h3>Important Message</h3>
    <p>This dialog content is conditionally rendered.</p>
    <button (click)="closeDialog()">Close</button>
  </div>
</sb-portal-input>

<!-- Portal outlet (always present) -->
<sb-portal-outlet name="dialog-content"></sb-portal-outlet>`;

export const DynamicContentExample = `<!-- Dynamic Content with Signals -->
<sb-portal-input name="dynamic-content">
  <div [innerHTML]="dynamicHtml()"></div>
</sb-portal-input>

<!-- Multiple outlets for the same content -->
<sb-portal-outlet name="dynamic-content"></sb-portal-outlet>
<sb-portal-outlet name="dynamic-content"></sb-portal-outlet>`;

export const ComplexComponentExample = `<!-- Complex Components in Portals -->
<sb-portal-input name="complex-widget">
  <my-complex-component 
    [data]="complexData()"
    (action)="handleAction($event)">
    
    <!-- Nested content -->
    <ng-container slot="header">
      <h4>Widget Header</h4>
    </ng-container>
    
    <ng-container slot="content">
      <p>Widget content with {{ interpolation }}</p>
    </ng-container>
  </my-complex-component>
</sb-portal-input>

<sb-portal-outlet name="complex-widget"></sb-portal-outlet>`;
