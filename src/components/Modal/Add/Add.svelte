<script>
  import InputMultiple from '~components/InputMultiple';
  import InputPath from '~components/InputPath';
  import InputFile from '~components/InputFile';
  import Icon from '~components/Icon';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { modals, torrents, alerts, session } from '~helpers/stores';
  import { isValidUrl } from '~helpers/urlHelper';
  import {
    SESSION_COLUMN_DOWNLOAD_DIR,
    SESSION_COLUMN_START_ADDED,
  } from '~helpers/constants/columns';
  import { PATH_VALIDATION_REGEX } from '~helpers/constants/paths';
  import {
    getFileAddBody,
    handleTorrentAddResponses,
  } from '~helpers/fileHelper';

  const TORRENT_HASH_REGEX = /^[\da-f]{40}$/i;

  export let fileNames = [];

  let loadingInitial = true;
  let loadingSubmit = false;
  let tab = 'url';
  let files = null;
  let destination = null;
  let start = null;

  $: cleanFileNames = fileNames
    .map((fileName) => fileName.trim())
    .filter(Boolean);

  session
    .addColumns([SESSION_COLUMN_DOWNLOAD_DIR, SESSION_COLUMN_START_ADDED])
    .then(($session) => {
      destination = $session[SESSION_COLUMN_DOWNLOAD_DIR];
      start = $session[SESSION_COLUMN_START_ADDED];
    })
    .finally(() => {
      loadingInitial = false;
    });

  const validateInputs = (formElement) => {
    const inputs = Array.from(
      formElement.querySelectorAll('.torrent-url-hash-input')
    );
    const validity = inputs.map(
      (input) => TORRENT_HASH_REGEX.test(input.value) || isValidUrl(input.value)
    );
    const invalidIndex = validity.indexOf(false);

    if (invalidIndex === -1) return false;

    // Set errors for the first invalid input
    inputs[invalidIndex].setCustomValidity(
      '无效的 URL、磁力链接或种子哈希'
    );
    formElement.reportValidity();
    return true;
  };

  const handleUrlSubmit = (event) => {
    if (validateInputs(event.target)) {
      return Promise.reject();
    }

    const dataItems = cleanFileNames.map((filename) => {
      let hashUrl;
      if (TORRENT_HASH_REGEX.test(filename)) {
        hashUrl = `magnet:?xt=urn:btih:${filename}`;
      }

      return {
        'filename': hashUrl || filename,
        'paused': !start,
        'download-dir': destination,
      };
    });
    return Promise.resolve(dataItems);
  };

  const handleSubmit = (event) => {
    loadingSubmit = true;

    let promise;
    if (tab === 'file') {
      promise = getFileAddBody(files, start, destination);
    } else if (tab === 'url') {
      promise = handleUrlSubmit(event);
    } else {
      throw new Error('<Add> Unexpected tab');
    }

    promise
      .then((dataItems) => {
        return Promise.all(dataItems.map((item) => torrents.add(item)));
      })
      .then((responses) => {
        handleTorrentAddResponses(responses);

        modals.close();
      })
      .catch((e) => {
        if (e) {
          console.error(e);
          alerts.add(
            '添加种子失败，请重试',
            'negative'
          );
        }
        loadingSubmit = false;
      });
  };
</script>

<h1>添加种子</h1>
<ul class="tabs">
  <li>
    <button
      type="button"
      class="tab"
      class:active={tab === 'url'}
      on:click={() => (tab = 'url')}
    >
      通过 URL 或哈希
    </button>
  </li>
  <li>
    <button
      type="button"
      class="tab"
      class:active={tab === 'file'}
      on:click={() => (tab = 'file')}
    >
      通过文件
    </button>
  </li>
</ul>

<div class="content" class:loading-initial={loadingInitial}>
  <Icon name="SpinnerIcon" />
  <form on:submit|preventDefault={handleSubmit}>
    {#if tab === 'url'}
      <InputMultiple
        label="种子"
        class="torrent-url-hash-input"
        placeholder="种子 URL、磁力链接或哈希"
        bind:values={fileNames}
        required={!cleanFileNames.length}
      />
    {:else if tab === 'file'}
      <InputFile
        label="种子"
        bind:files={files}
        multiple
        required
        accept=".torrent,application/x-bittorrent"
      />
    {/if}
    <InputPath
      label="保存位置"
      placeholder="保存位置"
      bind:value={destination}
      pattern={PATH_VALIDATION_REGEX}
      validationMessage="保存位置必须是绝对路径。"
      required
    />
    <div class="button-group">
      <Checkbox label="添加后立即开始" bind:checked={start} />
      <Button priority="tertiary" on:click={modals.close}>取消</Button>
      <Button priority="primary" loading={loadingSubmit} type="submit">
        添加种子
      </Button>
    </div>
  </form>
</div>

<style>
  h1 {
    color: var(--color-modal-header);
    font-size: 20px;
    font-weight: 500;
    padding: 20px 25px 0;
  }

  ul {
    color: var(--color-modal-tab-label);
    font-size: 13px;
    font-weight: 500;
    margin: 5px 0 0;
    padding: 0 25px;
    box-shadow: inset 0 -1px 0 var(--color-modal-add-tab-bar-shadow);
  }

  li {
    display: inline-block;
    margin-right: 15px;
    padding: 0;
  }

  .tab {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    display: inline-block;
    font: inherit;
    padding: 5px 0 10px 0;
    position: relative;
  }

  .tab.active {
    color: var(--color-modal-tab-label-active);
    font-weight: 700;
  }

  .tab.active::after {
    background-color: var(--color-modal-tab-label-active);
    bottom: 0;
    content: '';
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
  }

  .content {
    overflow-y: auto;
    padding: 20px 25px 20px 25px;
    color: var(--color-modal-text);
    position: relative;
  }

  .content.loading-initial {
    display: flex;
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
  }

  .content > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
  }

  .content.loading-initial > :global(.icon) {
    display: inherit;
  }

  .content.loading-initial form {
    visibility: hidden;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
    gap: 10px;
  }
</style>
