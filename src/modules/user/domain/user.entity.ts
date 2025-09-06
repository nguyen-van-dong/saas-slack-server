export class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly fullName: string,
        public readonly password: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly isActive: boolean,
        public readonly resetPasswordExpires: Date | null,
        public readonly resetPasswordToken: string | null,
    ) { }
}
