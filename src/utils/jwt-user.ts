export class JWTUser {
  readonly id: string;
  readonly isAdmin: boolean;

  constructor(details: any) {
    this.id = details.id;
    this.isAdmin = details.isAdmin;
  }

  getId(): string {
    return this.id;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }
}
