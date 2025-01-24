import{_ as s,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/alg/alg-graph-store-1.png",i="/vitepress-blog-template/images/alg/alg-graph-store-2.png",t="/vitepress-blog-template/images/alg/alg-graph-store-3.jpg",r="/vitepress-blog-template/images/alg/alg-graph-store-4.jpg",c="/vitepress-blog-template/images/alg/alg-graph-store-5.jpg",k=JSON.parse('{"title":"图 - 基础和Overview","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-graph.md","filePath":"algorithm/alg-basic-graph.md","lastUpdated":1737706346000}'),o={name:"algorithm/alg-basic-graph.md"};function d(u,a,h,g,b,v){return e(),n("div",null,a[0]||(a[0]=[p('<h1 id="图-基础和overview" tabindex="-1">图 - 基础和Overview <a class="header-anchor" href="#图-基础和overview" aria-label="Permalink to &quot;图 - 基础和Overview&quot;">​</a></h1><blockquote><p>图(Graph)是由顶点和连接顶点的边构成的离散结构。在计算机科学中，图是最灵活的数据结构之一，很多问题都可以使用图模型进行建模求解。例如: 生态环境中不同物种的相互竞争、人与人之间的社交与关系网络、化学上用图区分结构不同但分子式相同的同分异构体、分析计算机网络的拓扑结构确定两台计算机是否可以通信、找到两个城市之间的最短路径等等。@pdai</p></blockquote><h2 id="图的基础" tabindex="-1">图的基础 <a class="header-anchor" href="#图的基础" aria-label="Permalink to &quot;图的基础&quot;">​</a></h2><h3 id="定义" tabindex="-1">定义 <a class="header-anchor" href="#定义" aria-label="Permalink to &quot;定义&quot;">​</a></h3><p>图(Graph)是由顶点的有穷非空集合和顶点之间边的集合组成，通常表示为: G(V,E)，其中，G表示一个图，V是图G中顶点的集合，E是图G中边的集合。</p><p>和线性表，树的差异:</p><ul><li>线性表中我们把数据元素叫元素，树中将数据元素叫结点，在图中数据元素，我们则称之为顶点(Vertex)。</li><li>线性表可以没有元素，称为空表；树中可以没有节点，称为空树；但是，在图中不允许没有顶点(有穷非空性)。</li><li>线性表中的各元素是线性关系，树中的各元素是层次关系，而图中各顶点的关系是用边来表示(边集可以为空)。</li></ul><h3 id="相关术语" tabindex="-1">相关术语 <a class="header-anchor" href="#相关术语" aria-label="Permalink to &quot;相关术语&quot;">​</a></h3><ul><li>顶点的度</li></ul><p>顶点Vi的度(Degree)是指在图中与Vi相关联的边的条数。对于有向图来说，有入度(In-degree)和出度(Out-degree)之分，有向图顶点的度等于该顶点的入度和出度之和。</p><ul><li>邻接</li></ul><p>若无向图中的两个顶点V1和V2存在一条边(V1,V2)，则称顶点V1和V2邻接(Adjacent)；</p><p>若有向图中存在一条边&lt;V3,V2&gt;，则称顶点V3与顶点V2邻接，且是V3邻接到V2或V2邻接直V3；</p><ul><li>路径</li></ul><p>在无向图中，若从顶点Vi出发有一组边可到达顶点Vj，则称顶点Vi到顶点Vj的顶点序列为从顶点Vi到顶点Vj的路径(Path)。</p><ul><li>连通</li></ul><p>若从Vi到Vj有路径可通，则称顶点Vi和顶点Vj是连通(Connected)的。</p><ul><li>权(Weight)</li></ul><p>有些图的边或弧具有与它相关的数字，这种与图的边或弧相关的数叫做权(Weight)。</p><h3 id="类型" tabindex="-1">类型 <a class="header-anchor" href="#类型" aria-label="Permalink to &quot;类型&quot;">​</a></h3><h4 id="无向图" tabindex="-1">无向图 <a class="header-anchor" href="#无向图" aria-label="Permalink to &quot;无向图&quot;">​</a></h4><p>如果图中任意两个顶点之间的边都是无向边(简而言之就是没有方向的边)，则称该图为无向图(Undirected graphs)。</p><p>无向图中的边使用小括号“()”表示; 比如 (V1,V2);</p><h4 id="有向图" tabindex="-1">有向图 <a class="header-anchor" href="#有向图" aria-label="Permalink to &quot;有向图&quot;">​</a></h4><p>如果图中任意两个顶点之间的边都是有向边(简而言之就是有方向的边)，则称该图为有向图(Directed graphs)。</p><p>有向图中的边使用尖括号“&lt;&gt;”表示; 比如/&lt;V1,V2&gt;</p><h4 id="完全图" tabindex="-1">完全图 <a class="header-anchor" href="#完全图" aria-label="Permalink to &quot;完全图&quot;">​</a></h4><ul><li><p><code>无向完全图</code>: 在无向图中，如果任意两个顶点之间都存在边，则称该图为无向完全图。(含有n个顶点的无向完全图有(n×(n-1))/2条边)</p></li><li><p>`有向完全图: 在有向图中，如果任意两个顶点之间都存在方向互为相反的两条弧，则称该图为有向完全图。(含有n个顶点的有向完全图有n×(n-1)条边)</p></li></ul><h2 id="图的存储结构" tabindex="-1">图的存储结构 <a class="header-anchor" href="#图的存储结构" aria-label="Permalink to &quot;图的存储结构&quot;">​</a></h2><h3 id="邻接矩阵表示法" tabindex="-1">邻接矩阵表示法 <a class="header-anchor" href="#邻接矩阵表示法" aria-label="Permalink to &quot;邻接矩阵表示法&quot;">​</a></h3><p>图的邻接矩阵(Adjacency Matrix)存储方式是用两个数组来表示图。一个一维数组存储图中顶点信息，一个二维数组(称为邻接矩阵)存储图中的边或弧的信息。</p><ul><li>无向图:</li></ul><p><img src="'+l+'" alt="error.图片加载失败"></p><p>我们可以设置两个数组，顶点数组为vertex[4]={v0,v1,v2,v3}，边数组arc[4][4]为上图右边这样的一个矩阵。对于矩阵的主对角线的值，即arc[0][0]、arc[1][1]、arc[2][2]、arc[3][3]，全为0是因为不存在顶点的边。</p><ul><li>有向图:</li></ul><p>我们再来看一个有向图样例，如下图所示的左边。顶点数组为vertex[4]={v0,v1,v2,v3}，弧数组arc[4][4]为下图右边这样的一个矩阵。主对角线上数值依然为0。但因为是有向图，所以此矩阵并不对称，比如由v1到v0有弧，得到arc[1][0]=1，而v到v没有弧，因此arc[0][1]=0。</p><p><img src="'+i+'" alt="error.图片加载失败"></p><blockquote><p>不足: 由于存在n个顶点的图需要n*n个数组元素进行存储，当图为稀疏图时，使用邻接矩阵存储方法将会出现大量0元素，这会造成极大的空间浪费。这时，可以考虑使用邻接表表示法来存储图中的数据</p></blockquote><h3 id="邻接表表示法" tabindex="-1">邻接表表示法 <a class="header-anchor" href="#邻接表表示法" aria-label="Permalink to &quot;邻接表表示法&quot;">​</a></h3><p>首先，回忆我们在线性表时谈到，顺序存储结构就存在预先分配内存可能造成存储空间浪费的问题，于是引出了链式存储的结构。同样的，我们也可以考虑对边或弧使用链式存储的方式来避免空间浪费的问题。</p><p>邻接表由表头节点和表节点两部分组成，图中每个顶点均对应一个存储在数组中的表头节点。如果这个表头节点所对应的顶点存在邻接节点，则把邻接节点依次存放于表头节点所指向的单向链表中。</p><ul><li><code>无向图</code></li></ul><p>下图所示的就是一个无向图的邻接表结构。</p><p><img src="'+t+'" alt="error.图片加载失败"></p><p>从上图中我们知道，顶点表的各个结点由data和firstedge两个域表示，data是数据域，存储顶点的信息，firstedge是指针域，指向边表的第一个结点，即此顶点的第一个邻接点。边表结点由adjvex和next两个域组成。adjvex是邻接点域，存储某顶点的邻接点在顶点表中的下标，next则存储指向边表中下一个结点的指针。例如: v1顶点与v0、v2互为邻接点，则在v1的边表中，adjvex分别为v0的0和v2的2。</p><p>PS: 对于无向图来说，使用邻接表进行存储也会出现数据冗余的现象。例如上图中，顶点V0所指向的链表中存在一个指向顶点V3的同事，顶点V3所指向的链表中也会存在一个指向V0的顶点。</p><ul><li><code>有向图</code></li></ul><p>若是有向图，邻接表结构是类似的，但要注意的是有向图由于有方向的。因此，有向图的邻接表分为出边表和入边表(又称逆邻接表)，出边表的表节点存放的是从表头节点出发的有向边所指的尾节点；入边表的表节点存放的则是指向表头节点的某个顶点，如下图所示。</p><p><img src="'+r+'" alt="error.图片加载失败"></p><ul><li><code>带权图</code></li></ul><p>对于带权值的网图，可以在边表结点定义中再增加一个weight的数据域，存储权值信息即可，如下图所示。</p><p><img src="'+c+`" alt="error.图片加载失败"></p><h2 id="图相关题目" tabindex="-1">图相关题目 <a class="header-anchor" href="#图相关题目" aria-label="Permalink to &quot;图相关题目&quot;">​</a></h2><h3 id="二分图" tabindex="-1">二分图 <a class="header-anchor" href="#二分图" aria-label="Permalink to &quot;二分图&quot;">​</a></h3><p>如果可以用两种颜色对图中的节点进行着色，并且保证相邻的节点颜色不同，那么这个图就是二分图。</p><p><strong>判断是否为二分图</strong></p><p><a href="https://leetcode.com/problems/is-graph-bipartite/description/" target="_blank" rel="noreferrer">785. Is Graph Bipartite? (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [[1,3], [0,2], [1,3], [0,2]]</span></span>
<span class="line"><span>Output: true</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>The graph looks like this:</span></span>
<span class="line"><span>0----1</span></span>
<span class="line"><span>|    |</span></span>
<span class="line"><span>|    |</span></span>
<span class="line"><span>3----2</span></span>
<span class="line"><span>We can divide the vertices into two groups: {0, 2} and {1, 3}.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Example 2:</span></span>
<span class="line"><span>Input: [[1,2,3], [0,2], [0,1,3], [0,2]]</span></span>
<span class="line"><span>Output: false</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>The graph looks like this:</span></span>
<span class="line"><span>0----1</span></span>
<span class="line"><span>| \\  |</span></span>
<span class="line"><span>|  \\ |</span></span>
<span class="line"><span>3----2</span></span>
<span class="line"><span>We cannot find a way to divide the set of nodes into two independent subsets.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean isBipartite(int[][] graph) {</span></span>
<span class="line"><span>    int[] colors = new int[graph.length];</span></span>
<span class="line"><span>    Arrays.fill(colors, -1);</span></span>
<span class="line"><span>    for (int i = 0; i &lt; graph.length; i++) {  // 处理图不是连通的情况</span></span>
<span class="line"><span>        if (colors[i] == -1 &amp;&amp; !isBipartite(i, 0, colors, graph)) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean isBipartite(int curNode, int curColor, int[] colors, int[][] graph) {</span></span>
<span class="line"><span>    if (colors[curNode] != -1) {</span></span>
<span class="line"><span>        return colors[curNode] == curColor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    colors[curNode] = curColor;</span></span>
<span class="line"><span>    for (int nextNode : graph[curNode]) {</span></span>
<span class="line"><span>        if (!isBipartite(nextNode, 1 - curColor, colors, graph)) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="拓扑排序" tabindex="-1">拓扑排序 <a class="header-anchor" href="#拓扑排序" aria-label="Permalink to &quot;拓扑排序&quot;">​</a></h3><p>常用于在具有先序关系的任务规划中。</p><p><strong>课程安排的合法性</strong></p><p><a href="https://leetcode.com/problems/course-schedule/description/" target="_blank" rel="noreferrer">207. Course Schedule (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2, [[1,0]]</span></span>
<span class="line"><span>return true</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2, [[1,0],[0,1]]</span></span>
<span class="line"><span>return false</span></span></code></pre></div><p>题目描述: 一个课程可能会先修课程，判断给定的先修课程规定是否合法。</p><p>本题不需要使用拓扑排序，只需要检测有向图是否存在环即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean canFinish(int numCourses, int[][] prerequisites) {</span></span>
<span class="line"><span>    List&lt;Integer&gt;[] graphic = new List[numCourses];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; numCourses; i++) {</span></span>
<span class="line"><span>        graphic[i] = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int[] pre : prerequisites) {</span></span>
<span class="line"><span>        graphic[pre[0]].add(pre[1]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    boolean[] globalMarked = new boolean[numCourses];</span></span>
<span class="line"><span>    boolean[] localMarked = new boolean[numCourses];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; numCourses; i++) {</span></span>
<span class="line"><span>        if (hasCycle(globalMarked, localMarked, graphic, i)) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean hasCycle(boolean[] globalMarked, boolean[] localMarked,</span></span>
<span class="line"><span>                         List&lt;Integer&gt;[] graphic, int curNode) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (localMarked[curNode]) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (globalMarked[curNode]) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    globalMarked[curNode] = true;</span></span>
<span class="line"><span>    localMarked[curNode] = true;</span></span>
<span class="line"><span>    for (int nextNode : graphic[curNode]) {</span></span>
<span class="line"><span>        if (hasCycle(globalMarked, localMarked, graphic, nextNode)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    localMarked[curNode] = false;</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>课程安排的顺序</strong></p><p><a href="https://leetcode.com/problems/course-schedule-ii/description/" target="_blank" rel="noreferrer">210. Course Schedule II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>4, [[1,0],[2,0],[3,1],[3,2]]</span></span>
<span class="line"><span>There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0. So one correct course order is [0,1,2,3]. Another correct ordering is[0,2,1,3].</span></span></code></pre></div><p>使用 DFS 来实现拓扑排序，使用一个栈存储后序遍历结果，这个栈的逆序结果就是拓扑排序结果。</p><p>证明: 对于任何先序关系: v-&gt;w，后序遍历结果可以保证 w 先进入栈中，因此栈的逆序结果中 v 会在 w 之前。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[] findOrder(int numCourses, int[][] prerequisites) {</span></span>
<span class="line"><span>    List&lt;Integer&gt;[] graphic = new List[numCourses];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; numCourses; i++) {</span></span>
<span class="line"><span>        graphic[i] = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int[] pre : prerequisites) {</span></span>
<span class="line"><span>        graphic[pre[0]].add(pre[1]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Stack&lt;Integer&gt; postOrder = new Stack&lt;&gt;();</span></span>
<span class="line"><span>    boolean[] globalMarked = new boolean[numCourses];</span></span>
<span class="line"><span>    boolean[] localMarked = new boolean[numCourses];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; numCourses; i++) {</span></span>
<span class="line"><span>        if (hasCycle(globalMarked, localMarked, graphic, i, postOrder)) {</span></span>
<span class="line"><span>            return new int[0];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int[] orders = new int[numCourses];</span></span>
<span class="line"><span>    for (int i = numCourses - 1; i &gt;= 0; i--) {</span></span>
<span class="line"><span>        orders[i] = postOrder.pop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return orders;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean hasCycle(boolean[] globalMarked, boolean[] localMarked, List&lt;Integer&gt;[] graphic,</span></span>
<span class="line"><span>                         int curNode, Stack&lt;Integer&gt; postOrder) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (localMarked[curNode]) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (globalMarked[curNode]) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    globalMarked[curNode] = true;</span></span>
<span class="line"><span>    localMarked[curNode] = true;</span></span>
<span class="line"><span>    for (int nextNode : graphic[curNode]) {</span></span>
<span class="line"><span>        if (hasCycle(globalMarked, localMarked, graphic, nextNode, postOrder)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    localMarked[curNode] = false;</span></span>
<span class="line"><span>    postOrder.push(curNode);</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="并查集" tabindex="-1">并查集 <a class="header-anchor" href="#并查集" aria-label="Permalink to &quot;并查集&quot;">​</a></h3><p>并查集可以动态地连通两个点，并且可以非常快速地判断两个点是否连通。</p><p><strong>冗余连接</strong></p><p><a href="https://leetcode.com/problems/redundant-connection/description/" target="_blank" rel="noreferrer">684. Redundant Connection (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [[1,2], [1,3], [2,3]]</span></span>
<span class="line"><span>Output: [2,3]</span></span>
<span class="line"><span>Explanation: The given undirected graph will be like this:</span></span>
<span class="line"><span>  1</span></span>
<span class="line"><span> / \\</span></span>
<span class="line"><span>2 - 3</span></span></code></pre></div><p>题目描述: 有一系列的边连成的图，找出一条边，移除它之后该图能够成为一棵树。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[] findRedundantConnection(int[][] edges) {</span></span>
<span class="line"><span>    int N = edges.length;</span></span>
<span class="line"><span>    UF uf = new UF(N);</span></span>
<span class="line"><span>    for (int[] e : edges) {</span></span>
<span class="line"><span>        int u = e[0], v = e[1];</span></span>
<span class="line"><span>        if (uf.connect(u, v)) {</span></span>
<span class="line"><span>            return e;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        uf.union(u, v);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return new int[]{-1, -1};</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private class UF {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private int[] id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    UF(int N) {</span></span>
<span class="line"><span>        id = new int[N + 1];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; id.length; i++) {</span></span>
<span class="line"><span>            id[i] = i;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void union(int u, int v) {</span></span>
<span class="line"><span>        int uID = find(u);</span></span>
<span class="line"><span>        int vID = find(v);</span></span>
<span class="line"><span>        if (uID == vID) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        for (int i = 0; i &lt; id.length; i++) {</span></span>
<span class="line"><span>            if (id[i] == uID) {</span></span>
<span class="line"><span>                id[i] = vID;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int find(int p) {</span></span>
<span class="line"><span>        return id[p];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean connect(int u, int v) {</span></span>
<span class="line"><span>        return find(u) == find(v);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,83)]))}const f=s(o,[["render",d]]);export{k as __pageData,f as default};
