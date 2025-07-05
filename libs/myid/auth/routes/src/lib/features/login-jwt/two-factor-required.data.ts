export class TwoFactorRequiredData {
  constructor(
    public token?: string,
    public provider?: string
  ) { }
}
