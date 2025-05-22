# @spider-baby/utils-imgs/progressive

Secondary entry point of `@spider-baby/utils-imgs`. It can be used by importing from `@spider-baby/utils-imgs/progressive`.

## Overview

This module provides a comprehensive solution for progressive image loading in Angular applications. The implementation uses Angular's modern signal-based inputs and reactive patterns to create a smooth, efficient image loading experience.

## Features

- Start with low-quality placeholder images that load quickly
- Smoothly transition to high-quality images when they're ready
- Fall back to a default image (or built-in SVG) if loading fails
- Multiple URL resolution strategies (transformation function or direct URL)
- Configurable retry mechanism for failed image loads
- Integration with View Transitions API for smooth page transitions
- Reactive updates to all inputs using Angular signals and RxJS

## Components

### ProgressiveImageLoaderDirective

A directive that enhances standard `<img>` elements with progressive loading capabilities. It handles:

- Listening for placeholder image load/error events
- Loading high-quality images in the background
- Retry logic for failed loads
- Fallback handling
- Event cleanup to prevent memory leaks

### ProgressiveImageComponent

A wrapper component with a cleaner API that internally uses the ProgressiveImageLoaderDirective. It provides:

- A more intuitive interface with the main image as the primary input
- Additional styling options through inputs
- Support for View Transitions API

### ProgImgLoaderFunctions

A utility class with helper methods for common URL transformation patterns:

- `replaceSegment`: Replace parts of a URL path
- `removeFromPath`: Remove segments from a URL path
- `replaceFilenameSuffix`: Replace filename suffixes (e.g., '-small.jpg' to '-large.jpg')
- `changeExtension`: Change file extensions (e.g., '.jpg' to '.webp')

## Implementation Details

- Uses Angular's modern signal-based inputs (input() function)
- Converts signals to observables with toObservable()
- Uses combineLatest to react to multiple input changes
- Implements automatic cleanup with takeUntilDestroyed
- Properly handles server-side rendering scenarios

For complete usage examples and API documentation, see the main [README.md](../README.md).
