// 是否是 rgb 色值
function isRgbColor(color: string) {
  return /^(rgb|RGB)/.test(color);
}
// 是否是 hsl 色值
function isHslColor(color: string) {
  return /^(hsl|HSL)/.test(color);
}

/**
 * 获取 rgb 颜色的 rgb 值
 * @param color 'rgb(255, 255, 255)'
 * @returns [255, 255, 255]
 */
function getRgbColorRgbValue(color: string) {
  return color
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item) => parseInt(item));
}

/**
 * 获取 hsl 颜色的 hsl 值
 * @param color 'hsl(40deg 90% 96%)'
 * @returns [0.1111111111111111, 0.9, 0.96] [h, s, l]
 */
function getHslColorHslValue(color: string) {
  const colors = color.replace(/(?:\(|\)|hsl|HSL)*/g, '').split(/\s+/);
  return [
    parseInt(colors[0], 10) / 360,
    parseInt(colors[1], 10) / 100,
    parseInt(colors[2], 10) / 100,
  ];
}
/**
 * 获取 hex 颜色的 rgb 值
 * @param color #fff
 * @returns [255, 255, 255]
 */
function getHexColorRgbValue(hexColor: string) {
  hexColor = hexColor.toLowerCase();
  //十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 不是 hex 标准色，直接返回黑色
  if (!hexColor || !reg.test(hexColor)) {
    return [0, 0, 0];
  }
  // 如果是 4 位 hex 颜色，先还原成标准的 7 位颜色
  if (hexColor.length === 4) {
    let sColorNew = '#';
    for (let i = 1; i < 4; i += 1) {
      sColorNew += hexColor.slice(i, i + 1).concat(hexColor.slice(i, i + 1));
    }
    hexColor = sColorNew;
  }
  //处理六位的颜色值
  let sColorChange = [];
  for (let i = 1; i < 7; i += 2) {
    sColorChange.push(parseInt('0x' + hexColor.slice(i, i + 2)));
  }
  return sColorChange;
}

/**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * @params [0-255, 0-255, 0-255]
 * @returns [0-1, 0-1, 0-1]
 */
function rgbToHsl(r: number, g: number, b: number) {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0;
  let s;
  let l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}
/**
 * HSL 颜色值转换为 RGB
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * @param   Number  h [0-1]       色相
 * @param   Number  s [0-1]       饱和度
 * @param   Number  l [0-1]       亮度
 * @returns [255, 255, 255]       RGB色值数值
 */
function hslToRgb(h: number, s: number, l: number) {
  var r, g, b;
  // 这个看不懂，理解为颜色转换就是这样定义的
  var hue2rgb = function (p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  // 饱和度为零，则 rgb 均为亮度数据
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
/**
 * 任意颜色转换为 rgb 值
 * @param color
 * @returns
 */
export function anyColorRgb(color: string) {
  if (isRgbColor(color)) {
    // rgb 颜色
    return getRgbColorRgbValue(color);
  } else if (isHslColor(color)) {
    // hsl 颜色
    const [h, s, l] = getHslColorHslValue(color);
    return hslToRgb(s, h, l);
  }
  return getHexColorRgbValue(color);
}
/**
 * 任意颜色转换成 hsl 值
 * @param color
 * @returns [0-1, 0-1, 0-1]
 */
export function anyColorToHsl(color: string) {
  if (isHslColor(color)) {
    // hsl 颜色
    return getHslColorHslValue(color);
  }
  let rgbValue = [];
  if (isRgbColor(color)) {
    // rgb 颜色
    rgbValue = getRgbColorRgbValue(color);
  } else {
    rgbValue = getHexColorRgbValue(color);
  }
  // 转换成 hsl
  return rgbToHsl(rgbValue[0], rgbValue[1], rgbValue[2]);
}
export function formartRgbToHex(r: number, g: number, b: number) {
  return [r, g, b].reduce((result, value) => {
    let newValue = value.toString(16);
    return result + (newValue.length > 1 ? newValue : '0' + newValue);
  }, '#');
}
export function formatHslToHex(h: number, s: number, l: number) {
  const [r, g, b] = hslToRgb(h, s, l);
  return formartRgbToHex(r, g, b);
}

/**
 * 任意颜色转换成 hex 格式
 * @param color rgb(255, 255, 255)   或  #fff
 * @returns #ffffff
 */
export function formatColorToHex(color: string) {
  const [r, g, b] = anyColorRgb(color);
  return formartRgbToHex(r, g, b);
}
