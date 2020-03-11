import { Action, InputValues } from "buurman-utils";
export interface Inputs extends InputValues {
    source: string;
    destination: string;
    variables: object;
}
export declare const run: Action<Inputs>;
