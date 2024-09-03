import {createGlobalStyle} from 'styled-components';

// noinspection CssUnresolvedCustomProperty,CssNoGenericFontName,CssUnusedSymbol
export const GlobalStyles: any = createGlobalStyle`
    *, *:before, *:after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    *:focus-visible {
        outline: none;
    }

    html {
        width: 100%;
    }

    body {
        --d9-font-color: var(--vscode-editor-foreground);
        --d9-background-color: var(--vscode-editor-background);
        position: relative;
        margin: 0;
        padding: 0;
        font-family: var(--d9-font-family);
        font-size: var(--d9-font-size);
        color: var(--d9-font-color);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        width: 100%;

        &.vscode-dark {
            #root > div[data-w=d9-page] {
                > div[data-w=d9-playground] {
                    --d9-playground-widget-declaration-instruction-color: rgba(182,135,115,1);
                    --d9-playground-widget-declaration-type-color: rgba(246,213,72,1);
                    --d9-playground-widget-declaration-splitter-color: rgba(212,212,212,1);
                }
            }
        }
    }

    *, *:before, *:after {
        box-sizing: border-box;
    }

    #root > div[data-w=d9-page] {
        height: 100vh;

        > div[data-w=d9-playground] {
            border: 0;
            border-top: 1px solid rgba(214, 214, 214, 1);
            height: 100%;
            min-height: 100%;

            div.cm-editor > div.cm-scroller {
                border-right: 1px solid rgba(214, 214, 214, 1);

                > div.cm-gutters {
                    background-color: var(--d9-background-color);
                }
            }
        }
    }
`;