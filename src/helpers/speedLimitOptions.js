import { getSize } from '~helpers/sizeHelper';

/**
 * @param {number | null} currentLimit bytes/s
 * @param {'download' | 'upload'} listId
 * @param {number} perSize
 */
export function buildSpeedLimitOptions(currentLimit, listId, perSize) {
  const speedLimits = [
    1,
    10,
    100,
    500,
    1 * perSize,
    2 * perSize,
    5 * perSize,
    10 * perSize,
  ];

  const options = speedLimits.map((speedLimit) => {
    const { value, size } = getSize(speedLimit, {
      isSpeed: true,
      startSize: 'kB',
      perSize,
    });
    return {
      name: `${value} ${size}/s`,
      value: speedLimit,
      list: listId,
      selected: currentLimit === speedLimit,
    };
  });

  options.push({
    name: '不限',
    value: null,
    list: listId,
    selected: currentLimit === null,
  });

  return options;
}
