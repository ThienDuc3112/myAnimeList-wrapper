import { describe, expect, it } from "vitest";
import { MAL } from "..";
import { config } from "dotenv";
config();
const id = process.env.MAL_ID as string;
const mal = new MAL(id);

describe("Get anime list", () => {
  it("Get anime", async () => {
    const [data, err] = await mal.searchAnime({ q: "One piece" });
    expect(err == undefined).toBe(true);
    expect(Array.isArray(data)).toBe(true);
  });
  it("Handle limit and offset", async () => {
    const [data, err] = await mal.searchAnime({
      q: "one punch man",
      offset: 2,
      limit: 10,
    });
    const [data2, err2] = await mal.searchAnime({
      q: "one punch man",
      limit: 4,
    });
    expect(err).toBeUndefined();
    expect(err2).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);
    expect(Array.isArray(data2)).toBe(true);
    expect(data != undefined && data.length <= 10).toBe(true);
    expect(data2 != undefined && data2.length <= 4).toBe(true);
    expect(data ? data[0].id : 0).toBe(data2 ? data2[2].id : 0);
  });

  it("Handle fields", async () => {
    const [data, err] = await mal.searchAnime({
      q: "one punch man",
      offset: 2,
      limit: 10,
      fields: ["start_date", "end_date", "mean", "num_list_users"],
    });
    expect(err).toBeUndefined();
    expect(
      data != undefined &&
        data.reduce((acc, anime) => acc || anime.start_date != undefined, false)
    ).toBe(true);
    expect(
      data != undefined &&
        data.reduce((acc, anime) => acc || anime.end_date != undefined, false)
    ).toBe(true);
    expect(
      data != undefined &&
        data.reduce((acc, anime) => acc || anime.mean != undefined, false)
    ).toBe(true);
    expect(
      data != undefined &&
        data.reduce(
          (acc, anime) => acc || anime.num_list_users != undefined,
          false
        )
    ).toBe(true);
    expect(
      data != undefined &&
        data.reduce((acc, anime) => acc || anime.nsfw == undefined, false)
    ).toBe(true);

    expect(
      data != undefined &&
        data.reduce((acc, anime) => acc || anime.status == undefined, false)
    ).toBe(true);
    expect(
      data != undefined &&
        data.reduce((acc, anime) => acc || anime.source == undefined, false)
    ).toBe(true);
  });
});

describe("Get anime details", () => {
  it("Get anime details", async () => {
    const [data, err] = await mal.getAnimeDetail({ animeId: 52991 });
    expect(err == undefined).toBe(true);
    expect(data?.id).toBe(52991);
  });
  it("Handle fields", async () => {
    const [data, err] = await mal.getAnimeDetail({
      animeId: 5114,
      fields: [
        "start_date",
        "end_date",
        "mean",
        "num_list_users",
        "related_manga",
        "related_anime",
        "rating",
        "rank",
      ],
    });
    expect(err).toBeUndefined();
    expect(data?.id).toBe(5114);
    expect(data?.mean).toBe(9.09);
    expect(data).toHaveProperty("start_date");
    expect(data).toHaveProperty("end_date");
    expect(data).not.toHaveProperty("nsfw");
  });
});

describe("Get anime ranking", () => {
  it("Get ranking", async () => {
    const [data, err] = await mal.getAnimeranking({ type: "tv" });
    expect(err).toBeUndefined();
    expect(data?.length).toBe(100);
    expect(data ? data[0] : {}).toHaveProperty("anime");
    expect(data ? data[0] : {}).toHaveProperty("ranking");
    expect(data ? data[0].anime : {}).toHaveProperty("start_date");
    expect(data ? data[0].anime : {}).toHaveProperty("id");
    expect(data ? data[0].anime : {}).toHaveProperty("title");
    expect(data ? data[0].anime : {}).toHaveProperty("mean");
    expect(data ? data[0].anime : {}).toHaveProperty("genres");
    expect(data ? data[0].anime : {}).toHaveProperty("media_type");
  });
  it("Handle limit and offset", async () => {
    const [data, err] = await mal.getAnimeranking({ type: "all", limit: 14 });
    const [data2, err2] = await mal.getAnimeranking({
      type: "all",
      limit: 4,
      offset: 10,
    });
    expect(err).toBeUndefined();
    expect(err2).toBeUndefined();
    expect(data?.length).toBe(14);
    expect(data2?.length).toBe(4);
    expect(data ? data[10].ranking.rank : 0).toBe(
      data2 ? data2[0].ranking.rank : 0
    );
  });
  it("Handle fields", async () => {
    const [data, err] = await mal.getAnimeranking({
      type: "movie",
      limit: 5,
      fields: ["mean", "genres", "rating", "start_date"],
    });
    expect(err).toBeUndefined();
    expect(data?.length).toBe(5);
    expect(data ? data[0].anime : {}).toHaveProperty("mean");
    expect(data ? data[0].anime : {}).toHaveProperty("genres");
    expect(data ? data[0].anime : {}).toHaveProperty("rating");
    expect(data ? data[0].anime : {}).toHaveProperty("start_date");
    expect(data ? data[0].anime : {}).not.toHaveProperty("nsfw");
    expect(data ? data[0].anime : {}).not.toHaveProperty("media_type");
    expect(data ? data[0].anime : {}).not.toHaveProperty("end_date");
  });
});
