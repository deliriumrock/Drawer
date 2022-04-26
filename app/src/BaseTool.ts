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

  protected frameSelectedSprite: PIXI.Sprite;

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
    sprite = sprite || this.backgroundSprite;
    sprite.tint = ApplicationSettings.PAINT_COLORS[colorIndex || 0];
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

  protected addSpritesToStage(isEraser?: boolean): void {
    this.stage.addChild(this.backgroundSprite);
    this.stage.addChild(this.frameSprite);
    this.stage.addChild(this.iconSprite);

    BaseTool.toolsFrameSet.add(this.frameSprite);
    !isEraser && BaseTool.toolsBackgroundSet.add(this.backgroundSprite);
  }

  protected changeToolsState(event?: any): void {
    event && event.stopPropagation();

    BaseTool.toolsFrameSet.forEach((sprite) => {
      this.setInactiveState(sprite);
    });

    this.toggleActiveState();
  }

  protected changeToolsBackground(): void {
    BaseTool.toolsBackgroundSet.forEach((sprite) => {
      this.setToolBackgroundColor(this.activeElement, sprite);
    });
  }

  protected setActiveElement(index: number): void {
    this.activeElement = index;
  }

  protected createFrameSelectedSprite(stage: PIXI.Container, isBrush: boolean = false): void {
    let frame = new PIXI.Graphics();
    frame.lineStyle(3, ApplicationSettings.TOOL_ACTIVE_FRAME_COLOR, 1, 1);
    frame.beginFill(0, 0);

    if (isBrush) {
      frame.drawRect(0, 0, ApplicationSettings.TOOL_BRUSH_WIDTH, ApplicationSettings.TOOL_BRUSH_HEIGHT);
    } else {
      frame.drawCircle(0, 0, ApplicationSettings.TOOL_PENCIL_SIZE);
    }

    frame.endFill();

    let texture: PIXI.Texture = this.drawService.app.renderer.generateTexture(frame, PIXI.SCALE_MODES.LINEAR, 1);

    this.frameSelectedSprite = new PIXI.Sprite(texture);
    this.frameSelectedSprite.anchor.set(0.5);
    this.frameSelectedSprite.position.set(-100, -100);

    stage.addChild(this.frameSelectedSprite);
  }

  protected selectElement(event: any): void {
    event.stopPropagation();
    this.setActiveElement(+event.currentTarget.name);
    this.frameSelectedSprite.position.set(event.currentTarget.position.x, event.currentTarget.position.y);
    // this.windowManager.closeWindow();
  }

  protected createPaintSprite(position: PIXI.Point, isBrush: boolean = false, isEraser: boolean = false): PIXI.Sprite {
    let paintTexture: PIXI.Texture;

    if (isBrush) {
      let brushName: string = `brush${this.activeElement}`;

      this.paintSprite = new PIXI.Sprite(this.drawService.resources[brushName].texture);
      this.paintSprite.alpha = this.drawService.activeBrushAlfa;
      this.paintSprite.width = ApplicationSettings.TOOL_BRUSH_WIDTH;
      this.paintSprite.height = ApplicationSettings.TOOL_BRUSH_HEIGHT;
      this.paintSprite.tint = ApplicationSettings.PAINT_COLORS[this.drawService.activeColor];
    } else {
      let pencil: PIXI.Graphics = new PIXI.Graphics();
      pencil.beginFill(ApplicationSettings.PAINT_COLORS[this.activeElement], 1);
      pencil.drawCircle(0, 0, ApplicationSettings.TOOL_PENCIL_SIZE);
      pencil.endFill();

      paintTexture = this.drawService.app.renderer.generateTexture(pencil, PIXI.SCALE_MODES.LINEAR, 1);

      this.paintSprite = new PIXI.Sprite(isEraser ? this.drawService.resources.eraserBrush.texture : paintTexture);
    }

    this.paintSprite.anchor.set(0.5);
    this.paintSprite.position = position;

    return this.paintSprite;
  }
}