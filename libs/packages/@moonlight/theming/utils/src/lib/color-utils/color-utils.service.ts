import { Injectable } from '@angular/core';

/**
 * Utility service for color manipulation and transformation.
 * 
 * Provides methods to work with hex colors, convert between formats,
 * and set color-related CSS variables.
 */
@Injectable({
    providedIn: 'root'
})
export class ColorUtilsService {

    /**
     * Extracts RGB components from a hex color
     * @param hexColor - Color in hex format (e.g., '#FF5733' or '#f00')
     * @returns Array with [r, g, b] values (0-255)
     */
    extractRGB(hexColor: string): [number, number, number] {
        // Remove # if present
        hexColor = hexColor.replace('#', '');

        // Handle shorthand hex (#rgb)
        if (hexColor.length === 3) {
            hexColor = hexColor.split('').map(char => char + char).join('');
        }

        // Extract RGB components
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);

        return [r, g, b];
    }

    //-----------------------------//

    /**
     * Returns RGB values as a comma-separated string for use with CSS rgba()
     * @param hexColor - Color in hex format
     * @returns Comma-separated RGB values (e.g., "255, 87, 51")
     */
    getRGBString(hexColor: string): string {
        const [r, g, b] = this.extractRGB(hexColor);
        return `${r}, ${g}, ${b}`;
    }

    //-----------------------------//

    /**
     * Returns a CSS rgba() value with the specified alpha
     * @param hexColor - Color in hex format
     * @param alpha - Alpha value (0-1)
     * @returns CSS rgba string (e.g., "rgba(255, 87, 51, 0.5)")
     */
    getRGBA = (hexColor: string, alpha: number): string =>
        `rgba(${this.getRGBString(hexColor)}, ${alpha})`

    //-----------------------------//

    /**
     * Set an RGB variable on an element for transparency support
     * @param element - The target HTML element
     * @param variableName - CSS variable name
     * @param hexColor - Color in hex format
     */
    setRGBVariable = (element: HTMLElement, variableName: string, hexColor: string): void =>
        element.style.setProperty(variableName, this.getRGBString(hexColor))


}//Cls