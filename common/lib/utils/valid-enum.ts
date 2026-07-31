export function validateEnumValues<T extends Record<string, string>>(
  enumObject: T,
  values: any[],
): T[keyof T][] {
  const allowedValues = new Set(Object.values(enumObject));

  const invalidValues = values.filter((v) => !allowedValues.has(v));

  if (invalidValues.length > 0) {
    throw new Error(`Invalid enum values: ${invalidValues.join(', ')}`);
  }

  return values as T[keyof T][];
}
