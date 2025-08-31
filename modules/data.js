import { Reactor } from "./utils/reactor.js";

export const shortcutList = new Reactor({
    lastModification: 0,
    softwares: {}
})
export const softwareList = new Reactor({})
export const lastListModification = new Reactor(null)


// Keyboard Options
export const keyboardActiveKeys = new Reactor([])
export const keyboardIsPause = new Reactor(false)
export const keyboardIsRawKeyInput = new Reactor("raw")
export const keyboardKeyDomListRaw = {}
export const keyboardCurrVirtualName = new Reactor("generic")


export const tmp = {
    oldAbortControllerSingal: null
}



export const lastKeyPress = new Reactor(null) // value should be the last key event ref;