export const FallbackInputCode = `// In the directive
/** 
 * What to use when placeholder and main img load fail.
 * Default = generic image icon SVG
 */
fallbackUrl = input(fallBackSvgDataUri, {
  transform: (value: string | undefined) => value ?? fallBackSvgDataUri,
});`;
