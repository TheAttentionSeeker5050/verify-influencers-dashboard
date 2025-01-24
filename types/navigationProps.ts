// Types for query search parameters and route parameters
export type SearchParams = { [key: string]: string | undefined };
export type RouteParams = { [key: string]: string }; // Typically dynamic route params are strings

export type NavigationProps = {
    searchParams: SearchParams; // Query parameters from the URL
    params: RouteParams;       // Dynamic route parameters
};
  