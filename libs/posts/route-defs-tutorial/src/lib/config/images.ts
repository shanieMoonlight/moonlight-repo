export class PlaceholderUtils {

 static getPlaceholder(url: string): string {
    const parts = url.split('/');
    if (parts.length >= 1)  // Ensure there's at least one part to avoid issues with empty or root URLs
      parts.splice(parts.length - 1, 0, 'placeholder')
    return parts.join('/');
  }

}

export class LibImages {


  static Post = class {
    static Banner = class {
      static readonly placeholder = 'route-defs-tutorial/images/banner/placeholder/route-defs-post.jpg';
      static readonly default = 'route-defs-tutorial/images/banner/route-defs-post.jpg';
      static readonly small = 'route-defs-tutorial/images/banner/small/route-defs-post.jpg';
      static readonly medium = 'route-defs-tutorial/images/banner/medium/route-defs-post.jpg';
      static readonly large = 'route-defs-tutorial/images/banner/large/route-defs-post.jpg';
      static readonly xlarge = 'route-defs-tutorial/images/banner/xlarge/route-defs-post.jpg';
    };

  }

} //Cls
