export class StringUtils {
    /**
     * Converts a string to a slug format (lowercase, hyphen-separated).
     * @param str The input string.
     * @returns The slugified string.
     */
    static slugify(str: string): string {
        return str
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '') // Remove all non-word chars
            .replace(/--+/g, '-') // Replace multiple hyphens with a single one
            .trim(); // Trim leading/trailing hyphens
    }

    //--------------------------------------//

    /**
     * Converts a string to title case.
     * Example: "hello-world" becomes "Hello World"
     * @param str The string to convert.
     * @returns The title-cased string.
     */
    static toTitleCase(str: string | undefined | null): string  {
        if (!str) return '';

        return str
            .replace(/-/g, ' ') // Replace all hyphens with spaces
            .toLowerCase() // Convert to lowercase first
            .split(' ') // Split into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
            .join(' '); // Join words back
    }
}