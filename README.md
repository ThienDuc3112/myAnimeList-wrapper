# MyAnimeList-wrapper 

A small, 0 dependency, My Anime List API wrapper with type checking.

## Initilization 
```js
import { MAL } from "myanimelist-wrapper";
// or
const { MAL } = require("myanimelist-wrapper");

// ACCESS-TOKEN is optional
const mal = new MAL("CLIENT-ID", "ACCESS-TOKEN")
```

## Usage
```js
// Search for an anime
const searchTerm = "One piece";
const [searchResult, error] = await mal.searchAnime({q: searchTerm});
if(!error) {
    serachResult.forEach(anime => console.log(anime));
} else {
    console.log(error.message);
}
```
