/// <reference types="express" />
import * as express from "express";
export interface IRequestCounter {
    readonly Counter: number;
    readonly Middleware: express.RequestHandler;
    on(event: "change", listener: (counter: number) => void): this;
    on(event: "req-start", listener: (req: express.Request, res: express.Response) => void): this;
    on(event: "req-end", listener: (aborted: boolean, req: express.Request, res: express.Response) => void): this;
    on(event: "zero-count", listener: () => void): this;
}
export declare function get(): IRequestCounter;
