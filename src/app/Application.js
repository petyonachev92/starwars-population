import config from '../config';
import EventEmitter from 'eventemitter3';
import StarWarsUniverse from './custom/StarWarsUniverse';


const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
  constructor() {
    super();

    this.config = config;
    this.data = {};

    this.on(Application.events.APP_READY, () => console.log('the end'))

    this.init();
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
  async init() {
    // Initiate classes and wait for async operations here.

    const universe = new StarWarsUniverse();
    

    await universe.init();

    this.data.universe = universe
    console.log(this.data.universe);

    this.emit(Application.events.APP_READY);
    /* console.log('1) should have 10 people in Planet.populationCount when universe_populated is emitted' + 
    ' 2) should have 6 films in StarWarsUniverse.films when universe_populated is emitted') */
  }
}

