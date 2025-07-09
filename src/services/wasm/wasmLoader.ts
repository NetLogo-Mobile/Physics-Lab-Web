let wasmInstance: any = null;

/**
 * 单次加载wasm实例并复用
 * To load the WebAssembly instance only once and reuse it
 * @returns WebAssembly instance.
 */
export async function getWasmInstance() {
  if (!wasmInstance) {
    const pltxt2htm = (await import("./pltxt2htm.js")).default;
    wasmInstance = await pltxt2htm();
  }
  return wasmInstance;
}
