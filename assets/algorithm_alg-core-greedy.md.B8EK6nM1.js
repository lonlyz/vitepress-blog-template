import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"算法思想 - 贪心算法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-core-greedy.md","filePath":"algorithm/alg-core-greedy.md","lastUpdated":1737706346000}'),i={name:"algorithm/alg-core-greedy.md"};function l(t,n,c,o,r,d){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="算法思想-贪心算法" tabindex="-1">算法思想 - 贪心算法 <a class="header-anchor" href="#算法思想-贪心算法" aria-label="Permalink to &quot;算法思想 - 贪心算法&quot;">​</a></h1><blockquote><p>本文主要介绍算法中贪心算法的思想: 保证每次操作都是局部最优的，并且最后得到的结果是全局最优的。@pdai</p></blockquote><h2 id="贪心思想相关题目" tabindex="-1">贪心思想相关题目 <a class="header-anchor" href="#贪心思想相关题目" aria-label="Permalink to &quot;贪心思想相关题目&quot;">​</a></h2><h3 id="分配饼干" tabindex="-1">分配饼干 <a class="header-anchor" href="#分配饼干" aria-label="Permalink to &quot;分配饼干&quot;">​</a></h3><p><a href="https://leetcode.com/problems/assign-cookies/description/" target="_blank" rel="noreferrer">455. Assign Cookies (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [1,2], [1,2,3]</span></span>
<span class="line"><span>Output: 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Explanation: You have 2 children and 3 cookies. The greed factors of 2 children are 1, 2.</span></span>
<span class="line"><span>You have 3 cookies and their sizes are big enough to gratify all of the children,</span></span>
<span class="line"><span>You need to output 2.</span></span></code></pre></div><p>题目描述: 每个孩子都有一个满足度，每个饼干都有一个大小，只有饼干的大小大于等于一个孩子的满足度，该孩子才会获得满足。求解最多可以获得满足的孩子数量。</p><p>给一个孩子的饼干应当尽量小又能满足该孩子，这样大饼干就能拿来给满足度比较大的孩子。因为最小的孩子最容易得到满足，所以先满足最小的孩子。</p><p>证明: 假设在某次选择中，贪心策略选择给当前满足度最小的孩子分配第 m 个饼干，第 m 个饼干为可以满足该孩子的最小饼干。假设存在一种最优策略，给该孩子分配第 n 个饼干，并且 m &lt; n。我们可以发现，经过这一轮分配，贪心策略分配后剩下的饼干一定有一个比最优策略来得大。因此在后续的分配中，贪心策略一定能满足更多的孩子。也就是说不存在比贪心策略更优的策略，即贪心策略就是最优策略。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findContentChildren(int[] g, int[] s) {</span></span>
<span class="line"><span>    Arrays.sort(g);</span></span>
<span class="line"><span>    Arrays.sort(s);</span></span>
<span class="line"><span>    int gi = 0, si = 0;</span></span>
<span class="line"><span>    while (gi &lt; g.length &amp;&amp; si &lt; s.length) {</span></span>
<span class="line"><span>        if (g[gi] &lt;= s[si]) {</span></span>
<span class="line"><span>            gi++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        si++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return gi;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="不重叠的区间个数" tabindex="-1">不重叠的区间个数 <a class="header-anchor" href="#不重叠的区间个数" aria-label="Permalink to &quot;不重叠的区间个数&quot;">​</a></h3><p><a href="https://leetcode.com/problems/non-overlapping-intervals/description/" target="_blank" rel="noreferrer">435. Non-overlapping Intervals (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [ [1,2], [1,2], [1,2] ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output: 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Explanation: You need to remove two [1,2] to make the rest of intervals non-overlapping.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [ [1,2], [2,3] ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output: 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Explanation: You don&#39;t need to remove any of the intervals since they&#39;re already non-overlapping.</span></span></code></pre></div><p>题目描述: 计算让一组区间不重叠所需要移除的区间个数。</p><p>计算最多能组成的不重叠区间个数，然后用区间总个数减去不重叠区间的个数。</p><p>在每次选择中，区间的结尾最为重要，选择的区间结尾越小，留给后面的区间的空间越大，那么后面能够选择的区间个数也就越大。</p><p>按区间的结尾进行排序，每次选择结尾最小，并且和前一个区间不重叠的区间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int eraseOverlapIntervals(Interval[] intervals) {</span></span>
<span class="line"><span>    if (intervals.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Arrays.sort(intervals, Comparator.comparingInt(o -&gt; o.end));</span></span>
<span class="line"><span>    int cnt = 1;</span></span>
<span class="line"><span>    int end = intervals[0].end;</span></span>
<span class="line"><span>    for (int i = 1; i &lt; intervals.length; i++) {</span></span>
<span class="line"><span>        if (intervals[i].start &lt; end) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        end = intervals[i].end;</span></span>
<span class="line"><span>        cnt++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return intervals.length - cnt;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用 lambda 表示式创建 Comparator 会导致算法运行时间过长，如果注重运行时间，可以修改为普通创建 Comparator 语句:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Arrays.sort(intervals, new Comparator&lt;Interval&gt;() {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int compare(Interval o1, Interval o2) {</span></span>
<span class="line"><span>        return o1.end - o2.end;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span></code></pre></div><h3 id="投飞镖刺破气球" tabindex="-1">投飞镖刺破气球 <a class="header-anchor" href="#投飞镖刺破气球" aria-label="Permalink to &quot;投飞镖刺破气球&quot;">​</a></h3><p><a href="https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/description/" target="_blank" rel="noreferrer">452. Minimum Number of Arrows to Burst Balloons (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>[[10,16], [2,8], [1,6], [7,12]]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output:</span></span>
<span class="line"><span>2</span></span></code></pre></div><p>题目描述: 气球在一个水平数轴上摆放，可以重叠，飞镖垂直投向坐标轴，使得路径上的气球都会刺破。求解最小的投飞镖次数使所有气球都被刺破。</p><p>也是计算不重叠的区间个数，不过和 Non-overlapping Intervals 的区别在于，[1, 2] 和 [2, 3] 在本题中算是重叠区间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findMinArrowShots(int[][] points) {</span></span>
<span class="line"><span>    if (points.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Arrays.sort(points, Comparator.comparingInt(o -&gt; o[1]));</span></span>
<span class="line"><span>    int cnt = 1, end = points[0][1];</span></span>
<span class="line"><span>    for (int i = 1; i &lt; points.length; i++) {</span></span>
<span class="line"><span>        if (points[i][0] &lt;= end) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        cnt++;</span></span>
<span class="line"><span>        end = points[i][1];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return cnt;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="根据身高和序号重组队列" tabindex="-1">根据身高和序号重组队列 <a class="header-anchor" href="#根据身高和序号重组队列" aria-label="Permalink to &quot;根据身高和序号重组队列&quot;">​</a></h3><p><a href="https://leetcode.com/problems/queue-reconstruction-by-height/description/" target="_blank" rel="noreferrer">406. Queue Reconstruction by Height(Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>[[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output:</span></span>
<span class="line"><span>[[5,0], [7,0], [5,2], [6,1], [4,4], [7,1]]</span></span></code></pre></div><p>题目描述: 一个学生用两个分量 (h, k) 描述，h 表示身高，k 表示排在前面的有 k 个学生的身高比他高或者和他一样高。</p><p>为了在每次插入操作时不影响后续的操作，身高较高的学生应该先做插入操作，否则身高较小的学生原先正确插入第 k 个位置可能会变成第 k+1 个位置。</p><p>身高降序、k 值升序，然后按排好序的顺序插入队列的第 k 个位置中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[][] reconstructQueue(int[][] people) {</span></span>
<span class="line"><span>    if (people == null || people.length == 0 || people[0].length == 0) {</span></span>
<span class="line"><span>        return new int[0][0];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Arrays.sort(people, (a, b) -&gt; (a[0] == b[0] ? a[1] - b[1] : b[0] - a[0]));</span></span>
<span class="line"><span>    List&lt;int[]&gt; queue = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (int[] p : people) {</span></span>
<span class="line"><span>        queue.add(p[1], p);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return queue.toArray(new int[queue.size()][]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="分隔字符串使同种字符出现在一起" tabindex="-1">分隔字符串使同种字符出现在一起 <a class="header-anchor" href="#分隔字符串使同种字符出现在一起" aria-label="Permalink to &quot;分隔字符串使同种字符出现在一起&quot;">​</a></h3><p><a href="https://leetcode.com/problems/partition-labels/description/" target="_blank" rel="noreferrer">763. Partition Labels (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: S = &quot;ababcbacadefegdehijhklij&quot;</span></span>
<span class="line"><span>Output: [9,7,8]</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>The partition is &quot;ababcbaca&quot;, &quot;defegde&quot;, &quot;hijhklij&quot;.</span></span>
<span class="line"><span>This is a partition so that each letter appears in at most one part.</span></span>
<span class="line"><span>A partition like &quot;ababcbacadefegde&quot;, &quot;hijhklij&quot; is incorrect, because it splits S into less parts.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;Integer&gt; partitionLabels(String S) {</span></span>
<span class="line"><span>    int[] lastIndexsOfChar = new int[26];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; S.length(); i++) {</span></span>
<span class="line"><span>        lastIndexsOfChar[char2Index(S.charAt(i))] = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    List&lt;Integer&gt; partitions = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    int firstIndex = 0;</span></span>
<span class="line"><span>    while (firstIndex &lt; S.length()) {</span></span>
<span class="line"><span>        int lastIndex = firstIndex;</span></span>
<span class="line"><span>        for (int i = firstIndex; i &lt; S.length() &amp;&amp; i &lt;= lastIndex; i++) {</span></span>
<span class="line"><span>            int index = lastIndexsOfChar[char2Index(S.charAt(i))];</span></span>
<span class="line"><span>            if (index &gt; lastIndex) {</span></span>
<span class="line"><span>                lastIndex = index;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        partitions.add(lastIndex - firstIndex + 1);</span></span>
<span class="line"><span>        firstIndex = lastIndex + 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return partitions;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int char2Index(char c) {</span></span>
<span class="line"><span>    return c - &#39;a&#39;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="种植花朵" tabindex="-1">种植花朵 <a class="header-anchor" href="#种植花朵" aria-label="Permalink to &quot;种植花朵&quot;">​</a></h3><p><a href="https://leetcode.com/problems/can-place-flowers/description/" target="_blank" rel="noreferrer">605. Can Place Flowers (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: flowerbed = [1,0,0,0,1], n = 1</span></span>
<span class="line"><span>Output: True</span></span></code></pre></div><p>题目描述: 花朵之间至少需要一个单位的间隔，求解是否能种下 n 朵花。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean canPlaceFlowers(int[] flowerbed, int n) {</span></span>
<span class="line"><span>    int len = flowerbed.length;</span></span>
<span class="line"><span>    int cnt = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; len &amp;&amp; cnt &lt; n; i++) {</span></span>
<span class="line"><span>        if (flowerbed[i] == 1) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int pre = i == 0 ? 0 : flowerbed[i - 1];</span></span>
<span class="line"><span>        int next = i == len - 1 ? 0 : flowerbed[i + 1];</span></span>
<span class="line"><span>        if (pre == 0 &amp;&amp; next == 0) {</span></span>
<span class="line"><span>            cnt++;</span></span>
<span class="line"><span>            flowerbed[i] = 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return cnt &gt;= n;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="判断是否为子序列" tabindex="-1">判断是否为子序列 <a class="header-anchor" href="#判断是否为子序列" aria-label="Permalink to &quot;判断是否为子序列&quot;">​</a></h3><p><a href="https://leetcode.com/problems/is-subsequence/description/" target="_blank" rel="noreferrer">392. Is Subsequence (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>s = &quot;abc&quot;, t = &quot;ahbgdc&quot;</span></span>
<span class="line"><span>Return true.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean isSubsequence(String s, String t) {</span></span>
<span class="line"><span>    int index = -1;</span></span>
<span class="line"><span>    for (char c : s.toCharArray()) {</span></span>
<span class="line"><span>        index = t.indexOf(c, index + 1);</span></span>
<span class="line"><span>        if (index == -1) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="修改一个数成为非递减数组" tabindex="-1">修改一个数成为非递减数组 <a class="header-anchor" href="#修改一个数成为非递减数组" aria-label="Permalink to &quot;修改一个数成为非递减数组&quot;">​</a></h3><p><a href="https://leetcode.com/problems/non-decreasing-array/description/" target="_blank" rel="noreferrer">665. Non-decreasing Array (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [4,2,3]</span></span>
<span class="line"><span>Output: True</span></span>
<span class="line"><span>Explanation: You could modify the first 4 to 1 to get a non-decreasing array.</span></span></code></pre></div><p>题目描述: 判断一个数组能不能只修改一个数就成为非递减数组。</p><p>在出现 nums[i] &lt; nums[i - 1] 时，需要考虑的是应该修改数组的哪个数，使得本次修改能使 i 之前的数组成为非递减数组，并且 <strong>不影响后续的操作</strong> 。优先考虑令 nums[i - 1] = nums[i]，因为如果修改 nums[i] = nums[i - 1] 的话，那么 nums[i] 这个数会变大，就有可能比 nums[i + 1] 大，从而影响了后续操作。还有一个比较特别的情况就是 nums[i] &lt; nums[i - 2]，只修改 nums[i - 1] = nums[i] 不能使数组成为非递减数组，只能修改 nums[i] = nums[i - 1]。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean checkPossibility(int[] nums) {</span></span>
<span class="line"><span>    int cnt = 0;</span></span>
<span class="line"><span>    for (int i = 1; i &lt; nums.length &amp;&amp; cnt &lt; 2; i++) {</span></span>
<span class="line"><span>        if (nums[i] &gt;= nums[i - 1]) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        cnt++;</span></span>
<span class="line"><span>        if (i - 2 &gt;= 0 &amp;&amp; nums[i - 2] &gt; nums[i]) {</span></span>
<span class="line"><span>            nums[i] = nums[i - 1];</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            nums[i - 1] = nums[i];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return cnt &lt;= 1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="股票的最大收益" tabindex="-1">股票的最大收益 <a class="header-anchor" href="#股票的最大收益" aria-label="Permalink to &quot;股票的最大收益&quot;">​</a></h3><p><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/description/" target="_blank" rel="noreferrer">122. Best Time to Buy and Sell Stock II (Easy)在新窗口打开</a></p><p>题目描述: 一次股票交易包含买入和卖出，多个交易之间不能交叉进行。</p><p>对于 [a, b, c, d]，如果有 a &lt;= b &lt;= c &lt;= d ，那么最大收益为 d - a。而 d - a = (d - c) + (c - b) + (b - a) ，因此当访问到一个 prices[i] 且 prices[i] - prices[i-1] &gt; 0，那么就把 prices[i] - prices[i-1] 添加到收益中，从而在局部最优的情况下也保证全局最优。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int maxProfit(int[] prices) {</span></span>
<span class="line"><span>    int profit = 0;</span></span>
<span class="line"><span>    for (int i = 1; i &lt; prices.length; i++) {</span></span>
<span class="line"><span>        if (prices[i] &gt; prices[i - 1]) {</span></span>
<span class="line"><span>            profit += (prices[i] - prices[i - 1]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return profit;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,59)]))}const g=s(i,[["render",l]]);export{u as __pageData,g as default};
