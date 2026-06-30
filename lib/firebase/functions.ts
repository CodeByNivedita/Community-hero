import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./config";

const functions = getFunctions(app);

/**
 * Example wrapper to call a Firebase Cloud Function.
 */
export const callCloudFunction = async <T, R>(functionName: string, data?: T): Promise<R> => {
  const fn = httpsCallable<T, R>(functions, functionName);
  const result = await fn(data);
  return result.data;
};
