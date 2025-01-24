import{_ as s,c as e,ai as n,o as p}from"./chunks/framework.BrYByd3F.js";const q=JSON.parse('{"title":"ElasticSearch - WrapperQuery","description":"","frontmatter":{},"headers":[],"relativePath":"db/nosql-es/elasticsearch-wrapper-query.md","filePath":"db/nosql-es/elasticsearch-wrapper-query.md","lastUpdated":1737706346000}'),t={name:"db/nosql-es/elasticsearch-wrapper-query.md"};function l(r,a,i,o,c,u){return p(),e("div",null,a[0]||(a[0]=[n(`<h1 id="elasticsearch-wrapperquery" tabindex="-1">ElasticSearch - WrapperQuery <a class="header-anchor" href="#elasticsearch-wrapperquery" aria-label="Permalink to &quot;ElasticSearch - WrapperQuery&quot;">​</a></h1><blockquote><p>在工作中遇到ElasticSearch版本升级时出现Java High Level接口变更导致的兼容性问题: 之前使用的是2.4.x，考虑性能和功能的增强，需要更换为6.4.x; 2.4.x中我们使用DSL语句直接查询(数据的不确定性和方便动态建立查询规则等因素)，而新的ES Java 高阶API中去掉了相关接口的支持。 此文主要记录通过 ES Wrapper Query实现对6.x版本中 Java high-level transport client对json DSL查询对支持。 @pdai</p></blockquote><h2 id="实现方式理论基础" tabindex="-1">实现方式理论基础 <a class="header-anchor" href="#实现方式理论基础" aria-label="Permalink to &quot;实现方式理论基础&quot;">​</a></h2><p><a href="https://www.elastic.co/guide/en/elasticsearch/reference/6.4/query-dsl-wrapper-query.html" target="_blank" rel="noreferrer">https://www.elastic.co/guide/en/elasticsearch/reference/6.4/query-dsl-wrapper-query.html</a></p><blockquote><p>This query is more useful in the context of the Java high-level REST client or transport client to also accept queries as json formatted string. In these cases queries can be specified as a json or yaml formatted string or as a query builder (which is a available in the Java high-level REST client).</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET /_search</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    &quot;query&quot; : {</span></span>
<span class="line"><span>        &quot;wrapper&quot;: {</span></span>
<span class="line"><span>            &quot;query&quot; : &quot;eyJ0ZXJtIiA6IHsgInVzZXIiIDogIktpbWNoeSIgfX0=&quot; // Base64 encoded string: {&quot;term&quot; : { &quot;user&quot; : &quot;Kimchy&quot; }}</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>将DSL JSON语句 转成 map</li></ul><p><a href="https://blog.csdn.net/qq%5C_41370896/article/details/83658948" target="_blank" rel="noreferrer">https://blog.csdn.net/qq\\_41370896/article/details/83658948</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String dsl = &quot;&quot;;</span></span>
<span class="line"><span>Map maps = (Map)JSON.parse(dsl);  </span></span>
<span class="line"><span>maps.get(&quot;query&quot;);// dsl query string</span></span></code></pre></div><ul><li>Java 代码</li></ul><p><a href="https://blog.csdn.net/tcyzhyx/article/details/84566734" target="_blank" rel="noreferrer">https://blog.csdn.net/tcyzhyx/article/details/84566734</a></p><p><a href="https://www.jianshu.com/p/216ca70d9e62" target="_blank" rel="noreferrer">https://www.jianshu.com/p/216ca70d9e62</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>StringBuffer dsl = new StringBuffer();</span></span>
<span class="line"><span>dsl.append(&quot;{\\&quot;bool\\&quot;: {&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;      \\&quot;must\\&quot;: [&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;        {&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;          \\&quot;term\\&quot;: {&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;            \\&quot;mdid.keyword\\&quot;: {&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;              \\&quot;value\\&quot;: \\&quot;2fa9d41e1af460e0d47ce36ca8a98737\\&quot;&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;            }&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;          }&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;        }&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;      ]&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;    }&quot;);</span></span>
<span class="line"><span>dsl.append(&quot;}&quot;);</span></span>
<span class="line"><span>WrapperQueryBuilder wqb = QueryBuilders.wrapperQuery(dsl.toString());</span></span>
<span class="line"><span>SearchResponse searchResponse = client.prepareSearch(basicsysCodeManager.getYjzxYjxxIndex())</span></span>
<span class="line"><span>.setTypes(basicsysCodeManager.getYjzxYjxxType()).setQuery(wqb).setSize(10).get();</span></span>
<span class="line"><span>SearchHit[] hits = searchResponse.getHits().getHits();</span></span>
<span class="line"><span>for(SearchHit hit : hits){</span></span>
<span class="line"><span>	String content = hit.getSourceAsString();</span></span>
<span class="line"><span>	System.out.println(content);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>query + agg 应该怎么写</li></ul><p><a href="http://www.itkeyword.com/doc/1009692843717298639/wrapperquerybuilder-aggs-query-throwing-query-malformed-exception" target="_blank" rel="noreferrer">http://www.itkeyword.com/doc/1009692843717298639/wrapperquerybuilder-aggs-query-throwing-query-malformed-exception</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;{\\&quot;query\\&quot;:{\\&quot;match_all\\&quot;: {}},\\&quot;aggs\\&quot;:{\\&quot;avg1\\&quot;:{\\&quot;avg\\&quot;:{\\&quot;field\\&quot;:\\&quot;age\\&quot;}}}}&quot;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SearchSourceBuilder ssb = new SearchSourceBuilder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// add the query part</span></span>
<span class="line"><span>String query =&quot;{\\&quot;match_all\\&quot;: {}}&quot;;</span></span>
<span class="line"><span>WrapperQueryBuilder wrapQB = new WrapperQueryBuilder(query);</span></span>
<span class="line"><span>ssb.query(wrapQB);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// add the aggregation part</span></span>
<span class="line"><span>AvgBuilder avgAgg = AggregationBuilders.avg(&quot;avg1&quot;).field(&quot;age&quot;);</span></span>
<span class="line"><span>ssb.aggregation(avgAgg);</span></span></code></pre></div><h2 id="实现示例" tabindex="-1">实现示例 <a class="header-anchor" href="#实现示例" aria-label="Permalink to &quot;实现示例&quot;">​</a></h2><p>略</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,20)]))}const h=s(t,[["render",l]]);export{q as __pageData,h as default};
