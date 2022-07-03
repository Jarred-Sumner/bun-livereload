/**
 * Wrap a function with `bun-livereload` to automatically reload any imports
 * _inside_ the function the next time it is called.
 * @param callback The function to wrap.
 * @param log Whether to log the number of modules unloaded.
 * @returns The wrapped function.
 */
export function liveReload(callback: CallableFunction, log = false) {
  var registry = new Map([...Loader.registry.entries()]);
  function runWithLog() {
    if (Loader.registry.size !== registry.size) {
      var count = 0;
      for (let key of Loader.registry.keys()) {
        if (!registry.has(key)) {
          count++;
          Loader.registry.delete(key);
        }
      }
      if (count > 0) {
        console.info(`[bun-livereload] ${count} modules unloaded`);
      }
    }
  }

  function runWithoutLog() {
    if (Loader.registry.size !== registry.size) {
      for (let key of Loader.registry.keys()) {
        if (!registry.has(key)) {
          Loader.registry.delete(key);
        }
      }
    }
  }

  var reload = log ? runWithLog : runWithoutLog;

  const isAsync = callback?.constructor?.name === "AsyncFunction";

  if (isAsync) {
    return async (...args) => {
      try {
        return await callback(...args);
      } catch (e) {
        throw e;
      } finally {
        reload();
      }
    };
  } else {
    return (...args) => {
      try {
        return callback(...args);
      } catch (e) {
        throw e;
      } finally {
        reload();
      }
    };
  }
}
export default liveReload;
