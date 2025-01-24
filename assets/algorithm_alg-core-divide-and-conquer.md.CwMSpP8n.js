import{_ as s,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"算法思想 - 分治算法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-core-divide-and-conquer.md","filePath":"algorithm/alg-core-divide-and-conquer.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-core-divide-and-conquer.md"};function l(i,a,r,c,o,d){return e(),n("div",null,a[0]||(a[0]=[p(`<h1 id="算法思想-分治算法" tabindex="-1">算法思想 - 分治算法 <a class="header-anchor" href="#算法思想-分治算法" aria-label="Permalink to &quot;算法思想 - 分治算法&quot;">​</a></h1><blockquote><p>分治算法的基本思想是将一个规模为N的问题分解为K个规模较小的子问题，这些子问题相互独立且与原问题性质相同。求出子问题的解，就可得到原问题的解。@pdai</p></blockquote><h2 id="分治相关题目" tabindex="-1">分治相关题目 <a class="header-anchor" href="#分治相关题目" aria-label="Permalink to &quot;分治相关题目&quot;">​</a></h2><h3 id="给表达式加括号" tabindex="-1">给表达式加括号 <a class="header-anchor" href="#给表达式加括号" aria-label="Permalink to &quot;给表达式加括号&quot;">​</a></h3><p><a href="https://leetcode.com/problems/different-ways-to-add-parentheses/description/" target="_blank" rel="noreferrer">241. Different Ways to Add Parentheses (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: &quot;2-1-1&quot;.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>((2-1)-1) = 0</span></span>
<span class="line"><span>(2-(1-1)) = 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output : [0, 2]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;Integer&gt; diffWaysToCompute(String input) {</span></span>
<span class="line"><span>    List&lt;Integer&gt; ways = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (int i = 0; i &lt; input.length(); i++) {</span></span>
<span class="line"><span>        char c = input.charAt(i);</span></span>
<span class="line"><span>        if (c == &#39;+&#39; || c == &#39;-&#39; || c == &#39;*&#39;) {</span></span>
<span class="line"><span>            List&lt;Integer&gt; left = diffWaysToCompute(input.substring(0, i));</span></span>
<span class="line"><span>            List&lt;Integer&gt; right = diffWaysToCompute(input.substring(i + 1));</span></span>
<span class="line"><span>            for (int l : left) {</span></span>
<span class="line"><span>                for (int r : right) {</span></span>
<span class="line"><span>                    switch (c) {</span></span>
<span class="line"><span>                        case &#39;+&#39;:</span></span>
<span class="line"><span>                            ways.add(l + r);</span></span>
<span class="line"><span>                            break;</span></span>
<span class="line"><span>                        case &#39;-&#39;:</span></span>
<span class="line"><span>                            ways.add(l - r);</span></span>
<span class="line"><span>                            break;</span></span>
<span class="line"><span>                        case &#39;*&#39;:</span></span>
<span class="line"><span>                            ways.add(l * r);</span></span>
<span class="line"><span>                            break;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (ways.size() == 0) {</span></span>
<span class="line"><span>        ways.add(Integer.valueOf(input));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ways;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,8)]))}const g=s(t,[["render",l]]);export{u as __pageData,g as default};
