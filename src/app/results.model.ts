export class Person {
    constructor(Person?: Person) {}
    birth_year: string;
    created: Date;
    edited: Date;
    eye_color: string;
    films: string[];
    gender: string;
    hair_color: string;
    height: string;
    homeworld: string;
    mass: string;
    name: string;
    skin_color: string;
    species: string[];
    starrships: string[];
    url: string;
    vehicles: string[];
}

export class Results {
    results: never;
}

export class WookieResults {
    constructor(WookieResults?: WookieResults) {}
    count: number;
    next: number | null;
    previous: number | null;
    results: Person[];
}