import {
  DEFAULT_COLUMN_WIDTH,
  UI_COLUMN,
  DEFAULT_SORT_COLUMN_ID,
} from './constants/columns';
import defaults from './constants/defaultConfig.json';

function columnLabelMatches(uiColumn, label) {
  return (
    uiColumn.label === label || uiColumn.oldLabels?.includes(label)
  );
}

const getConfigurationColumnsWithDefaults = (configColumns) => {
  if (!Array.isArray(configColumns)) {
    console.info(
      "The columns config in config.json is invalid, ensure it's an array and try again"
    );
    return defaults.COLUMNS;
  }

  // Deprecated support for array of strings
  if (typeof configColumns[0] === 'string') {
    return configColumns.map((columnLabel) => {
      const foundColumn = defaults.COLUMNS.find(
        (defaultColumn) => defaultColumn.label === columnLabel
      );
      if (!foundColumn) {
        console.warn(`${columnLabel} in config.json is not recognized`);
      }
      const width = foundColumn?.width || DEFAULT_COLUMN_WIDTH;
      return {
        label: columnLabel,
        width,
        enabled: true,
      };
    });
  }

  // Ignore potential id from config.json
  // eslint-disable-next-line no-unused-vars
  return configColumns.map(({ id, ...configColumn }) => configColumn);
};

async function fetchConfigJson() {
  for (const url of ['./config.json', './config.json.defaults']) {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    }
  }

  console.info(
    '未找到 config.json，已使用内置默认配置。\n详见 https://github.com/Nanako718/flood-for-transmission#配置'
  );
  return {};
}

export default await fetchConfigJson()
  .then((config) => ({ ...defaults, ...config }))
  .catch((error) => {
    console.error('加载 config.json 失败', error);
    return defaults;
  })
  .then((configWithDefaults) => {
    const completeConfig = { ...configWithDefaults };
    const safeConfigColumns = getConfigurationColumnsWithDefaults(
      configWithDefaults.COLUMNS
    );
    completeConfig.COLUMNS = Object.values(UI_COLUMN)
      .map((uiColumn) => {
        const configColumn =
          safeConfigColumns.find((configColumn) =>
            columnLabelMatches(uiColumn, configColumn.label)
          ) || {};
        return {
          ...uiColumn,
          ...configColumn,
          // Uses enabled key when present, but defaults to true when column is present in config
          enabled: configColumn.enabled ?? !!configColumn.label,
        };
      })
      .sort((a, b) => {
        const aIndex = safeConfigColumns.findIndex(
          (configColumn) => configColumn.label === a.label
        );
        const bIndex = safeConfigColumns.findIndex(
          (configColumn) => configColumn.label === b.label
        );
        // Sort by enabled items first, then by the index of the column from the config
        return b.enabled - a.enabled || aIndex - bIndex;
      });

    completeConfig.SORT_COLUMN =
      Object.values(UI_COLUMN).find((column) =>
        columnLabelMatches(column, completeConfig.SORT_COLUMN)
      )?.id || DEFAULT_SORT_COLUMN_ID;
    return completeConfig;
  });
