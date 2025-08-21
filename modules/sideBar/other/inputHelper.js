import { keyboardIsRawKeyInput } from "../../data.js"

export const inputHelper = (event) => {
    const value = event.currentTarget.value;
    const isRaw = value === 'raw' ? true : false;

    // just for safety
    if (value !== 'raw' && value !== 'processed') throw new Error("key Input type is neither of both 'raw' or 'processed'");

    keyboardIsRawKeyInput.set(isRaw);
}