import * as PIXI from 'pixi.js';
import WindowManager from "./WindowManager";
import DrawerService from "./DrawerService";
import ApplicationSettings from "./ApplicationSettings";
import BaseTool from "./BaseTool";

export default class EraserTool extends BaseTool {
  constructor(protected drawService: DrawerService, protected x: number, protected y: number, isActive?: boolean) {
    super(drawService, x, y, isActive);

    this.init();
  }

  public getPaintSprite(position: PIXI.Point): PIXI.Sprite {
    return super.createPaintSprite(position, false, true);
  }

  protected init(): void {
    super.init();

    this.createBackgroundSprite(false);
    this.createFrameSprite();
    this.createIconSprite(this.drawService.resources.iconEraserTool.texture);

    this.addSpritesToStage();
  }

  protected changeToolsState(event: any): void {
    event.stopPropagation();
    super.changeToolsState();
    this.drawService.setActiveTool(this);
  }
}