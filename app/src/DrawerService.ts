import * as PIXI from 'pixi.js';
import ApplicationSettings from "./ApplicationSettings";
import PencilTool from "./PencilTool";
import BrushTool from "./BrushTool";
import EraserTool from "./EraserTool";

export default class DrawerService {
  public resources: any;
  public activeColor: number = 0;
  public activeBrush: number = 0;
  public activeBrushAlfa: number = 1;

  public screenWidth: number;
  public screenHeight: number;

  private readonly application: PIXI.Application;

  private brushesTool: BrushTool;
  private pencilTool: PencilTool;
  private eraserTool: EraserTool;

  private activeTool: BrushTool | PencilTool | EraserTool;

  private loaderAnimation: HTMLElement;

  private drawContainer: PIXI.Container;
  private paintSprite: PIXI.Sprite;

  private isDraw: boolean = false;

  constructor() {
    this.startLoaderAnimation();

    PIXI.settings.ROUND_PIXELS = true;

    this.application = new PIXI.Application({
      view: <HTMLCanvasElement>document.getElementById('view'),
      width: ApplicationSettings.APP_WIDTH,
      height: ApplicationSettings.APP_HEIGHT,
      backgroundColor: 0xFFFFFF,
      resolution: window.devicePixelRatio || 1
    });

    this.screenWidth = this.app.screen.width;
    this.screenHeight = this.app.screen.height;

    this.app.stage.interactive = true;
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, this.screenWidth, this.screenHeight);
    
    this.app.stage.on('pointerdown', this.startDrawPaint, this);
    this.app.stage.on('pointermove', this.drawPaint, this);
    this.app.stage.on('pointerup', this.stopDrawPaint, this);
    this.app.stage.on('pointerupoutside', this.stopDrawPaint, this)
    this.app.stage.on('pointerout',  this.stopDrawPaint, this);

    this.app.loader.add(ApplicationSettings.APP_TEXTURES);
    this.app.loader.add(ApplicationSettings.APP_BRUSHES);
    this.app.loader.load(this.init.bind(this));
  }

  init(loader: PIXI.Loader, resources: any): void {
    this.resources = resources;

    document.getElementById('title').addEventListener('click', this.saveToDisk.bind(this));

    this.pencilTool = new PencilTool(this, 736, 62, true);
    this.brushesTool = new BrushTool(this, 736, 173);
    this.eraserTool = new EraserTool(this, 736, 284);

    this.setActiveTool(this.pencilTool);
    this.stopLoaderAnimation();
  }

  get app(): PIXI.Application {
    return this.application;
  }

  public setActiveTool(tool: BrushTool | PencilTool | EraserTool) {
    this.activeTool = tool;
  }

  private startLoaderAnimation(): void {
    if (!this.loaderAnimation) {
      this.loaderAnimation = document.getElementById('spinner-pacman');
    }

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

    let paintSprite = this.activeTool.getPaintSprite(event.data.global);

    this.drawContainer.addChild(paintSprite);
  }

  private stopDrawPaint(event: any): void {
    if (!this.isDraw) return;

    this.isDraw = false;

    this.drawContainer.removeChildren(this.drawContainer.children.length - 1);
    this.rasterisation();
  }

  private createDrawLayer(position: PIXI.Point): void {
    if (this.drawContainer) {
      this.app.stage.children.shift();
      this.app.stage.children.push(this.drawContainer);
    } else {
      this.drawContainer = new PIXI.Container();
      this.drawContainer.width = this.screenWidth;
      this.drawContainer.height = this.screenHeight;
      this.drawContainer.x = 0;
      this.drawContainer.y = 0;
      this.drawContainer.zIndex = 1;

      this.app.stage.addChild(this.drawContainer);
    }

    this.paintSprite = this.activeTool.getPaintSprite(position);

    this.drawContainer.addChild(this.paintSprite);
  }

  private rasterisation(): void {
    let texture: PIXI.Texture = this.app.renderer.generateTexture(this.drawContainer,
                                                                  PIXI.SCALE_MODES.NEAREST,
                                                         1,
                                                                  new PIXI.Rectangle(0,
                                                                                     0,
                                                                                        this.screenWidth,
                                                                                        this.screenHeight));
    let sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = this.screenWidth / 2;
    sprite.y = this.screenHeight / 2;

    this.drawContainer.addChild(sprite);
    this.drawContainer.children.length > 2 && this.drawContainer.removeChildren(0, this.drawContainer.children.length - 2);

    this.app.stage.children.pop();
    this.app.stage.children.unshift(this.drawContainer);
  }

  private saveToDisk(): void {
    if (!this.drawContainer) return;

    let whiteBackground: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    whiteBackground.width = this.screenWidth;
    whiteBackground.height = this.screenHeight;
    whiteBackground.position.set(0, 0);
    this.drawContainer.addChildAt(whiteBackground, 0);

    this.app.renderer.plugins.extract.canvas(this.drawContainer).toBlob((blob: Blob) => {
      let aElement: HTMLAnchorElement = document.createElement("a");

      document.body.append(aElement);
      aElement.download = ApplicationSettings.FILE_NAME;
      aElement.href = URL.createObjectURL(blob);
      aElement.click();
      aElement.remove();
      this.drawContainer.removeChild(whiteBackground);
    }, "image/png");
  }
}