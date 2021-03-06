export default class ApplicationSettings {
  public static readonly APP_WIDTH: number = 800;
  public static readonly APP_HEIGHT: number = 600;
  public static readonly WINDOW_FRAME_COLOR: number = 0xC4C4C4;
  public static readonly WINDOW_BACKGROUND_COLOR: number = 0xf8f8f8;
  public static readonly WINDOW_TITLE_COLOR: string = '#313131';
  public static readonly TOOL_FRAME_COLOR: number = 0x313131;
  public static readonly TOOL_ACTIVE_FRAME_COLOR: number = 0xff8a00;

  public static readonly TOOL_FRAME_SIZE: number = 96;

  public static readonly TOOL_PENCIL_SIZE: number = 30;
  public static readonly TOOL_BRUSH_WIDTH: number = 87;
  public static readonly TOOL_BRUSH_HEIGHT: number = 64;

  public static readonly SLIDER_LINE_WIDTH: number = 200;
  public static readonly SLIDER_WIDTH: number = 16;

  public static readonly FILE_NAME: string = 'my_masterpiece';

  public static readonly PAINT_COLORS: number[] = [
    0xFF0000,   // red
    0xFFFF00,   // yellow
    0x00FF00,   // green
    0x00FFFF,   // cyan
    0x0000FF,   // blue
    0xFF00FF    // magenta
  ];

  public static readonly APP_TEXTURES: any[] = [
    {
      name: 'buttonClose',
      url: '/assets/btn_close_window.png'
    },
    {
      name: 'slider',
      url: '/assets/slider.png'
    },
    {
      name: 'iconBrushTool',
      url: '/assets/icon_brush_tool.png'
    },
    {
      name: 'iconEraserTool',
      url: '/assets/icon_eraser_tool.png'
    },
    {
      name: 'iconPencilTool',
      url: '/assets/icon_pencil_tool.png'
    }
  ];

  public static readonly APP_BRUSHES: any[] = [
    {
      name: 'brush0',
      url: '/assets/brushes/brush0.png'
    },
    {
      name: 'brush1',
      url: '/assets/brushes/brush1.png'
    },
    {
      name: 'brush2',
      url: '/assets/brushes/brush2.png'
    },
    {
      name: 'brush3',
      url: '/assets/brushes/brush3.png'
    },
    {
      name: 'brush4',
      url: '/assets/brushes/brush4.png'
    },
    {
      name: 'brush5',
      url: '/assets/brushes/brush5.png'
    },
    {
      name: 'eraserBrush',
      url: '/assets/brushes/eraser_brush.png'
    }
  ];
}
