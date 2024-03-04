import { _MALstandardListResponse } from "./interface/animeRoute";
import { MalAnime } from "./routesWrapper/anime";

export class MAL {
  public animeRoute: MalAnime;
  constructor(clientId: string, accessToken?: string) {
    this.animeRoute = new MalAnime(clientId, accessToken);
  }
}
