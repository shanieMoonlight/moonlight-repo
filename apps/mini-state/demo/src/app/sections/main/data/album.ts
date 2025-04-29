import { FormControl, FormGroup } from "@angular/forms";

export interface Album {
    id?: string | number,
    userId: string | number,
    title: string
    description?: string|null
}

//#########################################//

export interface IAlbumForm extends FormGroup<{
    id: FormControl<string | number>;
    userId: FormControl<string | number>
    title: FormControl<string>
    description: FormControl<string|null>
}> { }

//#########################################//


export class AlbumUtils {

    /**
     * Generates a random Album with unique ID
     * @returns A randomly generated Album object
     */
    static generateRandomAlbum(id?: string | number, phrase?: string): Album {

        console.log(`Generating random Album with id: ${id}, ${phrase}`);
        

        const userId = Math.floor(Math.random() * 10) + 1; // Random userId between 1-10
        id ??= Math.floor(Math.random() * 1000) + 1; // Random id between 1-1000

        // Array of possible title prefixes and suffixes for variety
        const titlePrefixes = ['Amazing', 'Beautiful', 'Wonderful', 'Incredible', 'Fantastic'];
        const titleMiddles = ['Memories', 'Adventures', 'Moments', 'Journeys', 'Experiences'];
        const titleSuffixes = ['Collection', 'Anthology', 'Series', 'Compilation', 'Volume'];

        // Generate a random title by combining random elements from each array
        const randomPrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
        const randomMiddle = titleMiddles[Math.floor(Math.random() * titleMiddles.length)];
        const randomSuffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];

        const title = `${randomPrefix} ${phrase} ${randomMiddle} ${randomSuffix}`;


        const descriptions = [
            'A collection of unforgettable moments.',
            `An  ${phrase} anthology of beautiful memories.`,
            'A journey through incredible experiences.',
            `A compilation of fantastic  ${phrase} adventures.`,
            'A series of wonderful stories.'
        ];

        const description = descriptions[Math.floor(Math.random() * descriptions.length)];

        return {
            userId,
            id,
            title,
            description
        };
    }

    //----------------------------//

    /**
     * Generates an array of random Albums
     * @param count The number of Albums to generate (default: 15)
     * @returns An array of randomly generated Album objects
     */
    static generateRandomAlbums(count: number = 15, phrase?: string): Album[] {
        // Create a Set to track used IDs and ensure uniqueness
        const usedIds = new Set<number | string>();
        const albums: Album[] = [];

        for (let i = 0; i < count; i++) {
            // Keep generating until we get a unique ID
            let album = this.generateRandomAlbum(undefined, phrase);
            const albumId = album.id ?? 0
            while (usedIds.has(albumId)) {
                album = this.generateRandomAlbum();
            }

            // Track the ID we're using
            if (album.id)
                usedIds.add(album.id);
            albums.push(album);
        }

        return albums;
    }

}//Cls



//#########################################//