# Build Helpers Generator

This tool automates the creation of build helper scripts for libraries in your monorepo. It generates PowerShell, batch, and command files to streamline local and npm publishing, as well as a helpful README for each library.

---

## Features

- **Automatic Extraction:** Reads `package.json`, `project.json`, and (if present) `ng-package.json` to extract all necessary metadata.
- **Script Generation:** Creates PowerShell and batch scripts for local and npm publishing.
- **Customizable:** Accepts user input for library location and optional overrides for script paths.
- **Robust:** Ensures all required fields are present and directories are created as needed.

---

## Usage

### 1. **Install dependencies**

```sh
npm install
```

### 2. **Run the generator**

```sh
node scripts/shared/npm/build-helpers/build-helpers-generator.js \
  --libraryRootRelative=libs/packages/@spider-baby/ssr/storage
```

#### **Optional arguments:**

- `--localNpmDir` or `-n`: Override the default local npm directory.
- `--sharedScriptsRelativePath` or `-s`: Override the default shared scripts path.

### 3. **What gets generated?**

A `build-helpers` directory will be created inside your target library, containing:
- PowerShell scripts for local and npm publishing
- Batch wrappers for Windows
- Command files for easy CLI use
- A README with usage instructions

---

## Example

```sh
node scripts/shared/npm/build-helpers/build-helpers-generator.js \
  -l libs/packages/@spider-baby/ssr/storage \
  -n C:/Users/YourUser/my-npm \
  -s scripts/shared/npm
```

---

## How it works

1. **Extracts metadata** from your library’s `package.json`, `project.json`, and `ng-package.json`.
2. **Validates** all required fields.
3. **Generates scripts** using templates, parameterized with your library’s info.
4. **Writes files** to the `build-helpers` directory.

---

## Extending

- Add new script templates in `scripts/shared/npm/build-helpers/fileTemplates/`.
- Update or add utility functions in `scripts/shared/npm/build-helpers/utils/`.

---

## Troubleshooting

- Ensure your library has valid `package.json` and `project.json` files.
- If using Angular, make sure `ng-package.json` is present for accurate dist path detection.
- Errors will be logged to the console with details.

---

## License

MIT
