export class ChangePasswordCommand {
    constructor(public readonly token: string, public readonly password: string) { }
}
