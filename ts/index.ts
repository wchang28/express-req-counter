import * as events from "events";
import * as express from "express";

export interface IRequestCounter {
    readonly Counter: number;
    readonly Middleware: express.RequestHandler;
    on(event: "change", listener: (counter: number) => void) : this;
    on(event: "req-start", listener: (req: express.Request, res: express.Response) => void) : this;
    on(event: "req-end", listener: (aborted: boolean, req: express.Request, res: express.Response) => void) : this;
    on(event: "zero-count", listener: () => void) : this;
}

class RequestCounter extends events.EventEmitter implements IRequestCounter {
    private __counter: number;
    constructor() {
        super();
        this.__counter = 0;
    }
    get Counter(): number {return this.__counter;}
    get Middleware() : express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.__counter++;
            this.emit("change", this.__counter);
            this.emit("req-start", req, res);
            req.on("end", () => {
                this.__counter--;
                this.emit("change", this.__counter);
                this.emit("req-end", false, req, res);
                if (this.__counter === 0) this.emit("zero-count");
            });
            res.on("close", () => {
                this.__counter--;
                this.emit("change", this.__counter);
                this.emit("req-end", true, req, res);
                if (this.__counter === 0) this.emit("zero-count");
            });
            next();
        };
    }
}

export function get() : IRequestCounter {return new RequestCounter();}