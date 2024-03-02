import { describe, expect, it } from "vitest"
import { MAL } from "..";

describe("Test get anime", () => {
    const id = "fece92f6e55f3a677ce0b88aabecb3a1";
    const mal = new MAL(id);
    it("Get anime", async () => {
        const [data, err] = await mal.getAnimeList({ q: "One piece" });
        expect(err == undefined).toBe(true)
        expect(Array.isArray(data)).toBe(true)
    })
    it("Handle limit and offset", async () => {
        const [data, err] = await mal.getAnimeList({ q: "one punch man", offset: 2, limit: 10 });
        expect(err == undefined).toBe(true)
        expect(Array.isArray(data)).toBe(true);
        expect(data != undefined && data.length <= 10).toBe(true)
    })

    it("Handle fields", async () => {
        const [data, err] = await mal.getAnimeList({ q: "one punch man", offset: 2, limit: 10, fields: ["start_date", "end_date", "mean", "num_list_users"] });
        expect(err).toBeUndefined();
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.start_date != undefined, false)).toBe(true)
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.end_date != undefined, false)).toBe(true)
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.mean != undefined, false)).toBe(true)
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.num_list_users != undefined, false)).toBe(true)
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.nsfw == undefined, false)).toBe(true)
    })
})

