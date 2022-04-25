import * as PIXI from 'pixi.js';
import WindowManager from "./WindowManager";
import DrawerService from "./DrawerService";
import ApplicationSettings from "./ApplicationSettings";

export default class BaseTool {
  protected static toolsFrameSet: Set<PIXI.Sprite> = new Set();
  protected static toolsBackgroundSet: Set<PIXI.Sprite> = new Set();

  public activeElement: number = 0;

  protected windowManager: WindowManager;

  protected stage: PIXI.Container;
  protected toolsWindowContainer: PIXI.Container;

  protected backgroundSprite: PIXI.Sprite;
  protected frameSprite: PIXI.Sprite;
  protected iconSprite: PIXI.Sprite;
  protected activeFrameTexture: PIXI.Texture;
  protected inactiveFrameTexture: PIXI.Texture;

  public paintSprite: PIXI.Sprite;

  protected isActive: boolean = false;

  constructor(protected drawService: DrawerService, protected x: number, protected y: number, isActive?: boolean) {
    this.windowManager = new WindowManager(this.drawService.app, this.drawService.resources);
    this.stage = this.drawService.app.stage;
    this.isActive = !!isActive;
  }

  protected init(): void {
    this.createActiveFrameTexture();
    this.createInactiveFrameTexture();
  }

  public toggleActiveState(frame?: PIXI.Sprite): void {
    this.isActive = !this.isActive;
    frame = frame || this.frameSprite;
    frame.texture = this.isActive
      ? this.activeFrameTexture
      : this.inactiveFrameTexture;
  }

  public setInactiveState(frame?: PIXI.Sprite): void {
    frame = frame || this.frameSprite;
    frame.texture = this.inactiveFrameTexture;
    this.isActive = false;
  }

  public setToolBackgroundColor(colorIndex?: number, sprite?: PIXI.Sprite) {
    sprite = sprite || this.backgroundSprite
    sprite.tint = ApplicationSettings.PAINT_COLORS[colorIndex? ApplicationSettings.PAINT_COLORS[colorIndex] : 0];
  }

  protected createInactiveFrameTexture(): void {
    let frame = new PIXI.Graphics();
    frame.lineStyle(1, ApplicationSettings.TOOL_FRAME_COLOR, 1, 1);
    frame.beginFill(0, 0);
    frame.drawRect(0, 0, ApplicationSettings.TOOL_FRAME_SIZE, ApplicationSettings.TOOL_FRAME_SIZE);
    frame.endFill();

    this.inactiveFrameTexture = this.drawService.app.renderer.generateTexture(frame, PIXI.SCALE_MODES.LINEAR, 1);
  }

  protected createActiveFrameTexture(): void {
    let frame = new PIXI.Graphics();
    frame.lineStyle(5, ApplicationSettings.TOOL_ACTIVE_FRAME_COLOR, 1, 1);
    frame.beginFill(0, 0);
    frame.drawRect(0, 0, ApplicationSettings.TOOL_FRAME_SIZE, ApplicationSettings.TOOL_FRAME_SIZE);
    frame.endFill();

    this.activeFrameTexture = this.drawService.app.renderer.generateTexture(frame, PIXI.SCALE_MODES.LINEAR, 1);
  }

  protected createBackgroundSprite(isNeedTint: boolean = true): void {
    this.backgroundSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.backgroundSprite.anchor.set(0.5);
    this.backgroundSprite.position.set(this.x, this.y);
    this.backgroundSprite.width = ApplicationSettings.TOOL_FRAME_SIZE;
    this.backgroundSprite.height = ApplicationSettings.TOOL_FRAME_SIZE;
    isNeedTint && (this.backgroundSprite.tint = ApplicationSettings.PAINT_COLORS[this.activeElement]);
  }

  protected createFrameSprite(): void {
    this.frameSprite = new PIXI.Sprite(this.isActive ? this.activeFrameTexture : this.inactiveFrameTexture);
    this.frameSprite.anchor.set(0.5);
    this.frameSprite.position.set(this.x, this.y);
  }

  protected createIconSprite(texture: PIXI.Texture): void {
    this.iconSprite = new PIXI.Sprite(texture);
    this.iconSprite.anchor.set(0.5);
    this.iconSprite.position.set(this.x, this.y);
    this.iconSprite.interactive = true;
    this.iconSprite.buttonMode = true;

    this.iconSprite.on("pointerdown", this.changeToolsState, this);
  }

  protected addSpritesToStage(): void {
    this.stage.addChild(this.backgroundSprite);
    this.stage.addChild(this.frameSprite);
    this.stage.addChild(this.iconSprite);

    BaseTool.toolsFrameSet.add(this.frameSprite);
    BaseTool.toolsBackgroundSet.add(this.backgroundSprite);
  }

  protected changeToolsState(event?: any): void {
    BaseTool.toolsFrameSet.forEach((sprite) => {
      this.setInactiveState(sprite);
    });

    this.toggleActiveState();
  }

  protected changeToolsBackground(event?: any): void {
    BaseTool.toolsBackgroundSet.forEach((sprite) => {
      this.setToolBackgroundColor(this.activeElement, sprite);
    });

    this.toggleActiveState();
  }

  protected setActiveElement(index: number): void {
    this.activeElement = index;
  }

  protected createPaintSprite(position: PIXI.Point, isBrush: boolean = false, isEraser: boolean = false): PIXI.Sprite {
    let paintTexture: PIXI.Texture;

    if (!isBrush) {
      let pencil: PIXI.Graphics = new PIXI.Graphics();
      pencil.beginFill(isEraser ? 0xFFFFFF : ApplicationSettings.PAINT_COLORS[this.activeElement]);
      isEraser ? pencil.drawRect(0, 0, 60, 60) : pencil.drawCircle(0, 0, 30);
      pencil.endFill();

      paintTexture = this.drawService.app.renderer.generateTexture(pencil, PIXI.SCALE_MODES.LINEAR, 1);
      this.paintSprite = new PIXI.Sprite(paintTexture);
    } else {
      let brushColor: any = new PIXI.filters.ColorMatrixFilter();
      let brushName: string = 'brush' + this.activeElement;

      const tint: number = ApplicationSettings.PAINT_COLORS[this.activeElement];
      const r: number = tint >> 16 & 0xFF;
      const g: number = tint >> 8 & 0xFF;
      const b: number = tint & 0xFF;

      brushColor.matrix[0] = r / 255;
      brushColor.matrix[6] = g / 255;
      brushColor.matrix[12] = b / 255;

      // this.paintSprite = PIXI.Sprite.from('assets/brushes/brush0.png');
      this.paintSprite = new PIXI.Sprite(this.drawService.resources['brush6'].texture);
      this.paintSprite.width = 87;
      this.paintSprite.height = 64;
      this.paintSprite.filters = [brushColor];
    }

    this.paintSprite.anchor.set(0.5);
    this.paintSprite.position = position;

    return this.paintSprite;
  }
}