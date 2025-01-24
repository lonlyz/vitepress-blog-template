import{_ as s,c as a,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/alg/alg-graph-dfs-1.jpg",i="/vitepress-blog-template/images/alg/alg-graph-dfs-2.jpg",t="/vitepress-blog-template/images/alg/alg-graph-dfs-3.jpg",c="/vitepress-blog-template/images/alg/alg-graph-dfs-4.jpg",o="/vitepress-blog-template/images/alg/alg-graph-bfs-1.jpg",r="/vitepress-blog-template/images/alg/alg-graph-bfs-2.jpg",f=JSON.parse('{"title":"图 - 遍历(BFS & DFS)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-graph-bfs-dfs.md","filePath":"algorithm/alg-basic-graph-bfs-dfs.md","lastUpdated":1737706346000}'),d={name:"algorithm/alg-basic-graph-bfs-dfs.md"};function u(h,n,m,g,q,x){return l(),a("div",null,n[0]||(n[0]=[p('<h1 id="图-遍历-bfs-dfs" tabindex="-1">图 - 遍历(BFS &amp; DFS) <a class="header-anchor" href="#图-遍历-bfs-dfs" aria-label="Permalink to &quot;图 - 遍历(BFS &amp; DFS)&quot;">​</a></h1><blockquote><p>图的深度优先搜索(Depth First Search)，和树的先序遍历比较类似; 广度优先搜索算法(Breadth First Search)，又称为&quot;宽度优先搜索&quot;或&quot;横向优先搜索&quot;。 @pdai</p></blockquote><h2 id="深度优先搜索" tabindex="-1">深度优先搜索 <a class="header-anchor" href="#深度优先搜索" aria-label="Permalink to &quot;深度优先搜索&quot;">​</a></h2><h3 id="深度优先搜索介绍" tabindex="-1">深度优先搜索介绍 <a class="header-anchor" href="#深度优先搜索介绍" aria-label="Permalink to &quot;深度优先搜索介绍&quot;">​</a></h3><p>它的思想: 假设初始状态是图中所有顶点均未被访问，则从某个顶点v出发，首先访问该顶点，然后依次从它的各个未被访问的邻接点出发深度优先搜索遍历图，直至图中所有和v有路径相通的顶点都被访问到。 若此时尚有其他顶点未被访问到，则另选一个未被访问的顶点作起始点，重复上述过程，直至图中所有顶点都被访问到为止。</p><p>显然，深度优先搜索是一个递归的过程。</p><h3 id="深度优先搜索图解" tabindex="-1">深度优先搜索图解 <a class="header-anchor" href="#深度优先搜索图解" aria-label="Permalink to &quot;深度优先搜索图解&quot;">​</a></h3><h4 id="无向图的深度优先搜索" tabindex="-1">无向图的深度优先搜索 <a class="header-anchor" href="#无向图的深度优先搜索" aria-label="Permalink to &quot;无向图的深度优先搜索&quot;">​</a></h4><p>下面以&quot;无向图&quot;为例，来对深度优先搜索进行演示。</p><p><img src="'+e+'" alt="error.图片加载失败"></p><p>对上面的图G1进行深度优先遍历，从顶点A开始。</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p><code>第1步</code>: 访问A。</p><p><code>第2步</code>: 访问(A的邻接点)C。 在第1步访问A之后，接下来应该访问的是A的邻接点，即&quot;C,D,F&quot;中的一个。但在本文的实现中，顶点ABCDEFG是按照顺序存储，C在&quot;D和F&quot;的前面，因此，先访问C。</p><p><code>第3步</code>: 访问(C的邻接点)B。 在第2步访问C之后，接下来应该访问C的邻接点，即&quot;B和D&quot;中一个(A已经被访问过，就不算在内)。而由于B在D之前，先访问B。</p><p><code>第4步</code>: 访问(C的邻接点)D。 在第3步访问了C的邻接点B之后，B没有未被访问的邻接点；因此，返回到访问C的另一个邻接点D。</p><p><code>第5步</code>: 访问(A的邻接点)F。 前面已经访问了A，并且访问完了&quot;A的邻接点B的所有邻接点(包括递归的邻接点在内)&quot;；因此，此时返回到访问A的另一个邻接点F。</p><p><code>第6步</code>: 访问(F的邻接点)G。</p><p><code>第7步</code>: 访问(G的邻接点)E。</p><p>因此访问顺序是: A -&gt; C -&gt; B -&gt; D -&gt; F -&gt; G -&gt; E</p><h3 id="有向图的深度优先搜索" tabindex="-1">有向图的深度优先搜索 <a class="header-anchor" href="#有向图的深度优先搜索" aria-label="Permalink to &quot;有向图的深度优先搜索&quot;">​</a></h3><p>下面以&quot;有向图&quot;为例，来对深度优先搜索进行演示。</p><p><img src="'+t+'" alt="error.图片加载失败"></p><p>对上面的图G2进行深度优先遍历，从顶点A开始。</p><p><img src="'+c+'" alt="error.图片加载失败"></p><p><code>第1步</code>: 访问A。</p><p><code>第2步</code>: 访问B。 在访问了A之后，接下来应该访问的是A的出边的另一个顶点，即顶点B。</p><p><code>第3步</code>: 访问C。 在访问了B之后，接下来应该访问的是B的出边的另一个顶点，即顶点C,E,F。在本文实现的图中，顶点ABCDEFG按照顺序存储，因此先访问C。</p><p><code>第4步</code>: 访问E。 接下来访问C的出边的另一个顶点，即顶点E。</p><p><code>第5步</code>: 访问D。 接下来访问E的出边的另一个顶点，即顶点B,D。顶点B已经被访问过，因此访问顶点D。</p><p><code>第6步</code>: 访问F。 接下应该回溯&quot;访问A的出边的另一个顶点F&quot;。</p><p><code>第7步</code>: 访问G。</p><p>因此访问顺序是: A -&gt; B -&gt; C -&gt; E -&gt; D -&gt; F -&gt; G</p><h2 id="广度优先搜索" tabindex="-1">广度优先搜索 <a class="header-anchor" href="#广度优先搜索" aria-label="Permalink to &quot;广度优先搜索&quot;">​</a></h2><h3 id="广度优先搜索介绍" tabindex="-1">广度优先搜索介绍 <a class="header-anchor" href="#广度优先搜索介绍" aria-label="Permalink to &quot;广度优先搜索介绍&quot;">​</a></h3><p>广度优先搜索算法(Breadth First Search)，又称为&quot;宽度优先搜索&quot;或&quot;横向优先搜索&quot;，简称BFS。</p><p>它的思想是: 从图中某顶点v出发，在访问了v之后依次访问v的各个未曾访问过的邻接点，然后分别从这些邻接点出发依次访问它们的邻接点，并使得“先被访问的顶点的邻接点先于后被访问的顶点的邻接点被访问，直至图中所有已被访问的顶点的邻接点都被访问到。如果此时图中尚有顶点未被访问，则需要另选一个未曾被访问过的顶点作为新的起始点，重复上述过程，直至图中所有顶点都被访问到为止。</p><p>换句话说，广度优先搜索遍历图的过程是以v为起点，由近至远，依次访问和v有路径相通且路径长度为1,2...的顶点。</p><h3 id="广度优先搜索图解" tabindex="-1">广度优先搜索图解 <a class="header-anchor" href="#广度优先搜索图解" aria-label="Permalink to &quot;广度优先搜索图解&quot;">​</a></h3><h4 id="无向图的广度优先搜索" tabindex="-1">无向图的广度优先搜索 <a class="header-anchor" href="#无向图的广度优先搜索" aria-label="Permalink to &quot;无向图的广度优先搜索&quot;">​</a></h4><p>下面以&quot;无向图&quot;为例，来对广度优先搜索进行演示。还是以上面的图G1为例进行说明。</p><p><img src="'+o+'" alt="error.图片加载失败"></p><p><code>第1步</code>: 访问A。</p><p><code>第2步</code>: 依次访问C,D,F。 在访问了A之后，接下来访问A的邻接点。前面已经说过，在本文实现中，顶点ABCDEFG按照顺序存储的，C在&quot;D和F&quot;的前面，因此，先访问C。再访问完C之后，再依次访问D,F。</p><p><code>第3步</code>: 依次访问B,G。 在第2步访问完C,D,F之后，再依次访问它们的邻接点。首先访问C的邻接点B，再访问F的邻接点G。</p><p><code>第4步</code>: 访问E。 在第3步访问完B,G之后，再依次访问它们的邻接点。只有G有邻接点E，因此访问G的邻接点E。</p><p>因此访问顺序是: A -&gt; C -&gt; D -&gt; F -&gt; B -&gt; G -&gt; E</p><h4 id="有向图的广度优先搜索" tabindex="-1">有向图的广度优先搜索 <a class="header-anchor" href="#有向图的广度优先搜索" aria-label="Permalink to &quot;有向图的广度优先搜索&quot;">​</a></h4><p>下面以&quot;有向图&quot;为例，来对广度优先搜索进行演示。还是以上面的图G2为例进行说明。</p><p><img src="'+r+`" alt="error.图片加载失败"></p><p><code>第1步</code>: 访问A。</p><p><code>第2步</code>: 访问B。</p><p><code>第3步</code>: 依次访问C,E,F。 在访问了B之后，接下来访问B的出边的另一个顶点，即C,E,F。前面已经说过，在本文实现中，顶点ABCDEFG按照顺序存储的，因此会先访问C，再依次访问E,F。</p><p><code>第4步</code>: 依次访问D,G。 在访问完C,E,F之后，再依次访问它们的出边的另一个顶点。还是按照C,E,F的顺序访问，C的已经全部访问过了，那么就只剩下E,F；先访问E的邻接点D，再访问F的邻接点G。</p><p>因此访问顺序是: A -&gt; B -&gt; C -&gt; E -&gt; F -&gt; D -&gt; G</p><h2 id="相关实现" tabindex="-1">相关实现 <a class="header-anchor" href="#相关实现" aria-label="Permalink to &quot;相关实现&quot;">​</a></h2><h3 id="邻接矩阵实现无向图" tabindex="-1">邻接矩阵实现无向图 <a class="header-anchor" href="#邻接矩阵实现无向图" aria-label="Permalink to &quot;邻接矩阵实现无向图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.util.Scanner;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MatrixUDG {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private char[] mVexs;       // 顶点集合</span></span>
<span class="line"><span>    private int[][] mMatrix;    // 邻接矩阵</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 创建图(自己输入数据)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public MatrixUDG() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 输入&quot;顶点数&quot;和&quot;边数&quot;</span></span>
<span class="line"><span>        System.out.printf(&quot;input vertex number: &quot;);</span></span>
<span class="line"><span>        int vlen = readInt();</span></span>
<span class="line"><span>        System.out.printf(&quot;input edge number: &quot;);</span></span>
<span class="line"><span>        int elen = readInt();</span></span>
<span class="line"><span>        if ( vlen &lt; 1 || elen &lt; 1 || (elen &gt; (vlen*(vlen - 1)))) {</span></span>
<span class="line"><span>            System.out.printf(&quot;input error: invalid parameters!\\n&quot;);</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化&quot;顶点&quot;</span></span>
<span class="line"><span>        mVexs = new char[vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            System.out.printf(&quot;vertex(%d): &quot;, i);</span></span>
<span class="line"><span>            mVexs[i] = readChar();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;边&quot;</span></span>
<span class="line"><span>        mMatrix = new int[vlen][vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; elen; i++) {</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            System.out.printf(&quot;edge(%d):&quot;, i);</span></span>
<span class="line"><span>            char c1 = readChar();</span></span>
<span class="line"><span>            char c2 = readChar();</span></span>
<span class="line"><span>            int p1 = getPosition(c1);</span></span>
<span class="line"><span>            int p2 = getPosition(c2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (p1==-1 || p2==-1) {</span></span>
<span class="line"><span>                System.out.printf(&quot;input error: invalid edge!\\n&quot;);</span></span>
<span class="line"><span>                return ;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            mMatrix[p1][p2] = 1;</span></span>
<span class="line"><span>            mMatrix[p2][p1] = 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 创建图(用已提供的矩阵)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明：</span></span>
<span class="line"><span>     *     vexs  -- 顶点数组</span></span>
<span class="line"><span>     *     edges -- 边数组</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public MatrixUDG(char[] vexs, char[][] edges) {</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化&quot;顶点数&quot;和&quot;边数&quot;</span></span>
<span class="line"><span>        int vlen = vexs.length;</span></span>
<span class="line"><span>        int elen = edges.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;顶点&quot;</span></span>
<span class="line"><span>        mVexs = new char[vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            mVexs[i] = vexs[i];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;边&quot;</span></span>
<span class="line"><span>        mMatrix = new int[vlen][vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; elen; i++) {</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            int p1 = getPosition(edges[i][0]);</span></span>
<span class="line"><span>            int p2 = getPosition(edges[i][1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            mMatrix[p1][p2] = 1;</span></span>
<span class="line"><span>            mMatrix[p2][p1] = 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 返回ch位置</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int getPosition(char ch) {</span></span>
<span class="line"><span>        for(int i=0; i&lt;mVexs.length; i++)</span></span>
<span class="line"><span>            if(mVexs[i]==ch)</span></span>
<span class="line"><span>                return i;</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 读取一个输入字符</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private char readChar() {</span></span>
<span class="line"><span>        char ch=&#39;0&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ch = (char)System.in.read();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } while(!((ch&gt;=&#39;a&#39;&amp;&amp;ch&lt;=&#39;z&#39;) || (ch&gt;=&#39;A&#39;&amp;&amp;ch&lt;=&#39;Z&#39;)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return ch;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 读取一个输入字符</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int readInt() {</span></span>
<span class="line"><span>        Scanner scanner = new Scanner(System.in);</span></span>
<span class="line"><span>        return scanner.nextInt();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 返回顶点v的第一个邻接顶点的索引，失败则返回-1</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int firstVertex(int v) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (v&lt;0 || v&gt;(mVexs.length-1))</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            if (mMatrix[v][i] == 1)</span></span>
<span class="line"><span>                return i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 返回顶点v相对于w的下一个邻接顶点的索引，失败则返回-1</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int nextVertex(int v, int w) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (v&lt;0 || v&gt;(mVexs.length-1) || w&lt;0 || w&gt;(mVexs.length-1))</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = w + 1; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            if (mMatrix[v][i] == 1)</span></span>
<span class="line"><span>                return i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 深度优先搜索遍历图的递归实现</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void DFS(int i, boolean[] visited) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        visited[i] = true;</span></span>
<span class="line"><span>        System.out.printf(&quot;%c &quot;, mVexs[i]);</span></span>
<span class="line"><span>        // 遍历该顶点的所有邻接顶点。若是没有访问过，那么继续往下走</span></span>
<span class="line"><span>        for (int w = firstVertex(i); w &gt;= 0; w = nextVertex(i, w)) {</span></span>
<span class="line"><span>            if (!visited[w])</span></span>
<span class="line"><span>                DFS(w, visited);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 深度优先搜索遍历图</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void DFS() {</span></span>
<span class="line"><span>        boolean[] visited = new boolean[mVexs.length];       // 顶点访问标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化所有顶点都没有被访问</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            visited[i] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;DFS: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            if (!visited[i])</span></span>
<span class="line"><span>                DFS(i, visited);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 广度优先搜索（类似于树的层次遍历）</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void BFS() {</span></span>
<span class="line"><span>        int head = 0;</span></span>
<span class="line"><span>        int rear = 0;</span></span>
<span class="line"><span>        int[] queue = new int[mVexs.length];            // 辅组队列</span></span>
<span class="line"><span>        boolean[] visited = new boolean[mVexs.length];  // 顶点访问标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            visited[i] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;BFS: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            if (!visited[i]) {</span></span>
<span class="line"><span>                visited[i] = true;</span></span>
<span class="line"><span>                System.out.printf(&quot;%c &quot;, mVexs[i]);</span></span>
<span class="line"><span>                queue[rear++] = i;  // 入队列</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            while (head != rear) {</span></span>
<span class="line"><span>                int j = queue[head++];  // 出队列</span></span>
<span class="line"><span>                for (int k = firstVertex(j); k &gt;= 0; k = nextVertex(j, k)) { //k是为访问的邻接顶点</span></span>
<span class="line"><span>                    if (!visited[k]) {</span></span>
<span class="line"><span>                        visited[k] = true;</span></span>
<span class="line"><span>                        System.out.printf(&quot;%c &quot;, mVexs[k]);</span></span>
<span class="line"><span>                        queue[rear++] = k;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 打印矩阵队列图</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void print() {</span></span>
<span class="line"><span>        System.out.printf(&quot;Martix Graph:\\n&quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            for (int j = 0; j &lt; mVexs.length; j++)</span></span>
<span class="line"><span>                System.out.printf(&quot;%d &quot;, mMatrix[i][j]);</span></span>
<span class="line"><span>            System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        char[] vexs = {&#39;A&#39;, &#39;B&#39;, &#39;C&#39;, &#39;D&#39;, &#39;E&#39;, &#39;F&#39;, &#39;G&#39;};</span></span>
<span class="line"><span>        char[][] edges = new char[][]{</span></span>
<span class="line"><span>            {&#39;A&#39;, &#39;C&#39;}, </span></span>
<span class="line"><span>            {&#39;A&#39;, &#39;D&#39;}, </span></span>
<span class="line"><span>            {&#39;A&#39;, &#39;F&#39;}, </span></span>
<span class="line"><span>            {&#39;B&#39;, &#39;C&#39;}, </span></span>
<span class="line"><span>            {&#39;C&#39;, &#39;D&#39;}, </span></span>
<span class="line"><span>            {&#39;E&#39;, &#39;G&#39;}, </span></span>
<span class="line"><span>            {&#39;F&#39;, &#39;G&#39;}};</span></span>
<span class="line"><span>        MatrixUDG pG;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 自定义&quot;图&quot;(输入矩阵队列)</span></span>
<span class="line"><span>        //pG = new MatrixUDG();</span></span>
<span class="line"><span>        // 采用已有的&quot;图&quot;</span></span>
<span class="line"><span>        pG = new MatrixUDG(vexs, edges);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pG.print();   // 打印图</span></span>
<span class="line"><span>        pG.DFS();     // 深度优先遍历</span></span>
<span class="line"><span>        pG.BFS();     // 广度优先遍历</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="邻接表实现的无向图" tabindex="-1">邻接表实现的无向图 <a class="header-anchor" href="#邻接表实现的无向图" aria-label="Permalink to &quot;邻接表实现的无向图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.util.Scanner;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ListUDG {</span></span>
<span class="line"><span>    // 邻接表中表对应的链表的顶点</span></span>
<span class="line"><span>    private class ENode {</span></span>
<span class="line"><span>        int ivex;       // 该边所指向的顶点的位置</span></span>
<span class="line"><span>        ENode nextEdge; // 指向下一条弧的指针</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 邻接表中表的顶点</span></span>
<span class="line"><span>    private class VNode {</span></span>
<span class="line"><span>        char data;          // 顶点信息</span></span>
<span class="line"><span>        ENode firstEdge;    // 指向第一条依附该顶点的弧</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private VNode[] mVexs;  // 顶点数组</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 创建图(自己输入数据)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public ListUDG() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 输入&quot;顶点数&quot;和&quot;边数&quot;</span></span>
<span class="line"><span>        System.out.printf(&quot;input vertex number: &quot;);</span></span>
<span class="line"><span>        int vlen = readInt();</span></span>
<span class="line"><span>        System.out.printf(&quot;input edge number: &quot;);</span></span>
<span class="line"><span>        int elen = readInt();</span></span>
<span class="line"><span>        if ( vlen &lt; 1 || elen &lt; 1 || (elen &gt; (vlen*(vlen - 1)))) {</span></span>
<span class="line"><span>            System.out.printf(&quot;input error: invalid parameters!\\n&quot;);</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化&quot;顶点&quot;</span></span>
<span class="line"><span>        mVexs = new VNode[vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            System.out.printf(&quot;vertex(%d): &quot;, i);</span></span>
<span class="line"><span>            mVexs[i] = new VNode();</span></span>
<span class="line"><span>            mVexs[i].data = readChar();</span></span>
<span class="line"><span>            mVexs[i].firstEdge = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;边&quot;</span></span>
<span class="line"><span>        //mMatrix = new int[vlen][vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; elen; i++) {</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            System.out.printf(&quot;edge(%d):&quot;, i);</span></span>
<span class="line"><span>            char c1 = readChar();</span></span>
<span class="line"><span>            char c2 = readChar();</span></span>
<span class="line"><span>            int p1 = getPosition(c1);</span></span>
<span class="line"><span>            int p2 = getPosition(c2);</span></span>
<span class="line"><span>            // 初始化node1</span></span>
<span class="line"><span>            ENode node1 = new ENode();</span></span>
<span class="line"><span>            node1.ivex = p2;</span></span>
<span class="line"><span>            // 将node1链接到&quot;p1所在链表的末尾&quot;</span></span>
<span class="line"><span>            if(mVexs[p1].firstEdge == null)</span></span>
<span class="line"><span>              mVexs[p1].firstEdge = node1;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                linkLast(mVexs[p1].firstEdge, node1);</span></span>
<span class="line"><span>            // 初始化node2</span></span>
<span class="line"><span>            ENode node2 = new ENode();</span></span>
<span class="line"><span>            node2.ivex = p1;</span></span>
<span class="line"><span>            // 将node2链接到&quot;p2所在链表的末尾&quot;</span></span>
<span class="line"><span>            if(mVexs[p2].firstEdge == null)</span></span>
<span class="line"><span>              mVexs[p2].firstEdge = node2;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                linkLast(mVexs[p2].firstEdge, node2);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 创建图(用已提供的矩阵)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明：</span></span>
<span class="line"><span>     *     vexs  -- 顶点数组</span></span>
<span class="line"><span>     *     edges -- 边数组</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public ListUDG(char[] vexs, char[][] edges) {</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化&quot;顶点数&quot;和&quot;边数&quot;</span></span>
<span class="line"><span>        int vlen = vexs.length;</span></span>
<span class="line"><span>        int elen = edges.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;顶点&quot;</span></span>
<span class="line"><span>        mVexs = new VNode[vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            mVexs[i] = new VNode();</span></span>
<span class="line"><span>            mVexs[i].data = vexs[i];</span></span>
<span class="line"><span>            mVexs[i].firstEdge = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;边&quot;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; elen; i++) {</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            char c1 = edges[i][0];</span></span>
<span class="line"><span>            char c2 = edges[i][1];</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            int p1 = getPosition(edges[i][0]);</span></span>
<span class="line"><span>            int p2 = getPosition(edges[i][1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 初始化node1</span></span>
<span class="line"><span>            ENode node1 = new ENode();</span></span>
<span class="line"><span>            node1.ivex = p2;</span></span>
<span class="line"><span>            // 将node1链接到&quot;p1所在链表的末尾&quot;</span></span>
<span class="line"><span>            if(mVexs[p1].firstEdge == null)</span></span>
<span class="line"><span>              mVexs[p1].firstEdge = node1;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                linkLast(mVexs[p1].firstEdge, node1);</span></span>
<span class="line"><span>            // 初始化node2</span></span>
<span class="line"><span>            ENode node2 = new ENode();</span></span>
<span class="line"><span>            node2.ivex = p1;</span></span>
<span class="line"><span>            // 将node2链接到&quot;p2所在链表的末尾&quot;</span></span>
<span class="line"><span>            if(mVexs[p2].firstEdge == null)</span></span>
<span class="line"><span>              mVexs[p2].firstEdge = node2;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                linkLast(mVexs[p2].firstEdge, node2);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 将node节点链接到list的最后</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void linkLast(ENode list, ENode node) {</span></span>
<span class="line"><span>        ENode p = list;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(p.nextEdge!=null)</span></span>
<span class="line"><span>            p = p.nextEdge;</span></span>
<span class="line"><span>        p.nextEdge = node;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 返回ch位置</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int getPosition(char ch) {</span></span>
<span class="line"><span>        for(int i=0; i&lt;mVexs.length; i++)</span></span>
<span class="line"><span>            if(mVexs[i].data==ch)</span></span>
<span class="line"><span>                return i;</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 读取一个输入字符</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private char readChar() {</span></span>
<span class="line"><span>        char ch=&#39;0&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ch = (char)System.in.read();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } while(!((ch&gt;=&#39;a&#39;&amp;&amp;ch&lt;=&#39;z&#39;) || (ch&gt;=&#39;A&#39;&amp;&amp;ch&lt;=&#39;Z&#39;)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return ch;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 读取一个输入字符</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int readInt() {</span></span>
<span class="line"><span>        Scanner scanner = new Scanner(System.in);</span></span>
<span class="line"><span>        return scanner.nextInt();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 深度优先搜索遍历图的递归实现</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void DFS(int i, boolean[] visited) {</span></span>
<span class="line"><span>        ENode node;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        visited[i] = true;</span></span>
<span class="line"><span>        System.out.printf(&quot;%c &quot;, mVexs[i].data);</span></span>
<span class="line"><span>        node = mVexs[i].firstEdge;</span></span>
<span class="line"><span>        while (node != null) {</span></span>
<span class="line"><span>            if (!visited[node.ivex])</span></span>
<span class="line"><span>                DFS(node.ivex, visited);</span></span>
<span class="line"><span>            node = node.nextEdge;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 深度优先搜索遍历图</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void DFS() {</span></span>
<span class="line"><span>        boolean[] visited = new boolean[mVexs.length];       // 顶点访问标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化所有顶点都没有被访问</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            visited[i] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;DFS: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            if (!visited[i])</span></span>
<span class="line"><span>                DFS(i, visited);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 广度优先搜索（类似于树的层次遍历）</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void BFS() {</span></span>
<span class="line"><span>        int head = 0;</span></span>
<span class="line"><span>        int rear = 0;</span></span>
<span class="line"><span>        int[] queue = new int[mVexs.length];            // 辅组队列</span></span>
<span class="line"><span>        boolean[] visited = new boolean[mVexs.length];  // 顶点访问标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            visited[i] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;BFS: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            if (!visited[i]) {</span></span>
<span class="line"><span>                visited[i] = true;</span></span>
<span class="line"><span>                System.out.printf(&quot;%c &quot;, mVexs[i].data);</span></span>
<span class="line"><span>                queue[rear++] = i;  // 入队列</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            while (head != rear) {</span></span>
<span class="line"><span>                int j = queue[head++];  // 出队列</span></span>
<span class="line"><span>                ENode node = mVexs[j].firstEdge;</span></span>
<span class="line"><span>                while (node != null) {</span></span>
<span class="line"><span>                    int k = node.ivex;</span></span>
<span class="line"><span>                    if (!visited[k])</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        visited[k] = true;</span></span>
<span class="line"><span>                        System.out.printf(&quot;%c &quot;, mVexs[k].data);</span></span>
<span class="line"><span>                        queue[rear++] = k;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    node = node.nextEdge;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 打印矩阵队列图</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void print() {</span></span>
<span class="line"><span>        System.out.printf(&quot;List Graph:\\n&quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            System.out.printf(&quot;%d(%c): &quot;, i, mVexs[i].data);</span></span>
<span class="line"><span>            ENode node = mVexs[i].firstEdge;</span></span>
<span class="line"><span>            while (node != null) {</span></span>
<span class="line"><span>                System.out.printf(&quot;%d(%c) &quot;, node.ivex, mVexs[node.ivex].data);</span></span>
<span class="line"><span>                node = node.nextEdge;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        char[] vexs = {&#39;A&#39;, &#39;B&#39;, &#39;C&#39;, &#39;D&#39;, &#39;E&#39;, &#39;F&#39;, &#39;G&#39;};</span></span>
<span class="line"><span>        char[][] edges = new char[][]{</span></span>
<span class="line"><span>            {&#39;A&#39;, &#39;C&#39;}, </span></span>
<span class="line"><span>            {&#39;A&#39;, &#39;D&#39;}, </span></span>
<span class="line"><span>            {&#39;A&#39;, &#39;F&#39;}, </span></span>
<span class="line"><span>            {&#39;B&#39;, &#39;C&#39;}, </span></span>
<span class="line"><span>            {&#39;C&#39;, &#39;D&#39;}, </span></span>
<span class="line"><span>            {&#39;E&#39;, &#39;G&#39;}, </span></span>
<span class="line"><span>            {&#39;F&#39;, &#39;G&#39;}};</span></span>
<span class="line"><span>        ListUDG pG;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 自定义&quot;图&quot;(输入矩阵队列)</span></span>
<span class="line"><span>        //pG = new ListUDG();</span></span>
<span class="line"><span>        // 采用已有的&quot;图&quot;</span></span>
<span class="line"><span>        pG = new ListUDG(vexs, edges);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pG.print();   // 打印图</span></span>
<span class="line"><span>        pG.DFS();     // 深度优先遍历</span></span>
<span class="line"><span>        pG.BFS();     // 广度优先遍历</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="邻接矩阵实现的有向图" tabindex="-1">邻接矩阵实现的有向图 <a class="header-anchor" href="#邻接矩阵实现的有向图" aria-label="Permalink to &quot;邻接矩阵实现的有向图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.util.Scanner;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MatrixDG {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private char[] mVexs;       // 顶点集合</span></span>
<span class="line"><span>    private int[][] mMatrix;    // 邻接矩阵</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 创建图(自己输入数据)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public MatrixDG() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 输入&quot;顶点数&quot;和&quot;边数&quot;</span></span>
<span class="line"><span>        System.out.printf(&quot;input vertex number: &quot;);</span></span>
<span class="line"><span>        int vlen = readInt();</span></span>
<span class="line"><span>        System.out.printf(&quot;input edge number: &quot;);</span></span>
<span class="line"><span>        int elen = readInt();</span></span>
<span class="line"><span>        if ( vlen &lt; 1 || elen &lt; 1 || (elen &gt; (vlen*(vlen - 1)))) {</span></span>
<span class="line"><span>            System.out.printf(&quot;input error: invalid parameters!\\n&quot;);</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化&quot;顶点&quot;</span></span>
<span class="line"><span>        mVexs = new char[vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            System.out.printf(&quot;vertex(%d): &quot;, i);</span></span>
<span class="line"><span>            mVexs[i] = readChar();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;边&quot;</span></span>
<span class="line"><span>        mMatrix = new int[vlen][vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; elen; i++) {</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            System.out.printf(&quot;edge(%d):&quot;, i);</span></span>
<span class="line"><span>            char c1 = readChar();</span></span>
<span class="line"><span>            char c2 = readChar();</span></span>
<span class="line"><span>            int p1 = getPosition(c1);</span></span>
<span class="line"><span>            int p2 = getPosition(c2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (p1==-1 || p2==-1) {</span></span>
<span class="line"><span>                System.out.printf(&quot;input error: invalid edge!\\n&quot;);</span></span>
<span class="line"><span>                return ;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            mMatrix[p1][p2] = 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 创建图(用已提供的矩阵)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明：</span></span>
<span class="line"><span>     *     vexs  -- 顶点数组</span></span>
<span class="line"><span>     *     edges -- 边数组</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public MatrixDG(char[] vexs, char[][] edges) {</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化&quot;顶点数&quot;和&quot;边数&quot;</span></span>
<span class="line"><span>        int vlen = vexs.length;</span></span>
<span class="line"><span>        int elen = edges.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;顶点&quot;</span></span>
<span class="line"><span>        mVexs = new char[vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            mVexs[i] = vexs[i];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;边&quot;</span></span>
<span class="line"><span>        mMatrix = new int[vlen][vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; elen; i++) {</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            int p1 = getPosition(edges[i][0]);</span></span>
<span class="line"><span>            int p2 = getPosition(edges[i][1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            mMatrix[p1][p2] = 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 返回ch位置</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int getPosition(char ch) {</span></span>
<span class="line"><span>        for(int i=0; i&lt;mVexs.length; i++)</span></span>
<span class="line"><span>            if(mVexs[i]==ch)</span></span>
<span class="line"><span>                return i;</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 读取一个输入字符</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private char readChar() {</span></span>
<span class="line"><span>        char ch=&#39;0&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ch = (char)System.in.read();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } while(!((ch&gt;=&#39;a&#39;&amp;&amp;ch&lt;=&#39;z&#39;) || (ch&gt;=&#39;A&#39;&amp;&amp;ch&lt;=&#39;Z&#39;)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return ch;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 读取一个输入字符</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int readInt() {</span></span>
<span class="line"><span>        Scanner scanner = new Scanner(System.in);</span></span>
<span class="line"><span>        return scanner.nextInt();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 返回顶点v的第一个邻接顶点的索引，失败则返回-1</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int firstVertex(int v) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (v&lt;0 || v&gt;(mVexs.length-1))</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            if (mMatrix[v][i] == 1)</span></span>
<span class="line"><span>                return i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 返回顶点v相对于w的下一个邻接顶点的索引，失败则返回-1</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int nextVertex(int v, int w) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (v&lt;0 || v&gt;(mVexs.length-1) || w&lt;0 || w&gt;(mVexs.length-1))</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = w + 1; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            if (mMatrix[v][i] == 1)</span></span>
<span class="line"><span>                return i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 深度优先搜索遍历图的递归实现</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void DFS(int i, boolean[] visited) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        visited[i] = true;</span></span>
<span class="line"><span>        System.out.printf(&quot;%c &quot;, mVexs[i]);</span></span>
<span class="line"><span>        // 遍历该顶点的所有邻接顶点。若是没有访问过，那么继续往下走</span></span>
<span class="line"><span>        for (int w = firstVertex(i); w &gt;= 0; w = nextVertex(i, w)) {</span></span>
<span class="line"><span>            if (!visited[w])</span></span>
<span class="line"><span>                DFS(w, visited);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 深度优先搜索遍历图</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void DFS() {</span></span>
<span class="line"><span>        boolean[] visited = new boolean[mVexs.length];       // 顶点访问标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化所有顶点都没有被访问</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            visited[i] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;DFS: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            if (!visited[i])</span></span>
<span class="line"><span>                DFS(i, visited);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 广度优先搜索（类似于树的层次遍历）</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void BFS() {</span></span>
<span class="line"><span>        int head = 0;</span></span>
<span class="line"><span>        int rear = 0;</span></span>
<span class="line"><span>        int[] queue = new int[mVexs.length];            // 辅组队列</span></span>
<span class="line"><span>        boolean[] visited = new boolean[mVexs.length];  // 顶点访问标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            visited[i] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;BFS: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            if (!visited[i]) {</span></span>
<span class="line"><span>                visited[i] = true;</span></span>
<span class="line"><span>                System.out.printf(&quot;%c &quot;, mVexs[i]);</span></span>
<span class="line"><span>                queue[rear++] = i;  // 入队列</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            while (head != rear) {</span></span>
<span class="line"><span>                int j = queue[head++];  // 出队列</span></span>
<span class="line"><span>                for (int k = firstVertex(j); k &gt;= 0; k = nextVertex(j, k)) { //k是为访问的邻接顶点</span></span>
<span class="line"><span>                    if (!visited[k]) {</span></span>
<span class="line"><span>                        visited[k] = true;</span></span>
<span class="line"><span>                        System.out.printf(&quot;%c &quot;, mVexs[k]);</span></span>
<span class="line"><span>                        queue[rear++] = k;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 打印矩阵队列图</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void print() {</span></span>
<span class="line"><span>        System.out.printf(&quot;Martix Graph:\\n&quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            for (int j = 0; j &lt; mVexs.length; j++)</span></span>
<span class="line"><span>                System.out.printf(&quot;%d &quot;, mMatrix[i][j]);</span></span>
<span class="line"><span>            System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        char[] vexs = {&#39;A&#39;, &#39;B&#39;, &#39;C&#39;, &#39;D&#39;, &#39;E&#39;, &#39;F&#39;, &#39;G&#39;};</span></span>
<span class="line"><span>        char[][] edges = new char[][]{</span></span>
<span class="line"><span>            {&#39;A&#39;, &#39;B&#39;}, </span></span>
<span class="line"><span>            {&#39;B&#39;, &#39;C&#39;}, </span></span>
<span class="line"><span>            {&#39;B&#39;, &#39;E&#39;}, </span></span>
<span class="line"><span>            {&#39;B&#39;, &#39;F&#39;}, </span></span>
<span class="line"><span>            {&#39;C&#39;, &#39;E&#39;}, </span></span>
<span class="line"><span>            {&#39;D&#39;, &#39;C&#39;}, </span></span>
<span class="line"><span>            {&#39;E&#39;, &#39;B&#39;}, </span></span>
<span class="line"><span>            {&#39;E&#39;, &#39;D&#39;}, </span></span>
<span class="line"><span>            {&#39;F&#39;, &#39;G&#39;}}; </span></span>
<span class="line"><span>        MatrixDG pG;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 自定义&quot;图&quot;(输入矩阵队列)</span></span>
<span class="line"><span>        //pG = new MatrixDG();</span></span>
<span class="line"><span>        // 采用已有的&quot;图&quot;</span></span>
<span class="line"><span>        pG = new MatrixDG(vexs, edges);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pG.print();   // 打印图</span></span>
<span class="line"><span>        pG.DFS();     // 深度优先遍历</span></span>
<span class="line"><span>        pG.BFS();     // 广度优先遍历</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="邻接表实现的有向图" tabindex="-1">邻接表实现的有向图 <a class="header-anchor" href="#邻接表实现的有向图" aria-label="Permalink to &quot;邻接表实现的有向图&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.util.Scanner;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ListDG {</span></span>
<span class="line"><span>    // 邻接表中表对应的链表的顶点</span></span>
<span class="line"><span>    private class ENode {</span></span>
<span class="line"><span>        int ivex;       // 该边所指向的顶点的位置</span></span>
<span class="line"><span>        ENode nextEdge; // 指向下一条弧的指针</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 邻接表中表的顶点</span></span>
<span class="line"><span>    private class VNode {</span></span>
<span class="line"><span>        char data;          // 顶点信息</span></span>
<span class="line"><span>        ENode firstEdge;    // 指向第一条依附该顶点的弧</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private VNode[] mVexs;  // 顶点数组</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 创建图(自己输入数据)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public ListDG() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 输入&quot;顶点数&quot;和&quot;边数&quot;</span></span>
<span class="line"><span>        System.out.printf(&quot;input vertex number: &quot;);</span></span>
<span class="line"><span>        int vlen = readInt();</span></span>
<span class="line"><span>        System.out.printf(&quot;input edge number: &quot;);</span></span>
<span class="line"><span>        int elen = readInt();</span></span>
<span class="line"><span>        if ( vlen &lt; 1 || elen &lt; 1 || (elen &gt; (vlen*(vlen - 1)))) {</span></span>
<span class="line"><span>            System.out.printf(&quot;input error: invalid parameters!\\n&quot;);</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化&quot;顶点&quot;</span></span>
<span class="line"><span>        mVexs = new VNode[vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            System.out.printf(&quot;vertex(%d): &quot;, i);</span></span>
<span class="line"><span>            mVexs[i] = new VNode();</span></span>
<span class="line"><span>            mVexs[i].data = readChar();</span></span>
<span class="line"><span>            mVexs[i].firstEdge = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;边&quot;</span></span>
<span class="line"><span>        //mMatrix = new int[vlen][vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; elen; i++) {</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            System.out.printf(&quot;edge(%d):&quot;, i);</span></span>
<span class="line"><span>            char c1 = readChar();</span></span>
<span class="line"><span>            char c2 = readChar();</span></span>
<span class="line"><span>            int p1 = getPosition(c1);</span></span>
<span class="line"><span>            int p2 = getPosition(c2);</span></span>
<span class="line"><span>            // 初始化node1</span></span>
<span class="line"><span>            ENode node1 = new ENode();</span></span>
<span class="line"><span>            node1.ivex = p2;</span></span>
<span class="line"><span>            // 将node1链接到&quot;p1所在链表的末尾&quot;</span></span>
<span class="line"><span>            if(mVexs[p1].firstEdge == null)</span></span>
<span class="line"><span>              mVexs[p1].firstEdge = node1;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                linkLast(mVexs[p1].firstEdge, node1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 创建图(用已提供的矩阵)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明：</span></span>
<span class="line"><span>     *     vexs  -- 顶点数组</span></span>
<span class="line"><span>     *     edges -- 边数组</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public ListDG(char[] vexs, char[][] edges) {</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化&quot;顶点数&quot;和&quot;边数&quot;</span></span>
<span class="line"><span>        int vlen = vexs.length;</span></span>
<span class="line"><span>        int elen = edges.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;顶点&quot;</span></span>
<span class="line"><span>        mVexs = new VNode[vlen];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            mVexs[i] = new VNode();</span></span>
<span class="line"><span>            mVexs[i].data = vexs[i];</span></span>
<span class="line"><span>            mVexs[i].firstEdge = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化&quot;边&quot;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; elen; i++) {</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            char c1 = edges[i][0];</span></span>
<span class="line"><span>            char c2 = edges[i][1];</span></span>
<span class="line"><span>            // 读取边的起始顶点和结束顶点</span></span>
<span class="line"><span>            int p1 = getPosition(edges[i][0]);</span></span>
<span class="line"><span>            int p2 = getPosition(edges[i][1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 初始化node1</span></span>
<span class="line"><span>            ENode node1 = new ENode();</span></span>
<span class="line"><span>            node1.ivex = p2;</span></span>
<span class="line"><span>            // 将node1链接到&quot;p1所在链表的末尾&quot;</span></span>
<span class="line"><span>            if(mVexs[p1].firstEdge == null)</span></span>
<span class="line"><span>              mVexs[p1].firstEdge = node1;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                linkLast(mVexs[p1].firstEdge, node1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 将node节点链接到list的最后</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void linkLast(ENode list, ENode node) {</span></span>
<span class="line"><span>        ENode p = list;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(p.nextEdge!=null)</span></span>
<span class="line"><span>            p = p.nextEdge;</span></span>
<span class="line"><span>        p.nextEdge = node;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 返回ch位置</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int getPosition(char ch) {</span></span>
<span class="line"><span>        for(int i=0; i&lt;mVexs.length; i++)</span></span>
<span class="line"><span>            if(mVexs[i].data==ch)</span></span>
<span class="line"><span>                return i;</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 读取一个输入字符</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private char readChar() {</span></span>
<span class="line"><span>        char ch=&#39;0&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ch = (char)System.in.read();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } while(!((ch&gt;=&#39;a&#39;&amp;&amp;ch&lt;=&#39;z&#39;) || (ch&gt;=&#39;A&#39;&amp;&amp;ch&lt;=&#39;Z&#39;)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return ch;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 读取一个输入字符</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int readInt() {</span></span>
<span class="line"><span>        Scanner scanner = new Scanner(System.in);</span></span>
<span class="line"><span>        return scanner.nextInt();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 深度优先搜索遍历图的递归实现</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void DFS(int i, boolean[] visited) {</span></span>
<span class="line"><span>        ENode node;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        visited[i] = true;</span></span>
<span class="line"><span>        System.out.printf(&quot;%c &quot;, mVexs[i].data);</span></span>
<span class="line"><span>        node = mVexs[i].firstEdge;</span></span>
<span class="line"><span>        while (node != null) {</span></span>
<span class="line"><span>            if (!visited[node.ivex])</span></span>
<span class="line"><span>                DFS(node.ivex, visited);</span></span>
<span class="line"><span>            node = node.nextEdge;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 深度优先搜索遍历图</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void DFS() {</span></span>
<span class="line"><span>        boolean[] visited = new boolean[mVexs.length];       // 顶点访问标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化所有顶点都没有被访问</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            visited[i] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;DFS: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            if (!visited[i])</span></span>
<span class="line"><span>                DFS(i, visited);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 广度优先搜索（类似于树的层次遍历）</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void BFS() {</span></span>
<span class="line"><span>        int head = 0;</span></span>
<span class="line"><span>        int rear = 0;</span></span>
<span class="line"><span>        int[] queue = new int[mVexs.length];            // 辅组队列</span></span>
<span class="line"><span>        boolean[] visited = new boolean[mVexs.length];  // 顶点访问标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++)</span></span>
<span class="line"><span>            visited[i] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;BFS: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            if (!visited[i]) {</span></span>
<span class="line"><span>                visited[i] = true;</span></span>
<span class="line"><span>                System.out.printf(&quot;%c &quot;, mVexs[i].data);</span></span>
<span class="line"><span>                queue[rear++] = i;  // 入队列</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            while (head != rear) {</span></span>
<span class="line"><span>                int j = queue[head++];  // 出队列</span></span>
<span class="line"><span>                ENode node = mVexs[j].firstEdge;</span></span>
<span class="line"><span>                while (node != null) {</span></span>
<span class="line"><span>                    int k = node.ivex;</span></span>
<span class="line"><span>                    if (!visited[k])</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        visited[k] = true;</span></span>
<span class="line"><span>                        System.out.printf(&quot;%c &quot;, mVexs[k].data);</span></span>
<span class="line"><span>                        queue[rear++] = k;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    node = node.nextEdge;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 打印矩阵队列图</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void print() {</span></span>
<span class="line"><span>        System.out.printf(&quot;List Graph:\\n&quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mVexs.length; i++) {</span></span>
<span class="line"><span>            System.out.printf(&quot;%d(%c): &quot;, i, mVexs[i].data);</span></span>
<span class="line"><span>            ENode node = mVexs[i].firstEdge;</span></span>
<span class="line"><span>            while (node != null) {</span></span>
<span class="line"><span>                System.out.printf(&quot;%d(%c) &quot;, node.ivex, mVexs[node.ivex].data);</span></span>
<span class="line"><span>                node = node.nextEdge;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        char[] vexs = {&#39;A&#39;, &#39;B&#39;, &#39;C&#39;, &#39;D&#39;, &#39;E&#39;, &#39;F&#39;, &#39;G&#39;};</span></span>
<span class="line"><span>        char[][] edges = new char[][]{</span></span>
<span class="line"><span>            {&#39;A&#39;, &#39;B&#39;}, </span></span>
<span class="line"><span>            {&#39;B&#39;, &#39;C&#39;}, </span></span>
<span class="line"><span>            {&#39;B&#39;, &#39;E&#39;}, </span></span>
<span class="line"><span>            {&#39;B&#39;, &#39;F&#39;}, </span></span>
<span class="line"><span>            {&#39;C&#39;, &#39;E&#39;}, </span></span>
<span class="line"><span>            {&#39;D&#39;, &#39;C&#39;}, </span></span>
<span class="line"><span>            {&#39;E&#39;, &#39;B&#39;}, </span></span>
<span class="line"><span>            {&#39;E&#39;, &#39;D&#39;}, </span></span>
<span class="line"><span>            {&#39;F&#39;, &#39;G&#39;}}; </span></span>
<span class="line"><span>        ListDG pG;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 自定义&quot;图&quot;(输入矩阵队列)</span></span>
<span class="line"><span>        //pG = new ListDG();</span></span>
<span class="line"><span>        // 采用已有的&quot;图&quot;</span></span>
<span class="line"><span>        pG = new ListDG(vexs, edges);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pG.print();   // 打印图</span></span>
<span class="line"><span>        pG.DFS();     // 深度优先遍历</span></span>
<span class="line"><span>        pG.BFS();     // 广度优先遍历</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3711483.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3711483.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,67)]))}const V=s(d,[["render",u]]);export{f as __pageData,V as default};
