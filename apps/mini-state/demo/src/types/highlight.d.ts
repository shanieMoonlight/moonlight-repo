declare module 'highlight.js/lib/core' {
  const core: any;
  export default core;
}

// Add this declaration for the version with .js extension
declare module 'highlight.js/lib/core.js' {
  const core: any;
  export default core;
}