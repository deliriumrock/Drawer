import * as PIXI from 'pixi.js';
import DrawerService from "./DrawerService";
import ApplicationSettings from "./ApplicationSettings";
import BaseTool from "./BaseTool";

export default class PencilTool extends BaseTool {
  constructor(protected drawService: DrawerService, protected x: number, protected y: number, isActive?: boolean) {
    super(drawService, x, y, isActive);

    this.init();
  }

  public createToolColors() {
    this.createToolsWindow();


  }

  public getPaintSprite(position: PIXI.Point): PIXI.Sprite {
    return super.createPaintSprite(position);
  }

  protected init(): void {
    super.init();

    this.createBackgroundSprite();
    this.createFrameSprite();
    this.createIconSprite(this.drawService.resources.iconPencilTool.texture);
    this.addSpritesToStage();

    //this.createToolColors();
  }

  protected changeToolsState(event: any): void {
    event.stopPropagation();
    super.changeToolsState();
    this.drawService.setActiveTool(this);
  }

  protected changeToolsBackground(event: any): void {
    event.stopPropagation();
    super.changeToolsBackground();
  }

  protected setActiveElement(index: number) {
    super.setActiveElement(index);
    this.drawService.activeColor = index;
  }

  private createToolsWindow() {
    this.toolsWindowContainer = this.windowManager.createWindow('Choose color:');

    for (let i = 0; i < ApplicationSettings.PAINT_COLORS.length; i++) {

    }
  }

}