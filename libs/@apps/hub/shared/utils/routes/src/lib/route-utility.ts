
export class RouteUtility {

    static combine(...paths: Array<string | null | undefined>): string {

        const validSegments = paths
            // Filter out null, undefined, and empty/whitespace-only strings
            .filter((segment): segment is string => typeof segment === 'string' && segment.trim() !== '') 
            // Trim whitespace from valid segments
            .map(segment => segment.trim()); 

        if (validSegments.length === 0)
            return ''

        // Join segments, then normalize slashes
        let combinedPath = validSegments.join('/');

        // Replace multiple consecutive slashes with a single slash
        combinedPath = combinedPath.replace(/\/{2,}/g, '/');

        // Optional: Remove a trailing slash if the path is not just "/"
        if (combinedPath !== '/' && combinedPath.endsWith('/'))
            combinedPath = combinedPath.slice(0, -1);

        return combinedPath;
    }


}//Cls