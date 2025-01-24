import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/alg/alg-graph-topo-sort-1.png",i="/vitepress-blog-template/images/alg/alg-graph-topo-sort-2.png",f=JSON.parse('{"title":"图 - 拓扑排序(Topological sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-graph-topo-sort.md","filePath":"algorithm/alg-basic-graph-topo-sort.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-basic-graph-topo-sort.md"};function r(o,a,c,d,h,g){return e(),s("div",null,a[0]||(a[0]=[p('<h1 id="图-拓扑排序-topological-sort" tabindex="-1">图 - 拓扑排序(Topological sort) <a class="header-anchor" href="#图-拓扑排序-topological-sort" aria-label="Permalink to &quot;图 - 拓扑排序(Topological sort)&quot;">​</a></h1><blockquote><p>拓扑排序主要用来解决有向图中的依赖解析(dependency resolution)问题。@pdai</p></blockquote><h2 id="拓扑排序介绍" tabindex="-1">拓扑排序介绍 <a class="header-anchor" href="#拓扑排序介绍" aria-label="Permalink to &quot;拓扑排序介绍&quot;">​</a></h2><p>对于任何有向图而言，其拓扑排序为其所有结点的一个线性排序(对于同一个有向图而言可能存在多个这样的结点排序)。该排序满足这样的条件——对于图中的任意两个结点u和v，若存在一条有向边从u指向v，则在拓扑排序中u一定出现在v前面。</p><p>例如一个有向无环图如下:</p><p><img src="'+l+'" alt="error.图片加载失败"></p><ul><li>结点1必须在结点2、3之前</li><li>结点2必须在结点3、4之前</li><li>结点3必须在结点4、5之前</li><li>结点4必须在结点5之前</li></ul><p>则一个满足条件的拓扑排序为[1, 2, 3, 4, 5]。</p><h2 id="拓扑排序前提" tabindex="-1">拓扑排序前提 <a class="header-anchor" href="#拓扑排序前提" aria-label="Permalink to &quot;拓扑排序前提&quot;">​</a></h2><p>当且仅当一个有向图为有向无环图(directed acyclic graph，或称DAG)时，才能得到对应于该图的拓扑排序。这里有两点要注意:</p><ul><li><p>对于有环图，必然会造成循环依赖(circular dependency)，不符合拓扑排序定义；</p></li><li><p>对于每一个有向无环图都至少存在一种拓扑排序；</p></li></ul><p><code>不唯一的情况</code>:</p><p>上图中若我们删 4、5结点之前的有向边，上图变为如下所示:</p><p><img src="'+i+`" alt="error.图片加载失败"></p><p>则我们可得到两个不同的拓扑排序结果: [1, 2, 3, 4, 5]和[1, 2, 3, 5, 4]。</p><h2 id="拓扑排序算法" tabindex="-1">拓扑排序算法 <a class="header-anchor" href="#拓扑排序算法" aria-label="Permalink to &quot;拓扑排序算法&quot;">​</a></h2><p>为了说明如何得到一个有向无环图的拓扑排序，我们首先需要了解有向图结点的入度(indegree)和出度(outdegree)的概念。</p><p>假设有向图中不存在起点和终点为同一结点的有向边。</p><p><code>入度</code>: 设有向图中有一结点v，其入度即为当前所有从其他结点出发，终点为v的的边的数目。也就是所有指向v的有向边的数目。</p><p><code>出度</code>: 设有向图中有一结点v，其出度即为当前所有起点为v，指向其他结点的边的数目。也就是所有由v发出的边的数目。</p><p>在了解了入度和出度的概念之后，再根据拓扑排序的定义，我们自然就能够得出结论: 要想完成拓扑排序，我们每次都应当从入度为0的结点开始遍历。因为只有入度为0的结点才能够成为拓扑排序的起点。否则根据拓扑排序的定义，只要一个结点v的入度不为0，则至少有一条边起始于其他结点而指向v，那么这条边的起点在拓扑排序的顺序中应当位于v之前，则v不能成为当前遍历的起点。</p><p>由此我们可以进一步得出一个改进的深度优先遍历或广度优先遍历算法来完成拓扑排序。以广度优先遍历为例，这一改进后的算法与普通的广度优先遍历唯一的区别在于我们应当保存每一个结点对应的入度，并在遍历的每一层选取入度为0的结点开始遍历(而普通的广度优先遍历则无此限制，可以从该吃呢个任意一个结点开始遍历)。这个算法描述如下:</p><ul><li>初始化一个int[] inDegree保存每一个结点的入度。</li><li>对于图中的每一个结点的子结点，将其子结点的入度加1。</li><li>选取入度为0的结点开始遍历，并将该节点加入输出。</li><li>对于遍历过的每个结点，更新其子结点的入度: 将子结点的入度减1。</li><li>重复步骤3，直到遍历完所有的结点。</li><li>如果无法遍历完所有的结点，则意味着当前的图不是有向无环图。不存在拓扑排序。</li></ul><h2 id="拓扑排序代码实现" tabindex="-1">拓扑排序代码实现 <a class="header-anchor" href="#拓扑排序代码实现" aria-label="Permalink to &quot;拓扑排序代码实现&quot;">​</a></h2><p>广度优先遍历拓扑排序的Java代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TopologicalSort {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Get topological ordering of the input directed graph </span></span>
<span class="line"><span>     * @param n number of nodes in the graph</span></span>
<span class="line"><span>     * @param adjacencyList adjacency list representation of the input directed graph</span></span>
<span class="line"><span>     * @return topological ordering of the graph stored in an List&lt;Integer&gt;. </span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public List&lt;Integer&gt; topologicalSort(int n, int[][] adjacencyList) {</span></span>
<span class="line"><span>        List&lt;Integer&gt; topoRes = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        int[] inDegree = new int[n];</span></span>
<span class="line"><span>        for (int[] parent : adjacencyList) {</span></span>
<span class="line"><span>            for (int child : parent) {</span></span>
<span class="line"><span>                inDegree[child]++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        Deque&lt;Integer&gt; deque = new ArrayDeque&lt;&gt;();</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // start from nodes whose indegree are 0</span></span>
<span class="line"><span>        for (int i = 0; i &lt; n; i++) {</span></span>
<span class="line"><span>            if (inDegree[i] == 0) deque.offer(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        while (!deque.isEmpty()) {</span></span>
<span class="line"><span>            int curr = deque.poll();</span></span>
<span class="line"><span>            topoRes.add(curr);</span></span>
<span class="line"><span>            for (int child : adjacencyList[curr]) {</span></span>
<span class="line"><span>                inDegree[child]--;</span></span>
<span class="line"><span>                if (inDegree[child] == 0) {</span></span>
<span class="line"><span>                    deque.offer(child);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        return topoRes.size() == n ? topoRes : new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="复杂度" tabindex="-1">复杂度 <a class="header-anchor" href="#复杂度" aria-label="Permalink to &quot;复杂度&quot;">​</a></h2><p>时间复杂度: O(n + e)，其中n为图中的结点数目，e为图中的边的数目</p><p>空间复杂度: O(n)</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://www.jianshu.com/p/3347f54a3187" target="_blank" rel="noreferrer">https://www.jianshu.com/p/3347f54a3187</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,32)]))}const m=n(t,[["render",r]]);export{f as __pageData,m as default};
