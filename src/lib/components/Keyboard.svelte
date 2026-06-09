<script>
    import { onMount } from 'svelte';
    import { keyboardActiveKeys, keyboardIsRawKeyInput, keyboardLayout } from '../store.js';

    let keyboardEl;

    $: {
        if (keyboardEl) {
            keyboardEl.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            $keyboardActiveKeys.forEach(key => {
                keyboardEl.querySelectorAll('button').forEach(btn => {
                    const dataKey = btn.getAttribute('data-key');
                    if (!dataKey) return;
                    let dataKeyList = dataKey.split(" ");
                    if (dataKeyList.includes("")) dataKeyList.push(" ");
                    if (dataKeyList.includes(key)) {
                        btn.classList.add('active');
                    }
                });
            });
        }
    }

    onMount(() => {
        const handleKeyDown = (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

            const key = $keyboardIsRawKeyInput ? event.code : event.key;
            
            if (!$keyboardActiveKeys.includes(key)) {
                $keyboardActiveKeys = [...$keyboardActiveKeys, key];
            } else {
                $keyboardActiveKeys = $keyboardActiveKeys.filter(k => k !== key);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });
</script>

{#if $keyboardLayout === 'generic'}
<div id="keyboard-wrapper" bind:this={keyboardEl}>
    <div class="keyboard" data-keyboard="generic">

        <div class="main-pad">
            <div class="row fn">
                <button data-key="Escape">
                    esc
                </button>
                <div class="fn-group">
                    <button data-key="F1">F1</button>
                    <button data-key="F2">F2</button>
                    <button data-key="F3">F3</button>
                    <button data-key="F4">F4</button>
                </div>
                <div class="fn-group">
                    <button data-key="F5">F5</button>
                    <button data-key="F6">F6</button>
                    <button data-key="F7">F7</button>
                    <button data-key="F8">F8</button>
                </div>
                <div class="fn-group">
                    <button data-key="F9">F9</button>
                    <button data-key="F10">F10</button>
                    <button data-key="F11">F11</button>
                    <button data-key="F12">F12</button>
                </div>
            </div>

            <div class="row num-row">
                <button data-key="Backquote ` ~"><span>~</span><span>`</span></button>
                <button data-key="Digit1 1 !"><span>!</span><span>1</span></button>
                <button data-key="Digit2 2 @"><span>@</span><span>2</span></button>
                <button data-key="Digit3 3 #"><span>#</span><span>3</span></button>
                <button data-key="Digit4 4 $"><span>$</span><span>4</span></button>
                <button data-key="Digit5 5 %"><span>%</span><span>5</span></button>
                <button data-key="Digit6 6 ^"><span>^</span><span>6</span></button>
                <button data-key="Digit7 7 &"><span>&</span><span>7</span></button>
                <button data-key="Digit8 8 *"><span>*</span><span>8</span></button>
                <button data-key="Digit9 9 ("><span>(</span><span>9</span></button>
                <button data-key="Digit0 0 )"><span>)</span><span>0</span></button>
                <button data-key="Minus - _"><span>_</span><span>-</span></button>
                <button data-key="Equal = +"><span>+</span><span>=</span></button>
                <button class="backspace special" data-key="Backspace"><span>backspace</span></button>
            </div>

            <div class="row">
                <button class="tab special" data-key="Tab"><span>tab</span></button>
                <button data-key="KeyQ Q q">Q</button>
                <button data-key="KeyW W w">W</button>
                <button data-key="KeyE E e">E</button>
                <button data-key="KeyR R r">R</button>
                <button data-key="KeyT T t">T</button>
                <button data-key="KeyY Y y">Y</button>
                <button data-key="KeyU U u">U</button>
                <button data-key="KeyI I i">I</button>
                <button data-key="KeyO O o">O</button>
                <button data-key="KeyP P p">P</button>
                <button data-key="BracketLeft [ &#123;"><span>&#123;</span><span>[</span></button>
                <button data-key="BracketRight ] &#125;"><span>&#125;</span><span>]</span></button>
                <button class="special" data-key="Backslash \ |"><span>|</span><span>\</span></button>
            </div>

            <div class="row">
                <button class="capsLock special" data-key="CapsLock"><span>capsLock</span></button>
                <button data-key="KeyA A a">A</button>
                <button data-key="KeyS S s">S</button>
                <button data-key="KeyD D d">D</button>
                <button data-key="KeyF F f">F</button>
                <button data-key="KeyG G g">G</button>
                <button data-key="KeyH H h">H</button>
                <button data-key="KeyJ J j">J</button>
                <button data-key="KeyK K k">K</button>
                <button data-key="KeyL L l">L</button>
                <button data-key="Semicolon ; :"><span>:</span><span>;</span></button>
                <button data-key="Quote ' &quot;"><span>"</span><span>'</span></button>
                <button class="enter special" data-key="Enter"><span>Enter</span></button>
            </div>

            <div class="row">
                <button data-key="ShiftLeft Shift" class="shift special"><span>shift</span></button>
                <button data-key="KeyZ Z z">Z</button>
                <button data-key="KeyX X x">X</button>
                <button data-key="KeyC C c">C</button>
                <button data-key="KeyV V v">V</button>
                <button data-key="KeyB B b">B</button>
                <button data-key="KeyN N n">N</button>
                <button data-key="KeyM M m">M</button>
                <button data-key="Comma , <"><span>&lt;</span><span>,</span></button>
                <button data-key="Period . >"><span>&gt;</span><span>.</span></button>
                <button data-key="Slash / ?"><span>?</span><span>/</span></button>
                <button class="shift special" data-key="ShiftRight Shift"><span>shift</span></button>
            </div>

            <div class="row">
                <button data-key="ControlLeft Control" class="ctrl special"><span>ctrl</span></button>
                <button data-key="MetaLeft Meta Windows"><span>win</span></button>
                <button data-key="AltLeft Alt"><span>alt</span></button>
                <button class="space" data-key="Space  " aria-label="Space"></button>
                <button data-key="AltRight AltGraph"><span>alt</span></button>
                <button data-key="MetaRight Meta Windows"><span>win</span></button>
                <button data-key="ContextMenu Menu"><span>menu</span></button>
                <button class="ctrl special" data-key="ControlRight Control"><span>ctrl</span></button>
            </div>
        </div>


        <div class="middle-part">
            <div class="row">
                <button data-key="Insert PrintScreen"><span>insert</span></button>
                <button data-key="Home ScrollLock"><span>Home</span></button>
                <button data-key="PageUp Pause"><span>PgUp</span></button>
            </div>

            <div class="row">
                <button data-key="Delete"><span>Delete</span></button>
                <button data-key="End"><span>End</span></button>
                <button data-key="PageDown"><span>PgDn</span></button>
            </div>

            <div class="row">
                <button class="invisible" aria-hidden="true"></button>
                <button class="invisible" aria-hidden="true"></button>
                <button class="invisible" aria-hidden="true"></button>
            </div>

            <div class="row invisible">
                <button class="invisible" aria-hidden="true"></button>
                <button class="arrUp" data-key="ArrowUp">&uarr;</button>
                <button class="invisible" aria-hidden="true"></button>
            </div>

            <div class="row">
                <button data-key="ArrowLeft">&larr;</button>
                <button data-key="ArrowDown">&darr;</button>
                <button data-key="ArrowRight">&rarr;</button>
            </div>
        </div>

        <div class="num-pad">
            <div class="first">
                <div class="row">
                    <button data-key="NumLock"><span>Num Lock</span></button>
                    <button data-key="NumpadDivide /">/</button>
                    <button data-key="NumpadMultiply *">*</button>
                </div>

                <div class="row">
                    <button data-key="Numpad7 7 Home"><span>7</span><span>Home</span></button>
                    <button data-key="Numpad8 8 ArrowUp"><span>8</span><span>&uarr;</span></button>
                    <button data-key="Numpad9 9 PageUp"><span>9</span><span>PgUp</span></button>
                </div>

                <div class="row">
                    <button data-key="Numpad4 4 ArrowLeft"><span>4</span><span>&larr;</span></button>
                    <button data-key="Numpad5 5 Clear//"><span>5</span><span>Clear</span></button>
                    <button data-key="Numpad6 6 ArrowRight"><span>6</span><span>&rarr;</span></button>
                </div>

                <div class="row">
                    <button data-key="Numpad1 1 End"><span>1</span><span>End</span></button>
                    <button data-key="Numpad2 2 ArrowDown"><span>2</span><span>&darr;</span></button>
                    <button data-key="Numpad3 3 PageDown"><span>3</span><span>PgDn</span></button>
                </div>

                <div class="row">
                    <button class="special" data-key="Numpad0 0 Insert"><span>0</span><span>Insert</span></button>
                    <button data-key="NumpadDecimal . Delete"><span>.</span><span>Delete</span></button>
                </div>
            </div>
            <div class="second">
                <div class="row column">
                    <button data-key="NumpadSubtract -">-</button>
                    <button class="special" data-key="NumpadAdd +">+</button>
                    <button class="special" data-key="NumpadEnter Enter">Enter</button>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
#keyboard-wrapper {
    display: flex;
    justify-content: center;
    padding: 1rem;
    min-height: 5rem;
    border-radius: 1rem;
    border: 1px solid var(--nav-border);
    background-color: var(--nav-background);
    overflow: hidden;
}

.keyboard {
    background-color: rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    font-size: calc(.8cqw);

    --key-norm-width: 3em;
    --key-norm-height: 3em;
    --key-color: hsl(0, 0%, 14%);
    --key-horizontal-gap: .7em;
    --key-vertical-gap: .7em;
    --fn-row-margin-bottom: 1.5em;
}

@media (width <=1450px) {
    .keyboard {
        font-size: calc(.85cqw)
    }
}

@media (width <=1000px) {
    .keyboard {
        font-size: calc(.7cqw)
    }
}

.keyboard button {
    background-color: #262626;
    width: var(--key-norm-width);
    height: var(--key-norm-height);
    background-color: var(--key-color);
    display: grid;
    place-content: center;
    font-size: 1em;
    border-radius: .3em;
    border: none;
    color: white;
    transition: background-color 0.1s;
}

.keyboard button.invisible {
    background-color: transparent;
}

.keyboard button.special {
    flex: 1 1 fit-content;
    padding: 0 1em;
}

.keyboard button.space {
    flex: 1 1 38%;
}

.main-pad,
.middle-part,
.num-pad {
    display: flex;
    flex-direction: column;
}

.main-pad .row,
.middle-part .row,
.num-pad .row {
    display: flex;
    flex-direction: row;
    flex: 0 1 0;
    gap: var(--key-horizontal-gap);
}

.main-pad .row.fn {
    justify-content: space-between;
    margin-bottom: var(--fn-row-margin-bottom);
}

.main-pad .row.fn .fn-group {
    display: flex;
    gap: var(--key-horizontal-gap);
}

.main-pad {
    width: 60%;
    gap: var(--key-vertical-gap);
}

.middle-part {
    gap: var(--key-vertical-gap);
}

.num-pad {
    flex-direction: row !important;
    gap: var(--key-horizontal-gap);
}

.num-pad > div {
    display: flex;
    flex-direction: column;
    gap: var(--key-vertical-gap);
}

.num-pad .row.column {
    flex-direction: column;
    flex: 1 1 0;
}

/* Key highlight style */
:global(.keyboard button.active) {
    background-color: var(--root-font-color, #2987da) !important;
    color: #fff !important;
}

.keyboard button > span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
