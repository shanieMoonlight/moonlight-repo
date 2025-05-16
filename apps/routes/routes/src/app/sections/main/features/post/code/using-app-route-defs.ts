export const AppRoutesExamplesTs = {

  example: `// Basic route segment. 
// Use when nvaigating from MainSection base or home
const aboutRoute = MainSectionRoutesDefs.route('about');
// Result: "about"

// Use when nvaigating from ProductAdminSectionRoutesDefs base or home
const newProductRoute = ProductAdminSectionRoutesDefs.route('new-product');
// Result: "new-product"

// Full path from app root
const adminUsersPath = AppRouteDefs.fullPaths.admin.route('users');
// Result: "admin/users"

// Full path with leading slash.  Use to navigate from anywhere in the app relative to the base
const productsPathWithSlash = AppRouteDefs.fullPathsWithSlash.main.route('products');
// Result: "/main/products"

// Nested route full path (Product Admin within Admin)
const newProductPath = AppRouteDefs.fullPaths.admin.products.route('new-product');
// Result: "admin/product-admin/new-product"

// Nested route (Product Admin within Admin). Use to to display the route in a tooltip or similar. (Gets the final segment in the path)
const newProductPath = AppRouteDefs.routes.admin.products.route('new-product');
// Result: "new-product"


// Section base route 
const productsAdminBasePath = AppRouteDefs.fullPaths.admin.products.route();
// Result: "product-admin"

const productsAdminBaseFullPath = AppRouteDefs.fullPaths.admin.products.route();
// Result: "admin/product-admin"

const productsAdminBaseWithSlash = AppRouteDefs.fullPathsWithSlash.admin.products.route();
// Result: "/admin/product-admin"

//Type Safety Benefits
const productsAdminBaseWithSlash = AppRouteDefs.fullPathsWithSlash.admin.products.route('new-prod');
// Result: error - Argument of type '"new-prod"' is not assignable to parameter of type 'CHILD_ROUTE | undefined'.ts(2345)
`


}
