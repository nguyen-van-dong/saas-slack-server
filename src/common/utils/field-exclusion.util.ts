import { pick, omit } from 'lodash';

/**
 * Utility functions for field exclusion and data transformation using Lodash
 */

export function excludeFields<T extends Record<string, any>>(
  obj: T,
  fieldsToExclude: (keyof T)[]
): Partial<T> {
  return omit(obj, fieldsToExclude) as Partial<T>;
}

export function pickFields<T extends Record<string, any>>(
  obj: T,
  fieldsToPick: (keyof T)[]
): Partial<T> {
  return pick(obj, fieldsToPick);
}

export function transformUserResponse(user: any) {
  return pick(user, ['id', 'email', 'fullName']);
}
