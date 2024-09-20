import {createCssVars as createN2CssVars, CssConstants as N2CssConstants} from '@rainbow-d9/n2';
import {
	createPlaygroundCssVars as createD9PlaygroundCssVars,
	PlaygroundCssConstants as D9PlaygroundCssConstants
} from '@rainbow-d9/n5';
import {
	createPlaygroundCssVars as createO23PlaygroundCssVars,
	PlaygroundCssConstants as O23PlaygroundCssConstants
} from '@rainbow-d9/n6';
import {createGlobalStyle} from 'styled-components';

const createThemeStyles = () => {
	const N2LightConstants = N2CssConstants;
	const N2LightTheme = createN2CssVars(N2LightConstants);
	const N2DarkConstants = {
		...N2LightConstants,
		FONT_COLOR: 'rgb(204,204,204)',
		BG_COLOR: 'rgb(34,34,34)',
		PRIMARY_COLOR: 'rgb(102,165,255)',
		DANGER_COLOR: 'rgb(255,87,92)',
		SUCCESS_COLOR: 'rgb(40,167,69)',
		WARN_COLOR: 'rgb(255,193,7)',
		INFO_COLOR: 'rgb(85,183,194)',
		WAIVE_COLOR: 'rgb(102,102,102)',
		HOVER_COLOR: 'rgb(51,51,51)',
		INVERT_COLOR: 'rgb(34,34,34)',
		DISABLE_COLOR: 'rgb(51,51,51)',
		PLACEHOLDER_COLOR: 'rgb(128,128,128)',
		BORDER_COLOR: 'rgb(77,77,77)',
		SHADOW_COLOR: 'rgb(0,0,0)',
		WAIVE_SHADOW_COLOR: 'rgb(0,0,0)',
		// for widgets
		CAPTION_FONT_COLOR: 'rgb(153,153,153)',
		TAB_ACTIVE_COLOR: 'rgb(102,165,255)',
		WIZARD_STEP_DONE_COLOR: 'rgb(64,74,82)',
		WIZARD_STEP_ACTIVE_COLOR: 'rgb(102,165,255)',
		RIB_COLOR: 'rgb(51,53,56)',
		TREE_LINE_COLOR: 'rgb(77,77,77)',
		SCROLL_THUMB_COLOR: 'rgb(128,128,128)',
		SCROLL_TRACK_COLOR: 'rgba(51,51,51,0.5)'
	};
	const N2DarkTheme = createN2CssVars(N2DarkConstants);

	const D9LightConstants = D9PlaygroundCssConstants;
	const D9LightTheme = createD9PlaygroundCssVars(D9LightConstants);
	const D9DarkConstants = {
		...D9LightConstants,
		WIDGET_DECLARATION_INSTRUCTION_COLOR: 'rgb(184, 105, 209)',
		WIDGET_DECLARATION_SPLITTER_COLOR: 'rgba(150, 150, 150, 0.7)',
		WIDGET_DECLARATION_TYPE_COLOR: 'rgb(184, 105, 209)',
		WIDGET_DECLARATION_HEADLINE_COLOR: 'rgb(101, 190, 70)',
		WIDGET_DECLARATION_PROPERTY_COLOR: 'rgb(100, 195, 197)',
		WIDGET_DECLARATION_ID_COLOR: 'rgb(100, 195, 197)',
		WIDGET_DECLARATION_FLAG_COLOR: 'rgb(150, 149, 90)',
		WIDGET_DECLARATION_ATTR_NAME_COLOR: 'rgb(108, 189, 190)',
		WIDGET_DECLARATION_ATTR_VALUE_ICON_COLOR: 'rgb(101, 190, 70)',
		WIDGET_DECLARATION_ATTR_VALUE_STR_COLOR: 'rgb(101, 190, 70)',
		WIDGET_DECLARATION_ATTR_VALUE_EXT_COLOR: 'rgb(30, 77, 215)',
		WIDGET_WRAPPER_SHADOW: '0 0 5px 2px rgba(0,0,0,0.5)',
		WIDGET_WRAPPER_TOOLBAR_COLOR: 'rgba(255,255,255,0.2)',
		WIDGET_WRAPPER_TOOLBAR_FILTER: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))',
		CODE_MIRROR_ACTIVE_LINE_BACKGROUND_COLOR: 'rgba(255,255,255,0.06)'
	};
	const D9DarkTheme = createD9PlaygroundCssVars(D9DarkConstants);

	const O23LightConstants = O23PlaygroundCssConstants;
	const O23LightTheme = createO23PlaygroundCssVars(O23LightConstants);
	const O23DarkConstants = {
		...O23LightConstants,
		EDITOR_ATTRIBUTE_BADGE_COLOR: '#4a6a77',
		EDIT_DIALOG_BACKDROP_COLOR: 'rgba(30, 30, 30, 0.75)',
		EDIT_DIALOG_SHADOW: '0 0 10px 4px rgba(0, 0, 0, 0.6)',
		EDIT_DIALOG_HELP_DOC_TITLE_COLOR: 'rgb(128, 128, 128)',
		CONFIGURABLE_ELEMENT_BORDER_COLOR: 'rgb(80, 80, 80)',
		CONFIGURABLE_ELEMENT_GROUP_BORDER_COLOR: 'rgb(60, 60, 60)',
		TOOLBAR_BUTTON_ACTIVE_BACKGROUND_COLOR: '#4b6e8b',
		STEP_OPERATOR_COLOR: '#4b6e8b',
		NODE_START_COLOR: '#ff7f50',
		NODE_END_COLOR: '#c9a15e',
		NODE_JOIN_END_COLOR: '#8b8b7e',
		NODE_STEP_COLOR: '#3a7f54',
		NODE_STEP_HTTP_COLOR: '#7b9d8e',
		NODE_STEP_SETS_COLOR: '#4a3e7d',
		NODE_ASYNC_SETS_STEP_COLOR: '#ff5c40',
		NODE_EACH_STEP_COLOR: '#9c6ab0',
		NODE_PARALLEL_STEP_COLOR: '#0056a0',
		NODE_CONDITIONAL_STEP_COLOR: '#a85d49',
		NODE_ROUTES_STEP_COLOR: '#a85d49',
		NODE_REF_PIPELINE_STEP_COLOR: '#6c032b',
		NODE_REF_STEP_STEP_COLOR: '#6c032b',
		NODE_TYPEORM_STEP_COLOR: '#7a5f4b',
		NEXT_STEP_PORT_COLOR: '#6e6f3b',
		PREVIOUS_STEP_PORT_COLOR: '#6d3c8e',
		PORT_FIRST_SUB_STEP_COLOR: '#6d3c8e',
		PORT_STEPS_COLOR: '#415c75',
		PORT_ERROR_HANDLES_COLOR: '#a2396f',
		LINK_ERROR_HANDLES_COLOR: '#8c6a7a',
		PORT_LAST_SUB_STEP_JOIN_COLOR: '#004a75',
		PORT_ROUTE_TEST_COLOR: '#6d3c8e',
		PORT_OTHERWISE_COLOR: '#8c1b8a',
		PRE_PORT_COLOR: '#6b8e3f',
		POST_PORT_COLOR: '#a45c8d',
		CODE_MIRROR_ACTIVE_LINE_BACKGROUND_COLOR: 'rgba(255,255,255,0.06)'
	};
	const O23DarkTheme = createO23PlaygroundCssVars(O23DarkConstants);

	const createCss = (theme: Record<string, string | number>) => {
		return Object.keys(theme)
			.filter(key => typeof theme[key] === 'string' && theme[key].startsWith('var('))
			.map(key => {
				const parts = (theme[key] as string).split(',');
				return [parts[0], parts.slice(1).join(',').trim()];
			})
			.map(([p1, p2]) => [p1.substring(4), p2.slice(0, -1)])
			.map(([key, value]) => `${key}: ${value};`).join('\n');
	};

	return {
		n2Light: createCss(N2LightTheme),
		n2Dark: createCss(N2DarkTheme),
		d9Light: createCss(D9LightTheme),
		d9Dark: createCss(D9DarkTheme),
		o23Light: createCss(O23LightTheme),
		o23Dark: createCss(O23DarkTheme)
	};
};

const createGlobalStyles = () => {
	const {n2Light, n2Dark, d9Light, d9Dark, o23Light, o23Dark} = createThemeStyles();
	// noinspection CssUnresolvedCustomProperty,CssNoGenericFontName,CssUnusedSymbol
	return createGlobalStyle`
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
            --s2-top-border: 1px solid rgba(128, 128, 128, 0.35);
            ${n2Light}
            ${d9Light}
            ${o23Light}
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

            &.vscode-dark,
            &.vscode-high-contrast:not(.vscode-high-contrast-light) {
                ${n2Dark}
                ${d9Dark}
                ${o23Dark}
                --d9-playground-widget-declaration-splitter-color: #5f5f5f;
                --d9-playground-widget-declaration-attr-name-color: #569cd6;
                --d9-playground-ww-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.4);
                --d9-playground-ww-toolbar-filter: drop-shadow(2px 4px 6px rgb(255, 255, 255));
                --d9-playground-ww-toolbar-color: rgba(255, 255, 255, 0.6);
                --o23-playground-dialog-closer-icon-color: var(--d9-font-color);

                #root > div[data-w=d9-page] {
                    > div[data-w=o23-playground] {
                        div[data-w=o23-playground-edit-dialog-closer] {
                            background: var(--d9-background-color);
                            padding: 8px 16px 0 32px;
                            right: -16px;
                            margin-top: -8px;
                        }
                    }
                }
            }
        }

        *, *:before, *:after {
            box-sizing: border-box;
        }

        #root > div[data-w=d9-page] {
            height: 100vh;

            > div[data-w=d9-playground], > div[data-w=o23-playground] {
                border: 0;
                border-top: var(--s2-top-border);
                border-radius: 0;
                height: 100%;
                min-height: 100%;

                div.cm-editor > div.cm-scroller {
                    > div.cm-gutters {
                        background-color: var(--d9-background-color);
                    }
                }
            }

            > div[data-w=d9-playground] {
                div[data-w=d9-playground-editor-panel] > div.cm-editor > div.cm-scroller {
                    border-right: var(--d9-border);
                }
            }
        }
	`;
};
export const GlobalStyles = createGlobalStyles();