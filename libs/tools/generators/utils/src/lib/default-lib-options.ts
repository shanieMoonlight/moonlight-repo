import { Schema } from "@nx/angular/src/generators/library/schema";

//##############################################//

export type DefaultLibraryOptions = Omit<Schema, 'directory'>;

//##############################################//

export function getDefaultLibraryOptions(): DefaultLibraryOptions {

    return {
        addTailwind: false,
        skipFormat: false,
        // simpleName: false,
        addModuleSpec: false,
        buildable: true,
        publishable: true,
        spec: false,
        flat: false,
        commonModule: false,
        routing: false,
        lazy: false,
        strict: true,
        setParserOptionsProject: false,
        skipModule: true,
        skipPackageJson: false,
        standalone: true,
        displayBlock: true,
        inlineStyle: false,
        inlineTemplate: false,
        changeDetection: 'OnPush',
        style: 'scss',
        skipTests: false,
        skipSelector: false,
        addPlugin: false,
    }
}


//##############################################//