export default class RandomGenerator {
  public static generateJoinCode() {
    const now = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 7);

    return now + random;
  }
}
