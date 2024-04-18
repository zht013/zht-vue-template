/** 等待 */
export function sleep(timems: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, timems))
}
