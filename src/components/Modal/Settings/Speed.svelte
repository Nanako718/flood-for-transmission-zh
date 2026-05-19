<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import Header from './Header.svelte';
  import Checkbox from '~components/Checkbox';
  import Input from '~components/Input';
  import Button from '~components/Button';
  import Icon from '~components/Icon';
  import { session, modals, alerts } from '~helpers/stores';
  import { minutesToTime, timeToMinutes } from '~helpers/timeHelper';
  import {
    SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED,
    SESSION_COLUMN_SPEED_LIMIT_UP,
    SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED,
    SESSION_COLUMN_SPEED_LIMIT_DOWN,
    SESSION_COLUMN_ALT_SPEED_ENABLED,
    SESSION_COLUMN_ALT_SPEED_UP,
    SESSION_COLUMN_ALT_SPEED_DOWN,
    SESSION_COLUMN_ALT_SPEED_TIME_ENABLED,
    SESSION_COLUMN_ALT_SPEED_TIME_BEGIN,
    SESSION_COLUMN_ALT_SPEED_TIME_END,
  } from '~helpers/constants/columns';

  let loadingInitial = true;
  let loadingSubmit = false;
  let dataReady = false;

  let uploadLimitEnabled = false;
  let uploadLimit = 0;
  let downloadLimitEnabled = false;
  let downloadLimit = 0;
  let altLimitsEnabled = false;
  let altUploadLimit = 0;
  let altDownloadLimit = 0;
  let altSpeedTimeEnabled = false;
  let altSpeedTimeBegin = '00:00';
  let altSpeedTimeEnd = '00:00';

  const loadFromSession = (s) => {
    if (s[SESSION_COLUMN_SPEED_LIMIT_UP] === undefined) {
      return false;
    }

    uploadLimitEnabled = !!s[SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED];
    uploadLimit = Number(s[SESSION_COLUMN_SPEED_LIMIT_UP]) || 0;
    downloadLimitEnabled = !!s[SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED];
    downloadLimit = Number(s[SESSION_COLUMN_SPEED_LIMIT_DOWN]) || 0;
    altLimitsEnabled = !!s[SESSION_COLUMN_ALT_SPEED_ENABLED];
    altUploadLimit = Number(s[SESSION_COLUMN_ALT_SPEED_UP]) || 0;
    altDownloadLimit = Number(s[SESSION_COLUMN_ALT_SPEED_DOWN]) || 0;
    altSpeedTimeEnabled = !!s[SESSION_COLUMN_ALT_SPEED_TIME_ENABLED];
    altSpeedTimeBegin = minutesToTime(s[SESSION_COLUMN_ALT_SPEED_TIME_BEGIN]);
    altSpeedTimeEnd = minutesToTime(s[SESSION_COLUMN_ALT_SPEED_TIME_END]);
    return true;
  };

  onMount(() => {
    const current = get(session);
    if (loadFromSession(current)) {
      dataReady = true;
      loadingInitial = false;
    }

    session
      .addColumns([
        SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED,
        SESSION_COLUMN_SPEED_LIMIT_UP,
        SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED,
        SESSION_COLUMN_SPEED_LIMIT_DOWN,
        SESSION_COLUMN_ALT_SPEED_ENABLED,
        SESSION_COLUMN_ALT_SPEED_UP,
        SESSION_COLUMN_ALT_SPEED_DOWN,
        SESSION_COLUMN_ALT_SPEED_TIME_ENABLED,
        SESSION_COLUMN_ALT_SPEED_TIME_BEGIN,
        SESSION_COLUMN_ALT_SPEED_TIME_END,
      ])
      .then((updated) => {
        loadFromSession(updated);
        dataReady = true;
      })
      .catch(() => {
        if (!dataReady) {
          alerts.add('暂时无法获取速度设置，请稍后再试。', 'negative');
        }
      })
      .finally(() => {
        loadingInitial = false;
      });
  });

  const handleSubmit = () => {
    loadingSubmit = true;

    const payload = {
      'speed-limit-up-enabled': uploadLimitEnabled,
      'speed-limit-up': uploadLimitEnabled ? Number(uploadLimit) : uploadLimit,
      'speed-limit-down-enabled': downloadLimitEnabled,
      'speed-limit-down': downloadLimitEnabled
        ? Number(downloadLimit)
        : downloadLimit,
      'alt-speed-enabled': altLimitsEnabled,
      'alt-speed-up': Number(altUploadLimit) || 0,
      'alt-speed-down': Number(altDownloadLimit) || 0,
      'alt-speed-time-enabled': altLimitsEnabled && altSpeedTimeEnabled,
      'alt-speed-time-begin': timeToMinutes(altSpeedTimeBegin),
      'alt-speed-time-end': timeToMinutes(altSpeedTimeEnd),
    };

    session
      .update(payload)
      .then(() => {
        alerts.add('速度设置已保存');
        modals.close();
      })
      .catch(() => {
        alerts.add('速度设置保存失败，请重试', 'negative');
      })
      .finally(() => {
        loadingSubmit = false;
      });
  };
</script>

<div class="wrapper" class:loading-initial={loadingInitial}>
  {#if loadingInitial}
    <Icon name="SpinnerIcon" />
  {/if}

  {#if dataReady}
    <form
      novalidate
      onsubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <section class="settings-section">
        <Header text="常规限速" />
        <p class="settings-hint">
          未开启备用速度时使用。侧栏「快速限速」修改的也是这里；取消勾选即不限速。
        </p>

        <div class="limit-group">
          <Checkbox bind:checked={downloadLimitEnabled} label="限制下载速度" />
          <Input
            bind:value={downloadLimit}
            type="number"
            min="0"
            label="下载 (kB/s)"
            disabled={!downloadLimitEnabled}
          />
        </div>

        <div class="limit-group">
          <Checkbox bind:checked={uploadLimitEnabled} label="限制上传速度" />
          <Input
            bind:value={uploadLimit}
            type="number"
            min="0"
            label="上传 (kB/s)"
            disabled={!uploadLimitEnabled}
          />
        </div>
      </section>

      <section class="settings-section">
        <Header text="备用速度" />
        <p class="settings-hint">
          开启后可在侧栏用「备用」开关切换；若启用定时，仅在设定时段内使用下方限速。
        </p>

        <div class="limit-group">
          <Checkbox bind:checked={altLimitsEnabled} label="启用备用速度" />
        </div>

        <div class="limit-group" class:is-disabled={!altLimitsEnabled}>
          <Input
            bind:value={altDownloadLimit}
            type="number"
            min="0"
            label="备用下载 (kB/s)"
            disabled={!altLimitsEnabled}
          />
          <Input
            bind:value={altUploadLimit}
            type="number"
            min="0"
            label="备用上传 (kB/s)"
            disabled={!altLimitsEnabled}
          />
        </div>

        <div class="limit-group" class:is-disabled={!altLimitsEnabled}>
          <Checkbox
            bind:checked={altSpeedTimeEnabled}
            label="仅在指定时段使用备用速度"
            disabled={!altLimitsEnabled}
          />
        </div>

        <div
          class="settings-row settings-row--time"
          class:is-disabled={!altLimitsEnabled || !altSpeedTimeEnabled}
        >
          <Input
            bind:value={altSpeedTimeBegin}
            label="开始"
            type="time"
            disabled={!altLimitsEnabled || !altSpeedTimeEnabled}
          />
          <Input
            bind:value={altSpeedTimeEnd}
            label="结束"
            type="time"
            disabled={!altLimitsEnabled || !altSpeedTimeEnabled}
          />
        </div>
      </section>

      <div class="settings-buttons">
        <Button type="button" priority="tertiary" onclick={() => modals.close()}>
          取消
        </Button>
        <Button type="submit" priority="primary" loading={loadingSubmit}>
          保存设置
        </Button>
      </div>
    </form>
  {:else if !loadingInitial}
    <p class="settings-error">无法加载速度设置，请检查 Transmission 连接后重试。</p>
  {/if}
</div>

<style>
  .wrapper {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .wrapper.loading-initial {
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
    min-height: 240px;
  }

  .wrapper.loading-initial > :global(.icon) {
    height: 30px;
    width: 30px;
  }

  .wrapper.loading-initial form {
    display: none;
  }

  .limit-group {
    margin-bottom: 14px;
  }

  .limit-group:last-child {
    margin-bottom: 0;
  }

  .limit-group :global(.checkbox) {
    margin-bottom: 8px;
  }

  .limit-group.is-disabled {
    opacity: 0.45;
    pointer-events: none;
  }

  .settings-error {
    color: var(--color-negative);
    font-size: 13px;
    padding: 24px 0;
    text-align: center;
  }
</style>
