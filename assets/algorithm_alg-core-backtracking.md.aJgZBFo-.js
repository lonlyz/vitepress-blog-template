import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/pics/a3f34241-bb80-4879-8ec9-dff2d81b514e.jpg",t="/vitepress-blog-template/images/pics/1ca52246-c443-48ae-b1f8-1cafc09ec75c.png",l="/vitepress-blog-template/images/pics/1f080e53-4758-406c-bb5f-dbedf89b63ce.jpg",c="/vitepress-blog-template/images/pics/85583359-1b45-45f2-9811-4f7bb9a64db7.jpg",r="/vitepress-blog-template/images/pics/9e80f75a-b12b-4344-80c8-1f9ccc2d5246.jpg",k=JSON.parse('{"title":"算法思想 - 回溯算法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-core-backtracking.md","filePath":"algorithm/alg-core-backtracking.md","lastUpdated":1737706346000}'),o={name:"algorithm/alg-core-backtracking.md"};function d(u,s,g,b,m,h){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="算法思想-回溯算法" tabindex="-1">算法思想 - 回溯算法 <a class="header-anchor" href="#算法思想-回溯算法" aria-label="Permalink to &quot;算法思想 - 回溯算法&quot;">​</a></h1><blockquote><p>Backtracking(回溯)属于 DFS, 本文主要介绍算法中Backtracking算法的思想。回溯算法实际上一个类似枚举的搜索尝试过程，主要是在搜索尝试过程中寻找问题的解，当发现已不满足求解条件时，就“回溯”返回，尝试别的路径。回溯法是一种选优搜索法，按选优条件向前搜索，以达到目标。但当探索到某一步时，发现原先选择并不优或达不到目标，就退回一步重新选择，这种走不通就退回再走的技术为回溯法@pdai</p></blockquote><h2 id="backtracking" tabindex="-1">Backtracking <a class="header-anchor" href="#backtracking" aria-label="Permalink to &quot;Backtracking&quot;">​</a></h2><ul><li>普通 DFS 主要用在 <strong>可达性问题</strong> ，这种问题只需要执行到特点的位置然后返回即可。</li><li>而 Backtracking 主要用于求解 <strong>排列组合</strong> 问题，例如有 { &#39;a&#39;,&#39;b&#39;,&#39;c&#39; } 三个字符，求解所有由这三个字符排列得到的字符串，这种问题在执行到特定的位置返回之后还会继续执行求解过程。</li></ul><p>因为 Backtracking 不是立即就返回，而要继续求解，因此在程序实现时，需要注意对元素的标记问题:</p><ul><li>在访问一个新元素进入新的递归调用时，需要将新元素标记为已经访问，这样才能在继续递归调用时不用重复访问该元素；</li><li>但是在递归返回时，需要将元素标记为未访问，因为只需要保证在一个递归链中不同时访问一个元素，可以访问已经访问过但是不在当前递归链中的元素。</li></ul><h3 id="数字键盘组合" tabindex="-1">数字键盘组合 <a class="header-anchor" href="#数字键盘组合" aria-label="Permalink to &quot;数字键盘组合&quot;">​</a></h3><p><a href="https://leetcode.com/problems/letter-combinations-of-a-phone-number/description/" target="_blank" rel="noreferrer">17. Letter Combinations of a Phone Number (Medium)在新窗口打开</a></p><p><img src="'+i+`" alt="image"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:Digit string &quot;23&quot;</span></span>
<span class="line"><span>Output: [&quot;ad&quot;, &quot;ae&quot;, &quot;af&quot;, &quot;bd&quot;, &quot;be&quot;, &quot;bf&quot;, &quot;cd&quot;, &quot;ce&quot;, &quot;cf&quot;].</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>private static final String[] KEYS = {&quot;&quot;, &quot;&quot;, &quot;abc&quot;, &quot;def&quot;, &quot;ghi&quot;, &quot;jkl&quot;, &quot;mno&quot;, &quot;pqrs&quot;, &quot;tuv&quot;, &quot;wxyz&quot;};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public List&lt;String&gt; letterCombinations(String digits) {</span></span>
<span class="line"><span>    List&lt;String&gt; combinations = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    if (digits == null || digits.length() == 0) {</span></span>
<span class="line"><span>        return combinations;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    doCombination(new StringBuilder(), combinations, digits);</span></span>
<span class="line"><span>    return combinations;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void doCombination(StringBuilder prefix, List&lt;String&gt; combinations, final String digits) {</span></span>
<span class="line"><span>    if (prefix.length() == digits.length()) {</span></span>
<span class="line"><span>        combinations.add(prefix.toString());</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int curDigits = digits.charAt(prefix.length()) - &#39;0&#39;;</span></span>
<span class="line"><span>    String letters = KEYS[curDigits];</span></span>
<span class="line"><span>    for (char c : letters.toCharArray()) {</span></span>
<span class="line"><span>        prefix.append(c);                         // 添加</span></span>
<span class="line"><span>        doCombination(prefix, combinations, digits);</span></span>
<span class="line"><span>        prefix.deleteCharAt(prefix.length() - 1); // 删除</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="ip-地址划分" tabindex="-1">IP 地址划分 <a class="header-anchor" href="#ip-地址划分" aria-label="Permalink to &quot;IP 地址划分&quot;">​</a></h3><p><a href="https://leetcode.com/problems/restore-ip-addresses/description/" target="_blank" rel="noreferrer">93. Restore IP Addresses(Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Given &quot;25525511135&quot;,</span></span>
<span class="line"><span>return [&quot;255.255.11.135&quot;, &quot;255.255.111.35&quot;].</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;String&gt; restoreIpAddresses(String s) {</span></span>
<span class="line"><span>    List&lt;String&gt; addresses = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    StringBuilder tempAddress = new StringBuilder();</span></span>
<span class="line"><span>    doRestore(0, tempAddress, addresses, s);</span></span>
<span class="line"><span>    return addresses;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void doRestore(int k, StringBuilder tempAddress, List&lt;String&gt; addresses, String s) {</span></span>
<span class="line"><span>    if (k == 4 || s.length() == 0) {</span></span>
<span class="line"><span>        if (k == 4 &amp;&amp; s.length() == 0) {</span></span>
<span class="line"><span>            addresses.add(tempAddress.toString());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 0; i &lt; s.length() &amp;&amp; i &lt;= 2; i++) {</span></span>
<span class="line"><span>        if (i != 0 &amp;&amp; s.charAt(0) == &#39;0&#39;) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        String part = s.substring(0, i + 1);</span></span>
<span class="line"><span>        if (Integer.valueOf(part) &lt;= 255) {</span></span>
<span class="line"><span>            if (tempAddress.length() != 0) {</span></span>
<span class="line"><span>                part = &quot;.&quot; + part;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            tempAddress.append(part);</span></span>
<span class="line"><span>            doRestore(k + 1, tempAddress, addresses, s.substring(i + 1));</span></span>
<span class="line"><span>            tempAddress.delete(tempAddress.length() - part.length(), tempAddress.length());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="在矩阵中寻找字符串" tabindex="-1">在矩阵中寻找字符串 <a class="header-anchor" href="#在矩阵中寻找字符串" aria-label="Permalink to &quot;在矩阵中寻找字符串&quot;">​</a></h3><p><a href="https://leetcode.com/problems/word-search/description/" target="_blank" rel="noreferrer">79. Word Search (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>For example,</span></span>
<span class="line"><span>Given board =</span></span>
<span class="line"><span>[</span></span>
<span class="line"><span>  [&#39;A&#39;,&#39;B&#39;,&#39;C&#39;,&#39;E&#39;],</span></span>
<span class="line"><span>  [&#39;S&#39;,&#39;F&#39;,&#39;C&#39;,&#39;S&#39;],</span></span>
<span class="line"><span>  [&#39;A&#39;,&#39;D&#39;,&#39;E&#39;,&#39;E&#39;]</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span>word = &quot;ABCCED&quot;, -&gt; returns true,</span></span>
<span class="line"><span>word = &quot;SEE&quot;, -&gt; returns true,</span></span>
<span class="line"><span>word = &quot;ABCB&quot;, -&gt; returns false.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final static int[][] direction = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};</span></span>
<span class="line"><span>private int m;</span></span>
<span class="line"><span>private int n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public boolean exist(char[][] board, String word) {</span></span>
<span class="line"><span>    if (word == null || word.length() == 0) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (board == null || board.length == 0 || board[0].length == 0) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    m = board.length;</span></span>
<span class="line"><span>    n = board[0].length;</span></span>
<span class="line"><span>    boolean[][] hasVisited = new boolean[m][n];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int r = 0; r &lt; m; r++) {</span></span>
<span class="line"><span>        for (int c = 0; c &lt; n; c++) {</span></span>
<span class="line"><span>            if (backtracking(0, r, c, hasVisited, board, word)) {</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean backtracking(int curLen, int r, int c, boolean[][] visited, final char[][] board, final String word) {</span></span>
<span class="line"><span>    if (curLen == word.length()) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (r &lt; 0 || r &gt;= m || c &lt; 0 || c &gt;= n</span></span>
<span class="line"><span>            || board[r][c] != word.charAt(curLen) || visited[r][c]) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    visited[r][c] = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int[] d : direction) {</span></span>
<span class="line"><span>        if (backtracking(curLen + 1, r + d[0], c + d[1], visited, board, word)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    visited[r][c] = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="输出二叉树中所有从根到叶子的路径" tabindex="-1">输出二叉树中所有从根到叶子的路径 <a class="header-anchor" href="#输出二叉树中所有从根到叶子的路径" aria-label="Permalink to &quot;输出二叉树中所有从根到叶子的路径&quot;">​</a></h3><p><a href="https://leetcode.com/problems/binary-tree-paths/description/" target="_blank" rel="noreferrer">257. Binary Tree Paths (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  1</span></span>
<span class="line"><span> /  \\</span></span>
<span class="line"><span>2    3</span></span>
<span class="line"><span> \\</span></span>
<span class="line"><span>  5</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[&quot;1-&gt;2-&gt;5&quot;, &quot;1-&gt;3&quot;]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>public List&lt;String&gt; binaryTreePaths(TreeNode root) {</span></span>
<span class="line"><span>    List&lt;String&gt; paths = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    if (root == null) {</span></span>
<span class="line"><span>        return paths;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    List&lt;Integer&gt; values = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    backtracking(root, values, paths);</span></span>
<span class="line"><span>    return paths;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(TreeNode node, List&lt;Integer&gt; values, List&lt;String&gt; paths) {</span></span>
<span class="line"><span>    if (node == null) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    values.add(node.val);</span></span>
<span class="line"><span>    if (isLeaf(node)) {</span></span>
<span class="line"><span>        paths.add(buildPath(values));</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        backtracking(node.left, values, paths);</span></span>
<span class="line"><span>        backtracking(node.right, values, paths);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    values.remove(values.size() - 1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean isLeaf(TreeNode node) {</span></span>
<span class="line"><span>    return node.left == null &amp;&amp; node.right == null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private String buildPath(List&lt;Integer&gt; values) {</span></span>
<span class="line"><span>    StringBuilder str = new StringBuilder();</span></span>
<span class="line"><span>    for (int i = 0; i &lt; values.size(); i++) {</span></span>
<span class="line"><span>        str.append(values.get(i));</span></span>
<span class="line"><span>        if (i != values.size() - 1) {</span></span>
<span class="line"><span>            str.append(&quot;-&gt;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return str.toString();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="排列" tabindex="-1">排列 <a class="header-anchor" href="#排列" aria-label="Permalink to &quot;排列&quot;">​</a></h3><p><a href="https://leetcode.com/problems/permutations/description/" target="_blank" rel="noreferrer">46. Permutations (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[1,2,3] have the following permutations:</span></span>
<span class="line"><span>[</span></span>
<span class="line"><span>  [1,2,3],</span></span>
<span class="line"><span>  [1,3,2],</span></span>
<span class="line"><span>  [2,1,3],</span></span>
<span class="line"><span>  [2,3,1],</span></span>
<span class="line"><span>  [3,1,2],</span></span>
<span class="line"><span>  [3,2,1]</span></span>
<span class="line"><span>]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;Integer&gt;&gt; permute(int[] nums) {</span></span>
<span class="line"><span>    List&lt;List&lt;Integer&gt;&gt; permutes = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    List&lt;Integer&gt; permuteList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    boolean[] hasVisited = new boolean[nums.length];</span></span>
<span class="line"><span>    backtracking(permuteList, permutes, hasVisited, nums);</span></span>
<span class="line"><span>    return permutes;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(List&lt;Integer&gt; permuteList, List&lt;List&lt;Integer&gt;&gt; permutes, boolean[] visited, final int[] nums) {</span></span>
<span class="line"><span>    if (permuteList.size() == nums.length) {</span></span>
<span class="line"><span>        permutes.add(new ArrayList&lt;&gt;(permuteList)); // 重新构造一个 List</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 0; i &lt; visited.length; i++) {</span></span>
<span class="line"><span>        if (visited[i]) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        visited[i] = true;</span></span>
<span class="line"><span>        permuteList.add(nums[i]);</span></span>
<span class="line"><span>        backtracking(permuteList, permutes, visited, nums);</span></span>
<span class="line"><span>        permuteList.remove(permuteList.size() - 1);</span></span>
<span class="line"><span>        visited[i] = false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="含有相同元素求排列" tabindex="-1">含有相同元素求排列 <a class="header-anchor" href="#含有相同元素求排列" aria-label="Permalink to &quot;含有相同元素求排列&quot;">​</a></h3><p><a href="https://leetcode.com/problems/permutations-ii/description/" target="_blank" rel="noreferrer">47. Permutations II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[1,1,2] have the following unique permutations:</span></span>
<span class="line"><span>[[1,1,2], [1,2,1], [2,1,1]]</span></span></code></pre></div><p>数组元素可能含有相同的元素，进行排列时就有可能出现重复的排列，要求重复的排列只返回一个。</p><p>在实现上，和 Permutations 不同的是要先排序，然后在添加一个元素时，判断这个元素是否等于前一个元素，如果等于，并且前一个元素还未访问，那么就跳过这个元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;Integer&gt;&gt; permuteUnique(int[] nums) {</span></span>
<span class="line"><span>    List&lt;List&lt;Integer&gt;&gt; permutes = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    List&lt;Integer&gt; permuteList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    Arrays.sort(nums);  // 排序</span></span>
<span class="line"><span>    boolean[] hasVisited = new boolean[nums.length];</span></span>
<span class="line"><span>    backtracking(permuteList, permutes, hasVisited, nums);</span></span>
<span class="line"><span>    return permutes;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(List&lt;Integer&gt; permuteList, List&lt;List&lt;Integer&gt;&gt; permutes, boolean[] visited, final int[] nums) {</span></span>
<span class="line"><span>    if (permuteList.size() == nums.length) {</span></span>
<span class="line"><span>        permutes.add(new ArrayList&lt;&gt;(permuteList));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int i = 0; i &lt; visited.length; i++) {</span></span>
<span class="line"><span>        if (i != 0 &amp;&amp; nums[i] == nums[i - 1] &amp;&amp; !visited[i - 1]) {</span></span>
<span class="line"><span>            continue;  // 防止重复</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (visited[i]){</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        visited[i] = true;</span></span>
<span class="line"><span>        permuteList.add(nums[i]);</span></span>
<span class="line"><span>        backtracking(permuteList, permutes, visited, nums);</span></span>
<span class="line"><span>        permuteList.remove(permuteList.size() - 1);</span></span>
<span class="line"><span>        visited[i] = false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="组合" tabindex="-1">组合 <a class="header-anchor" href="#组合" aria-label="Permalink to &quot;组合&quot;">​</a></h3><p><a href="https://leetcode.com/problems/combinations/description/" target="_blank" rel="noreferrer">77. Combinations (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>If n = 4 and k = 2, a solution is:</span></span>
<span class="line"><span>[</span></span>
<span class="line"><span>  [2,4],</span></span>
<span class="line"><span>  [3,4],</span></span>
<span class="line"><span>  [2,3],</span></span>
<span class="line"><span>  [1,2],</span></span>
<span class="line"><span>  [1,3],</span></span>
<span class="line"><span>  [1,4],</span></span>
<span class="line"><span>]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;Integer&gt;&gt; combine(int n, int k) {</span></span>
<span class="line"><span>    List&lt;List&lt;Integer&gt;&gt; combinations = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    List&lt;Integer&gt; combineList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    backtracking(combineList, combinations, 1, k, n);</span></span>
<span class="line"><span>    return combinations;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(List&lt;Integer&gt; combineList, List&lt;List&lt;Integer&gt;&gt; combinations, int start, int k, final int n) {</span></span>
<span class="line"><span>    if (k == 0) {</span></span>
<span class="line"><span>        combinations.add(new ArrayList&lt;&gt;(combineList));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = start; i &lt;= n - k + 1; i++) {  // 剪枝</span></span>
<span class="line"><span>        combineList.add(i);</span></span>
<span class="line"><span>        backtracking(combineList, combinations, i + 1, k - 1, n);</span></span>
<span class="line"><span>        combineList.remove(combineList.size() - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="组合求和" tabindex="-1">组合求和 <a class="header-anchor" href="#组合求和" aria-label="Permalink to &quot;组合求和&quot;">​</a></h3><p><a href="https://leetcode.com/problems/combination-sum/description/" target="_blank" rel="noreferrer">39. Combination Sum (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>given candidate set [2, 3, 6, 7] and target 7,</span></span>
<span class="line"><span>A solution set is:</span></span>
<span class="line"><span>[[7],[2, 2, 3]]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;Integer&gt;&gt; combinationSum(int[] candidates, int target) {</span></span>
<span class="line"><span>    List&lt;List&lt;Integer&gt;&gt; combinations = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    backtracking(new ArrayList&lt;&gt;(), combinations, 0, target, candidates);</span></span>
<span class="line"><span>    return combinations;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(List&lt;Integer&gt; tempCombination, List&lt;List&lt;Integer&gt;&gt; combinations,</span></span>
<span class="line"><span>                          int start, int target, final int[] candidates) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (target == 0) {</span></span>
<span class="line"><span>        combinations.add(new ArrayList&lt;&gt;(tempCombination));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = start; i &lt; candidates.length; i++) {</span></span>
<span class="line"><span>        if (candidates[i] &lt;= target) {</span></span>
<span class="line"><span>            tempCombination.add(candidates[i]);</span></span>
<span class="line"><span>            backtracking(tempCombination, combinations, i, target - candidates[i], candidates);</span></span>
<span class="line"><span>            tempCombination.remove(tempCombination.size() - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="含有相同元素的求组合求和" tabindex="-1">含有相同元素的求组合求和 <a class="header-anchor" href="#含有相同元素的求组合求和" aria-label="Permalink to &quot;含有相同元素的求组合求和&quot;">​</a></h3><p><a href="https://leetcode.com/problems/combination-sum-ii/description/" target="_blank" rel="noreferrer">40. Combination Sum II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>For example, given candidate set [10, 1, 2, 7, 6, 1, 5] and target 8,</span></span>
<span class="line"><span>A solution set is:</span></span>
<span class="line"><span>[</span></span>
<span class="line"><span>  [1, 7],</span></span>
<span class="line"><span>  [1, 2, 5],</span></span>
<span class="line"><span>  [2, 6],</span></span>
<span class="line"><span>  [1, 1, 6]</span></span>
<span class="line"><span>]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;Integer&gt;&gt; combinationSum2(int[] candidates, int target) {</span></span>
<span class="line"><span>    List&lt;List&lt;Integer&gt;&gt; combinations = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    Arrays.sort(candidates);</span></span>
<span class="line"><span>    backtracking(new ArrayList&lt;&gt;(), combinations, new boolean[candidates.length], 0, target, candidates);</span></span>
<span class="line"><span>    return combinations;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(List&lt;Integer&gt; tempCombination, List&lt;List&lt;Integer&gt;&gt; combinations,</span></span>
<span class="line"><span>                          boolean[] hasVisited, int start, int target, final int[] candidates) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (target == 0) {</span></span>
<span class="line"><span>        combinations.add(new ArrayList&lt;&gt;(tempCombination));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = start; i &lt; candidates.length; i++) {</span></span>
<span class="line"><span>        if (i != 0 &amp;&amp; candidates[i] == candidates[i - 1] &amp;&amp; !hasVisited[i - 1]) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (candidates[i] &lt;= target) {</span></span>
<span class="line"><span>            tempCombination.add(candidates[i]);</span></span>
<span class="line"><span>            hasVisited[i] = true;</span></span>
<span class="line"><span>            backtracking(tempCombination, combinations, hasVisited, i + 1, target - candidates[i], candidates);</span></span>
<span class="line"><span>            hasVisited[i] = false;</span></span>
<span class="line"><span>            tempCombination.remove(tempCombination.size() - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_1-9-数字的组合求和" tabindex="-1">1-9 数字的组合求和 <a class="header-anchor" href="#_1-9-数字的组合求和" aria-label="Permalink to &quot;1-9 数字的组合求和&quot;">​</a></h3><p><a href="https://leetcode.com/problems/combination-sum-iii/description/" target="_blank" rel="noreferrer">216. Combination Sum III (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: k = 3, n = 9</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[[1,2,6], [1,3,5], [2,3,4]]</span></span></code></pre></div><p>从 1-9 数字中选出 k 个数不重复的数，使得它们的和为 n。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;Integer&gt;&gt; combinationSum3(int k, int n) {</span></span>
<span class="line"><span>    List&lt;List&lt;Integer&gt;&gt; combinations = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    List&lt;Integer&gt; path = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    backtracking(k, n, 1, path, combinations);</span></span>
<span class="line"><span>    return combinations;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(int k, int n, int start,</span></span>
<span class="line"><span>                          List&lt;Integer&gt; tempCombination, List&lt;List&lt;Integer&gt;&gt; combinations) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (k == 0 &amp;&amp; n == 0) {</span></span>
<span class="line"><span>        combinations.add(new ArrayList&lt;&gt;(tempCombination));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (k == 0 || n == 0) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = start; i &lt;= 9; i++) {</span></span>
<span class="line"><span>        tempCombination.add(i);</span></span>
<span class="line"><span>        backtracking(k - 1, n - i, i + 1, tempCombination, combinations);</span></span>
<span class="line"><span>        tempCombination.remove(tempCombination.size() - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="子集" tabindex="-1">子集 <a class="header-anchor" href="#子集" aria-label="Permalink to &quot;子集&quot;">​</a></h3><p><a href="https://leetcode.com/problems/subsets/description/" target="_blank" rel="noreferrer">78. Subsets (Medium)在新窗口打开</a></p><p>找出集合的所有子集，子集不能重复，[1, 2] 和 [2, 1] 这种子集算重复</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;Integer&gt;&gt; subsets(int[] nums) {</span></span>
<span class="line"><span>    List&lt;List&lt;Integer&gt;&gt; subsets = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    List&lt;Integer&gt; tempSubset = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (int size = 0; size &lt;= nums.length; size++) {</span></span>
<span class="line"><span>        backtracking(0, tempSubset, subsets, size, nums); // 不同的子集大小</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return subsets;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(int start, List&lt;Integer&gt; tempSubset, List&lt;List&lt;Integer&gt;&gt; subsets,</span></span>
<span class="line"><span>                          final int size, final int[] nums) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (tempSubset.size() == size) {</span></span>
<span class="line"><span>        subsets.add(new ArrayList&lt;&gt;(tempSubset));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = start; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        tempSubset.add(nums[i]);</span></span>
<span class="line"><span>        backtracking(i + 1, tempSubset, subsets, size, nums);</span></span>
<span class="line"><span>        tempSubset.remove(tempSubset.size() - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="含有相同元素求子集" tabindex="-1">含有相同元素求子集 <a class="header-anchor" href="#含有相同元素求子集" aria-label="Permalink to &quot;含有相同元素求子集&quot;">​</a></h3><p><a href="https://leetcode.com/problems/subsets-ii/description/" target="_blank" rel="noreferrer">90. Subsets II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>For example,</span></span>
<span class="line"><span>If nums = [1,2,2], a solution is:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[</span></span>
<span class="line"><span>  [2],</span></span>
<span class="line"><span>  [1],</span></span>
<span class="line"><span>  [1,2,2],</span></span>
<span class="line"><span>  [2,2],</span></span>
<span class="line"><span>  [1,2],</span></span>
<span class="line"><span>  []</span></span>
<span class="line"><span>]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;Integer&gt;&gt; subsetsWithDup(int[] nums) {</span></span>
<span class="line"><span>    Arrays.sort(nums);</span></span>
<span class="line"><span>    List&lt;List&lt;Integer&gt;&gt; subsets = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    List&lt;Integer&gt; tempSubset = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    boolean[] hasVisited = new boolean[nums.length];</span></span>
<span class="line"><span>    for (int size = 0; size &lt;= nums.length; size++) {</span></span>
<span class="line"><span>        backtracking(0, tempSubset, subsets, hasVisited, size, nums); // 不同的子集大小</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return subsets;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(int start, List&lt;Integer&gt; tempSubset, List&lt;List&lt;Integer&gt;&gt; subsets, boolean[] hasVisited,</span></span>
<span class="line"><span>                          final int size, final int[] nums) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (tempSubset.size() == size) {</span></span>
<span class="line"><span>        subsets.add(new ArrayList&lt;&gt;(tempSubset));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = start; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        if (i != 0 &amp;&amp; nums[i] == nums[i - 1] &amp;&amp; !hasVisited[i - 1]) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        tempSubset.add(nums[i]);</span></span>
<span class="line"><span>        hasVisited[i] = true;</span></span>
<span class="line"><span>        backtracking(i + 1, tempSubset, subsets, hasVisited, size, nums);</span></span>
<span class="line"><span>        hasVisited[i] = false;</span></span>
<span class="line"><span>        tempSubset.remove(tempSubset.size() - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="分割字符串使得每个部分都是回文数" tabindex="-1">分割字符串使得每个部分都是回文数 <a class="header-anchor" href="#分割字符串使得每个部分都是回文数" aria-label="Permalink to &quot;分割字符串使得每个部分都是回文数&quot;">​</a></h3><p><a href="https://leetcode.com/problems/palindrome-partitioning/description/" target="_blank" rel="noreferrer">131. Palindrome Partitioning (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>For example, given s = &quot;aab&quot;,</span></span>
<span class="line"><span>Return</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[</span></span>
<span class="line"><span>  [&quot;aa&quot;,&quot;b&quot;],</span></span>
<span class="line"><span>  [&quot;a&quot;,&quot;a&quot;,&quot;b&quot;]</span></span>
<span class="line"><span>]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;List&lt;String&gt;&gt; partition(String s) {</span></span>
<span class="line"><span>    List&lt;List&lt;String&gt;&gt; partitions = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    List&lt;String&gt; tempPartition = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    doPartition(s, partitions, tempPartition);</span></span>
<span class="line"><span>    return partitions;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void doPartition(String s, List&lt;List&lt;String&gt;&gt; partitions, List&lt;String&gt; tempPartition) {</span></span>
<span class="line"><span>    if (s.length() == 0) {</span></span>
<span class="line"><span>        partitions.add(new ArrayList&lt;&gt;(tempPartition));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 0; i &lt; s.length(); i++) {</span></span>
<span class="line"><span>        if (isPalindrome(s, 0, i)) {</span></span>
<span class="line"><span>            tempPartition.add(s.substring(0, i + 1));</span></span>
<span class="line"><span>            doPartition(s.substring(i + 1), partitions, tempPartition);</span></span>
<span class="line"><span>            tempPartition.remove(tempPartition.size() - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean isPalindrome(String s, int begin, int end) {</span></span>
<span class="line"><span>    while (begin &lt; end) {</span></span>
<span class="line"><span>        if (s.charAt(begin++) != s.charAt(end--)) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="数独" tabindex="-1">数独 <a class="header-anchor" href="#数独" aria-label="Permalink to &quot;数独&quot;">​</a></h3><p><a href="https://leetcode.com/problems/sudoku-solver/description/" target="_blank" rel="noreferrer">37. Sudoku Solver (Hard)在新窗口打开</a></p><p><img src="`+t+`" alt="image"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private boolean[][] rowsUsed = new boolean[9][10];</span></span>
<span class="line"><span>private boolean[][] colsUsed = new boolean[9][10];</span></span>
<span class="line"><span>private boolean[][] cubesUsed = new boolean[9][10];</span></span>
<span class="line"><span>private char[][] board;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void solveSudoku(char[][] board) {</span></span>
<span class="line"><span>    this.board = board;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 9; i++)</span></span>
<span class="line"><span>        for (int j = 0; j &lt; 9; j++) {</span></span>
<span class="line"><span>            if (board[i][j] == &#39;.&#39;) {</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            int num = board[i][j] - &#39;0&#39;;</span></span>
<span class="line"><span>            rowsUsed[i][num] = true;</span></span>
<span class="line"><span>            colsUsed[j][num] = true;</span></span>
<span class="line"><span>            cubesUsed[cubeNum(i, j)][num] = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int i = 0; i &lt; 9; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; 9; j++) {</span></span>
<span class="line"><span>            backtracking(i, j);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean backtracking(int row, int col) {</span></span>
<span class="line"><span>    while (row &lt; 9 &amp;&amp; board[row][col] != &#39;.&#39;) {</span></span>
<span class="line"><span>        row = col == 8 ? row + 1 : row;</span></span>
<span class="line"><span>        col = col == 8 ? 0 : col + 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (row == 9) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int num = 1; num &lt;= 9; num++) {</span></span>
<span class="line"><span>        if (rowsUsed[row][num] || colsUsed[col][num] || cubesUsed[cubeNum(row, col)][num]) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        rowsUsed[row][num] = colsUsed[col][num] = cubesUsed[cubeNum(row, col)][num] = true;</span></span>
<span class="line"><span>        board[row][col] = (char) (num + &#39;0&#39;);</span></span>
<span class="line"><span>        if (backtracking(row, col)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        board[row][col] = &#39;.&#39;;</span></span>
<span class="line"><span>        rowsUsed[row][num] = colsUsed[col][num] = cubesUsed[cubeNum(row, col)][num] = false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int cubeNum(int i, int j) {</span></span>
<span class="line"><span>    int r = i / 3;</span></span>
<span class="line"><span>    int c = j / 3;</span></span>
<span class="line"><span>    return r * 3 + c;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="n-皇后" tabindex="-1">N 皇后 <a class="header-anchor" href="#n-皇后" aria-label="Permalink to &quot;N 皇后&quot;">​</a></h3><p><a href="https://leetcode.com/problems/n-queens/description/" target="_blank" rel="noreferrer">51. N-Queens (Hard)在新窗口打开</a></p><p><img src="`+l+'" alt="image"></p><p>在 n*n 的矩阵中摆放 n 个皇后，并且每个皇后不能在同一行，同一列，同一对角线上，求所有的 n 皇后的解。</p><p>一行一行地摆放，在确定一行中的那个皇后应该摆在哪一列时，需要用三个标记数组来确定某一列是否合法，这三个标记数组分别为: 列标记数组、45 度对角线标记数组和 135 度对角线标记数组。</p><p>45 度对角线标记数组的维度为 2 * n - 1，通过下图可以明确 (r, c) 的位置所在的数组下标为 r + c。</p><p><img src="'+c+'" alt="image"></p><p>135 度对角线标记数组的维度也是 2 * n - 1，(r, c) 的位置所在的数组下标为 n - 1 - (r - c)。</p><p><img src="'+r+`" alt="image"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private List&lt;List&lt;String&gt;&gt; solutions;</span></span>
<span class="line"><span>private char[][] nQueens;</span></span>
<span class="line"><span>private boolean[] colUsed;</span></span>
<span class="line"><span>private boolean[] diagonals45Used;</span></span>
<span class="line"><span>private boolean[] diagonals135Used;</span></span>
<span class="line"><span>private int n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public List&lt;List&lt;String&gt;&gt; solveNQueens(int n) {</span></span>
<span class="line"><span>    solutions = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    nQueens = new char[n][n];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; n; i++) {</span></span>
<span class="line"><span>        Arrays.fill(nQueens[i], &#39;.&#39;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    colUsed = new boolean[n];</span></span>
<span class="line"><span>    diagonals45Used = new boolean[2 * n - 1];</span></span>
<span class="line"><span>    diagonals135Used = new boolean[2 * n - 1];</span></span>
<span class="line"><span>    this.n = n;</span></span>
<span class="line"><span>    backtracking(0);</span></span>
<span class="line"><span>    return solutions;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void backtracking(int row) {</span></span>
<span class="line"><span>    if (row == n) {</span></span>
<span class="line"><span>        List&lt;String&gt; list = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        for (char[] chars : nQueens) {</span></span>
<span class="line"><span>            list.add(new String(chars));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        solutions.add(list);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (int col = 0; col &lt; n; col++) {</span></span>
<span class="line"><span>        int diagonals45Idx = row + col;</span></span>
<span class="line"><span>        int diagonals135Idx = n - 1 - (row - col);</span></span>
<span class="line"><span>        if (colUsed[col] || diagonals45Used[diagonals45Idx] || diagonals135Used[diagonals135Idx]) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        nQueens[row][col] = &#39;Q&#39;;</span></span>
<span class="line"><span>        colUsed[col] = diagonals45Used[diagonals45Idx] = diagonals135Used[diagonals135Idx] = true;</span></span>
<span class="line"><span>        backtracking(row + 1);</span></span>
<span class="line"><span>        colUsed[col] = diagonals45Used[diagonals45Idx] = diagonals135Used[diagonals135Idx] = false;</span></span>
<span class="line"><span>        nQueens[row][col] = &#39;.&#39;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,78)]))}const f=n(o,[["render",d]]);export{k as __pageData,f as default};
