export async function asyncWrapper<T>(func: Promise<T>): Promise<[T | null, Error | null]> {
    try {
      const data = await func;
      return [data, null];
    } catch(error: any) {
      return [null, error];
    }
  }