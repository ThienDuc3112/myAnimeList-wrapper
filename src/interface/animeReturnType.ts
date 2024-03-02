interface mainPicture {
    large?: string
    medium: string
}

interface alternateTitles {
    synonyms?: string[]
    en?: string
    ja?: string
}

type nsfw = "white" | "gray" | "black";

interface genre {
    id: number
    name: string
}

type mediaType = "unknown" | "tv" | "ova" | "movie" | "special" | "ona" | "music"

type status = "finished_airing" | "currently_airing" | "not_yet_aired"

interface listStatus {

}

type quarter = "winter" | "spring" | "summer" | "fall"

interface season {
    year: number
    season: quarter
}

type dayOfTheWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | "other"

interface broadcast {
    day_of_the_week: dayOfTheWeek
    start_time?: string
}


type source =
    "other"
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
    | "music"

type rating = "g" | "pg" | "pg_13" | "r" | "r+" | "rx"

interface studio {
    id: number
    name: string
}

export interface Anime {
    id: string
    title: string
    main_picture?: mainPicture
    alternative_titles?: alternateTitles
    start_date?: string
    end_date?: string
    sypnosis?: string
    mean?: number
    rank?: number
    popularity?: number
    num_list_users: number
    num_scoring_users: number
    nsfw?: nsfw
    genres: genre[]
    created_at: string
    updated_at: string
    media_type: mediaType
    status: status
    my_list_status?: listStatus
    num_episodes: number
    start_season?: season
    broadcast?: broadcast
    source?: source
    average_episode_duration?: number
    rating?: rating
    studios: studio[]
}

export type AnimeFields = keyof Anime;

export const AllAnimeFields:AnimeFields[] = ["status", "nsfw", "studios", "rating", "average_episode_duration", "source", "broadcast", "start_season", "id", "mean", "rank", "title", "genres", "end_date", "sypnosis", "start_date", "popularity", "created_at", "updated_at", "media_type", "main_picture", "num_episodes", "num_list_users", "my_list_status", "num_scoring_users", "alternative_titles"]
