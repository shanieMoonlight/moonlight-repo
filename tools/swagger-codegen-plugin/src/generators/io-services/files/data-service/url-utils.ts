export class UrlUtils {

    static combine(...paths: Array<string | null | undefined>): string {
        const validSegments = paths
            .filter(
                (segment): segment is string =>
                    typeof segment === 'string' && segment.trim() !== ''
            )
            .map((segment, idx) => {
                // Don't trim trailing slash from protocol (e.g., 'https://')
                if (idx === 0 && /^[a-zA-Z]+:\/\//.test(segment)) {
                    return segment.replace(/\/+$/, '');
                }
                return segment.replace(/^\/+|\/+$/g, '');
            });

        if (validSegments.length === 0) return '';

        // Join with a single slash
        return validSegments.join('/');
    }

}