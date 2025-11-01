export class Reactor {
    constructor(value) {
        this._val = this._unwrap(value);
        this._subscribers = new Set();
    }

    get value() {
        // console.log("getting value");
        if (typeof this._val === 'object' && this._val !== null) {
            return structuredClone(this._val);
        }
        return this._val;
    }

    set value(v) {
        throw new Error("use .set() method instead of .get");
    }

    set(newVal) {
        const unwrappedNewVal = this._unwrap(newVal);
        if (this._val !== unwrappedNewVal) {
            this._val = unwrappedNewVal;
            this._notifySubscribers();
        }
    }

    subscribe(func) {
        this._subscribers.add(func);
        // console.log(this)
        func(this.value);
    }

    _unwrap(val) {
        if (val instanceof Reactor) {
            return val.value;
        }
        return val;
    }

    _notifySubscribers() {
        const subscribersToRun = [...this._subscribers];
        for (const subscribeFunc of subscribersToRun) {
            subscribeFunc(this.value);
        }
    }
}




// "Reactor.value" to get the reactive value
// "Reactor.set(newVal)" to set whole new value
// "Reactor.subscribe(fn(this.value))" to subscribe the reactor. when value changes, this will run automatically