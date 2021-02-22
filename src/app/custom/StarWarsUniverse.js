import EventEmitter from "eventemitter3";
import delay from "../utils";
import Film from "./Film";
import Planet from "./Planet";

let filmsToBeCreated= []

export default class StarWarsUniverse extends EventEmitter {
    constructor() {
        super()
        this.films = []
        this.planet = null;

    }
    
    static get events() {
        return {
            FILM_ADDED: 'film_added',
            UNIVERSE_POPULATED: 'universe_populated'
        }
    }
    
    async init() {

        const resp = await fetch('https://swapi.booost.bg/api/planets/')
        const data = await resp.json()

        let planetData = null;
        const planet = new Planet();

        for (let i = 1; i <= +data.count; i++) {
            const resp = await fetch(`https://swapi.booost.bg/api/planets/${i}/`)
            const data = await resp.json()

            if (+data.population == 0) {
                const response = await fetch('https://swapi.booost.bg/api/people/')
                const popData = await response.json()

                planetData = popData.results

                planet.name = data.name
                planet.peopleData = planetData
        
                /* console.log(popData)
                console.log(planet.peopleData) */
        
                this.planet = planet;
            }
        }
        
        /* const response = await fetch('https://swapi.booost.bg/api/people/')
        const popData = await response.json()

        console.log(popData)
        
        const planetData = popData.results
        const planet = new Planet();
        
        planet.peopleData = planetData
        
        this.planet = planet; */
        
        planet.on(Planet.events.PERSON_BORN, (filmUrls) => this._onPersonBorn(filmUrls))
        planet.once(Planet.events.POPULATING_COMPLETED, () => console.log('populating is complete'))
        planet.once(Planet.events.POPULATING_COMPLETED, () => console.log(planet.populationCount))
        planet.once(Planet.events.POPULATING_COMPLETED, () => console.log(this.films))
        planet.once(Planet.events.POPULATING_COMPLETED, () => this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED))
        this.on(StarWarsUniverse.events.UNIVERSE_POPULATED, () => console.log('добре'))
        
        
        await planet.populate();

        console.log(planet)

    }

    _onPersonBorn(filmUrls) {
        filmUrls.forEach(element => {
            if(!filmsToBeCreated.includes(element)) {
                filmsToBeCreated.push(element)
                const film = new Film(element);

                this.films.push(film);
                this.emit(StarWarsUniverse.events.FILM_ADDED);  
            }
            /* if(!containsObject(element, this.films)) {
                const film = new Film(element);

                this.films.push(film);
                this.emit(StarWarsUniverse.events.FILM_ADDED);                
            } */
        });
    }

    _onPopulatingComplete() {
        console.log('universe populated')
        this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED)
    }
}

/* function containsObject(str, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].url == str) {
            return true;
        }
    }

    return false;
} */

//да се провери дали url от filmUrls е използван вече за създаването на Film и съществува в Array StarWarsUniverse.films