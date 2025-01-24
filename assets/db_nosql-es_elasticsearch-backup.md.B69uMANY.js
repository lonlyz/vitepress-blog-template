import{_ as s,c as n,ai as t,o as p}from"./chunks/framework.BrYByd3F.js";const h=JSON.parse('{"title":"ElasticSearch - 备份和迁移","description":"","frontmatter":{},"headers":[],"relativePath":"db/nosql-es/elasticsearch-backup.md","filePath":"db/nosql-es/elasticsearch-backup.md","lastUpdated":1737706346000}'),e={name:"db/nosql-es/elasticsearch-backup.md"};function o(l,a,i,u,c,r){return p(),n("div",null,a[0]||(a[0]=[t(`<h1 id="elasticsearch-备份和迁移" tabindex="-1">ElasticSearch - 备份和迁移 <a class="header-anchor" href="#elasticsearch-备份和迁移" aria-label="Permalink to &quot;ElasticSearch - 备份和迁移&quot;">​</a></h1><h2 id="方案" tabindex="-1">方案 <a class="header-anchor" href="#方案" aria-label="Permalink to &quot;方案&quot;">​</a></h2><h3 id="离线方案" tabindex="-1">离线方案 <a class="header-anchor" href="#离线方案" aria-label="Permalink to &quot;离线方案&quot;">​</a></h3><ul><li>Snapshot</li><li>Reindex</li><li>Logstash</li><li>ElasticSearch-dump</li><li>ElasticSearch-Exporter</li></ul><h3 id="增量备份方案" tabindex="-1">增量备份方案 <a class="header-anchor" href="#增量备份方案" aria-label="Permalink to &quot;增量备份方案&quot;">​</a></h3><ul><li>logstash</li></ul><h2 id="使用快照进行备份" tabindex="-1">使用快照进行备份 <a class="header-anchor" href="#使用快照进行备份" aria-label="Permalink to &quot;使用快照进行备份&quot;">​</a></h2><h3 id="配置信息" tabindex="-1">配置信息 <a class="header-anchor" href="#配置信息" aria-label="Permalink to &quot;配置信息&quot;">​</a></h3><p>注册前要注意配置文件加上: elasticsearch.yml</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>path.repo: [&quot;/opt/elasticsearch/backup&quot;]</span></span></code></pre></div><h3 id="创建仓库" tabindex="-1">创建仓库 <a class="header-anchor" href="#创建仓库" aria-label="Permalink to &quot;创建仓库&quot;">​</a></h3><blockquote><p>注册一个仓库，存放快照，记住，这里不是生成快照，只是注册一个仓库</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>curl -XPUT &#39;http://10.11.60.5:9200/_snapshot/repo_backup_1&#39; -H &#39;Content-Type: application/json&#39; -d &#39;{</span></span>
<span class="line"><span>	&quot;type&quot;: &quot;fs&quot;,</span></span>
<span class="line"><span>	&quot;settings&quot;: {</span></span>
<span class="line"><span>		&quot;location&quot;: &quot;/opt/elasticsearch/backup&quot;,</span></span>
<span class="line"><span>		&quot;max_snapshot_bytes_per_sec&quot;: &quot;20mb&quot;,</span></span>
<span class="line"><span>		&quot;max_restore_bytes_per_sec&quot;: &quot;20mb&quot;,</span></span>
<span class="line"><span>		&quot;compress&quot;: true</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}&#39;</span></span></code></pre></div><p>查看仓库信息:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>curl -XGET &#39;http://10.11.60.5:9200/_snapshot/repo_backup_1?pretty&#39;</span></span></code></pre></div><p>返回内容</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@STOR-ES elasticsearch]# curl -XGET &#39;http://10.11.60.5:9200/_snapshot/repo_backup_1?pretty&#39;</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;repo_backup_1&quot; : {</span></span>
<span class="line"><span>    &quot;type&quot; : &quot;fs&quot;,</span></span>
<span class="line"><span>    &quot;settings&quot; : {</span></span>
<span class="line"><span>      &quot;location&quot; : &quot;/opt/elasticsearch/backup&quot;,</span></span>
<span class="line"><span>      &quot;max_restore_bytes_per_sec&quot; : &quot;20mb&quot;,</span></span>
<span class="line"><span>      &quot;compress&quot; : &quot;true&quot;,</span></span>
<span class="line"><span>      &quot;max_snapshot_bytes_per_sec&quot; : &quot;20mb&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="创建快照" tabindex="-1">创建快照 <a class="header-anchor" href="#创建快照" aria-label="Permalink to &quot;创建快照&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>curl -XPUT &#39;http://10.11.60.5:9200/_snapshot/repo_backup_1/snapshot_1?wait_for_completion=true&amp;pretty&#39; -H &#39;Content-Type: application/json&#39; -d &#39;{</span></span>
<span class="line"><span>	&quot;indices&quot;: &quot;bro-2019-09-14,bro-2019-09-15,wmi-2019-09-14,wmi-2019-09-15,syslog-2019-09-14,sylog-2019-09-15&quot;,</span></span>
<span class="line"><span>	&quot;rename_pattern&quot;: &quot;bro_(.+)&quot;,</span></span>
<span class="line"><span>	&quot;rename_replacement&quot;: &quot;dev_bro_$1&quot;,</span></span>
<span class="line"><span>	&quot;ignore_unavailable&quot;: true,</span></span>
<span class="line"><span>	&quot;include_global_state&quot;: true</span></span>
<span class="line"><span>}&#39;</span></span></code></pre></div><p>执行</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;snapshot&quot; : {</span></span>
<span class="line"><span>    &quot;snapshot&quot; : &quot;snapshot_1&quot;,</span></span>
<span class="line"><span>    &quot;version_id&quot; : 2040399,</span></span>
<span class="line"><span>    &quot;version&quot; : &quot;2.4.3&quot;,</span></span>
<span class="line"><span>    &quot;indices&quot; : [ &quot;bro-2019-09-14&quot;, &quot;bro-2019-09-15&quot;, &quot;wmi-2019-09-15&quot;, &quot;syslog-2019-09-14&quot;, &quot;wmi-2019-09-14&quot; ],</span></span>
<span class="line"><span>    &quot;state&quot; : &quot;SUCCESS&quot;,</span></span>
<span class="line"><span>    &quot;start_time&quot; : &quot;2019-09-18T05:58:08.860Z&quot;,</span></span>
<span class="line"><span>    &quot;start_time_in_millis&quot; : 1568786288860,</span></span>
<span class="line"><span>    &quot;end_time&quot; : &quot;2019-09-18T06:02:18.037Z&quot;,</span></span>
<span class="line"><span>    &quot;end_time_in_millis&quot; : 1568786538037,</span></span>
<span class="line"><span>    &quot;duration_in_millis&quot; : 249177,</span></span>
<span class="line"><span>    &quot;failures&quot; : [ ],</span></span>
<span class="line"><span>    &quot;shards&quot; : {</span></span>
<span class="line"><span>      &quot;total&quot; : 25,</span></span>
<span class="line"><span>      &quot;failed&quot; : 0,</span></span>
<span class="line"><span>      &quot;successful&quot; : 25</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="恢复数据" tabindex="-1">恢复数据 <a class="header-anchor" href="#恢复数据" aria-label="Permalink to &quot;恢复数据&quot;">​</a></h3><h2 id="方案使用场景" tabindex="-1">方案使用场景 <a class="header-anchor" href="#方案使用场景" aria-label="Permalink to &quot;方案使用场景&quot;">​</a></h2><h2 id="迁移考虑的问题" tabindex="-1">迁移考虑的问题 <a class="header-anchor" href="#迁移考虑的问题" aria-label="Permalink to &quot;迁移考虑的问题&quot;">​</a></h2><ul><li><p>版本问题，从低版本到高版本数据的迁移</p></li><li><p>多租户的适配问题</p></li></ul><blockquote><p>多个工厂的数据进入不同index, 原有的数据bro-2019-09-15的数据需要进入factorycode-bro-2019-09-15</p></blockquote><ul><li><p>多次或者分批迁移数据</p></li><li><p>数据在迁移时候富化</p></li><li><p>FieldMapping 和 数据信息 分离?</p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,28)]))}const d=s(e,[["render",o]]);export{h as __pageData,d as default};
