export default class OverlayPainter {
  ctx: CanvasRenderingContext2D | null = null;
  cvsWidth: number = 640;
  cvsHeight: number = 360;
  constructor() {

  }

  setContext(ctx: CanvasRenderingContext2D,
    width: number, height: number) {
    this.ctx = ctx;
    this.cvsWidth = width;
    this.cvsHeight = height;
  }

  paint() {
    this.overlay_text("test string");    
  }

  overlay_text(text: string) {
    if (!this.ctx) return;
    this.ctx.fillStyle = "white";
    this.ctx.font = "50px serif";
    this.ctx.fillText(text, 100, 100)
  }


}