import { Reactor } from "./utils/reactor.js";

export const shortcutList = new Reactor({
    lastModification: 0,
    softwares: {}
})
export const activeKeyboardKeys = new Reactor([])
export const activeShortcutList = new Reactor([])