//------------------------------//

export const joinTags = (tags: string[]) => tags
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .join(',');

//------------------------------//