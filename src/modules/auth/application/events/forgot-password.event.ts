export class ForgotPasswordEvent {
    constructor(public readonly userId: string, public readonly email: string) { }
}
