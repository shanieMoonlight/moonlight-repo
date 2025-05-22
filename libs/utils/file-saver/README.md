# spider-baby-utils-file-saver

This library was generated with [Nx](https://nx.dev).

This library provides a service, `FileDownloadService`, for triggering file downloads in the browser.

## FileDownloadService

The primary service exported by this library is `FileDownloadService`. It allows you to download content as a file.

### Importing the service

```typescript
import { FileDownloadService } from '@spider-baby/utils-file-saver';
import { Component, inject } from '@angular/core';

@Component({
  // ...
})
export class MyComponent {
  private readonly blobDownloadService = inject(FileDownloadService);

  downloadMyFile() {
    this.blobDownloadService.downloadText('Hello, world!', 'hello.txt');
  }
}
```

### Methods

#### `downloadBlob(content: string | Blob, options: DownloadOptions): boolean`

This is the core method that triggers a file download.

-   `content`: The content to download. Can be a string or a Blob.
-   `options`: An object with the following properties:
    -   `filename`: The desired name for the downloaded file.
    -   `mimeType`: The MIME type of the content (e.g., 'text/plain', 'application/json').
-   Returns: `true` if the download was initiated successfully, `false` otherwise.

**Example:**

```typescript
const success = this.blobDownloadService.downloadBlob('Some text content', {
  filename: 'example.txt',
  mimeType: 'text/plain',
});
if (success) {
  console.log('File download initiated.');
} else {
  console.error('File download failed.');
}
```

#### Convenience Methods

The service also provides several convenience methods for common file types. These methods internally call `downloadBlob` with the appropriate MIME type and ensure the correct file extension.

-   **`downloadScss(content: string, filename = 'my-download.scss'): boolean`**
    -   Downloads SCSS content. Ensures the filename ends with `.scss`.
    -   MIME type: `text/scss`

-   **`downloadJson(content: object | string, filename = 'data.json'): boolean`**
    -   Downloads JSON content. If `content` is an object, it will be stringified. Ensures the filename ends with `.json`.
    -   MIME type: `application/json`

-   **`downloadCsv(content: string, filename = 'data.csv'): boolean`**
    -   Downloads CSV content. Ensures the filename ends with `.csv`.
    -   MIME type: `text/csv`

-   **`downloadText(content: string, filename = 'data.txt'): boolean`**
    -   Downloads plain text content. Ensures the filename ends with `.txt`.
    -   MIME type: `text/plain`

-   **`downloadHtml(content: string, filename = 'page.html'): boolean`**
    -   Downloads HTML content. Ensures the filename ends with `.html` (or `.htm`).
    -   MIME type: `text/html`

**Example using a convenience method:**

```typescript
const jsonData = { key: 'value', count: 42 };
this.blobDownloadService.downloadJson(jsonData, 'my-data.json');
```

## Running unit tests

Run `nx test spider-baby-utils-file-saver` to execute the unit tests.
