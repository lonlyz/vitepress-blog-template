import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/pics/4ff355cf-9a7f-4468-af43-e5b02038facc.jpg",i="/vitepress-blog-template/images/pics/f7f7e3e5-7dd4-4173-9999-576b9e2ac0a2.png",b=JSON.parse('{"title":"算法思想 - 搜索算法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-core-search.md","filePath":"algorithm/alg-core-search.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-core-search.md"};function c(r,n,o,d,u,h){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="算法思想-搜索算法" tabindex="-1">算法思想 - 搜索算法 <a class="header-anchor" href="#算法思想-搜索算法" aria-label="Permalink to &quot;算法思想 - 搜索算法&quot;">​</a></h1><blockquote><p>本文主要介绍算法中搜索算法的思想，主要包含BFS，DFS。@pdai</p></blockquote><h2 id="搜索相关题目" tabindex="-1">搜索相关题目 <a class="header-anchor" href="#搜索相关题目" aria-label="Permalink to &quot;搜索相关题目&quot;">​</a></h2><p>深度优先搜索和广度优先搜索广泛运用于树和图中，但是它们的应用远远不止如此。</p><h3 id="bfs" tabindex="-1">BFS <a class="header-anchor" href="#bfs" aria-label="Permalink to &quot;BFS&quot;">​</a></h3><p><img src="'+l+`" alt="image"></p><p>广度优先搜索的搜索过程有点像一层一层地进行遍历，每层遍历都以上一层遍历的结果作为起点，遍历一个距离能访问到的所有节点。需要注意的是，遍历过的节点不能再次被遍历。</p><p>第一层:</p><ul><li>0 -&gt; {6,2,1,5};</li></ul><p>第二层:</p><ul><li>6 -&gt;</li><li>2 -&gt; {}</li><li>1 -&gt; {}</li><li>5 -&gt;</li></ul><p>第三层:</p><ul><li>4 -&gt; {}</li><li>3 -&gt; {}</li></ul><p>可以看到，每一层遍历的节点都与根节点距离相同。设 di 表示第 i 个节点与根节点的距离，推导出一个结论: 对于先遍历的节点 i 与后遍历的节点 j，有 di&lt;=dj。利用这个结论，可以求解最短路径等 <strong>最优解</strong> 问题: 第一次遍历到目的节点，其所经过的路径为最短路径。应该注意的是，使用 BFS 只能求解无权图的最短路径。</p><p>在程序实现 BFS 时需要考虑以下问题:</p><ul><li>队列: 用来存储每一轮遍历得到的节点；</li><li>标记: 对于遍历过的节点，应该将它标记，防止重复遍历。</li></ul><h4 id="计算在网格中从原点到特定点的最短路径长度" tabindex="-1">计算在网格中从原点到特定点的最短路径长度 <a class="header-anchor" href="#计算在网格中从原点到特定点的最短路径长度" aria-label="Permalink to &quot;计算在网格中从原点到特定点的最短路径长度&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[[1,1,0,1],</span></span>
<span class="line"><span> [1,0,1,0],</span></span>
<span class="line"><span> [1,1,1,1],</span></span>
<span class="line"><span> [1,0,1,1]]</span></span></code></pre></div><p>1 表示可以经过某个位置，求解从 (0, 0) 位置到 (tr, tc) 位置的最短路径长度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int minPathLength(int[][] grids, int tr, int tc) {</span></span>
<span class="line"><span>    final int[][] direction = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};</span></span>
<span class="line"><span>    final int m = grids.length, n = grids[0].length;</span></span>
<span class="line"><span>    Queue&lt;Pair&lt;Integer, Integer&gt;&gt; queue = new LinkedList&lt;&gt;();</span></span>
<span class="line"><span>    queue.add(new Pair&lt;&gt;(0, 0));</span></span>
<span class="line"><span>    int pathLength = 0;</span></span>
<span class="line"><span>    while (!queue.isEmpty()) {</span></span>
<span class="line"><span>        int size = queue.size();</span></span>
<span class="line"><span>        pathLength++;</span></span>
<span class="line"><span>        while (size-- &gt; 0) {</span></span>
<span class="line"><span>            Pair&lt;Integer, Integer&gt; cur = queue.poll();</span></span>
<span class="line"><span>            for (int[] d : direction) {</span></span>
<span class="line"><span>                int nr = cur.getKey() + d[0], nc = cur.getValue() + d[1];</span></span>
<span class="line"><span>                Pair&lt;Integer, Integer&gt; next = new Pair&lt;&gt;(nr, nc);</span></span>
<span class="line"><span>                if (next.getKey() &lt; 0 || next.getValue() &gt;= m</span></span>
<span class="line"><span>                        || next.getKey() &lt; 0 || next.getValue() &gt;= n) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                grids[next.getKey()][next.getValue()] = 0; // 标记</span></span>
<span class="line"><span>                if (next.getKey() == tr &amp;&amp; next.getValue() == tc) {</span></span>
<span class="line"><span>                    return pathLength;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                queue.add(next);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return -1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="组成整数的最小平方数数量" tabindex="-1">组成整数的最小平方数数量 <a class="header-anchor" href="#组成整数的最小平方数数量" aria-label="Permalink to &quot;组成整数的最小平方数数量&quot;">​</a></h4><p><a href="https://leetcode.com/problems/perfect-squares/description/" target="_blank" rel="noreferrer">279. Perfect Squares (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>For example, given n = 12, return 3 because 12 = 4 + 4 + 4; given n = 13, return 2 because 13 = 4 + 9.</span></span></code></pre></div><p>可以将每个整数看成图中的一个节点，如果两个整数之差为一个平方数，那么这两个整数所在的节点就有一条边。</p><p>要求解最小的平方数数量，就是求解从节点 n 到节点 0 的最短路径。</p><p>本题也可以用动态规划求解，在之后动态规划部分中会再次出现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int numSquares(int n) {</span></span>
<span class="line"><span>    List&lt;Integer&gt; squares = generateSquares(n);</span></span>
<span class="line"><span>    Queue&lt;Integer&gt; queue = new LinkedList&lt;&gt;();</span></span>
<span class="line"><span>    boolean[] marked = new boolean[n + 1];</span></span>
<span class="line"><span>    queue.add(n);</span></span>
<span class="line"><span>    marked[n] = true;</span></span>
<span class="line"><span>    int level = 0;</span></span>
<span class="line"><span>    while (!queue.isEmpty()) {</span></span>
<span class="line"><span>        int size = queue.size();</span></span>
<span class="line"><span>        level++;</span></span>
<span class="line"><span>        while (size-- &gt; 0) {</span></span>
<span class="line"><span>            int cur = queue.poll();</span></span>
<span class="line"><span>            for (int s : squares) {</span></span>
<span class="line"><span>                int next = cur - s;</span></span>
<span class="line"><span>                if (next &lt; 0) {</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (next == 0) {</span></span>
<span class="line"><span>                    return level;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (marked[next]) {</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                marked[next] = true;</span></span>
<span class="line"><span>                queue.add(cur - s);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return n;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 生成小于 n 的平方数序列</span></span>
<span class="line"><span> * @return 1,4,9,...</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private List&lt;Integer&gt; generateSquares(int n) {</span></span>
<span class="line"><span>    List&lt;Integer&gt; squares = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    int square = 1;</span></span>
<span class="line"><span>    int diff = 3;</span></span>
<span class="line"><span>    while (square &lt;= n) {</span></span>
<span class="line"><span>        squares.add(square);</span></span>
<span class="line"><span>        square += diff;</span></span>
<span class="line"><span>        diff += 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return squares;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="最短单词路径" tabindex="-1">最短单词路径 <a class="header-anchor" href="#最短单词路径" aria-label="Permalink to &quot;最短单词路径&quot;">​</a></h4><p><a href="https://leetcode.com/problems/word-ladder/description/" target="_blank" rel="noreferrer">127. Word Ladder (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>beginWord = &quot;hit&quot;,</span></span>
<span class="line"><span>endWord = &quot;cog&quot;,</span></span>
<span class="line"><span>wordList = [&quot;hot&quot;,&quot;dot&quot;,&quot;dog&quot;,&quot;lot&quot;,&quot;log&quot;,&quot;cog&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output: 5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Explanation: As one shortest transformation is &quot;hit&quot; -&gt; &quot;hot&quot; -&gt; &quot;dot&quot; -&gt; &quot;dog&quot; -&gt; &quot;cog&quot;,</span></span>
<span class="line"><span>return its length 5.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>beginWord = &quot;hit&quot;</span></span>
<span class="line"><span>endWord = &quot;cog&quot;</span></span>
<span class="line"><span>wordList = [&quot;hot&quot;,&quot;dot&quot;,&quot;dog&quot;,&quot;lot&quot;,&quot;log&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output: 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Explanation: The endWord &quot;cog&quot; is not in wordList, therefore no possible transformation.</span></span></code></pre></div><p>找出一条从 beginWord 到 endWord 的最短路径，每次移动规定为改变一个字符，并且改变之后的字符串必须在 wordList 中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int ladderLength(String beginWord, String endWord, List&lt;String&gt; wordList) {</span></span>
<span class="line"><span>    wordList.add(beginWord);</span></span>
<span class="line"><span>    int N = wordList.size();</span></span>
<span class="line"><span>    int start = N - 1;</span></span>
<span class="line"><span>    int end = 0;</span></span>
<span class="line"><span>    while (end &lt; N &amp;&amp; !wordList.get(end).equals(endWord)) {</span></span>
<span class="line"><span>        end++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (end == N) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    List&lt;Integer&gt;[] graphic = buildGraphic(wordList);</span></span>
<span class="line"><span>    return getShortestPath(graphic, start, end);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private List&lt;Integer&gt;[] buildGraphic(List&lt;String&gt; wordList) {</span></span>
<span class="line"><span>    int N = wordList.size();</span></span>
<span class="line"><span>    List&lt;Integer&gt;[] graphic = new List[N];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; N; i++) {</span></span>
<span class="line"><span>        graphic[i] = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        for (int j = 0; j &lt; N; j++) {</span></span>
<span class="line"><span>            if (isConnect(wordList.get(i), wordList.get(j))) {</span></span>
<span class="line"><span>                graphic[i].add(j);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return graphic;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean isConnect(String s1, String s2) {</span></span>
<span class="line"><span>    int diffCnt = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; s1.length() &amp;&amp; diffCnt &lt;= 1; i++) {</span></span>
<span class="line"><span>        if (s1.charAt(i) != s2.charAt(i)) {</span></span>
<span class="line"><span>            diffCnt++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return diffCnt == 1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int getShortestPath(List&lt;Integer&gt;[] graphic, int start, int end) {</span></span>
<span class="line"><span>    Queue&lt;Integer&gt; queue = new LinkedList&lt;&gt;();</span></span>
<span class="line"><span>    boolean[] marked = new boolean[graphic.length];</span></span>
<span class="line"><span>    queue.add(start);</span></span>
<span class="line"><span>    marked[start] = true;</span></span>
<span class="line"><span>    int path = 1;</span></span>
<span class="line"><span>    while (!queue.isEmpty()) {</span></span>
<span class="line"><span>        int size = queue.size();</span></span>
<span class="line"><span>        path++;</span></span>
<span class="line"><span>        while (size-- &gt; 0) {</span></span>
<span class="line"><span>            int cur = queue.poll();</span></span>
<span class="line"><span>            for (int next : graphic[cur]) {</span></span>
<span class="line"><span>                if (next == end) {</span></span>
<span class="line"><span>                    return path;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (marked[next]) {</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                marked[next] = true;</span></span>
<span class="line"><span>                queue.add(next);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="dfs" tabindex="-1">DFS <a class="header-anchor" href="#dfs" aria-label="Permalink to &quot;DFS&quot;">​</a></h3><p><img src="`+i+`" alt="image"></p><p>广度优先搜索一层一层遍历，每一层得到的所有新节点，要用队列存储起来以备下一层遍历的时候再遍历。</p><p>而深度优先搜索在得到一个新节点时立马对新节点进行遍历: 从节点 0 出发开始遍历，得到到新节点 6 时，立马对新节点 6 进行遍历，得到新节点 4；如此反复以这种方式遍历新节点，直到没有新节点了，此时返回。返回到根节点 0 的情况是，继续对根节点 0 进行遍历，得到新节点 2，然后继续以上步骤。</p><p>从一个节点出发，使用 DFS 对一个图进行遍历时，能够遍历到的节点都是从初始节点可达的，DFS 常用来求解这种 <strong>可达性</strong> 问题。</p><p>在程序实现 DFS 时需要考虑以下问题:</p><ul><li>栈: 用栈来保存当前节点信息，当遍历新节点返回时能够继续遍历当前节点。可以使用递归栈。</li><li>标记: 和 BFS 一样同样需要对已经遍历过的节点进行标记。</li></ul><h4 id="查找最大的连通面积" tabindex="-1">查找最大的连通面积 <a class="header-anchor" href="#查找最大的连通面积" aria-label="Permalink to &quot;查找最大的连通面积&quot;">​</a></h4><p><a href="https://leetcode.com/problems/max-area-of-island/description/" target="_blank" rel="noreferrer">695. Max Area of Island (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[[0,0,1,0,0,0,0,1,0,0,0,0,0],</span></span>
<span class="line"><span> [0,0,0,0,0,0,0,1,1,1,0,0,0],</span></span>
<span class="line"><span> [0,1,1,0,1,0,0,0,0,0,0,0,0],</span></span>
<span class="line"><span> [0,1,0,0,1,1,0,0,1,0,1,0,0],</span></span>
<span class="line"><span> [0,1,0,0,1,1,0,0,1,1,1,0,0],</span></span>
<span class="line"><span> [0,0,0,0,0,0,0,0,0,0,1,0,0],</span></span>
<span class="line"><span> [0,0,0,0,0,0,0,1,1,1,0,0,0],</span></span>
<span class="line"><span> [0,0,0,0,0,0,0,1,1,0,0,0,0]]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int m, n;</span></span>
<span class="line"><span>private int[][] direction = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public int maxAreaOfIsland(int[][] grid) {</span></span>
<span class="line"><span>    if (grid == null || grid.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    m = grid.length;</span></span>
<span class="line"><span>    n = grid[0].length;</span></span>
<span class="line"><span>    int maxArea = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; m; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; n; j++) {</span></span>
<span class="line"><span>            maxArea = Math.max(maxArea, dfs(grid, i, j));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return maxArea;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int dfs(int[][] grid, int r, int c) {</span></span>
<span class="line"><span>    if (r &lt; 0 || r &gt;= m || c &lt; 0 || c &gt;= n || grid[r][c] == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    grid[r][c] = 0;</span></span>
<span class="line"><span>    int area = 1;</span></span>
<span class="line"><span>    for (int[] d : direction) {</span></span>
<span class="line"><span>        area += dfs(grid, r + d[0], c + d[1]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return area;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="矩阵中的连通分量数目" tabindex="-1">矩阵中的连通分量数目 <a class="header-anchor" href="#矩阵中的连通分量数目" aria-label="Permalink to &quot;矩阵中的连通分量数目&quot;">​</a></h4><p><a href="https://leetcode.com/problems/number-of-islands/description/" target="_blank" rel="noreferrer">200. Number of Islands (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>11000</span></span>
<span class="line"><span>11000</span></span>
<span class="line"><span>00100</span></span>
<span class="line"><span>00011</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output: 3</span></span></code></pre></div><p>可以将矩阵表示看成一张有向图。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int m, n;</span></span>
<span class="line"><span>private int[][] direction = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public int numIslands(char[][] grid) {</span></span>
<span class="line"><span>    if (grid == null || grid.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    m = grid.length;</span></span>
<span class="line"><span>    n = grid[0].length;</span></span>
<span class="line"><span>    int islandsNum = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; m; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; n; j++) {</span></span>
<span class="line"><span>            if (grid[i][j] != &#39;0&#39;) {</span></span>
<span class="line"><span>                dfs(grid, i, j);</span></span>
<span class="line"><span>                islandsNum++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return islandsNum;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void dfs(char[][] grid, int i, int j) {</span></span>
<span class="line"><span>    if (i &lt; 0 || i &gt;= m || j &lt; 0 || j &gt;= n || grid[i][j] == &#39;0&#39;) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    grid[i][j] = &#39;0&#39;;</span></span>
<span class="line"><span>    for (int[] d : direction) {</span></span>
<span class="line"><span>        dfs(grid, i + d[0], j + d[1]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="好友关系的连通分量数目" tabindex="-1">好友关系的连通分量数目 <a class="header-anchor" href="#好友关系的连通分量数目" aria-label="Permalink to &quot;好友关系的连通分量数目&quot;">​</a></h4><p><a href="https://leetcode.com/problems/friend-circles/description/" target="_blank" rel="noreferrer">547. Friend Circles (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>[[1,1,0],</span></span>
<span class="line"><span> [1,1,0],</span></span>
<span class="line"><span> [0,0,1]]</span></span>
<span class="line"><span>Output: 2</span></span>
<span class="line"><span>Explanation:The 0th and 1st students are direct friends, so they are in a friend circle.</span></span>
<span class="line"><span>The 2nd student himself is in a friend circle. So return 2.</span></span></code></pre></div><p>好友关系可以看成是一个无向图，例如第 0 个人与第 1 个人是好友，那么 M[0][1] 和 M[1][0] 的值都为 1。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public int findCircleNum(int[][] M) {</span></span>
<span class="line"><span>    n = M.length;</span></span>
<span class="line"><span>    int circleNum = 0;</span></span>
<span class="line"><span>    boolean[] hasVisited = new boolean[n];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; n; i++) {</span></span>
<span class="line"><span>        if (!hasVisited[i]) {</span></span>
<span class="line"><span>            dfs(M, i, hasVisited);</span></span>
<span class="line"><span>            circleNum++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return circleNum;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void dfs(int[][] M, int i, boolean[] hasVisited) {</span></span>
<span class="line"><span>    hasVisited[i] = true;</span></span>
<span class="line"><span>    for (int k = 0; k &lt; n; k++) {</span></span>
<span class="line"><span>        if (M[i][k] == 1 &amp;&amp; !hasVisited[k]) {</span></span>
<span class="line"><span>            dfs(M, k, hasVisited);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="填充封闭区域" tabindex="-1">填充封闭区域 <a class="header-anchor" href="#填充封闭区域" aria-label="Permalink to &quot;填充封闭区域&quot;">​</a></h4><p><a href="https://leetcode.com/problems/surrounded-regions/description/" target="_blank" rel="noreferrer">130. Surrounded Regions (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>For example,</span></span>
<span class="line"><span>X X X X</span></span>
<span class="line"><span>X O O X</span></span>
<span class="line"><span>X X O X</span></span>
<span class="line"><span>X O X X</span></span>
<span class="line"><span></span></span>
<span class="line"><span>After running your function, the board should be:</span></span>
<span class="line"><span>X X X X</span></span>
<span class="line"><span>X X X X</span></span>
<span class="line"><span>X X X X</span></span>
<span class="line"><span>X O X X</span></span></code></pre></div><p>使被 &#39;X&#39; 包围的 &#39;O&#39; 转换为 &#39;X&#39;。</p><p>先填充最外侧，剩下的就是里侧了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int[][] direction = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};</span></span>
<span class="line"><span>private int m, n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void solve(char[][] board) {</span></span>
<span class="line"><span>    if (board == null || board.length == 0) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    m = board.length;</span></span>
<span class="line"><span>    n = board[0].length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int i = 0; i &lt; m; i++) {</span></span>
<span class="line"><span>        dfs(board, i, 0);</span></span>
<span class="line"><span>        dfs(board, i, n - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 0; i &lt; n; i++) {</span></span>
<span class="line"><span>        dfs(board, 0, i);</span></span>
<span class="line"><span>        dfs(board, m - 1, i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int i = 0; i &lt; m; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; n; j++) {</span></span>
<span class="line"><span>            if (board[i][j] == &#39;T&#39;) {</span></span>
<span class="line"><span>                board[i][j] = &#39;O&#39;;</span></span>
<span class="line"><span>            } else if (board[i][j] == &#39;O&#39;) {</span></span>
<span class="line"><span>                board[i][j] = &#39;X&#39;;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void dfs(char[][] board, int r, int c) {</span></span>
<span class="line"><span>    if (r &lt; 0 || r &gt;= m || c &lt; 0 || c &gt;= n || board[r][c] != &#39;O&#39;) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    board[r][c] = &#39;T&#39;;</span></span>
<span class="line"><span>    for (int[] d : direction) {</span></span>
<span class="line"><span>        dfs(board, r + d[0], c + d[1]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="能到达的太平洋和大西洋的区域" tabindex="-1">能到达的太平洋和大西洋的区域 <a class="header-anchor" href="#能到达的太平洋和大西洋的区域" aria-label="Permalink to &quot;能到达的太平洋和大西洋的区域&quot;">​</a></h4><p><a href="https://leetcode.com/problems/pacific-atlantic-water-flow/description/" target="_blank" rel="noreferrer">417. Pacific Atlantic Water Flow (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Given the following 5x5 matrix:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Pacific ~   ~   ~   ~   ~</span></span>
<span class="line"><span>       ~  1   2   2   3  (5) *</span></span>
<span class="line"><span>       ~  3   2   3  (4) (4) *</span></span>
<span class="line"><span>       ~  2   4  (5)  3   1  *</span></span>
<span class="line"><span>       ~ (6) (7)  1   4   5  *</span></span>
<span class="line"><span>       ~ (5)  1   1   2   4  *</span></span>
<span class="line"><span>          *   *   *   *   * Atlantic</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Return:</span></span>
<span class="line"><span>[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] (positions with parentheses in above matrix).</span></span></code></pre></div><p>左边和上边是太平洋，右边和下边是大西洋，内部的数字代表海拔，海拔高的地方的水能够流到低的地方，求解水能够流到太平洋和大西洋的所有位置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>private int m, n;</span></span>
<span class="line"><span>private int[][] matrix;</span></span>
<span class="line"><span>private int[][] direction = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public List&lt;int[]&gt; pacificAtlantic(int[][] matrix) {</span></span>
<span class="line"><span>    List&lt;int[]&gt; ret = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    if (matrix == null || matrix.length == 0) {</span></span>
<span class="line"><span>        return ret;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    m = matrix.length;</span></span>
<span class="line"><span>    n = matrix[0].length;</span></span>
<span class="line"><span>    this.matrix = matrix;</span></span>
<span class="line"><span>    boolean[][] canReachP = new boolean[m][n];</span></span>
<span class="line"><span>    boolean[][] canReachA = new boolean[m][n];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int i = 0; i &lt; m; i++) {</span></span>
<span class="line"><span>        dfs(i, 0, canReachP);</span></span>
<span class="line"><span>        dfs(i, n - 1, canReachA);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 0; i &lt; n; i++) {</span></span>
<span class="line"><span>        dfs(0, i, canReachP);</span></span>
<span class="line"><span>        dfs(m - 1, i, canReachA);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int i = 0; i &lt; m; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; n; j++) {</span></span>
<span class="line"><span>            if (canReachP[i][j] &amp;&amp; canReachA[i][j]) {</span></span>
<span class="line"><span>                ret.add(new int[]{i, j});</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void dfs(int r, int c, boolean[][] canReach) {</span></span>
<span class="line"><span>    if (canReach[r][c]) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    canReach[r][c] = true;</span></span>
<span class="line"><span>    for (int[] d : direction) {</span></span>
<span class="line"><span>        int nextR = d[0] + r;</span></span>
<span class="line"><span>        int nextC = d[1] + c;</span></span>
<span class="line"><span>        if (nextR &lt; 0 || nextR &gt;= m || nextC &lt; 0 || nextC &gt;= n</span></span>
<span class="line"><span>                || matrix[r][c] &gt; matrix[nextR][nextC]) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        dfs(nextR, nextC, canReach);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,66)]))}const m=s(t,[["render",c]]);export{b as __pageData,m as default};
