import { FormControl, FormGroup } from "@angular/forms";

export interface Album {
    id: string | number,
    userId: string | number,
    title: string
    description?: string | null
}

// export interface CreateAlbumDto {
//     userId: string | number,
//     title: string
//     description?: string | null
// }

//#########################################//

export interface IAlbumForm extends FormGroup<{
    id: FormControl<string | number | null>;
    userId: FormControl<string | number>
    title: FormControl<string>
    description: FormControl<string | null>
}> { }

//#########################################//


export class AlbumUtils {

    /**
     * Generates a random Album with unique ID
     * @returns A randomly generated Album object
     */
    static generateRandomAlbum(id?: string | number | null, searchTerm?: string): Album {
        const userId = Math.floor(Math.random() * 10) + 1; // Random userId between 1-10

        // Generate a random ID between 1-10000 if not provided
        id ??= Math.floor(Math.random() * 10000) + 1;

        // Array of possible title prefixes and suffixes for variety
        const titlePrefixes = ['Amazing', 'Beautiful', 'Wonderful', 'Incredible', 'Fantastic'];
        const titleMiddles = ['Memories', 'Adventures', 'Moments', 'Journeys', 'Experiences'];
        const titleSuffixes = ['Collection', 'Anthology', 'Series', 'Compilation', 'Volume'];

        // Generate a random title by combining random elements from each array
        const randomPrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
        const randomMiddle = titleMiddles[Math.floor(Math.random() * titleMiddles.length)];
        const randomSuffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];

        // Include searchTerm in title if provided
        const title = searchTerm
            ? `${randomPrefix} ${searchTerm} ${randomMiddle} ${randomSuffix}`
            : `${randomPrefix} ${randomMiddle} ${randomSuffix}`;

        const descriptions = [
            'A collection of unforgettable moments.',
            'An anthology of beautiful memories.',
            'A journey through incredible experiences.',
            'A compilation of fantastic adventures.',
            'A series of wonderful stories.'
        ];

        // Include searchTerm in description if provided
        let description = descriptions[Math.floor(Math.random() * descriptions.length)];
        if (searchTerm) {
            // Add searchTerm to half of the descriptions to make searching more realistic
            if (Math.random() > 0.5) {
                description = `An anthology of beautiful ${searchTerm} memories.`;
            }
        }

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
    static generateRandomAlbums(count: number = 15, searchTerm?: string): Album[] {
        // Simplified approach: don't worry about ID uniqueness for demo purposes
        const albums: Album[] = [];

        for (let i = 0; i < count; i++) {
            // Generate a random album with searchTerm
            const album = this.generateRandomAlbum(undefined, searchTerm);
            albums.push(album);
        }

        return albums;
    }

}//Cls



//#########################################//