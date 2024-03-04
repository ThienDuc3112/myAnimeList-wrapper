import { MalError } from "./Error";

export const _malFetch = async <T>(
  url: string,
  option: RequestInit
): Promise<[T, undefined] | [undefined, MalError]> => {
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
          return [undefined, new MalError("Generic error occured", res.status)];
      }
    }
    const json: T = await res.json();
    return [json, undefined];
  } catch (err) {
    return [undefined, new MalError("Network error", 500)];
  }
};
