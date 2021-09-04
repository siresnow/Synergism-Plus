import { player } from './Synergism';
import { Globals as G } from './Variables';
import { sumContents } from './Utility';

import Decimal from 'break_infinity.js';
import { CalcECC } from './Challenges';
import { achievementaward } from './Achievements';

export const calculatetax = () => {
    let c = 0;
    let e = 1;
    let f = player.toggles[36]?1.1:1;
    let compareC = 0;
    G['produceFirst'] = (player.firstGeneratedCoin.add(player.firstOwnedCoin)).times(G['globalCoinMultiplier']).times(G['coinOneMulti']).times(player.firstProduceCoin).pow(player.toggles[37]?0.5:1);
    G['produceSecond'] = (player.secondGeneratedCoin.add(player.secondOwnedCoin)).times(G['globalCoinMultiplier']).times(G['coinTwoMulti']).times(player.secondProduceCoin).pow(player.toggles[37]?0.5:1);
    G['produceThird'] = (player.thirdGeneratedCoin.add(player.thirdOwnedCoin)).times(G['globalCoinMultiplier']).times(G['coinThreeMulti']).times(player.thirdProduceCoin).pow(player.toggles[37]?0.5:1);
    G['produceFourth'] = (player.fourthGeneratedCoin.add(player.fourthOwnedCoin)).times(G['globalCoinMultiplier']).times(G['coinFourMulti']).times(player.fourthProduceCoin).pow(player.toggles[37]?0.5:1);
    G['produceFifth'] = (player.fifthGeneratedCoin.add(player.fifthOwnedCoin)).times(G['globalCoinMultiplier']).times(G['coinFiveMulti']).times(player.fifthProduceCoin).pow(player.toggles[37]?0.5:1);
    G['produceTotal'] = G['produceFirst'].add(G['produceSecond']).add(G['produceThird']).add(G['produceFourth']).add(G['produceFifth']);

    if (G['produceFirst'].lte(.0001)) {
        G['produceFirst'] = new Decimal(0)
    }
    if (G['produceSecond'].lte(.0001)) {
        G['produceSecond'] = new Decimal(0)
    }
    if (G['produceThird'].lte(.0001)) {
        G['produceThird'] = new Decimal(0)
    }
    if (G['produceFourth'].lte(.0001)) {
        G['produceFourth'] = new Decimal(0)
    }
    if (G['produceFifth'].lte(.0001)) {
        G['produceFifth'] = new Decimal(0)
    }

    G['producePerSecond'] = G['produceTotal'].times(40);

    if (player.currentChallenge.reincarnation === 6) {
        e = 3 * Math.pow((1 + player.challengecompletions[6] / 25), 2)
    }
    if (player.currentChallenge.reincarnation === 9) {
        e = 0.005
    }
    if (player.currentChallenge.ascension === 15) {
        e = 0.000005
    }
    //im doing this to spite xander, basically changes w5x9 to not impact tax scaling in c13 || Sean#7236
    if (player.currentChallenge.ascension === 13) {
        e *= 700 * (1 + 1 / 6 * player.challengecompletions[13])
        e *= Math.pow(1.05, Math.max(0, sumContents(player.challengecompletions) - player.challengecompletions[11] - player.challengecompletions[12] - player.challengecompletions[13] - player.challengecompletions[14] - player.challengecompletions[15] - 3 * player.cubeUpgrades[49]))
    }
    if (player.challengecompletions[6] > 0) {
        f /= 1.075
    }
    let exponent = player.toggles[36]?2.5:1;
    exponent *= e;
    exponent *= (1 - 1 / 20 * player.researches[51] - 1 / 40 * player.researches[52] - 1 / 80 * player.researches[53] - 1 / 160 * player.researches[54] - 1 / 320 * player.researches[55])
    exponent *= (1 - 0.05 / 1800 * (player.achievements[45] + player.achievements[46] + 2 * player.achievements[47]) * Math.min(player.prestigecounter, 1800))
    exponent *= Math.pow(0.965, CalcECC('reincarnation', player.challengecompletions[6]))
    exponent *= (0.001 + .999 * (Math.pow(6, -(G['rune2level'] * G['effectiveLevelMult']) / 1000)))
    exponent *= (0.01 + .99 * (Math.pow(4, Math.min(0, (400 - G['rune4level']) / 1100))))
    exponent *= (1 - 0.04 * player.achievements[82] - 0.04 * player.achievements[89] - 0.04 * player.achievements[96] - 0.04 * player.achievements[103] - 0.04 * player.achievements[110] - 0.0566 * player.achievements[117] - 0.0566 * player.achievements[124] - 0.0566 * player.achievements[131])
    exponent *= f;
    exponent *= Math.pow(0.9925, player.achievements[118] * (player.challengecompletions[6] + player.challengecompletions[7] + player.challengecompletions[8] + player.challengecompletions[9] + player.challengecompletions[10]));
    exponent *= (0.005 + 0.995 * Math.pow(0.99, player.antUpgrades[3-1] + G['bonusant3']))
    exponent *= 1 / Math.pow((1 + Decimal.log(player.ascendShards.add(1), 10)), 1 + .2 / 60 * player.challengecompletions[10] * player.upgrades[125] + 0.1 * player.platonicUpgrades[5] + 0.2 * player.platonicUpgrades[10] + (G['platonicBonusMultiplier'][5]-1))
    exponent *= (1 - 0.10 * (player.talismanRarity[1-1] - 1))
    exponent *= Math.pow(0.98, 3 / 5 * Math.log(1 + player.rareFragments) / Math.log(10) * player.researches[159])
    exponent *= Math.pow(0.966, CalcECC('ascension', player.challengecompletions[13]))
    exponent *= (1 - 0.666 * player.researches[200] / 100000)
    exponent *= (1 - 0.666 * player.cubeUpgrades[50] / 100000)
    exponent *= G['challenge15Rewards'].taxes
    if (player.upgrades[121] > 0) {
        exponent *= 0.5
    }
    let mxe = Math.floor((player.toggles[36]?.5:275) / (Decimal.log(player.toggles[36]?1.05:1.01, 10) * exponent)) - 1
    G['maxexponent'] = mxe;
    if (player.toggles[36]) {
        let mxemult = 1+Object.keys(player.upgrades).filter(x => player.upgrades[Number(x)]==1 && (Number(x)<3||Number(x)==5||(Number(x)>=21&&Number(x)<23)||Number(x)==25||Number(x)==26)).length/3;
        if (player.upgrades[6]>.5) mxemult += new Decimal(G['totalCoinOwned'] + 1).times(Decimal.min(1e30, Decimal.pow(1.008, G['totalCoinOwned']))).max(1).log10()/5;
        if (player.upgrades[10]>.5) mxemult += 1;
        if (player.upgrades[11]>.5) mxemult += Math.log10(player.acceleratorBought*1.1+1);
        if (player.upgrades[12]>.5) mxemult += Object.keys(player.upgrades).filter(i => player.upgrades[Number(i)]>.5).length/11.5;
        if (player.upgrades[27]>.5) mxemult += Math.log10(player.prestigePoints.plus(1).log10()+1)
        if (player.upgrades[101]>.5) mxemult += Math.log10(player.prestigeShards.plus(1).log10()+1)
        G['maxexponent'] *= mxemult;
    }
    const a2 = Math.min(G['maxexponent'], Math.floor(Decimal.log(G['produceTotal'].add(1), 10)));

    if (player.currentChallenge.ascension === 13 && G['maxexponent'] <= 99999 && player.achievements[249] < 1) {
        achievementaward(249)
    }

    if (a2 >= 1) {
        c = Math.pow(a2, 2) / (player.toggles[36]?1:550)
    }


    compareC = Math.pow(mxe, 2) / (player.toggles[36]?1:550)

    if (!player.toggles[33]){
        let base = 1.01;
        if (player.toggles[36]) {
            base = 1.05;
            if (G['produceFourth'].gte(1e4)) exponent /= 1.175;
            if (G['produceFifth'].gte(1e5)) exponent /= 1.2; // what, you thought I'd fix actually fix these bugs? nah I'll just hardcode a temporary solution ;)
            c /= Object.keys(player.upgrades).filter(x => player.upgrades[Number(x)]==1 && ((Number(x)>=3&&Number(x)<=4)||(Number(x)>=23&&Number(x)<=24))).length*1.25+1
            compareC /= Object.keys(player.upgrades).filter(x => player.upgrades[Number(x)]==1 && ((Number(x)>=3&&Number(x)<=4)||(Number(x)>=23&&Number(x)<=24))).length*1.25+1
            if (exponent>=200) exponent = Math.pow(exponent, 2)/200;
        }

        G['taxdivisor'] = Decimal.pow(base, (c) * (exponent)).times(player.toggles[36]?(G["produceTotal"].plus(1).log10()+1):1)
        G['taxdivisorcheck'] = Decimal.pow(base, (compareC) * (exponent)).times(player.toggles[36]?(G["produceTotal"].plus(1).log10()+1):1)
    }
    else{
        G['taxdivisor'] = new Decimal(1)
        G['taxdivisorcheck'] = new Decimal(1)
    }

    if (player.toggles[36]) {
        G['crystaltax'] = Decimal.pow(2, G['produceFirstDiamonds'].plus(1).times(G['produceSecondDiamonds'].plus(1)).times(G['produceThirdDiamonds'].plus(1)).times(G['produceFourthDiamonds'].plus(1)).times(G['produceFifthDiamonds'].plus(1)).plus(1).log10());
        G['mythostax'] = Decimal.pow(3, G['produceFirstMythos'].plus(1).times(G['produceSecondMythos'].plus(1)).times(G['produceThirdMythos'].plus(1)).times(G['produceFourthMythos'].plus(1)).times(G['produceFifthMythos'].plus(1)).plus(1).log10());
        G['particletax'] = Decimal.pow(4, G['produceFirstParticles'].plus(1).times(G['produceSecondParticles'].plus(1)).times(G['produceThirdParticles'].plus(1)).times(G['produceFourthParticles'].plus(1)).times(G['produceFifthParticles'].plus(1)).plus(1).log10());
        G['tessertax'] = Decimal.pow(5, G['ascendBuildingProduction'].first.plus(1).times(G['ascendBuildingProduction'].second.plus(1)).times(G['ascendBuildingProduction'].third.plus(1)).times(G['ascendBuildingProduction'].fourth.plus(1)).times(G['ascendBuildingProduction'].fifth.plus(1)).plus(1).log10());
    } else {
        G['crystaltax'] = new Decimal(1);
        G['mythostax'] = new Decimal(1);
        G['particletax'] = new Decimal(1);
        G['tessertax'] = new Decimal(1);
    }
}