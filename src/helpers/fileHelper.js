import { alerts } from '~helpers/stores';

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const getFileAddBody = (files, start, destination) => {
  const promises = files.map((file) => toBase64(file));
  return Promise.all(promises).then((base64Files) =>
    base64Files.map((base64File) => ({
      'metainfo': base64File,
      'paused': !start,
      'download-dir': destination,
    }))
  );
};

export const handleTorrentAddResponses = (responses) => {
  const duplicateResponses = responses
    .map((response) => response.arguments['torrent-duplicate'])
    .filter(Boolean);
  if (!duplicateResponses.length) {
    alerts.add(`已成功添加 ${responses.length} 个种子`);
  } else if (duplicateResponses.length === responses.length) {
    alerts.add('上传的种子均已存在', 'negative');
  } else {
    const successCount = responses.length - duplicateResponses.length;
    alerts.add(
      `已成功添加 ${successCount} 个种子，另有 ${duplicateResponses.length} 个已存在`,
      'negative'
    );
  }
};

export const areAllFilesValid = (files, acceptList) => {
  return files.every((file) => {
    const splitName = file.name.split('.');
    const extension = `.${splitName[splitName.length - 1]}`;
    return acceptList.some((type) => type === file.type || type === extension);
  });
};
