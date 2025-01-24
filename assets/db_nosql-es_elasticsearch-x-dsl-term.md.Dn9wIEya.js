import{_ as a}from"./chunks/es-dsl-full-text-3.D-0L5xgq.js";import{_ as n,c as e,ai as p,o as t}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/db/es/es-dsl-term-1.png",i="/vitepress-blog-template/images/db/es/es-dsl-term-2.png",o="/vitepress-blog-template/images/db/es/es-dsl-term-3.png",r="/vitepress-blog-template/images/db/es/es-dsl-term-4.png",c="/vitepress-blog-template/images/db/es/es-dsl-term-5.png",u="/vitepress-blog-template/images/db/es/es-dsl-term-6.png",d="/vitepress-blog-template/images/db/es/es-dsl-term-7.png",q="/vitepress-blog-template/images/db/es/es-dsl-term-8.png",m="/vitepress-blog-template/images/db/es/es-dsl-term-9.png",h="/vitepress-blog-template/images/db/es/es-dsl-term-10.png",g="/vitepress-blog-template/images/db/es/es-dsl-term-11.png",P=JSON.parse('{"title":"ES详解 - 查询：DSL查询之Term详解","description":"","frontmatter":{},"headers":[],"relativePath":"db/nosql-es/elasticsearch-x-dsl-term.md","filePath":"db/nosql-es/elasticsearch-x-dsl-term.md","lastUpdated":1737706346000}'),b={name:"db/nosql-es/elasticsearch-x-dsl-term.md"};function v(_,s,k,x,f,y){return t(),e("div",null,s[0]||(s[0]=[p('<h1 id="es详解-查询-dsl查询之term详解" tabindex="-1">ES详解 - 查询：DSL查询之Term详解 <a class="header-anchor" href="#es详解-查询-dsl查询之term详解" aria-label="Permalink to &quot;ES详解 - 查询：DSL查询之Term详解&quot;">​</a></h1><blockquote><p>DSL查询另一种极为常用的是对词项进行搜索，官方文档中叫”term level“查询，本文主要对term level搜索进行详解。@pdai</p></blockquote><h2 id="term查询引入" tabindex="-1">Term查询引入 <a class="header-anchor" href="#term查询引入" aria-label="Permalink to &quot;Term查询引入&quot;">​</a></h2><p>如前文所述，查询分基于文本查询和基于词项的查询:</p><p><img src="'+a+'" alt=""></p><p>本文主要讲基于词项的查询。</p><p><img src="'+l+`" alt=""></p><h2 id="term查询" tabindex="-1">Term查询 <a class="header-anchor" href="#term查询" aria-label="Permalink to &quot;Term查询&quot;">​</a></h2><blockquote><p>很多比较常用，也不难，就是需要结合实例理解。这里综合官方文档的内容，我设计一个测试场景的数据，以覆盖所有例子。@pdai</p></blockquote><p>准备数据</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PUT /test-dsl-term-level</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mappings&quot;: {</span></span>
<span class="line"><span>    &quot;properties&quot;: {</span></span>
<span class="line"><span>      &quot;name&quot;: {</span></span>
<span class="line"><span>        &quot;type&quot;: &quot;keyword&quot;</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      &quot;programming_languages&quot;: {</span></span>
<span class="line"><span>        &quot;type&quot;: &quot;keyword&quot;</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      &quot;required_matches&quot;: {</span></span>
<span class="line"><span>        &quot;type&quot;: &quot;long&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>POST /test-dsl-term-level/_bulk</span></span>
<span class="line"><span>{ &quot;index&quot;: { &quot;_id&quot;: 1 }}</span></span>
<span class="line"><span>{&quot;name&quot;: &quot;Jane Smith&quot;, &quot;programming_languages&quot;: [ &quot;c++&quot;, &quot;java&quot; ], &quot;required_matches&quot;: 2}</span></span>
<span class="line"><span>{ &quot;index&quot;: { &quot;_id&quot;: 2 }}</span></span>
<span class="line"><span>{&quot;name&quot;: &quot;Jason Response&quot;, &quot;programming_languages&quot;: [ &quot;java&quot;, &quot;php&quot; ], &quot;required_matches&quot;: 2}</span></span>
<span class="line"><span>{ &quot;index&quot;: { &quot;_id&quot;: 3 }}</span></span>
<span class="line"><span>{&quot;name&quot;: &quot;Dave Pdai&quot;, &quot;programming_languages&quot;: [ &quot;java&quot;, &quot;c++&quot;, &quot;php&quot; ], &quot;required_matches&quot;: 3, &quot;remarks&quot;: &quot;hello world&quot;}</span></span></code></pre></div><h3 id="字段是否存在-exist" tabindex="-1">字段是否存在:exist <a class="header-anchor" href="#字段是否存在-exist" aria-label="Permalink to &quot;字段是否存在:exist&quot;">​</a></h3><p>由于多种原因，文档字段的索引值可能不存在：</p><ul><li>源JSON中的字段是null或[]</li><li>该字段已&quot;index&quot; : false在映射中设置</li><li>字段值的长度超出ignore_above了映射中的设置</li><li>字段值格式错误，并且ignore_malformed已在映射中定义</li></ul><p>所以exist表示查找是否存在字段。</p><p><img src="`+i+`" alt=""></p><h3 id="id查询-ids" tabindex="-1">id查询:ids <a class="header-anchor" href="#id查询-ids" aria-label="Permalink to &quot;id查询:ids&quot;">​</a></h3><p>ids 即对id查找</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;ids&quot;: {</span></span>
<span class="line"><span>      &quot;values&quot;: [3, 1]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+o+`" alt=""></p><h3 id="前缀-prefix" tabindex="-1">前缀:prefix <a class="header-anchor" href="#前缀-prefix" aria-label="Permalink to &quot;前缀:prefix&quot;">​</a></h3><p>通过前缀查找某个字段</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;prefix&quot;: {</span></span>
<span class="line"><span>      &quot;name&quot;: {</span></span>
<span class="line"><span>        &quot;value&quot;: &quot;Jan&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+r+`" alt=""></p><h3 id="分词匹配-term" tabindex="-1">分词匹配:term <a class="header-anchor" href="#分词匹配-term" aria-label="Permalink to &quot;分词匹配:term&quot;">​</a></h3><p>前文最常见的根据分词查询</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;term&quot;: {</span></span>
<span class="line"><span>      &quot;programming_languages&quot;: &quot;php&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+c+`" alt=""></p><h3 id="多个分词匹配-terms" tabindex="-1">多个分词匹配:terms <a class="header-anchor" href="#多个分词匹配-terms" aria-label="Permalink to &quot;多个分词匹配:terms&quot;">​</a></h3><p>按照读个分词term匹配，它们是or的关系</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;terms&quot;: {</span></span>
<span class="line"><span>      &quot;programming_languages&quot;: [&quot;php&quot;,&quot;c++&quot;]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+u+`" alt=""></p><h3 id="按某个数字字段分词匹配-term-set" tabindex="-1">按某个数字字段分词匹配:term set <a class="header-anchor" href="#按某个数字字段分词匹配-term-set" aria-label="Permalink to &quot;按某个数字字段分词匹配:term set&quot;">​</a></h3><p>设计这种方式查询的初衷是用文档中的数字字段动态匹配查询满足term的个数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;terms_set&quot;: {</span></span>
<span class="line"><span>      &quot;programming_languages&quot;: {</span></span>
<span class="line"><span>        &quot;terms&quot;: [ &quot;java&quot;, &quot;php&quot; ],</span></span>
<span class="line"><span>        &quot;minimum_should_match_field&quot;: &quot;required_matches&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+d+`" alt=""></p><h3 id="通配符-wildcard" tabindex="-1">通配符:wildcard <a class="header-anchor" href="#通配符-wildcard" aria-label="Permalink to &quot;通配符:wildcard&quot;">​</a></h3><p>通配符匹配，比如<code>*</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;wildcard&quot;: {</span></span>
<span class="line"><span>      &quot;name&quot;: {</span></span>
<span class="line"><span>        &quot;value&quot;: &quot;D*ai&quot;,</span></span>
<span class="line"><span>        &quot;boost&quot;: 1.0,</span></span>
<span class="line"><span>        &quot;rewrite&quot;: &quot;constant_score&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+q+`" alt=""></p><h3 id="范围-range" tabindex="-1">范围:range <a class="header-anchor" href="#范围-range" aria-label="Permalink to &quot;范围:range&quot;">​</a></h3><p>常常被用在数字或者日期范围的查询</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;range&quot;: {</span></span>
<span class="line"><span>      &quot;required_matches&quot;: {</span></span>
<span class="line"><span>        &quot;gte&quot;: 3,</span></span>
<span class="line"><span>        &quot;lte&quot;: 4</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+m+`" alt=""></p><h3 id="正则-regexp" tabindex="-1">正则:regexp <a class="header-anchor" href="#正则-regexp" aria-label="Permalink to &quot;正则:regexp&quot;">​</a></h3><p>通过<a href="https://pdai.tech/md/develop/regex/dev-regex-all.html" target="_blank" rel="noreferrer">正则表达式</a>查询</p><p>以&quot;Jan&quot;开头的name字段</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;regexp&quot;: {</span></span>
<span class="line"><span>      &quot;name&quot;: {</span></span>
<span class="line"><span>        &quot;value&quot;: &quot;Ja.*&quot;,</span></span>
<span class="line"><span>        &quot;case_insensitive&quot;: true</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+h+`" alt=""></p><h3 id="模糊匹配-fuzzy" tabindex="-1">模糊匹配:fuzzy <a class="header-anchor" href="#模糊匹配-fuzzy" aria-label="Permalink to &quot;模糊匹配:fuzzy&quot;">​</a></h3><p>官方文档对模糊匹配：编辑距离是将一个术语转换为另一个术语所需的一个字符更改的次数。这些更改可以包括：</p><ul><li>更改字符（box→ fox）</li><li>删除字符（black→ lack）</li><li>插入字符（sic→ sick）</li><li>转置两个相邻字符（act→ cat）</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /test-dsl-term-level/_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;query&quot;: {</span></span>
<span class="line"><span>    &quot;fuzzy&quot;: {</span></span>
<span class="line"><span>      &quot;remarks&quot;: {</span></span>
<span class="line"><span>        &quot;value&quot;: &quot;hell&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+g+'" alt=""></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html" target="_blank" rel="noreferrer">https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',57)]))}const w=n(b,[["render",v]]);export{P as __pageData,w as default};
