import * as PIXI from 'pixi.js';
import DrawerService from "./DrawerService";
import BaseTool from "./BaseTool";

export default class BrushTool extends BaseTool {
  constructor(protected drawService: DrawerService, protected x: number, protected y: number, isActive?: boolean) {
    super(drawService, x, y, isActive);

    this.init();
  }

  public setToolColor() {

  }

  public getPaintSprite(position: PIXI.Point): PIXI.Sprite {
    return super.createPaintSprite(position, true);
  }

  protected init(): void {
    super.init();

    this.createBackgroundSprite();
    this.createFrameSprite();
    this.createIconSprite(this.drawService.resources.iconBrushTool.texture);
    this.addSpritesToStage();
  }

  protected changeToolsState(event: any): void {
    event.stopPropagation();
    super.changeToolsState();
    this.drawService.setActiveTool(this);
  }

  protected setActiveElement(index: number) {
    super.setActiveElement(index);
    this.drawService.activeBrush = index;
  }

  private createToolsWindow() {
    this.toolsWindowContainer = this.windowManager.createWindow('Choose brush:', null, null, 431,268);
  }
}