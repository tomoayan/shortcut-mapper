import { Reactor } from "./utils/reactor.js";

export const shortcutList = new Reactor({
    lastModification: 0,
    softwares: {}
})



// Keyboard Options
export const keyboardActiveKeys = new Reactor([])
export const keyboardIsPause = new Reactor(false)
export const keyboardIsRawKeyInput = new Reactor("raw")
export const keyboardKeyDomListRaw = {}
export const keyboardCurrVirtualName = new Reactor("generic")


export const tmp = {
    oldAbortControllerSingal: null
}