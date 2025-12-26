function getValidChallenges(challenges, context) {
    const valid = [];

    for (const c of challenges) {
        if (c.already_issued) continue;
        if (context.players === 1 && !c.allowedinsolo) continue;
        if (!c.allowed_cycles) continue;

        const cycles = c.allowed_cycles.split(" ").map(Number);
        if (!cycles.includes(context.cycle - 1)) continue;

        if (shouldSkipChallenge(c, context)) continue;

        const hives = c.allowed_hives.split(" ");
        if (!hives.includes(context.hive)) continue;

        valid.push(c);
    }

    return valid;
}

function shouldSkipChallenge(challenge, context) {
    const weaponChallenges = new Set([
        "ar_only",
        "smg_only",
        "lmgs_only",
        "shotguns_only",
        "2_weapons_only",
        "semi_autos_only",
        "new_weapon",
        "snipers_only"
    ]);

    const isWeaponChallenge = weaponChallenges.has(challenge.ref);

    if (!isWeaponChallenge) {
        return false;
    }

    if (context.players === 1) {
        return true;
    }

    return false;
}

