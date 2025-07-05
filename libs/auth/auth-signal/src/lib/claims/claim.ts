export class Claim<T = unknown> {
  type: string;
  /** Claim payload */
  value: T;

  private constructor(type: string, value: T) {
    this.type = type;
    this.value = value;
  }

  /**
   * @param type Claim Identifier
   * @param value Claim data
   */
  static Create<T = unknown>(type: string, value: T): Claim<T> {
    return new Claim(type, value);
  }
} //Cls
