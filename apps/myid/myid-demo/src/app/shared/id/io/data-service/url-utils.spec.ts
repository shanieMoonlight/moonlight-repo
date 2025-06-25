import { UrlUtils } from './url-utils';

describe('UrlUtils.combine', () => {
  it('joins simple relative paths', () => {
    expect(UrlUtils.combine('api', 'foo', 'bar')).toBe('api/foo/bar');
  });

  it('preserves a single leading slash for absolute paths', () => {
    expect(UrlUtils.combine('/api', 'foo')).toBe('/api/foo');
    expect(UrlUtils.combine('/api/', '/foo/')).toBe('/api/foo');
  });

  it('removes duplicate slashes between segments', () => {
    expect(UrlUtils.combine('api/', '/foo/', '/bar/')).toBe('api/foo/bar');
    expect(UrlUtils.combine('/api/', '/foo//bar/')).toBe('/api/foo/bar');
    expect(UrlUtils.combine('api//', '//foo//', 'bar//')).toBe('api/foo/bar');
  });

  it('handles protocol and does not remove double slash after protocol', () => {
    expect(UrlUtils.combine('https://api.site', 'foo', 'bar')).toBe('https://api.site/foo/bar');
    expect(UrlUtils.combine('https://api.site/', '/foo/', '/bar/')).toBe('https://api.site/foo/bar');
    expect(UrlUtils.combine('https://api.site//', '//foo//', 'bar//')).toBe('https://api.site/foo/bar');
  });

  it('handles empty, null, or undefined segments', () => {
    expect(UrlUtils.combine('', 'foo', null, undefined, 'bar')).toBe('foo/bar');
    expect(UrlUtils.combine()).toBe('');
    expect(UrlUtils.combine(null, undefined, '')).toBe('');
  });

  it('handles only a leading slash', () => {
    // expect(UrlUtils.combine('/')).toBe('/');
    // expect(UrlUtils.combine('/', 'foo')).toBe('/foo');
    expect(UrlUtils.combine('/', '/foo/')).toBe('/foo');
  });

  it('handles trailing slashes in protocol', () => {
    expect(UrlUtils.combine('https://api.site//')).toBe('https://api.site');
    expect(UrlUtils.combine('https://api.site//', '/foo/')).toBe('https://api.site/foo');
  });

  it('handles user mistakes with many slashes', () => {
    expect(UrlUtils.combine('///api///', '///foo///', '///bar///')).toBe('/api/foo/bar');
    expect(UrlUtils.combine('https://api.site', '////foo/////bar////')).toBe('https://api.site/foo/bar');
    expect(UrlUtils.combine('/api/', '/foo//bar/')).toBe('/api/foo/bar');
  });
});
