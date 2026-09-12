import { HydratedDocument } from 'mongoose';

export function formatMongoDocument<T>(document: HydratedDocument<T>) {
  const obj = document.toObject();
  const id = obj._id as string;
  delete obj._id;
  delete obj.__v;
  return {
    ...obj,
    id,
  };
}
