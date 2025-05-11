import { localNpmPublishPackage } from '../../shared/npm/local-npm-publisher';
import { extractLibraryData } from '../../../shared/library-data/extract_data_from_library'

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

const libraryRootRelative = "libs/utils/dev-console";
const localNpmDir = "C:/Users/Shaneyboy/my-npm";

//= = = = = = = = = = = = = = = = = = = = = = = = = = //
// EXTRACT DATA FROM LIBRARY
const libraryData = extractLibraryData(libraryRootRelative);
console.log(`Extracted data from ${libraryRootRelative}:`);
console.log(`  libraryData`, libraryData);

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

async function main() {
    try {
        console.log('Strarting local NPM publish process...');

        await localNpmPublishPackage(
            libraryData,
            localNpmDir
        );

        console.log("PUBLISHED!!!!!!!!!!!!!!");
        process.exit(0)

    } catch (err) {
        console.error("😱 ERROR: An error occurred during the publish processing! 👻");
        console.error(err);
        process.exit(1);
    }
}

main();