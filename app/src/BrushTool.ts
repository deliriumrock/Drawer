import * as PIXI from 'pixi.js';
import DrawerService from "./DrawerService";
import BaseTool from "./BaseTool";
import ApplicationSettings from "./ApplicationSettings";

export default class BrushTool extends BaseTool {
  private isSlide: boolean = false;
  private sliderGlobalStarX: number;
  private sliderGlobalEndX: number;
  private brushPreviewSprites: Array<PIXI.Sprite> = [];

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
      { x: -130, y: -60},
      { x: 0, y: -60},
      { x: 130, y: -60},
      { x: -130, y: 30},
      { x: 0, y: 30},
      { x: 130, y: 30}
    ];

    this.brushPreviewSprites = [];
    this.toolsWindowContainer = this.windowManager.createWindow('Choose brush:', null, null, 430,300);
    this.createSlider(this.toolsWindowContainer);

    this.createFrameSelectedSprite(this.toolsWindowContainer, true);

    for (let i = 0; i < ApplicationSettings.PAINT_COLORS.length; i++) {
      let x: number = this.drawService.screenWidth / 2 + arrColorsPosition[i].x;
      let y: number = this.drawService.screenHeight / 2 + arrColorsPosition[i].y;
      let brushName: string = `brush${i}`;

      let sprite: PIXI.Sprite = new PIXI.Sprite(this.drawService.resources[brushName].texture);
      sprite.alpha = this.drawService.activeBrushAlfa;
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

      this.brushPreviewSprites.push(sprite);

      this.toolsWindowContainer.addChild(sprite);
    }
  }

  private createSlider(container: PIXI.Container): void {
    let sliderLine: PIXI.Graphics = new PIXI.Graphics();
    sliderLine.lineStyle(4, ApplicationSettings.WINDOW_FRAME_COLOR, 1, 1);
    sliderLine.beginFill(0, 0);
    sliderLine.moveTo(
      this.drawService.screenWidth / 2 - ApplicationSettings.SLIDER_LINE_WIDTH / 2,
      this.drawService.screenHeight / 2 + 120);
    sliderLine.lineTo(
      this.drawService.screenWidth / 2 + ApplicationSettings.SLIDER_LINE_WIDTH / 2,
      this.drawService.screenHeight / 2 + 120);
    sliderLine.endFill();

    container.addChild(sliderLine);

    let slider: PIXI.Graphics = new PIXI.Graphics();
    slider.beginFill(ApplicationSettings.TOOL_FRAME_COLOR, 1);
    slider.drawRect(
      this.drawService.screenWidth / 2 - ApplicationSettings.SLIDER_LINE_WIDTH / 2,
      this.drawService.screenHeight / 2 + 104,
      ApplicationSettings.SLIDER_WIDTH,
      ApplicationSettings.SLIDER_HEIGHT);
    slider.endFill();

    this.sliderGlobalStarX = this.drawService.screenWidth / 2 - ApplicationSettings.SLIDER_LINE_WIDTH / 2;
    this.sliderGlobalEndX = this.drawService.screenWidth / 2
                            + (ApplicationSettings.SLIDER_LINE_WIDTH / 2 - ApplicationSettings.SLIDER_WIDTH)
                            - this.sliderGlobalStarX;

    slider.name = "slider";
    slider.interactive = true;
    slider.buttonMode = true;
    slider.on('pointerdown', this.sliderStart, this);
    slider.on('pointermove', this.sliderMove, this);
    slider.on('pointerup', this.sliderStop, this);

    container.addChild(slider);
  }

  private sliderStart(event: any): void {
    event.stopPropagation();

    this.isSlide = true;
  }

  private sliderMove(event: any): void {
    event.stopPropagation();

    if (!this.isSlide) return;

    event.currentTarget.x = event.data.global.x - this.sliderGlobalStarX;
    this.drawService.activeBrushAlfa = 1 - (event.data.global.x - this.sliderGlobalStarX) / 200;

    if ((event.data.global.x - this.sliderGlobalStarX) <= 0) {
      event.currentTarget.x = 0;
      this.drawService.activeBrushAlfa = 1;
    }

    if ((event.data.global.x - this.sliderGlobalStarX) >= this.sliderGlobalEndX) {
      event.currentTarget.x = this.sliderGlobalEndX;
      this.drawService.activeBrushAlfa = 0;
    }

    this.brushPreviewSprites.forEach((sprite) => sprite.alpha = this.drawService.activeBrushAlfa);
  }

  private sliderStop(event: any): void {
    event.stopPropagation();

    this.isSlide = false;
  }
}