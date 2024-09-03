import {ModelUtilsType, PropertyPathUtilsType, ValueUtilsType} from '@rainbow-d9/n1';

declare global {
	interface VSCode {
		setState<T = any>(state: T): void;
		getState<T>(): T;
	}

	interface Window {
		PPUtils: PropertyPathUtilsType;
		VUtils: ValueUtilsType;
		MUtils: ModelUtilsType;
		acquireVsCodeApi: () => VSCode;
	}
}
