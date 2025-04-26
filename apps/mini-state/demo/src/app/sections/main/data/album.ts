export interface Album {
    userId: number,
    id: number | string,
    title: string
}

//#####################################################//


export class AlbumUtils {

    /**
     * Generates a random Album with unique ID
     * @returns A randomly generated Album object
     */
    static generateRandomAlbum(): Album {

        const userId = Math.floor(Math.random() * 10) + 1; // Random userId between 1-10
        const id = Math.floor(Math.random() * 1000) + 1; // Random id between 1-1000

        // Array of possible title prefixes and suffixes for variety
        const titlePrefixes = ['Amazing', 'Beautiful', 'Wonderful', 'Incredible', 'Fantastic'];
        const titleMiddles = ['Memories', 'Adventures', 'Moments', 'Journeys', 'Experiences'];
        const titleSuffixes = ['Collection', 'Anthology', 'Series', 'Compilation', 'Volume'];

        // Generate a random title by combining random elements from each array
        const randomPrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
        const randomMiddle = titleMiddles[Math.floor(Math.random() * titleMiddles.length)];
        const randomSuffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];

        const title = `${randomPrefix} ${randomMiddle} ${randomSuffix}`;

        return {
            userId,
            id,
            title
        };
    }

    //----------------------------//

    /**
     * Generates an array of random Albums
     * @param count The number of Albums to generate (default: 15)
     * @returns An array of randomly generated Album objects
     */
    static generateRandomAlbums(count: number = 15): Album[] {
        // Create a Set to track used IDs and ensure uniqueness
        const usedIds = new Set<number | string>();
        const albums: Album[] = [];

        for (let i = 0; i < count; i++) {
            // Keep generating until we get a unique ID
            let album = this.generateRandomAlbum();
            while (usedIds.has(album.id)) {
                album = this.generateRandomAlbum();
            }

            // Track the ID we're using
            usedIds.add(album.id);
            albums.push(album);
        }

        return albums;
    }

}//Cls



//#####################################################//