<<<<<<< HEAD:src/Structures.ts
import Decimal from "break_infinity.js";

export class Resource extends Decimal {
    private value: Decimal

    constructor (v: Decimal){super(v)}

    setTo(amount: Decimal): Resource {
        this.value = amount
        return this
    }

    gain(amount: Decimal): Resource {
        this.value = this.value.add(amount) 
        return this
    }

    spend(amount: Decimal): Resource {
        this.value = this.value.sub(amount)
        return this
    }
=======
import Decimal from "break_infinity.js";

export class Resource extends Decimal {
    private value: Decimal

    constructor (v: Decimal){super(v)}

    setTo(amount: Decimal): Resource {
        this.value = amount
        return this
    }

    gain(amount: Decimal): Resource {
        this.value = this.value.add(amount) 
        return this
    }

    spend(amount: Decimal): Resource {
        this.value = this.value.sub(amount)
        return this
    }
>>>>>>> upstream/plus:Javascript/Structures.ts
}