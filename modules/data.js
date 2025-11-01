import { Reactor } from "./utils/reactor.js";

export const shortcutList = new Reactor({
    lastModification: 0,
    softwares: {}
})
export const softwareList = new Reactor({})
export const lastListModification = new Reactor(null)


// Keyboard Options
export const keyboardActiveKeys = new Reactor([])
export const searchInputParams = new Reactor({searchInput: undefined, searchFilterIncludeDescription: true, searchFilterCaseSensitive: false})
export const keyboardIsPause = new Reactor(false)
export const keyboardIsRawKeyInput = new Reactor("raw") // it is actually made for boolen value but don't change it to true becuase it is used to fetch initial value for nav. Also boolen values are swaped so false mean true and true mean false, LOL
export const keyboardKeyDomListRaw = {}
export const keyboardCurrVirtualName = new Reactor("generic")


export const tmp = {
    oldAbortControllerSingal: null
}



export const lastKeyPress = new Reactor(null) // value should be the last key event ref;