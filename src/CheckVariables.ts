import { player } from './Synergism';
import { Player } from './types/Synergism';
/**
 * Given player data, it checks, on load if variables are undefined
 * or set incorrectly, and corrects it. This should be where all new
 * variable declarations for `player` should go!
 */
export const checkVariablesOnLoad = (data: Player) => {
    // assign the save's toggles to the player toggles
    // will overwrite player.toggles keys that exist on both objects,
    // but new keys will default to the values on the player object
    Object.assign(player.toggles, data.toggles);
}