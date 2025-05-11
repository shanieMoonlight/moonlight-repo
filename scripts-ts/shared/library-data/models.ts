
//####################################################//

export interface LibraryDependency {
    name: string;
    version: string;
    relativePath?: string;
    absolutePath?: string;
}

//####################################################//

/**
 * Interface representing library data extracted from a package
 */
export interface LibraryData {
    packageName: string;
    pkgVersion: string;
    nxBuildTarget: string;
    packageDistPathRelative: string;
    packageDistPathAbsolute: string;
    libraryRootAbsolute: string;
    repoRoot: string;
    dependencies: LibraryDependency[];
    peerDependencies?: LibraryDependency[];
    devDependencies?: LibraryDependency[];
}

//####################################################//