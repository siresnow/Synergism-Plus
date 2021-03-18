import { player, updateAllTick, updateAllMultiplier, format } from './Synergism';
import { CalcECC } from './Challenges';
import { achievementaward } from './Achievements';
import { smallestInc } from './Utility';
import { upgradeupdate, crystalupgradedescriptions } from './Upgrades';
import { reset } from './Reset';
import { calculateSummationLinear, calculateCorruptionPoints, calculateRuneBonuses } from './Calculate';
import { Globals as G } from './Variables';

export const getReductionValue = () => {
    let reduction = 1;
    reduction += (G['rune4level'] * G['effectiveLevelMult']) / 160;
    reduction += (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60]) / 200;
    reduction += CalcECC('transcend', player.challengecompletions[4]) / 200;
    reduction += Math.min(99999.9, (3 * (player.antUpgrades[7-1] + G['bonusant7'])) / 100);
    return reduction;
}

const getCostAccelerator = (buyingTo: number) => {
    --buyingTo;

    const originalCost = 500;
    let cost = originalCost

    cost *= (Math.pow(4 / G['costDivisor'], buyingTo));
    return cost;
}

export const buyAccelerator = (autobuyer?: boolean) => {
    // Start buying at the current amount bought + 1
    let buyTo = player.acceleratorBought + 1;
    let cashToBuy = getCostAccelerator(buyTo);
    while (player.coins >= cashToBuy) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getCostAccelerator(buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getCostAccelerator(buyTo - stepdown) <= player.coins) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer && (player.coinbuyamount as number | string) !== "max") {
        if (player.acceleratorBought + player.coinbuyamount < buyTo) {
            buyTo = player.acceleratorBought + player.coinbuyamount;
        }
    }

    let buyFrom = Math.max(buyTo - 7, player.acceleratorBought + 1);
    let thisCost = getCostAccelerator(buyFrom);
    while (buyFrom <= buyTo && player.coins >= thisCost) {
        player.coins -= thisCost;
        player.acceleratorBought = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getCostAccelerator(buyFrom);
        player.acceleratorCost = thisCost;
    }

    player.prestigenoaccelerator = false;
    player.transcendnoaccelerator = false;
    player.reincarnatenoaccelerator = false;
    updateAllTick();
    if (player.acceleratorBought >= 5 && player.achievements[148] === 0) {
        achievementaward(148)
    }
    if (player.acceleratorBought >= 25 && player.achievements[149] === 0) {
        achievementaward(149)
    }
    if (player.acceleratorBought >= 100 && player.achievements[150] === 0) {
        achievementaward(150)
    }
    if (player.acceleratorBought >= 666 && player.achievements[151] === 0) {
        achievementaward(151)
    }
    if (player.acceleratorBought >= 2000 && player.achievements[152] === 0) {
        achievementaward(152)
    }
    if (player.acceleratorBought >= 12500 && player.achievements[153] === 0) {
        achievementaward(153)
    }
    if (player.acceleratorBought >= 100000 && player.achievements[154] === 0) {
        achievementaward(154)
    }
}

const getCostMultiplier = (buyingTo: number) => {
    --buyingTo;

    const originalCost = 1e5;
    let cost = originalCost
    cost *= Math.pow(10, buyingTo / G['costDivisor']);

    return cost;
}

export const buyMultiplier = (autobuyer?: boolean) => {
    // Start buying at the current amount bought + 1
    let buyTo = player.multiplierBought + 1;
    let cashToBuy = getCostMultiplier(buyTo);
    while (player.coins >= cashToBuy) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getCostMultiplier(buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getCostMultiplier(buyTo - stepdown) <= player.coins) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer && (player.coinbuyamount as number | string) !== "max") {
        if (player.multiplierBought + player.coinbuyamount < buyTo) {
            buyTo = player.multiplierBought + player.coinbuyamount;
        }
    }

    let buyFrom = Math.max(buyTo - 7, player.multiplierBought + 1);
    let thisCost = getCostMultiplier(buyFrom);
    while (buyFrom <= buyTo && player.coins >= thisCost) {
        player.coins = player.coins -= thisCost;
        player.multiplierBought = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getCostMultiplier(buyFrom);
        player.multiplierCost = thisCost;
    }

    player.prestigenomultiplier = false;
    player.transcendnomultiplier = false;
    player.reincarnatenomultiplier = false;
    updateAllMultiplier();
    if (player.multiplierBought >= 2 && player.achievements[155] === 0) {
        achievementaward(155)
    }
    if (player.multiplierBought >= 20 && player.achievements[156] === 0) {
        achievementaward(156)
    }
    if (player.multiplierBought >= 100 && player.achievements[157] === 0) {
        achievementaward(157)
    }
    if (player.multiplierBought >= 500 && player.achievements[158] === 0) {
        achievementaward(158)
    }
    if (player.multiplierBought >= 2000 && player.achievements[159] === 0) {
        achievementaward(159)
    }
    if (player.multiplierBought >= 12500 && player.achievements[160] === 0) {
        achievementaward(160)
    }
    if (player.multiplierBought >= 100000 && player.achievements[161] === 0) {
        achievementaward(161)
    }
}

/*
// Uses same as Decimal prototype but does so without creating new objects
Decimal.prototype.factorial = function () {
  // Using Stirling's Approximation.
  // https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators
  var n = this.toNumber() + 1;
  return Decimal.pow(n / Math.E * Math.sqrt(n * Math.sinh(1 / n) + 1 / (810 * Math.pow(n, 6))), n).mul(Math.sqrt(2 * Math.PI / n));
};
*/

// system of equations
// 16 digits of precision
// log10(1.25)xn = log10(x)+16
// see: https://www.wolframalpha.com/input/?i=log10%28x%29%2B16+%3D+log10%281.25%29x
// xn ~= 188.582
// x ~= 188.582/n

export const getCost = (originalCost: number, buyingTo: number, type: string, num: number, r: number) => {
    // It's 0 indexed by mistake so you have to subtract 1 somewhere.
    --buyingTo;
    // Accounts for the multiplies by 1.25^num buyingTo times
    type;
    num;
    const cost = originalCost;
    return cost * Math.pow(Math.pow(1.05, r), buyingTo)
}

export const buyMax = (pos: string, type: string, num: number, originalCost: number) => {
    const r = getReductionValue();

    let tag = '';
    switch (type) {
        case 'Diamonds': tag = 'prestigePoints'; break;
        case 'Mythos': tag = 'transcendPoints'; break;
        case 'Particles': tag = 'reincarnationPoints'; break;
        case 'Coin': tag = 'coins'; break;
    }

    // Start buying at the current amount bought + 1
    const buyStart = player[pos + 'Owned' + type];
    let buyInc = 1;
    let cashToBuy = getCost(originalCost, buyStart + buyInc, type, num, r);
    while (player[tag].gte(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyInc = buyInc * 4;
        cashToBuy = getCost(originalCost, buyStart + buyInc, type, num, r);
    }
    let stepdown = Math.floor(buyInc / 8);
    while (stepdown !== 0) {
        // if step down would push it below out of expense range then divide step down by 2
        if (getCost(originalCost, buyStart + buyInc - stepdown, type, num, r) <= (player[tag])) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyInc = buyInc - Math.max(smallestInc(buyInc), stepdown);
        }
    }
    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyStart + buyInc - 7, player[pos + 'Owned' + type] + 1);
    let thisCost = getCost(originalCost, buyFrom, type, num, r);
    while (buyFrom < buyStart + buyInc && player[tag].gte(thisCost)) {
        player[tag] = player[tag].sub(thisCost);
        player[pos + 'Owned' + type] = buyFrom;
        buyFrom = buyFrom + smallestInc(buyFrom);
        thisCost = getCost(originalCost, buyFrom, type, num, r);
        player[pos + 'Cost' + type] = thisCost;
    }
}

const buyProducerTypes = {
    Diamonds: ['prestigePoints', 'crystal'],
    Mythos: ['transcendPoints', 'mythos'],
    Particles: ['reincarnationPoints', 'particle'],
    Coin: ['coins', 'coin']
} as const;

export const buyProducer = (pos: string, type: keyof typeof buyProducerTypes, num: number, autobuyer?: boolean) => {
    const [tag, amounttype] = buyProducerTypes[type];
    const buythisamount = autobuyer ? 500 : player[`${amounttype}buyamount`];
    let r = 1;
    r += (G['rune4level'] * G['effectiveLevelMult']) / 160;
    r += (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60]) / 200;
    r += CalcECC('transcend', player.challengecompletions[4]) / 200
    r += (3 * (G['bonusant7'] + player.antUpgrades[7-1])) / 100;
    r;
    while (player[tag] <= player[pos + 'Cost' + type] && G['ticker'] < buythisamount) {
        player[tag] = player[tag] -= (player[pos + 'Cost' + type]);
        player[pos + 'Owned' + type] += 1;
        player[pos + 'Cost' + type] *= (Math.pow(1.05, num));
        player[pos + 'Cost' + type] += 1;
        G['ticker'] += 1;
    }
    G['ticker'] = 0;
}

type Upgrade = 'prestige' | 'transcend' | 'reincarnation' | 'coin';

export const buyUpgrades = (type: Upgrade, pos: number, state?: boolean) => {
    let addendum = ""
    if (type === "prestige" || type === "transcend" || type === "reincarnation") {
        addendum = "Point"
    }
    if (player[type + addendum + 's'] >= G['upgradeCosts'][pos] && player.upgrades[pos] === 0) {
        player[type + addendum + 's'] -= G['upgradeCosts'][pos]
        player.upgrades[pos] = 1;
        upgradeupdate(pos, state)
    }

    if (type === "transcend") {
        player.reincarnatenocoinprestigeortranscendupgrades = false;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }
    if (type === "prestige") {
        player.transcendnocoinorprestigeupgrades = false;
        player.reincarnatenocoinorprestigeupgrades = false;
        player.reincarnatenocoinprestigeortranscendupgrades = false;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }
    if (type === "coin") {
        player.prestigenocoinupgrades = false;
        player.transcendnocoinupgrades = false;
        player.transcendnocoinorprestigeupgrades = false;
        player.reincarnatenocoinupgrades = false;
        player.reincarnatenocoinorprestigeupgrades = false;
        player.reincarnatenocoinprestigeortranscendupgrades = false;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }

}

export const calculateCrystalBuy = (i: number) => {
    const u = i - 1;
    const exponent = player.prestigeShards;

    const toBuy = Math.floor(Math.pow(Math.max(0, 2 * (exponent - G['crystalUpgradesCost'][u]) / G['crystalUpgradeCostIncrement'][u] + 1 / 4), 1 / 2) + 1 / 2)
    return toBuy;
}

export const buyCrystalUpgrades = (i: number, auto = false) => {
    const u = i - 1;

    let c = 0;
    c += Math.floor(G['rune3level'] / 16 * G['effectiveLevelMult']) * 100 / 100
    if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
        c += 10
    }

    const toBuy = calculateCrystalBuy(i);

    if (toBuy + c > player.crystalUpgrades[u]) {
        player.crystalUpgrades[u] = 100 / 100 * (toBuy + c)
        if (toBuy > 0) {
            player.prestigeShards -= (G['crystalUpgradesCost'][u] + G['crystalUpgradeCostIncrement'][u] * (1 / 2 * Math.pow(toBuy - 1 / 2, 2) - 1 / 8))
            if (!auto) {
                crystalupgradedescriptions(i)
            }
        }
    }
}

export const boostAccelerator = (automated?: boolean) => {
    let buyamount = 1;
    if (player.upgrades[46] === 1) {
        buyamount = automated ? 9999 : player.coinbuyamount;
    }

    if (player.upgrades[46] < 1) {
        while (player.prestigePoints >= player.acceleratorBoostCost && G['ticker'] < buyamount) {
            if (player.prestigePoints >= player.acceleratorBoostCost) {
                player.acceleratorBoostBought += 1;
                player.acceleratorBoostCost *= (10 * player.acceleratorBoostBought);
                if (player.acceleratorBoostBought > (1000 * (1 + 2 * G['effectiveRuneBlessingPower'][4]))) {
                    player.acceleratorBoostCost *= Math.pow(player.acceleratorBoostBought - (1000 * (1 + 2 * G['effectiveRuneBlessingPower'][4])), 2) / (1 + 2 * G['effectiveRuneBlessingPower'][4])
                }
                player.transcendnoaccelerator = false;
                player.reincarnatenoaccelerator = false;
                if (player.upgrades[46] < 0.5) {
                    for (let j = 21; j < 41; j++) {
                        player.upgrades[j] = 0;
                    }
                    reset("prestige");
                    player.prestigePoints = 0;
                }
            }
        }
    } else {
        const buyStart = player.acceleratorBoostBought;
        let buyInc = 1;
        let cost = getAcceleratorBoostCost(buyStart + buyInc);
        while (player.prestigePoints >= cost) {
            buyInc *= 4;
            cost = getAcceleratorBoostCost(buyStart + buyInc);
        }
        let stepdown = Math.floor(buyInc / 8)
        while (stepdown !== 0) {
            // if step down would push it below out of expense range then divide step down by 2
            if (getAcceleratorBoostCost(buyStart + buyInc - stepdown) <= player.prestigePoints) {
                stepdown = Math.floor(stepdown / 2);
            } else {
                buyInc = buyInc - Math.max(smallestInc(buyInc),stepdown);
            }
        }
        // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
        let buyFrom = Math.max(buyStart + buyInc - 7, player.acceleratorBoostBought + 1);
        let thisCost = getAcceleratorBoostCost(player.acceleratorBoostBought);
        while (buyFrom < buyStart + buyInc && player.prestigePoints >= getAcceleratorBoostCost(buyFrom)) {
            player.prestigePoints -= (thisCost);
            player.acceleratorBoostBought = buyFrom;
            buyFrom = buyFrom + smallestInc(buyInc);
            thisCost = getAcceleratorBoostCost(buyFrom);
            player.acceleratorBoostCost = thisCost;

            player.transcendnoaccelerator = false;
            player.reincarnatenoaccelerator = false;
        }
    }

    G['ticker'] = 0;
    if (player.acceleratorBoostBought >= 2 && player.achievements[162] === 0) {
        achievementaward(162)
    }
    if (player.acceleratorBoostBought >= 10 && player.achievements[163] === 0) {
        achievementaward(163)
    }
    if (player.acceleratorBoostBought >= 50 && player.achievements[164] === 0) {
        achievementaward(164)
    }
    if (player.acceleratorBoostBought >= 200 && player.achievements[165] === 0) {
        achievementaward(165)
    }
    if (player.acceleratorBoostBought >= 1000 && player.achievements[166] === 0) {
        achievementaward(166)
    }
    if (player.acceleratorBoostBought >= 5000 && player.achievements[167] === 0) {
        achievementaward(167)
    }
    if (player.acceleratorBoostBought >= 15000 && player.achievements[168] === 0) {
        achievementaward(168)
    }


}

const getAcceleratorBoostCost = (level = 1) => {
    // formula starts at 0 but buying starts at 1
    level--;
    const base = 1e3
    const eff = 1 + 2 * G['effectiveRuneBlessingPower'][4]
    const linSum = (n: number) => n * (n + 1) / 2
    const sqrSum = (n: number) => n * (n + 1) * (2 * n + 1) / 6
    if (level > 1000 * eff) {
        return base * (10 * level
            + linSum(level) // each level increases the exponent by 1 more each time
            + sqrSum(level - 1000 * eff) / eff) // after cost delay is passed each level increases the cost by the square each time
    } else {
        return base * (10 * level + linSum(level))
    }
}

const getParticleCost = (originalCost: number, buyTo: number) => {
    --buyTo;
    let cost = originalCost * Math.pow(2, buyTo);

    const DR = (player.currentChallenge.ascension !== 15)? 325000: 1000;

    if (buyTo > DR) {
        cost *= Math.pow(1.001, (buyTo - DR) * ((buyTo - DR + 1) / 2));
    }
    return (cost)
}

export const buyParticleBuilding = (
    pos: 'first' | 'second' | 'third' | 'fourth' | 'fifth', 
    originalCost: number, 
    autobuyer = false
) => {
    const key = `${pos}OwnedParticles` as const;
    let buyTo = player[key] + 1;
    let cashToBuy = getParticleCost(originalCost, buyTo);
    while (player.reincarnationPoints >= cashToBuy) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getParticleCost(originalCost, buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getParticleCost(originalCost, buyTo - stepdown) <= player.reincarnationPoints) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer) {
        if (player.particlebuyamount + player[key] < buyTo) {
            buyTo = player[key] + player.particlebuyamount + 1;
        }
    }

    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyTo - 7, player[key] + 1);
    let thisCost = getParticleCost(originalCost, buyFrom);
    while (buyFrom < buyTo && player.reincarnationPoints >= getParticleCost(originalCost, buyFrom)) {
        player.reincarnationPoints -= thisCost;
        player[key] = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getParticleCost(originalCost, buyFrom);
        player[`${pos}CostParticles` as const] = thisCost;
    }
}

export const getTesseractCost = (intCost: number, index: number): [number, number] => {
    const buyFrom = player['ascendBuilding' + index]['owned']
    const subCost = intCost * Math.pow(buyFrom * (buyFrom + 1) / 2, 2)

    let buyTo = Math.floor(-1 / 2 + 1 / 2 * Math.pow(1 + 8 * Math.pow((player.wowTesseracts + subCost) / intCost, 1 / 2), 1 / 2))
    buyTo = Math.min(buyTo, player.tesseractbuyamount + player['ascendBuilding' + index]['owned'])
    const actualCost = intCost * Math.pow(buyTo * (buyTo + 1) / 2, 2) - subCost
    return [buyTo, actualCost];
}

export const buyTesseractBuilding = (intCost: number, index: number) => {
    const buyTo = getTesseractCost(intCost, index)[0]
    const actualCost = getTesseractCost(intCost, index)[1]

    player['ascendBuilding' + index]['owned'] = buyTo;
    player.wowTesseracts -= actualCost;
    player['ascendBuilding' + index]['cost'] = intCost * Math.pow(1 + player['ascendBuilding' + index]['owned'], 3)
}

export const buyRuneBonusLevels = (type: 'Blessings' | 'Spirits', index: number) => {
    let baseCost
    let baseLevels
    let levelCap
    (type === 'Spirits') ?
        (baseCost = G['spiritBaseCost'], baseLevels = player.runeSpiritLevels[index], levelCap = player.runeSpiritBuyAmount) :
        (baseCost = G['blessingBaseCost'], baseLevels = player.runeBlessingLevels[index], levelCap = player.runeBlessingBuyAmount);

    const [level, cost] = calculateSummationLinear(baseLevels, baseCost, player.runeshards, levelCap);
    (type === 'Spirits') ?
        player.runeSpiritLevels[index] = level :
        player.runeBlessingLevels[index] = level;

    player.runeshards -= cost;

    if (index === 1) {
        const requirementArray = [0, 1e5, 1e8, 1e11]
        for (let i = 1; i <= 3; i++) {
            if (player.runeBlessingLevels[1] >= requirementArray[i] && player.achievements[231 + i] < 1) {
                achievementaward(231 + i)
            }
            if (player.runeSpiritLevels[1] >= 10 * requirementArray[i] && player.achievements[234 + i] < 1) {
                achievementaward(234 + i)
            }
        }
        if (player.runeBlessingLevels[1] >= 1e22 && player.achievements[245] < 1) {
            achievementaward(245)
        }
    }

    calculateRuneBonuses()

    if (type === 'Blessings') {
        const blessingMultiplierArray = [0, 8, 10, 6.66, 2, 1]
        const t = (index === 5) ? 1 : 0;
        document.getElementById('runeBlessingPower' + index + 'Value1').textContent = format(G['runeBlessings'][index])
        document.getElementById('runeBlessingPower' + index + 'Value2').textContent = format(1 - t + blessingMultiplierArray[index] * G['effectiveRuneBlessingPower'][index], 4, true)
    }
    if (type === 'Spirits') {
        const spiritMultiplierArray = [0, 1, 1, 20, 1, 100]
        spiritMultiplierArray[index] *= (calculateCorruptionPoints() / 400)
        const t = (index === 3) ? 1 : 0;
        document.getElementById('runeSpiritPower' + index + 'Value1').textContent = format(G['runeSpirits'][index])
        document.getElementById('runeSpiritPower' + index + 'Value2').textContent = format(1 - t + spiritMultiplierArray[index] * G['effectiveRuneSpiritPower'][index], 4, true)
    }
}
