export class MalError {
    public readonly status: number;
    public readonly message:string;
    constructor(reason: string, status: number){
        this.message = reason;
        this.status = status;
    }
}
