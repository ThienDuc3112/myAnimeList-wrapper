import { MalError } from "./util/Error";
import { AllAnimeFields, Anime, AnimeFields } from "./interface/animeReturnType";
import { buildURI } from "./util/UriBuilder";

export class MAL {
    private accessToken: string | undefined;
    private clientId: string;
    private url = "https://api.myanimelist.net/v2";
    constructor(clientId: string, accessToken?: string) {
        this.clientId = clientId;
        this.accessToken = accessToken;
    }

    public setAccessToken(token: string):void {
        this.accessToken = token;
    }

    public setClientId(id: string):void {
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

    public async getAnimeList(option: { q: string, limit?: number, offset?: number }): Promise<[Anime[], undefined] | [undefined, MalError]>
    public async getAnimeList(option: { q: string, limit?: number, offset?: number, fields: AnimeFields[] }): Promise<[Partial<Anime>[], undefined] | [undefined, MalError]>
    public async getAnimeList(option: { q: string, limit?: number, offset?: number, fields?: AnimeFields[] }): Promise<[Partial<Anime>[], undefined] | [undefined, MalError]> {
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
            const [data, err] = await MAL.get<{ data: { node: Partial<Anime> }[], paging: { previous?: string, next?: string } }>(`${uri}&fields=${option.fields.join(",")}`, reqOption);
            if (err == undefined) {
                return [data.data.map(anime => anime.node), undefined];
            }
            return [undefined, err];
        }
    }

}
