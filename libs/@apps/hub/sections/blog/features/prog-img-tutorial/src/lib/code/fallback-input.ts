export const FallbackInputCode = `// In the directive
fallbackUrl = input(fallBackSvgDataUri, {
  transform: (value) => value ?? fallBackSvgDataUri,
});`;
