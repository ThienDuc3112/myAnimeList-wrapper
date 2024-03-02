import { MalError } from "./util/Error";
import { AllAnimeDetailFields, AllAnimeFields, Anime, AnimeDetail, AnimeDetailFields, AnimeFields } from "./interface/animeRoute";
import { buildURI } from "./util/UriBuilder";

export class MAL {
    private accessToken: string | undefined;
    private clientId: string;
    private url = "https://api.myanimelist.net/v2";

    /**
        * Creates an instance of MAL API wrapper.
        * @param {string} clientId - The client ID required for accessing the API.
        * @param {string} [accessToken] - The access token (optional).
    */
    constructor(clientId: string, accessToken?: string) {
        this.clientId = clientId;
        this.accessToken = accessToken;
    }

    /**
        * Sets the access token for the API requests.
        * @param {string} token - The access token to set.
    */
    public setAccessToken(token: string): void {
        this.accessToken = token;
    }

    /**
        * Sets the client ID for the API requests.
        * @param {string} id - The client ID to set.
    */
    public setClientId(id: string): void {
        this.clientId = id;
    }

    private static async get<T>(url: string, option: RequestInit): Promise<[T, undefined] | [undefined, MalError]> {
        try {
            const res = await fetch(url, option);
            if (!res.ok) {
                switch (res.status) {
                    case 400:
                        return [undefined, new MalError("Invalid parameter", 400)]
                    case 401:
                        return [undefined, new MalError("Expired access tokens, invlaid access tokens, etc.", 401)]
                    case 403:
                        return [undefined, new MalError("DoS detected etc.", 403)]
                    case 404:
                        return [undefined, new MalError("Not found", 404)]
                    default:
                        return [undefined, new MalError("Generic error occured", res.status)];
                }
            }
            const json: T = await res.json();
            return [json, undefined];
        } catch (err) {
            return [undefined, new MalError("Network error", 500)];
        }
    }

    /**
        * Asynchronous method for searching anime.
        * @param {Object} option - Search options.
        * @param {string} option.q - The search term.
        * @param {number} [option.limit] - Limit on the number of anime to be returned (maximum 100).
        * @param {number} [option.offset] - Offset for pagination.
        * @returns {Promise<[Anime[], undefined] | [undefined, MalError]>} A promise resolving to an array containing anime data or an error.
    */
    public async searchAnime(option: { q: string, limit?: number, offset?: number }): Promise<[Anime[], undefined] | [undefined, MalError]>
    /**
        * Asynchronous method for searching anime with specific fields.
        * @param {Object} option - Search options.
        * @param {string} option.q - The search term.
        * @param {number} [option.limit] - Limit on the number of anime to be returned (maximum 100).
        * @param {number} [option.offset] - Offset for pagination.
        * @param {AnimeFields[]} option.fields - The fields to include in the returned data.
        * @returns {Promise<[(Partial<Anime> & Pick<Anime, "id" | "title">)[], undefined] | [undefined, MalError]>} A promise resolving to an array containing partial anime data or an error.
    */
    public async searchAnime(option: { q: string, limit?: number, offset?: number, fields: AnimeFields[] }): Promise<[(Partial<Anime> & Pick<Anime, "id" | "title">)[], undefined] | [undefined, MalError]>
    public async searchAnime(option: { q: string, limit?: number, offset?: number, fields?: AnimeFields[] }): Promise<[(Partial<Anime> & Pick<Anime, "id" | "title">)[], undefined] | [undefined, MalError]> {
        const reqOption: RequestInit = this.accessToken ? {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        } : {
            headers: {
                "X-MAL-CLIENT-ID": this.clientId
            }
        }
        const uri = buildURI(`${this.url}/anime`, { q: option.q, limit: option.limit ?? 100, offset: option.offset ?? 0 })
        if (!option.fields) {
            const [data, err] = await MAL.get<{ data: { node: Anime }[], paging: { previous?: string, next?: string } }>(`${uri}&fields=${AllAnimeFields.join(",")}`, reqOption);
            if (err == undefined) {
                return [data.data.map(anime => anime.node), undefined];
            }
            return [undefined, err];
        } else {
            const [data, err] = await MAL.get<{ data: { node: Partial<Anime> & Pick<Anime, "id" | "title"> }[], paging: { previous?: string, next?: string } }>(`${uri}&fields=${option.fields.join(",")}`, reqOption);
            if (err == undefined) {
                return [data.data.map(anime => anime.node), undefined];
            }
            return [undefined, err];
        }
    }

    /**
        * Asynchronous method for retrieving anime details.
        * @param {Object} option - Options for retrieving anime details.
        * @param {number} option.animeId - The ID of the anime.
        * @returns {Promise<[AnimeDetail, undefined] | [undefined, MalError]>} A promise resolving to anime details or an error.
    */
    public async getAnimeDetail(option: { animeId: number }): Promise<[AnimeDetail, undefined] | [undefined, MalError]>
    /**
        * Asynchronous method for retrieving anime details with specific fields.
        * @param {Object} option - Options for retrieving anime details.
        * @param {number} option.animeId - The ID of the anime.
        * @param {AnimeDetailFields[]} option.fields - The fields to include in the returned data.
        * @returns {Promise<[Partial<AnimeDetail> & Pick<AnimeDetail, "id" | "title">, undefined] | [undefined, MalError]>} A promise resolving to partial anime details or an error.
    */
    public async getAnimeDetail(option: { animeId: number, fields: AnimeDetailFields[] }): Promise<[Partial<AnimeDetail> & Pick<AnimeDetail, "id" | "title">, undefined] | [undefined, MalError]>
    public async getAnimeDetail({ animeId, fields }: { animeId: number, fields?: AnimeDetailFields[] }): Promise<[Partial<AnimeDetail> & Pick<AnimeDetail, "id" | "title">, undefined] | [undefined, | MalError]> {
        const reqOption: RequestInit = this.accessToken ? {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        } : {
            headers: {
                "X-MAL-CLIENT-ID": this.clientId
            }
        }
        const uri = `${this.url}/anime/${animeId}`;
        if (!fields) return await MAL.get<AnimeDetail>(uri + "?fields=" + AllAnimeDetailFields.join(","), reqOption);
        return await MAL.get<Partial<AnimeDetail> & Pick<AnimeDetail, "id" | "title">>(uri + "?fields=" + fields.join(","), reqOption);
    }
}
