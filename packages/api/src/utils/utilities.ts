export class Utilities {
  /**
   * Get property name of a type. Helps to avoid hardcoding property names
   * @param type Class or Type
   * @example const propName = getTypePropertyName(User).username;
   */
  public static getPropertyName<T extends object>(type: { new (): T }): T {
    return new Proxy(new type(), {
      get(_, key) {
        return key;
      },
    });
  }
}
