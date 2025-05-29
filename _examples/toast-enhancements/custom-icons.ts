// Example implementation for custom icon support in toast library

import { TemplateRef, Type, ComponentRef } from '@angular/core';
import { ToastAnimationType } from './position-animations';
import { ToastType } from '../../libs/ui/toast/src';

// Enhanced icon configuration types
export type IconType = 'svg' | 'font' | 'component' | 'template' | 'url';

export interface CustomIcon {
  type: IconType;
  content: string | TemplateRef<any> | Type<any>;
  className?: string;
  style?: { [key: string]: string };
  attributes?: { [key: string]: string };
}

export interface IconConfig {
  // Built-in icons (current system)
  useBuiltIn?: boolean;
  
  // Custom icons per toast type
  warn?: CustomIcon;
  error?: CustomIcon;
  success?: CustomIcon;
  info?: CustomIcon;
  
  // Global custom icon (overrides all types)
  global?: CustomIcon;
  
  // Icon library integration
  library?: 'material' | 'fontawesome' | 'heroicons' | 'custom';
  
  // Size and styling
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
}

// Enhanced ToastOptions with icon support
export interface EnhancedToastOptions {
  duration?: number;
  dismissible?: boolean;
  positionVertical?: 'top' | 'bottom' | 'center';
  positionHorizontal?: 'left' | 'right' | 'center';
  showIcon?: boolean;
  animationType?: ToastAnimationType;
  
  // New icon options
  customIcon?: CustomIcon;
  iconConfig?: IconConfig;
}

// Enhanced ToastData with custom icons
export class EnhancedToastData {
  
  constructor(
    public type: ToastType,
    public text?: string,
    options: EnhancedToastOptions = {}
  ) {
    // Existing properties...
    
    // New icon properties
    this.customIcon = options.customIcon;
    this.iconConfig = options.iconConfig;
  }
  
  public customIcon?: CustomIcon;
  public iconConfig?: IconConfig;
  
  // Fluent API methods for custom icons
  withSvgIcon(svgContent: string, className?: string): EnhancedToastData {
    this.customIcon = {
      type: 'svg',
      content: svgContent,
      className
    };
    return this;
  }
  
  withFontIcon(iconClass: string, library: 'fontawesome' | 'material' = 'material'): EnhancedToastData {
    this.customIcon = {
      type: 'font',
      content: iconClass,
      className: library === 'fontawesome' ? 'fas' : 'material-icons'
    };
    return this;
  }
  
  withComponentIcon(component: Type<any>): EnhancedToastData {
    this.customIcon = {
      type: 'component',
      content: component
    };
    return this;
  }
  
  withTemplateIcon(template: TemplateRef<any>): EnhancedToastData {
    this.customIcon = {
      type: 'template',
      content: template
    };
    return this;
  }
  
  withImageIcon(url: string, alt?: string): EnhancedToastData {
    this.customIcon = {
      type: 'url',
      content: url,
      attributes: { alt: alt || 'Toast icon' }
    };
    return this;
  }
}

// Icon rendering service
export class ToastIconService {
  
  /**
   * Renders the appropriate icon based on configuration
   */
  renderIcon(
    toastData: EnhancedToastData, 
    container: HTMLElement
  ): ComponentRef<any> | null {
    
    const iconConfig = this.resolveIconConfig(toastData);
    
    if (!iconConfig) return null;
    
    switch (iconConfig.type) {
      case 'svg':
        return this.renderSvgIcon(iconConfig, container);
      case 'font':
        return this.renderFontIcon(iconConfig, container);
      case 'component':
        return this.renderComponentIcon(iconConfig, container);
      case 'template':
        return this.renderTemplateIcon(iconConfig, container);
      case 'url':
        return this.renderImageIcon(iconConfig, container);
      default:
        return null;
    }
  }
  
  private resolveIconConfig(toastData: EnhancedToastData): CustomIcon | null {
    // Priority: custom icon > type-specific icon > global icon > built-in
    if (toastData.customIcon) {
      return toastData.customIcon;
    }
    
    if (toastData.iconConfig?.global) {
      return toastData.iconConfig.global;
    }
    
    if (toastData.iconConfig?.[toastData.type]) {
      return toastData.iconConfig[toastData.type];
    }
    
    return null;
  }
  
  private renderSvgIcon(icon: CustomIcon, container: HTMLElement): null {
    const svgElement = document.createElement('div');
    svgElement.innerHTML = icon.content as string;
    svgElement.className = `toast-icon svg-icon ${icon.className || ''}`;
    
    if (icon.style) {
      Object.assign(svgElement.style, icon.style);
    }
    
    container.appendChild(svgElement);
    return null;
  }
  
  private renderFontIcon(icon: CustomIcon, container: HTMLElement): null {
    const iconElement = document.createElement('i');
    iconElement.className = `toast-icon font-icon ${icon.className || ''} ${icon.content}`;
    
    if (icon.style) {
      Object.assign(iconElement.style, icon.style);
    }
    
    container.appendChild(iconElement);
    return null;
  }
  
  private renderComponentIcon(icon: CustomIcon, container: HTMLElement): ComponentRef<any> {
    // Would need Angular's ViewContainerRef to create component
    // This is a simplified example
    console.log('Rendering component icon:', icon.content);
    return null;
  }
  
  private renderTemplateIcon(icon: CustomIcon, container: HTMLElement): null {
    // Would need Angular's TemplateRef rendering
    console.log('Rendering template icon:', icon.content);
    return null;
  }
  
  private renderImageIcon(icon: CustomIcon, container: HTMLElement): null {
    const imgElement = document.createElement('img');
    imgElement.src = icon.content as string;
    imgElement.className = `toast-icon image-icon ${icon.className || ''}`;
    
    if (icon.attributes) {
      Object.entries(icon.attributes).forEach(([key, value]) => {
        imgElement.setAttribute(key, value);
      });
    }
    
    if (icon.style) {
      Object.assign(imgElement.style, icon.style);
    }
    
    container.appendChild(imgElement);
    return null;
  }
}

// Usage examples
export class ToastIconExamples {
  
  static fontAwesome() {
    return EnhancedToastData.Success('Task completed!')
      .withFontIcon('fa-check-circle', 'fontawesome');
  }
  
  static customSvg() {
    const customSvg = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    `;
    
    return EnhancedToastData.Success('Custom icon!')
      .withSvgIcon(customSvg, 'custom-success-icon');
  }
  
  static imageIcon() {
    return EnhancedToastData.Info('New message!')
      .withImageIcon('/assets/icons/message.png', 'Message icon');
  }
  
  static globalIconConfig(): IconConfig {
    return {
      library: 'fontawesome',
      size: 'lg',
      warn: {
        type: 'font',
        content: 'fa-exclamation-triangle',
        className: 'fas text-warning'
      },
      error: {
        type: 'font', 
        content: 'fa-times-circle',
        className: 'fas text-danger'
      },
      success: {
        type: 'font',
        content: 'fa-check-circle', 
        className: 'fas text-success'
      },
      info: {
        type: 'font',
        content: 'fa-info-circle',
        className: 'fas text-info'
      }
    };
  }
}
