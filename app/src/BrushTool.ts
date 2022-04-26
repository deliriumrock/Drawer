import * as PIXI from 'pixi.js';
import DrawerService from "./DrawerService";
import BaseTool from "./BaseTool";
import ApplicationSettings from "./ApplicationSettings";

export default class BrushTool extends BaseTool {
  constructor(protected drawService: DrawerService, protected x: number, protected y: number, isActive?: boolean) {
    super(drawService, x, y, isActive);

    this.init();
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
    super.changeToolsState(event);
    this.drawService.setActiveTool(this);
    this.createToolsWindow();
  }

  protected setActiveElement(index: number) {
    super.setActiveElement(index);
    this.drawService.activeBrush = index;
  }

  private createToolsWindow(): void {
    let arrColorsPosition: Array<{ x: number; y: number; }> = [
      { x: -130, y: -30},
      { x: 0, y: -30},
      { x: 130, y: -30},
      { x: -130, y: 50},
      { x: 0, y: 50},
      { x: 130, y: 50}
    ];

    this.toolsWindowContainer = this.windowManager.createWindow('Choose brush:', null, null, 430,260);

    this.createFrameSelectedSprite(this.toolsWindowContainer, true);

    for (let i = 0; i < ApplicationSettings.PAINT_COLORS.length; i++) {
      let x: number = this.drawService.screenWidth / 2 + arrColorsPosition[i].x;
      let y: number = this.drawService.screenHeight / 2 + arrColorsPosition[i].y;
      let brushName: string = `brush${i}`;

      let sprite: PIXI.Sprite = new PIXI.Sprite(this.drawService.resources[brushName].texture);
      sprite.name = `${i}`;
      sprite.anchor.set(0.5);
      sprite.position.set(x, y);
      sprite.interactive = true;
      sprite.buttonMode = true;
      sprite.tint = ApplicationSettings.PAINT_COLORS[this.drawService.activeColor];

      sprite.on('pointerdown', this.selectElement, this);

      if (i === this.activeElement) {
        this.frameSelectedSprite.position.set(x, y);
      }

      this.toolsWindowContainer.addChild(sprite);
    }
  }

}