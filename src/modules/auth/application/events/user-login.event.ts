export class UserLoginEvent {
    constructor(public readonly userId: string, public readonly email: string) { }
}
