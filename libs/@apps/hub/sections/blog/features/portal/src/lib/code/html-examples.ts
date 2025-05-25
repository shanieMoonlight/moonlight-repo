export const BasicUsageExample = `<!-- Basic Portal Usage -->
<!-- Define content in a template -->
<ng-template #myContentTemplate>
  <h2>This content will be teleported!</h2>
  <p>Any Angular content can go here - components, directives, pipes, etc.</p>
</ng-template>

<!-- Project the template -->
<sb-portal-input [portalTemplate]="myContentTemplate"></sb-portal-outlet>

<!-- Display the portal content elsewhere -->
<sb-portal-outlet></sb-portal-outlet>`;

export const MultiplePortalsExample = `<!-- Multiple Named Portals -->
<!-- Define templates -->
<ng-template #headerTemplate>
  <h1>Header Content</h1>
</ng-template>

<ng-template #sidebarTemplate>
  <nav>
    <a href="/home">Home</a>
    <a href="/about">About</a>
  </nav>
</ng-template>

<!-- Project templates -->
<sb-portal-input 
  name="header-content" 
  [portalTemplate]="headerTemplate">
</sb-portal-input>

<sb-portal-input 
  name="sidebar-content" 
  [portalTemplate]="sidebarTemplate">
</sb-portal-input>

<!-- Display in different locations -->
<header>
  <sb-portal-outlet name="header-content"></sb-portal-outlet>
</header>

<aside>
  <sb-portal-outlet name="sidebar-content"></sb-portal-outlet>
</aside>`;

export const ConditionalPortalExample = `<!-- Conditional Portal Rendering -->
<!-- Define template -->
<ng-template #dialogTemplate>
  <div class="message">
    <h3>Important Message</h3>
    <p>This message content is conditionally rendered.</p>
  </div>
</ng-template>
  
<!-- Conditionally project template -->
<button mat-flat-button (click)="showDialog = !showDialog">Toggle Message</button>
 @if(showDialog){
   <sb-portal-input name="message-content" 
     [portalTemplate]="dialogTemplate"/>
 }

<!-- Portal outlet (always present) -->
<sb-portal-outlet name="message-content"/>`;

export const DynamicContentExample = `<!-- Dynamic Content with Signals -->
<!-- Define template -->
<ng-template #dynamicTemplate>
  <div [innerHTML]="dynamicHtml()"></div>
</ng-template>

<!-- Project template -->
<sb-portal-input name="dynamic-content" [portalTemplate]="dynamicTemplate"></sb-portal-input>

<!-- Multiple outlets for the same content -->
<sb-portal-outlet name="dynamic-content"></sb-portal-outlet>
<sb-portal-outlet name="dynamic-content"></sb-portal-outlet>`;

export const ComplexComponentExample = `<!-- Complex Components in Portals -->
<!-- Define template -->
<ng-template #complexWidgetTemplate>
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
</ng-template>

<!-- Project template -->
<sb-portal-input name="complex-widget" [portalTemplate]="complexWidgetTemplate"></sb-portal-input>

<sb-portal-outlet name="complex-widget"></sb-portal-outlet>`;
