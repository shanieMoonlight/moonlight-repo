# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-02

### Added
- Initial release of @spider-baby/auth-signal
- `BaseAuthSignalService` abstract class for JWT authentication with Angular signals
- `JwtPayload` interface with comprehensive JWT and OIDC claims support
- `JwtHelper` utility for JWT decoding and validation
- `Claim` class for type-safe claim representation
- Automatic JWT token expiry handling with timer management
- Cross-platform storage support (browser, Node.js, mobile)
- Built-in role-based access control methods
- Firebase-specific implementation example
- Default localStorage-based implementation example
- Comprehensive unit test coverage
- Full TypeScript support with strict typing
- SSR (Server-Side Rendering) compatibility
- Reactive UI updates via Angular signals
