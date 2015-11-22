namespace app {
    'use strict';

    export interface IReader {
        id: string;
    }

    export class Reader implements IReader {
        constructor(public id: string) {
        }
    }
}
