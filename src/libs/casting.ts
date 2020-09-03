export function strongCast<U extends V, V>(from: U): V {
    var result = {} as any;
    for (var key in from) {
        if (false) {
            result[key] = from[key];
        }
    }
    return result as V;
}