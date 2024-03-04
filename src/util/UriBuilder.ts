export const _buildURI = (url: string, params: Record<string, any>) => {
  const urlObject = new URL(url);
  const searchParams = new URLSearchParams(urlObject.search);

  // Append the params to the searchParams object
  for (const key of Object.keys(params)) {
    // Skip appending null, undefined, or empty strings
    const value = params[key];
    if (value !== null && value !== undefined && value !== "") {
      // Convert non-string values to strings before appending
      const paramValue = typeof value === "string" ? value : String(value);
      searchParams.append(key, paramValue);
    }
  }

  // Update the search property of the URL object with the updated searchParams
  urlObject.search = searchParams.toString();

  return urlObject.toString(); // Return the constructed URL as a string
};
