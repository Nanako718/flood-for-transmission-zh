<script>
  import Header from './Header.svelte';

  const REPO_URL = 'https://github.com/Nanako718/flood-for-transmission';
  const UPSTREAM_URL = 'https://github.com/johman10/flood-for-transmission';
  const FLOOD_UI_URL = 'https://github.com/Flood-UI/flood';
</script>

<Header text="Flood for Transmission 中文版" />

<p>
  本界面是 <a href="https://transmissionbt.com/" target="_blank" rel="noopener"
    >Transmission</a
  >
  的 Web 前端，纯静态应用，无需额外后台进程即可通过 Transmission RPC 工作。
</p>

<Header text="项目来源" />

<p>
  本仓库为独立维护的<strong>中文本地化版本</strong>，在
  <a href={UPSTREAM_URL} target="_blank" rel="noopener">Flood for Transmission</a>
  （作者 johman10）基础上修改而来。上游项目同样面向 Transmission，界面设计追溯自
  <a href={FLOOD_UI_URL} target="_blank" rel="noopener">Flood</a>（原为 rTorrent 设计）。
</p>

<p>
  与上游仓库无自动同步关系；问题反馈、功能建议请在本仓库提交，请勿向上游提交本中文版特有的
  Issue。
</p>

<Header text="反馈" />

<p>
  如有缺陷或建议，请在本仓库提交
  <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noopener">GitHub Issue</a>。
</p>

<style>
  p {
    color: var(--color-modal-text);
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 15px;
  }

  p strong {
    color: var(--color-modal-header);
    font-weight: 600;
  }

  a {
    color: var(--color-modal-link);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
