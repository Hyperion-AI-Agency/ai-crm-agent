// @ts-nocheck

export function isObject(item: unknown): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

export default function deepMerge<T, R>(target: T, source?: R): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source as any).forEach(key => {
      if (isObject((source as any)[key])) {
        if (!(key in (target as any))) {
          Object.assign(output as any, { [key]: (source as any)[key] });
        } else {
          (output as any)[key] = deepMerge((target as any)[key], (source as any)[key]);
        }
      } else {
        Object.assign(output as any, { [key]: (source as any)[key] });
      }
    });
  }

  return output;
}
