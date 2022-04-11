<<<<<<< HEAD:src/Events.ts
// EventTarget is lacking.
import EventEmitter from 'eventemitter3';
import { SynergismEvents } from './types/Synergism';

=======
// EventTarget is lacking.
import EventEmitter from 'eventemitter3';
import { SynergismEvents } from './types/Synergism';

>>>>>>> upstream/plus:Javascript/Events.ts
export const Synergism = new EventEmitter<SynergismEvents>();