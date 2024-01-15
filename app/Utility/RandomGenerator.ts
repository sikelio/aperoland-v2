import crypto from 'crypto';

export default class RandomGenerator {
	public static generateJoinCode(): string {
		const now: string = Date.now().toString(36);
		const random: string = Math.random().toString(36).slice(2, 7);

		return now + random;
	}

  public static generateState(lenght: number): string {
    return crypto.randomBytes(lenght).toString('hex');
  }
}
