# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-12-30

### Changed
- Updated README example: `MiniCrudStateBuilder` now demonstrates `.buildAndTrigger()` instead of `.build()` (builder no longer auto-triggers on `build()`).
- Minor documentation tidy.

### Removed
- Removed the `utils` secondary entrypoint; `MiniStateCombined`, `MiniStateUtility`, and other helpers are now exported from the main package root.

## [2.0.0] - 2025-08-01

### Changed
- Updated to use Angular 20

## [1.1.0] - 2025-06-24
Updated the readme to reflect the fact that MiniStateBuilder.Create*** does not require a Destrowref paramater

### Added
- Angular 18 compatibility
- Expanded peer dependency range

## [1.1.0] - 2025-05-07

### Added
- Angular 18 compatibility
- Expanded peer dependency range

### Changed
- Updated documentation to reflect Angular 18 support

## [1.1.0] - 2025-05-07

### Added
- Initial release
- Support for Angular 19