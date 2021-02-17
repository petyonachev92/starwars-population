import EventEmitter from "eventemitter3";
import delay from "../utils";
import Film from "./Film";
import Planet from "./Planet";

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

        const response = await fetch('https://swapi.booost.bg/api/people/')
        const popData = await response.json()

        const planetData = popData.results
        const planet = new Planet();

        planet.peopleData = planetData
        
        this.planet = planet;
        
        planet.on(Planet.events.PERSON_BORN, (filmUrls) => this._onPersonBorn(filmUrls))
        planet.on(Planet.events.POPULATING_COMPLETED, () => console.log(planet.populationCount))
        planet.on(Planet.events.POPULATING_COMPLETED, () => console.log(this.films))
        planet.on(Planet.events.POPULATING_COMPLETED, this._onPopulatingComplete)
        
        await planet.populate();

    }

    _onPersonBorn(filmUrls) {
        filmUrls.forEach(element => {
            if(!containsObject(element, this.films)) {
                const film = new Film(element);

                this.films.push(film);
                this.emit(StarWarsUniverse.events.FILM_ADDED);
                console.log(film)
                
            }
        });
    }

    _onPopulatingComplete() {
        console.log('universe populated')
        this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED)
    }
}

function containsObject(str, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].url == str) {
            return true;
        }
    }

    return false;
}