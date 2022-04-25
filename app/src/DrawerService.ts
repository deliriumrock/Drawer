import * as PIXI from 'pixi.js';
import ApplicationSettings from "./ApplicationSettings";
import PencilTool from "./PencilTool";
import BrushTool from "./BrushTool";
import EraserTool from "./EraserTool";

export default class DrawerService {
  public resources: any;
  public activeColor: number = 0;
  public activeBrush: number = 0;

  private readonly application: PIXI.Application;

  private brushesTool: BrushTool;
  private pencilTool: PencilTool;
  private eraserTool: EraserTool;

  private activeTool: BrushTool | PencilTool | EraserTool;

  private loaderAnimation: HTMLElement;

  private drawContainer: PIXI.Container;
  private paintSprite: PIXI.Sprite;
  private paintTexture: PIXI.Texture;
  private isDraw: boolean = false;

  constructor() {
    this.loaderAnimation = document.getElementById('spinner-pacman');
    this.startLoaderAnimation();

    this.application = new PIXI.Application({
      view: <HTMLCanvasElement>document.getElementById('view'),
      width: 800,
      height: 600,
      backgroundColor: 0xFFFFFF,
      resolution: window.devicePixelRatio || 1
    });

    this.app.stage.sortableChildren = true;
    this.app.stage.interactive = true;
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, this.app.screen.width, this.app.screen.height);
    
    this.app.stage.on('pointerdown', this.startDrawPaint.bind(this));
    this.app.stage.on('pointermove', this.drawPaint.bind(this));
    this.app.stage.on('pointerup', this.stopDrawPaint.bind(this));
    this.app.stage.on('pointerupoutside', this.stopDrawPaint.bind(this))
    this.app.stage.on('pointerout',  this.stopDrawPaint.bind(this));

    this.app.loader.add(ApplicationSettings.APP_TEXTURES);
    this.app.loader.add(ApplicationSettings.APP_BRUSHES);
    this.app.loader.load(this.init.bind(this));
  }

  init(loader: PIXI.Loader, resources: any): void {
    this.resources = resources;

    this.stopLoaderAnimation();

    this.pencilTool = new PencilTool(this, 736, 62, true);
    this.brushesTool = new BrushTool(this, 736, 173);
    this.eraserTool = new EraserTool(this, 736, 284);

    this.setActiveTool(this.pencilTool);
  }

  get app(): PIXI.Application {
    return this.application;
  }

  public setActiveTool(tool: BrushTool | PencilTool | EraserTool) {
    this.activeTool = tool;
  }

  private startLoaderAnimation(): void {
    this.loaderAnimation.classList.remove("fade-out");
    this.loaderAnimation.classList.add("fade-in");
  }

  private stopLoaderAnimation(): void {
    this.loaderAnimation.classList.remove("fade-in");
    this.loaderAnimation.classList.add("fade-out");
  }

  private startDrawPaint(event: any): void {
    this.isDraw = true;
    this.createDrawLayer(event.data.global);
  }

  private drawPaint(event: any): void {
    if (!this.isDraw) return;

    let paintSprite = new PIXI.Sprite(this.paintSprite.texture);
    paintSprite.anchor.set(0.5);
    paintSprite.position = event.data.global;

    this.drawContainer.addChild( paintSprite);
  }

  private stopDrawPaint(event: any): void {
    if (this.isDraw) {
      this.rasterisation();
    }

    this.isDraw = false;
  }

  private createDrawLayer(position: PIXI.Point): void {
    if (this.drawContainer) {
      this.app.stage.sortChildren();
    } else {
      this.drawContainer = new PIXI.Container();
      this.drawContainer.width = this.app.screen.width;
      this.drawContainer.height = this.app.screen.height;
      this.drawContainer.x = 0;
      this.drawContainer.y = 0;
      this.drawContainer.zIndex = 1;
    }

    this.paintSprite = this.activeTool.getPaintSprite(position);

    this.drawContainer.addChild(this.paintSprite);
    this.app.stage.addChild(this.drawContainer);
  }

  private rasterisation(): void {
    let texture: PIXI.Texture = this.app.renderer.generateTexture(this.drawContainer,
                                                                  PIXI.SCALE_MODES.LINEAR,
                                                         1,
                                                                  new PIXI.Rectangle(0,
                                                                                     0,
                                                                                        this.app.screen.width,
                                                                                        this.app.screen.height));
    let sprite = new PIXI.Sprite(texture);

    sprite.anchor.set(0.5);
    sprite.x = this.app.screen.width / 2;
    sprite.y = this.app.screen.height / 2;

    this.drawContainer.removeChildren();
    this.drawContainer.addChild(sprite);

    this.app.stage.children.pop();
    this.app.stage.children.unshift(this.drawContainer);
  }
}