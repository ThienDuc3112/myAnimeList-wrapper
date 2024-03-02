interface mainPicture {
  large?: string;
  medium: string;
}

interface alternateTitles {
  synonyms?: string[];
  en?: string;
  ja?: string;
}

type nsfw = "white" | "gray" | "black";

interface genre {
  id: number;
  name: string;
}

type mediaType =
  | "unknown"
  | "tv"
  | "ova"
  | "movie"
  | "special"
  | "ona"
  | "music";

type status = "finished_airing" | "currently_airing" | "not_yet_aired";

type watchStatus =
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped"
  | "plan_to_watch";

interface listStatus {
  status?: watchStatus;
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  start_date?: string;
  finish_date?: string;
  priority: number;
  num_times_rewatched: number;
  rewatch_value: number;
  tags: string[];
  comments: string;
  updated_at: string;
}

type quarter = "winter" | "spring" | "summer" | "fall";

interface season {
  year: number;
  season: quarter;
}

type dayOfTheWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
  | "other";

interface broadcast {
  day_of_the_week: dayOfTheWeek;
  start_time?: string;
}

type source =
  | "other"
  | "original"
  | "manga"
  | "4_koma_manga"
  | "web_manga"
  | "digital_manga"
  | "novel"
  | "light_novel"
  | "visual_novel"
  | "game"
  | "card_game"
  | "book"
  | "picture_book"
  | "radio"
  | "music";

type rating = "g" | "pg" | "pg_13" | "r" | "r+" | "rx";

interface studio {
  id: number;
  name: string;
}

export interface Anime {
  id: string;
  title: string;
  main_picture?: mainPicture;
  alternative_titles?: alternateTitles;
  start_date?: string;
  end_date?: string;
  sypnosis?: string;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_list_users: number;
  num_scoring_users: number;
  nsfw?: nsfw;
  genres: genre[];
  created_at: string;
  updated_at: string;
  media_type: mediaType;
  status: status;
  my_list_status?: listStatus;
  num_episodes: number;
  start_season?: season;
  broadcast?: broadcast;
  source?: source;
  average_episode_duration?: number;
  rating?: rating;
  studios: studio[];
}

export type AnimeFields = keyof Anime;

export const AllAnimeFields: AnimeFields[] = [
  "status",
  "nsfw",
  "studios",
  "rating",
  "average_episode_duration",
  "source",
  "broadcast",
  "start_season",
  "id",
  "mean",
  "rank",
  "title",
  "genres",
  "end_date",
  "sypnosis",
  "start_date",
  "popularity",
  "created_at",
  "updated_at",
  "media_type",
  "main_picture",
  "num_episodes",
  "num_list_users",
  "my_list_status",
  "num_scoring_users",
  "alternative_titles",
];

interface picture {
  large?: string;
  small: string;
}

type relationType =
  | "sequel"
  | "prequel"
  | "alternative_setting"
  | "alternative_version"
  | "side_story"
  | "parent_story"
  | "summary"
  | "full_story";

interface relatedAnime {
  node: Pick<Anime, "id" | "title" | "main_picture">;
  relation_type: relationType;
  relation_type_formated: string;
}

interface relatedManga {
  relation_type: relationType;
  relation_type_formatted: string;
}

interface recommendation {
  node: Pick<Anime, "id" | "title" | "main_picture">;
  num_recommendations: number;
}

interface stat {
  num_list_users: number;
  status: {
    watching: number;
    completed: number;
    on_hold: number;
    dropped: number;
    plan_to_watch: number;
  };
}

export interface AnimeDetail extends Anime {
  pictures: picture[];
  background?: string;
  related_anime: relatedAnime[];
  related_manga: relatedManga[];
  recommendations: recommendation[];
  statistics: stat;
}

export type AnimeDetailFields = keyof AnimeDetail;

export const AllAnimeDetailFields: AnimeDetailFields[] = [
  "status",
  "nsfw",
  "studios",
  "rating",
  "average_episode_duration",
  "source",
  "broadcast",
  "start_season",
  "id",
  "mean",
  "rank",
  "title",
  "genres",
  "end_date",
  "sypnosis",
  "start_date",
  "popularity",
  "created_at",
  "updated_at",
  "media_type",
  "main_picture",
  "num_episodes",
  "num_list_users",
  "my_list_status",
  "num_scoring_users",
  "alternative_titles",
  "pictures",
  "background",
  "related_anime",
  "related_manga",
  "recommendations",
  "statistics",
];

export interface rankingInfo {
  rank: number;
  previous_rank?: number;
}

export type rankingType =
  | "all"
  | "airing"
  | "upcoming"
  | "tv"
  | "ova"
  | "movie"
  | "special"
  | "bypopularity"
  | "favorite";
