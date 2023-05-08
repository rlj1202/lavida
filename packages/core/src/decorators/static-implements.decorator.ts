/** Decorate some class with this to restrict some static declarations. */
export default function StaticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
