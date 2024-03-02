import { describe, expect, expectTypeOf, it } from "vitest"
import { MAL } from "..";

describe("Test search anime", () => {
    const id = "fece92f6e55f3a677ce0b88aabecb3a1";
    const mal = new MAL(id);
    it("Get anime", async () => {
        const [data, err] = await mal.searchAnime({ q: "One piece" });
        expect(err == undefined).toBe(true)
        expect(Array.isArray(data)).toBe(true)
    })
    it("Handle limit and offset", async () => {
        const [data, err] = await mal.searchAnime({ q: "one punch man", offset: 2, limit: 10 });
        expect(err == undefined).toBe(true)
        expect(Array.isArray(data)).toBe(true);
        expect(data != undefined && data.length <= 10).toBe(true)
    })

    it("Handle fields", async () => {
        const [data, err] = await mal.searchAnime({ q: "one punch man", offset: 2, limit: 10, fields: ["start_date", "end_date", "mean", "num_list_users"] });
        expect(err).toBeUndefined();
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.start_date != undefined, false)).toBe(true)
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.end_date != undefined, false)).toBe(true)
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.mean != undefined, false)).toBe(true)
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.num_list_users != undefined, false)).toBe(true)
        expect(data != undefined && data.reduce((acc, anime) => acc || anime.nsfw == undefined, false)).toBe(true)
    })
})

describe("Get anime details", () => {
    const id = "fece92f6e55f3a677ce0b88aabecb3a1";
    const mal = new MAL(id);
    it("Get anime details", async () => {
        const [data, err] = await mal.getAnimeDetail({ animeId: 52991 });
        expect(err == undefined).toBe(true)
        expect(data?.id).toBe(52991)
        console.log(data)
    })
    it("Handle fields", async () => {
        const [data, err] = await mal.getAnimeDetail({ animeId: 5114, fields: ["start_date", "end_date", "mean", "num_list_users", "related_manga", "related_anime", "rating", "rank"] });
        expect(err).toBeUndefined();
        expect(data?.id).toBe(5114)
        expect(data?.mean).toBe(9.09)
        expect(data).toHaveProperty("start_date")
        expect(data).toHaveProperty("end_date")
        expect(data).not.toHaveProperty("nsfw")
        console.log(data)
    })
})
