import {ModelUtilsType, PropertyPathUtilsType, ValueUtilsType} from '@rainbow-d9/n1';

declare global {
	interface VSCode {
		setState<T>(state: T): void;
		getState<T>(): T;
		postMessage<T>(msg: T): void;
	}

	interface Window {
		PPUtils: PropertyPathUtilsType;
		VUtils: ValueUtilsType;
		MUtils: ModelUtilsType;
		acquireVsCodeApi: () => VSCode;
	}
}
