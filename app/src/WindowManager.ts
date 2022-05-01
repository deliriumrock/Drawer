import * as PIXI from 'pixi.js';
import ApplicationSettings from "./ApplicationSettings";

export default class WindowManager {
  private windowContainer: PIXI.Container;

  constructor(private application: PIXI.Application, private resources: any) {
  }

  createWindow(title: string, x?: number, y?: number, width?: number, height?: number): PIXI.Container {
    !x && (x = this.application.screen.width / 2);
    !y && (y = this.application.screen.height / 2);
    !width && (width = 300);
    !height && (height = 200);

    let windowFrame = new PIXI.Graphics();
    windowFrame.lineStyle(2, ApplicationSettings.WINDOW_FRAME_COLOR, 1);
    windowFrame.beginFill(ApplicationSettings.WINDOW_BACKGROUND_COLOR);
    windowFrame.drawRect(0, 0, width, height);
    windowFrame.endFill();

    let texture = this.application.renderer.generateTexture(windowFrame, PIXI.SCALE_MODES.LINEAR, 1);
    let window = new PIXI.Sprite(texture);
    window.anchor.set(0.5);
    window.position.set(x, y);
    window.interactive = true;

    window.on('pointerdown', (event: any): void => {
      event.stopPropagation();
    });

    const fontStyle = new PIXI.TextStyle({
      fill: ApplicationSettings.WINDOW_TITLE_COLOR,
      fontFamily: 'Arial',
      fontSize: 16,
      fontWeight: 'normal'
    });

    const windowTitle = new PIXI.Text(title, fontStyle);
    windowTitle.anchor.set(0.5);
    windowTitle.x = x;
    windowTitle.y = y - (height / 2 - 13);

    let buttonClose = new PIXI.Sprite(this.resources.buttonClose.texture);
    buttonClose.anchor.set(0.5);
    buttonClose.position.set(x + (width / 2 - 13), y - (height / 2 - 13));
    buttonClose.interactive = true;
    buttonClose.buttonMode = true;

    buttonClose.on("pointerdown", this.closeWindow, this);

    this.windowContainer = new PIXI.Container();
    this.windowContainer.width = this.application.screen.width;
    this.windowContainer.height = this.application.screen.height;
    this.windowContainer.position.set(0, 0);
    this.windowContainer.hitArea = new PIXI.Rectangle(0, 0, this.application.screen.width, this.application.screen.height);
    this.windowContainer.zIndex = 2;
    this.windowContainer.interactive = true;

    this.windowContainer.on("pointerdown", this.closeWindow, this);

    this.windowContainer.addChild(window);
    this.windowContainer.addChild(windowTitle);
    this.windowContainer.addChild(buttonClose);

    this.application.stage.addChild(this.windowContainer);

    return this.windowContainer;
  }

  public closeWindow(event?: any): void {
    if (event) {
      event.stopPropagation();
    }

    this.application.stage.removeChild(this.windowContainer);
    this.windowContainer = null;
  }
}