import * as PIXI from 'pixi.js';
import DrawerService from "./DrawerService";
import ApplicationSettings from "./ApplicationSettings";
import BaseTool from "./BaseTool";

export default class PencilTool extends BaseTool {
  constructor(protected drawService: DrawerService, protected x: number, protected y: number, isActive?: boolean) {
    super(drawService, x, y, isActive);

    this.init();
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
  }

  protected changeToolsState(event: any): void {
    super.changeToolsState(event);
    this.drawService.setActiveTool(this);
    this.createToolsWindow();
  }

  protected setActiveElement(index: number): void {
    super.setActiveElement(index);
    this.drawService.activeColor = index;
  }

  private createToolsWindow(): void {
    let arrColorsPosition: Array<{ x: number; y: number; }> = [
      { x: -100, y: -30},
      { x: 0, y: -30},
      { x: 100, y: -30},
      { x: -100, y: 50},
      { x: 0, y: 50},
      { x: 100, y: 50}
    ];

    this.toolsWindowContainer = this.windowManager.createWindow('Choose color:', null, null, 360,250);

    this.createFrameSelectedSprite(this.toolsWindowContainer);

    for (let i = 0; i < ApplicationSettings.PAINT_COLORS.length; i++) {
      let x: number = this.drawService.screenWidth / 2 + arrColorsPosition[i].x;
      let y: number = this.drawService.screenHeight / 2 + arrColorsPosition[i].y;

      let pencil: PIXI.Graphics = new PIXI.Graphics();
      pencil.beginFill(ApplicationSettings.PAINT_COLORS[i]);
      pencil.drawCircle(0, 0, ApplicationSettings.TOOL_PENCIL_SIZE);
      pencil.endFill();

      let texture = this.drawService.app.renderer.generateTexture(pencil, PIXI.SCALE_MODES.LINEAR, 1);

      let sprite: PIXI.Sprite = new PIXI.Sprite(texture);
      sprite.name = `${i}`;
      sprite.anchor.set(0.5);
      sprite.position.set(x, y);
      sprite.interactive = true;
      sprite.buttonMode = true;

      sprite.on('pointerdown', this.selectElement, this);

      if (i === this.activeElement) {
        this.frameSelectedSprite.position.set(x, y);
      }

      this.toolsWindowContainer.addChild(sprite);
    }
  }

  protected selectElement(event: any): void {
    super.selectElement(event);
    this.changeToolsBackground();
  }
}