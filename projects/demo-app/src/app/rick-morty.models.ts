/**Información de paginación que devuelve la API */
export interface ApiInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

/**Respuesta paginada de la API */
export interface ApiResponse<T>{
    info: ApiInfo;
    results: T[];
}

/**Referencia con nombre y enlace (origen o ubicación de un personaje) */
export interface NamedLink {
    name: string;
    url: string;
}

/**Estados posibles de un personaje */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/**Personaje de Rick and Morty */
export interface Character {
    id: number;
    name: string;
    status:CharacterStatus;
    species: string;
    type: string;
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
    origin: NamedLink;
    location: NamedLink;
    image: string;
    episode: string[];
    url: string;
    created: string;
}

/**Episodio de Rick and Morty */
export interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
}

/**Ubicación de Rick and Morty */
export interface Location {
    id: number;
    name: string;
    type:string;
    dimension: string;
    residents: string[];
    url:string;
    created: string;
}