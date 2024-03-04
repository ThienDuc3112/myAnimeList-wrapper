import {
  AllAnimeDetailFields,
  AllAnimeFields,
  Anime,
  AnimeDetail,
  AnimeDetailFields,
  AnimeFields,
  _MALstandardListResponse,
  quarter,
  rankingInfo,
  rankingType,
} from "../interface/animeRoute";
import { MalError } from "../util/Error";
import { _malFetch } from "../util/MalFetch";
import { _buildURI } from "../util/UriBuilder";

export class MalAnime {
  private accessToken: string | undefined;
  private clientId: string;
  private url = "https://api.myanimelist.net/v2";

  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {string} clientId - the client ID
   * @param {string} [accessToken] - the access token (optional)
   */
  constructor(clientId: string, accessToken?: string) {
    this.clientId = clientId;
    this.accessToken = accessToken;
  }

  private genenrateHeader(): RequestInit {
    return this.accessToken
      ? {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      : {
          headers: {
            "X-MAL-CLIENT-ID": this.clientId,
          },
        };
  }

  /**
   *
   * Sets the access token for the API requests.
   * @param {string} token - The access token to set.
   */
  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   *
   * Sets the client ID for the API requests.
   * @param {string} id - The client ID to set.
   */
  public setClientId(id: string): void {
    this.clientId = id;
  }

  private static async fetch<T>(
    url: string,
    option: RequestInit
  ): Promise<[T, undefined] | [undefined, MalError]> {
    try {
      const res = await fetch(url, option);
      if (!res.ok) {
        switch (res.status) {
          case 400:
            return [undefined, new MalError("Invalid parameter", 400)];
          case 401:
            return [
              undefined,
              new MalError(
                "Expired access tokens, invlaid access tokens, etc.",
                401
              ),
            ];
          case 403:
            return [undefined, new MalError("DoS detected etc.", 403)];
          case 404:
            return [undefined, new MalError("Not found", 404)];
          default:
            return [
              undefined,
              new MalError("Generic error occured", res.status),
            ];
        }
      }
      const json: T = await res.json();
      return [json, undefined];
    } catch (err) {
      return [undefined, new MalError("Network error", 500)];
    }
  }

  /**
   *
   * Searches for anime matching the given query. This method can be used
   * to find anime by titles, descriptions, or other criteria.
   *
   * @example
   * ```typescript
   * const mal = new MAL('your_client_id', 'your_access_token');
   *
   * async function searchForAnime() {
   *   const [results, error] = await mal.searchAnime({ q: 'Naruto', limit: 10 });
   *   if (error) {
   *     console.error('Search failed:', error.message);
   *     return;
   *   }
   *   console.log('Search results:', results);
   * }
   *
   * searchForAnime();
   * ```
   *
   * @param {Object} option - Search options including query, limit, offset, and fields.
   * @returns {Promise<[Anime[], undefined] | [undefined, MalError]>} A promise that resolves with the search results or an error.
   */
  public async searchAnime(option: {
    q: string;
    limit?: number;
    offset?: number;
  }): Promise<[Anime[], undefined] | [undefined, MalError]>;
  public async searchAnime(option: {
    q: string;
    limit?: number;
    offset?: number;
    fields: AnimeFields[];
  }): Promise<
    | [(Partial<Anime> & Pick<Anime, "id" | "title">)[], undefined]
    | [undefined, MalError]
  >;
  public async searchAnime({
    q,
    limit,
    offset,
    fields,
  }: {
    q: string;
    limit?: number;
    offset?: number;
    fields?: AnimeFields[];
  }): Promise<
    | [(Partial<Anime> & Pick<Anime, "id" | "title">)[], undefined]
    | [undefined, MalError]
  > {
    const reqOption: RequestInit = this.genenrateHeader();
    let uri = _buildURI(`${this.url}/anime`, {
      q: q,
      limit: limit ?? 100,
      offset: offset ?? 0,
      fields: fields ? fields.join(",") : AllAnimeFields.join(","),
    });
    const [data, err] = await _malFetch<
      _MALstandardListResponse<{ node: Anime }>
    >(`${uri}`, reqOption);
    if (err == undefined) {
      return [data.data.map((anime) => anime.node), undefined];
    }
    return [undefined, err];
  }

  /**
   *
   * Retrieves detailed information about a specific anime by its ID. This includes
   * all available data such as the synopsis, airing status, genres, and more. You can
   * also specify which fields to return to minimize the response data.
   *
   * @example
   * ```typescript
   * const mal = new MAL('your_client_id', 'your_access_token');
   *
   * async function getDetailsForAnime(animeId: number) {
   *   const [detail, error] = await mal.getAnimeDetail({ animeId: animeId, fields: ['title', 'sypnosis', 'media_type'] });
   *   if (error) {
   *     console.error('Failed to get anime details:', error.message);
   *     return;
   *   }
   *   console.log('Anime details:', detail);
   * }
   *
   * getDetailsForAnime(1); // Example anime ID
   * ```
   *
   * @param {Object} option - Options for retrieving anime details, including the anime ID and optionally specific fields.
   * @returns {Promise<[AnimeDetail, undefined] | [undefined, MalError]>} A promise that resolves with the anime details or an error.
   */
  public async getAnimeDetail(option: {
    animeId: number;
  }): Promise<[AnimeDetail, undefined] | [undefined, MalError]>;
  public async getAnimeDetail(option: {
    animeId: number;
    fields: AnimeDetailFields[];
  }): Promise<
    | [Partial<AnimeDetail> & Pick<AnimeDetail, "id" | "title">, undefined]
    | [undefined, MalError]
  >;
  public async getAnimeDetail({
    animeId,
    fields,
  }: {
    animeId: number;
    fields?: AnimeDetailFields[];
  }): Promise<
    | [Partial<AnimeDetail> & Pick<AnimeDetail, "id" | "title">, undefined]
    | [undefined, MalError]
  > {
    const reqOption: RequestInit = this.genenrateHeader();
    const uri = `${this.url}/anime/${animeId}?fields=${[
      fields ?? AllAnimeDetailFields,
    ].join(",")}`;
    if (!fields) return await _malFetch<AnimeDetail>(uri, reqOption);
    return await _malFetch<
      Partial<AnimeDetail> & Pick<AnimeDetail, "id" | "title">
    >(uri, reqOption);
  }

  /**
   *
   * Retrieves detailed information about a specific anime by its ID. This includes
   * all available data such as the synopsis, airing status, genres, and more. You can
   * also specify which fields to return to minimize the response data.
   *
   * @example
   * ```typescript
   * const mal = new MAL('your_client_id', 'your_access_token');
   *
   * async function getDetailsForAnime(animeId: number) {
   *   const [detail, error] = await mal.getAnimeDetail({ animeId: animeId, fields: ['title', 'sypnosis', 'media_type'] });
   *   if (error) {
   *     console.error('Failed to get anime details:', error.message);
   *     return;
   *   }
   *   console.log('Anime details:', detail);
   * }
   *
   * getDetailsForAnime(1); // Example anime ID
   * ```
   *
   * @param {Object} option - Options for retrieving anime details, including the anime ID and optionally specific fields.
   * @returns {Promise<[AnimeDetail, undefined] | [undefined, MalError]>} A promise that resolves with the anime details or an error.
   */
  public async getAnimeranking(option: {
    type: rankingType;
    limit?: number;
    offset?: number;
  }): Promise<
    | [{ anime: Anime; ranking: rankingInfo }[], undefined]
    | [undefined, MalError]
  >;
  public async getAnimeranking(option: {
    type: rankingType;
    limit?: number;
    offset?: number;
    fields: AnimeFields[];
  }): Promise<
    | [
        {
          anime: Partial<Anime> & Pick<Anime, "id" | "title">;
          ranking: rankingInfo;
        }[],
        undefined
      ]
    | [undefined, MalError]
  >;
  public async getAnimeranking({
    type,
    limit,
    offset,
    fields,
  }: {
    type: rankingType;
    limit?: number;
    offset?: number;
    fields?: AnimeFields[];
  }): Promise<
    | [{ anime: Anime; ranking: rankingInfo }[], undefined]
    | [undefined, MalError]
  > {
    const reqOption = this.genenrateHeader();
    let uri = _buildURI(`${this.url}/anime/ranking`, {
      ranking_type: type,
      limit: limit ? Math.floor(limit) : 100,
      offset: offset ? Math.floor(offset) : 0,
      fields: fields ? fields.join(",") : AllAnimeFields.join(","),
    });
    const [data, err] = await _malFetch<{
      data: { node: Anime; ranking: rankingInfo }[];
      paging: { previous?: string; next?: string };
    }>(uri, reqOption);
    if (!err)
      return [
        data.data.map((anime) => ({
          anime: anime.node,
          ranking: anime.ranking,
        })),
        undefined,
      ];
    return [undefined, err];
  }

  /**
   *
   * Fetches anime that aired in a specific year and season. This can be used
   * to explore anime by their airing schedule, with options to sort by score or number
   * of list users, and to paginate through results.
   *
   * @example
   * ```typescript
   * const mal = new MAL('your_client_id', 'your_access_token');
   *
   * async function getSeasonalAnimeList(year: number, season: quarter) {
   *   const [animeList, error] = await mal.getSeasonalAnime({
   *     year: year,
   *     season: season,
   *     sort: 'anime_score',
   *     limit: 20
   *   });
   *   if (error) {
   *     console.error('Failed to fetch seasonal anime:', error.message);
   *     return;
   *   }
   *   console.log('Seasonal anime list:', animeList);
   * }
   *
   * getSeasonalAnimeList(2021, 'spring'); // Example year and season
   * ```
   *
   * @param {Object} option - Options for retrieving seasonal anime, including the year, season, sorting preferences, limit, and offset.
   * @returns {Promise<[Anime[], undefined] | [undefined, MalError]>} A promise that resolves with the list of seasonal anime or an error.
   */
  public async getSeasonalAnime(option: {
    year: number;
    season: quarter;
    sort?: "anime_score" | "anime_num_list_users";
    limit?: number;
    offset?: number;
  }): Promise<[Anime[], undefined] | [undefined, MalError]>;
  public async getSeasonalAnime(option: {
    year: number;
    season: quarter;
    sort?: "anime_score" | "anime_num_list_users";
    limit?: number;
    offset?: number;
    fields: AnimeFields[];
  }): Promise<
    | [(Partial<Anime> & Pick<Anime, "id" | "title">)[], undefined]
    | [undefined, MalError]
  >;
  public async getSeasonalAnime({
    year,
    season,
    sort,
    limit,
    fields,
    offset,
  }: {
    year: number;
    season: quarter;
    sort?: "anime_score" | "anime_num_list_users";
    limit?: number;
    offset?: number;
    fields?: AnimeFields[];
  }): Promise<[Anime[], undefined] | [undefined, MalError]> {
    const reqOption = this.genenrateHeader();
    let uri = _buildURI(this.url + `/anime/season/${year}/${season}`, {
      sort,
      limit,
      offset,
      fields: fields ? fields.join(",") : AllAnimeFields.join(","),
    });
    const [data, err] = await _malFetch<
      _MALstandardListResponse<{ node: Anime }>
    >(uri, reqOption);
    if (!err) return [data.data.map((anime) => anime.node), undefined];
    return [undefined, err];
  }
  /**
   *
   * Retrieves suggested anime based on the provided options.
   * Require access token (OAauth2).
   *
   * @example
   * const suggestedAnime = await getSuggestedAnime({ limit: 10, offset: 0 });
   *
   * @param {{ limit?: number; offset?: number; }} option - Options for limiting and offsetting the results
   * @return {Promise<[Anime[], undefined] | [undefined, MalError]>} A promise that resolves with an array of suggested anime or an error
   *
   */
  public async getSuggestedAnime(option: {
    limit?: number;
    offset?: number;
  }): Promise<[Anime[], undefined] | [undefined, MalError]>;
  public async getSuggestedAnime(option: {
    limit?: number;
    offset?: number;
    fields: AnimeFields[];
  }): Promise<
    | [(Partial<Anime> & Pick<Anime, "id" | "title">)[], undefined]
    | [undefined, MalError]
  >;
  public async getSuggestedAnime({
    limit,
    offset,
    fields,
  }: {
    limit?: number;
    offset?: number;
    fields?: AnimeFields[];
  }): Promise<[Anime[], undefined] | [undefined, MalError]> {
    if (!this.accessToken)
      return [undefined, new MalError("Access token required", 401)];
    const reqOption = this.genenrateHeader();
    const uri = _buildURI(this.url + "/anime/suggestions", {
      limit,
      offset,
      fields: fields ? fields.join(",") : AllAnimeFields.join(","),
    });
    const [data, err] = await _malFetch<
      _MALstandardListResponse<{ node: Anime }>
    >(uri, reqOption);
    if (!err) return [data.data.map((anime) => anime.node), undefined];
    return [undefined, err];
  }
}
