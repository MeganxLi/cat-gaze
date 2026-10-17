export class HanaGlbViewer {
  constructor(canvas: HTMLCanvasElement, source: string, callbacks?: {
    onReady?: () => void
    onError?: (error: unknown) => void
    onPose?: (yaw: number, pitch: number) => void
  })
  aim(clientX: number, clientY: number): void
  setAngles(yaw: number, pitch: number): void
  setHeadOnly(value: boolean): void
  setWireframe(value: boolean): void
  destroy(): void
}
