import * as PIXI from 'pixi.js';
import DrawerService from "./DrawerService";
import BaseTool from "./BaseTool";
import ApplicationSettings from "./ApplicationSettings";

export default class BrushTool extends BaseTool {
  private isSlide: boolean = false;
  private sliderStartX: number;
  private sliderEndX: number;
  private sliderSelectedX: number;
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

  protected setActiveElement(index: number): void {
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

    for (let i: number = 0; i < ApplicationSettings.PAINT_COLORS.length; i++) {
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
    this.sliderSelectedX = (ApplicationSettings.SLIDER_LINE_WIDTH - ApplicationSettings.SLIDER_WIDTH) * (1 - this.drawService.activeBrushAlfa);
    this.sliderStartX = (this.drawService.screenWidth / 2 - ApplicationSettings.SLIDER_LINE_WIDTH / 2);
    this.sliderEndX = this.drawService.screenWidth / 2 + ApplicationSettings.SLIDER_LINE_WIDTH / 2;

    let sliderLine: PIXI.Graphics = new PIXI.Graphics();
    sliderLine.lineStyle(4, ApplicationSettings.WINDOW_FRAME_COLOR, 1, 1);
    sliderLine.beginFill(0, 0);
    sliderLine.moveTo(this.sliderStartX, this.drawService.screenHeight / 2 + 120);
    sliderLine.lineTo(this.sliderEndX, this.drawService.screenHeight / 2 + 120);
    sliderLine.endFill();

    let slider: PIXI.Sprite = new PIXI.Sprite(this.drawService.resources.slider.texture);
    slider.anchor.set(0.5);
    slider.position.set(this.sliderStartX + this.sliderSelectedX, this.drawService.screenHeight / 2 + 118);
    slider.interactive = true;
    slider.buttonMode = true;
    slider.on('pointerdown', this.sliderStart, this);
    slider.on('pointermove', this.sliderMove, this);
    slider.on('pointerup', this.sliderStop, this);

    container.addChild(sliderLine, slider);
  }

  private sliderStart(event: any): void {
    event.stopPropagation();

    this.isSlide = true;
  }

  private sliderMove(event: any): void {
    event.stopPropagation();

    if (!this.isSlide) return;

    event.currentTarget.x = event.data.global.x;
    this.sliderSelectedX = event.data.global.x - (this.drawService.screenWidth / 2 - ApplicationSettings.SLIDER_LINE_WIDTH / 2);
    this.drawService.activeBrushAlfa = 1 - this.sliderSelectedX / ApplicationSettings.SLIDER_LINE_WIDTH;

    if (event.currentTarget.x <= this.sliderStartX) {
      event.currentTarget.x = this.sliderStartX;
      this.drawService.activeBrushAlfa = 1;
    }

    if (event.currentTarget.x >= this.sliderEndX) {
      event.currentTarget.x = this.sliderEndX;
      this.drawService.activeBrushAlfa = 0;
    }

    this.brushPreviewSprites.forEach((sprite) => sprite.alpha = this.drawService.activeBrushAlfa);
  }

  private sliderStop(event: any): void {
    event.stopPropagation();

    this.isSlide = false;
  }
}