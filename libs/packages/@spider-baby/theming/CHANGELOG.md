# Changelog
All notable changes to this project will be documented in this file.

## [2.0.1] - 2025-08-01

### Changed
- Removed lightModeClass (inferred from lack of darkModeClass)
- Using Dynamic config in ThemeGenerator

 
## [2.0.0] - 2025-08-01

### Changed
- Updated to use Angular 20


## [1.0.3] - 2025-05-29

### Fixed
- Fixed import error with `provideAppInitializer` when using package in Angular 17-18 environments
- Replaced `provideAppInitializer` with `APP_INITIALIZER` token for better cross-version compatibility
- Updated `provideThemeInitializer` function to work consistently across Angular 17, 18, and 19

### Technical Details
- `provideAppInitializer` was only introduced in Angular 19, causing import errors in earlier versions
- Now uses the stable `APP_INITIALIZER` token which is available in all supported Angular versions
- Maintains the same API surface while ensuring compatibility


## [1.0.2] - 2025-05-12

### Changed
- Updated Readme


## [1.0.1] - 2025-05-12

### Changed
- Updated peer dependency declarations to use explicit SemVer range expressions with OR operators (`^17.0.0 || ^18.0.0 || ...`) instead of open-ended ranges (`>=18.0.0`) to improve compatibility across different Angular versions and prevent dependency resolution conflicts


## [1.0.0] - 2025-05-11

### Added
- Initial release
- Support for Angular >=18