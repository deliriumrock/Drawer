export default class ApplicationSettings {
  public static readonly WINDOW_FRAME_COLOR: number = 0xC4C4C4;
  public static readonly WINDOW_BACKGROUND_COLOR: number = 0xFAFAFA;
  public static readonly WINDOW_TITLE_COLOR: string = '#313131';
  public static readonly TOOL_FRAME_COLOR: number = 0x313131;
  public static readonly TOOL_ACTIVE_FRAME_COLOR: number = 0xa200ff;

  public static readonly TOOL_FRAME_SIZE: number = 96;

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
      name: 'brush6',
      url: '/assets/brushes/brush6.png'
    }
  ];
}
