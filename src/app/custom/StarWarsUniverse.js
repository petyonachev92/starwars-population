import EventEmitter from "eventemitter3";
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
        const resp = await fetch('https://swapi.booost.bg/api/planets/')
        const data = await resp.json()

        let planetData = null;

        for (let i = 1; i <= +data.count; i++) {
            const resp = await fetch(`https://swapi.booost.bg/api/planets/${i}/`)
            const data = await resp.json()

            if (+data.population == 0) {
                const response = await fetch('https://swapi.booost.bg/api/people/')
                const popData = await response.json()

                planetData = popData.results

            }
        }
        const planet = new Planet();

        planet.peopleData = planetData

        /* console.log(popData)
        console.log(planet.peopleData) */
        
        this.planet = planet;
        
        planet.on(Planet.events.PERSON_BORN, (filmUrls) => this._onPersonBorn(filmUrls))
        this.on.bind(Planet.events.POPULATING_COMPLETED, this._onPopulatingComplete())
        
        await planet.populate();

    }

    _onPersonBorn(filmUrls) {

        filmUrls.forEach(element => {
            if(!this.films.includes(element)) {
                const film = new Film(element);

                this.films.push(film);
                this.emit(StarWarsUniverse.events.FILM_ADDED);
                console.log(element);
            }
        });
    }

    _onPopulatingComplete() {
        this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED)
    }
}