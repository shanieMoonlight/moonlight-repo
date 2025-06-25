export class UrlUtils {

 static combine(...paths: Array<string | null | undefined>): string {
    // Filter out empty, null, or undefined segments
    const segments = paths.filter(
      (segment): segment is string =>
        typeof segment === 'string' && segment.trim() !== ''
    );

    if (segments.length === 0) return '';

    let first = segments[0];
    let rest = segments.slice(1);

    // Handle protocol (e.g., 'https://')
    if (/^[a-zA-Z]+:\/\//.test(first)) {
      first = first.replace(/\/+$/, '');
    } else if (/^\/+$/.test(first)) {
      // If first is only slashes, treat as root
      first = '/';
    } else if (first.startsWith('/')) {
      // If first starts with slash, preserve single leading slash
      first = '/' + first.replace(/^\/+|\/+$/g, '');
    } else {
      // Otherwise, trim slashes
      first = first.replace(/^\/+|\/+$/g, '');
    }

    // Normalize the rest: trim leading/trailing slashes
    rest = rest.map(s => s.replace(/^\/+|\/+$/g, ''));

    // If first is just '/', avoid adding extra slash
    if (first === '/') {
      // Remove empty segments in rest to avoid '/foo' -> '//foo'
      rest = rest.filter(s => s !== '');
      return rest.length ? '/' + rest.join('/') : '/';
    }

    // Join all together
    let result = [first, ...rest].filter(Boolean).join('/');

    // Defensive: remove double slashes except after protocol
    result = result.replace(/([^:]\/)\/+/g, '$1');

    return result;
  }

}
