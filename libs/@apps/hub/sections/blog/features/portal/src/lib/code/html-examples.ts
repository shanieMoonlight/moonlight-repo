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

export const ConditionalPortalExample0 = `<!-- Conditional Portal Rendering -->
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

export const ConditionalPortalHtmlExample = `<!-- Conditional Portal Rendering -->
  <div class="demo-container">
       <div class="demo-source">
      <h4>Portal Input (Source)</h4>
      <p>Click the button below to teleport this content:</p>
      <div class="demo-actions">
        <!-- Change TemplateRef -->
        <button mat-flat-button class="primary" 
          (click)="_selectedPortal = _demoTemplate1()"   
          [disabled]="_selectedPortal === _demoTemplate1()">
          Display 1
        </button>
        <!-- Change TemplateRef -->
        <button mat-flat-button class="secondary" 
          (click)="_selectedPortal = _demoTemplate2()"
          [disabled]="_selectedPortal === _demoTemplate2()">
          Display 2
        </button>
        <!-- Remove TemplateRef -->
        <button mat-flat-button class="tertiary" 
          (click)="_selectedPortal = undefined"
          [disabled]="!_selectedPortal">
          Hide
        </button>
        <!-- Change Template content in realtime -->
        <button 
          mat-flat-button class="error" 
          (click)="_toggleDynamicText()">
          Dynamic Text 
        </button>
      </div>
      
      <!-- Define Templates to render -->
      <ng-template #demoPortalTemplate1>
        <div class="demo-content primary">
          <h3>🚀 Primary Portal Content</h3>
          <p>This is the primary content portal - 
            it demonstrates basic portal functionality with a clean, modern design.</p>
          <h3 class="dynamic"> Dynamic Text: {{_dynamicText}}</h3>
        </div>
      </ng-template>

      <ng-template #demoPortalTemplate2>
        <div class="demo-content secondary">
          <h3>⭐ Secondary Portal Content</h3>
          <p>This is the secondary content portal - 
            showcasing alternative styling and content to demonstrate portal flexibility.</p>
          <h3 class="dynamic"> Dynamic Text: {{_dynamicText}}</h3>
        </div>
      </ng-template>


      <!-- Conditional Rendering -->
      @if(_selectedPortal; as portal){  
      <sb-portal-input [portalTemplate]="portal" name="demo-portal" />
      }
    </div>

    
      <!-- Render the portal-->
    <div class="demo-destination">
      <h4>Portal Outlet (Destination)</h4>
      <h5>Could be anywhere in your application</h5>
      <div class="outlet-container">
        <sb-portal-outlet name="demo-portal"></sb-portal-outlet>
      </div>
    </div>

  </div>`;

export const ConditionalPortalTsExample = `export class SbHubBlogPortalConditionalDemoComponent {

  protected _demoTemplate1 = viewChild.required<TemplateRef<unknown>>('demoPortalTemplate1')
  protected _demoTemplate2 = viewChild.required<TemplateRef<unknown>>('demoPortalTemplate2')


  protected _selectedPortal?: TemplateRef<unknown>

  protected _dynamicText = "Hello"
  protected _toggleDynamicText = () => 
    this._dynamicText = this._dynamicText === "Hello" ? "GoodBye" : "Hello"

}`;



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
