import {BridgeToRootEventTypes, useBridgeEventBus} from '@rainbow-d9/n1';
import {vscodeDark, vscodeLight} from '@uiw/codemirror-theme-vscode';
import {Fragment, MutableRefObject, useEffect} from 'react';
import {AppEventTypes, useAppEventBus} from './app-event-bus.tsx';
import {ThemeKind} from './types.ts';

export const getThemeFromDOM = (): ThemeKind => {
	const classList = document.body.classList;
	if (classList.contains('vscode-dark')) {
		return ThemeKind.DARK;
	} else if (classList.contains('vscode-light')) {
		return ThemeKind.LIGHT;
	} else if (classList.contains('vscode-high-contrast-light')) {
		return ThemeKind.HIGH_CONTRAST_LIGHT;
	} else if (classList.contains('vscode-high-contrast')) {
		return ThemeKind.HIGH_CONTRAST_DARK;
	} else {
		return ThemeKind.LIGHT;
	}
};
export const theme = (ref: MutableRefObject<ThemeKind>) => {
	return (theme?: string) => {
		const kind = theme || ref.current;

		switch (kind) {
			case ThemeKind.DARK:
			case ThemeKind.HIGH_CONTRAST_DARK:
				return vscodeDark;
			case ThemeKind.LIGHT:
			case ThemeKind.HIGH_CONTRAST_LIGHT:
			default:
				return vscodeLight;
		}
	};
};

export const ThemeHandler = (props: { theme: MutableRefObject<ThemeKind> }) => {
	const {theme} = props;

	const {on, off} = useAppEventBus();
	const {fire} = useBridgeEventBus();
	useEffect(() => {
		const onChangeTheme = (kind: ThemeKind) => {
			theme.current = kind;
			fire(BridgeToRootEventTypes.THEME_CHANGED, kind);
		};
		on(AppEventTypes.CHANGE_THEME, onChangeTheme);
		return () => {
			off(AppEventTypes.CHANGE_THEME, onChangeTheme);
		};
	}, [on, off, fire]);

	return <Fragment/>;
};