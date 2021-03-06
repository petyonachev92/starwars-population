import EventEmitter from "eventemitter3";
import delay from "../utils";
import Person from "./Person";

export default class Planet extends EventEmitter {
    constructor(name, config = { populationDelay: 1 }, peopleData) {
        super()
        this.name = name
        this.config = config
        this.peopleData = peopleData                 //10 people from StarWarsUniverse init method
        this.population = []
    }

    static get events() {
        return {
            PERSON_BORN: 'person_born',
            POPULATING_COMPLETED: 'populating_completed'
        }
    }

    get populationCount() {
        return this.population.length;
    }

    async populate() {

        this.peopleData.forEach(element => {
            
            delay(this.config.populationDelay);
    
            let person = new Person(element.name, element.height, element.mass);
    
            this.population.push(person);
    
            const filmUrls = element.films
    
            this.emit(Planet.events.PERSON_BORN, filmUrls);
        });
                    
        /* console.log(element.films) */
        this.emit(Planet.events.POPULATING_COMPLETED);
    }
}