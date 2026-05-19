/** Catppuccin Mocha 强调色，按标签名哈希稳定取色 */
const LABEL_RGB_PALETTE = [
  '203, 166, 247', /* mauve */
  '137, 180, 250', /* blue */
  '166, 227, 161', /* green */
  '250, 179, 135', /* peach */
  '245, 194, 231', /* pink */
  '116, 199, 236', /* sapphire */
  '148, 226, 213', /* teal */
  '249, 226, 175', /* yellow */
  '180, 190, 254', /* lavender */
  '137, 220, 235', /* sky */
  '235, 160, 172', /* maroon */
  '243, 139, 168', /* red */
];

function hashLabel(label) {
  let hash = 0;
  const text = String(label);
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getLabelRgb(label) {
  return LABEL_RGB_PALETTE[hashLabel(label) % LABEL_RGB_PALETTE.length];
}

export function getLabelInlineStyle(label, { muted = false } = {}) {
  const rgb = getLabelRgb(label);
  const bgAlpha = muted ? 0.14 : 0.24;
  const borderAlpha = muted ? 0.35 : 0.58;
  return [
    `background-color: rgba(${rgb}, ${bgAlpha})`,
    `color: rgb(${rgb})`,
    `border-color: rgba(${rgb}, ${borderAlpha})`,
  ].join('; ');
}
