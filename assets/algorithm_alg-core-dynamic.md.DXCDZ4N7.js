import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/pics/7c98e1b6-c446-4cde-8513-5c11b9f52aea.jpg",l="/vitepress-blog-template/images/pics/a3da4342-078b-43e2-b748-7e71bec50dc4.png",t="/vitepress-blog-template/images/pics/61942711-45a0-4e11-bbc9-434e31436f33.png",b=JSON.parse('{"title":"算法思想 - 动态规划算法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-core-dynamic.md","filePath":"algorithm/alg-core-dynamic.md","lastUpdated":1737706346000}'),c={name:"algorithm/alg-core-dynamic.md"};function r(o,n,d,u,h,m){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="算法思想-动态规划算法" tabindex="-1">算法思想 - 动态规划算法 <a class="header-anchor" href="#算法思想-动态规划算法" aria-label="Permalink to &quot;算法思想 - 动态规划算法&quot;">​</a></h1><blockquote><p>动态规划算法通常用于求解具有某种最优性质的问题。在这类问题中，可能会有许多可行解。每一个解都对应于一个值，我们希望找到具有最优值的解。动态规划算法与分治法类似，其基本思想也是将待求解问题分解成若干个子问题，先求解子问题，然后从这些子问题的解得到原问题的解。动态规划算法在算法思想中是极为重要的，需要重点掌握。@pdai</p></blockquote><h2 id="动态规划相关题目" tabindex="-1">动态规划相关题目 <a class="header-anchor" href="#动态规划相关题目" aria-label="Permalink to &quot;动态规划相关题目&quot;">​</a></h2><p>递归和动态规划都是将原问题拆成多个子问题然后求解，他们之间最本质的区别是，动态规划保存了子问题的解，避免重复计算。</p><h3 id="斐波那契数列" tabindex="-1">斐波那契数列 <a class="header-anchor" href="#斐波那契数列" aria-label="Permalink to &quot;斐波那契数列&quot;">​</a></h3><h4 id="爬楼梯" tabindex="-1">爬楼梯 <a class="header-anchor" href="#爬楼梯" aria-label="Permalink to &quot;爬楼梯&quot;">​</a></h4><p><a href="https://leetcode.com/problems/climbing-stairs/description/" target="_blank" rel="noreferrer">70. Climbing Stairs (Easy)在新窗口打开</a></p><p>题目描述: 有 N 阶楼梯，每次可以上一阶或者两阶，求有多少种上楼梯的方法。</p><p>定义一个数组 dp 存储上楼梯的方法数(为了方便讨论，数组下标从 1 开始)，dp[i] 表示走到第 i 个楼梯的方法数目。</p><p>第 i 个楼梯可以从第 i-1 和 i-2 个楼梯再走一步到达，走到第 i 个楼梯的方法数为走到第 i-1 和第 i-2 个楼梯的方法数之和。</p><p><img src="https://latex.codecogs.com/gif.latex?dp%5Bi%5D=dp%5Bi-1%5D+dp%5Bi-2%5D" alt=""></p><p>考虑到 dp[i] 只与 dp[i - 1] 和 dp[i - 2] 有关，因此可以只用两个变量来存储 dp[i - 1] 和 dp[i - 2]，使得原来的 O(N) 空间复杂度优化为 O(1) 复杂度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int climbStairs(int n) {</span></span>
<span class="line"><span>    if (n &lt;= 2) {</span></span>
<span class="line"><span>        return n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int pre2 = 1, pre1 = 2;</span></span>
<span class="line"><span>    for (int i = 2; i &lt; n; i++) {</span></span>
<span class="line"><span>        int cur = pre1 + pre2;</span></span>
<span class="line"><span>        pre2 = pre1;</span></span>
<span class="line"><span>        pre1 = cur;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return pre1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="强盗抢劫" tabindex="-1">强盗抢劫 <a class="header-anchor" href="#强盗抢劫" aria-label="Permalink to &quot;强盗抢劫&quot;">​</a></h4><p><a href="https://leetcode.com/problems/house-robber/description/" target="_blank" rel="noreferrer">198. House Robber (Easy)在新窗口打开</a></p><p>题目描述: 抢劫一排住户，但是不能抢邻近的住户，求最大抢劫量。</p><p>定义 dp 数组用来存储最大的抢劫量，其中 dp[i] 表示抢到第 i 个住户时的最大抢劫量。</p><p>由于不能抢劫邻近住户，因此如果抢劫了第 i 个住户那么只能抢劫 i - 2 或者 i - 3 的住户，所以</p><p><img src="https://latex.codecogs.com/gif.latex?dp%5Bi%5D=max(dp%5Bi-2%5D,dp%5Bi-3%5D)+nums%5Bi%5D" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int rob(int[] nums) {</span></span>
<span class="line"><span>    int n = nums.length;</span></span>
<span class="line"><span>    if (n == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (n == 1) {</span></span>
<span class="line"><span>        return nums[0];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int pre3 = 0, pre2 = 0, pre1 = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; n; i++) {</span></span>
<span class="line"><span>        int cur = Math.max(pre2, pre3) + nums[i];</span></span>
<span class="line"><span>        pre3 = pre2;</span></span>
<span class="line"><span>        pre2 = pre1;</span></span>
<span class="line"><span>        pre1 = cur;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Math.max(pre1, pre2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="强盗在环形街区抢劫" tabindex="-1">强盗在环形街区抢劫 <a class="header-anchor" href="#强盗在环形街区抢劫" aria-label="Permalink to &quot;强盗在环形街区抢劫&quot;">​</a></h4><p><a href="https://leetcode.com/problems/house-robber-ii/description/" target="_blank" rel="noreferrer">213. House Robber II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int rob(int[] nums) {</span></span>
<span class="line"><span>    if (nums == null || nums.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int n = nums.length;</span></span>
<span class="line"><span>    if (n == 1) {</span></span>
<span class="line"><span>        return nums[0];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Math.max(rob(nums, 0, n - 2), rob(nums, 1, n - 1));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int rob(int[] nums, int first, int last) {</span></span>
<span class="line"><span>    int pre3 = 0, pre2 = 0, pre1 = 0;</span></span>
<span class="line"><span>    for (int i = first; i &lt;= last; i++) {</span></span>
<span class="line"><span>        int cur = Math.max(pre3, pre2) + nums[i];</span></span>
<span class="line"><span>        pre3 = pre2;</span></span>
<span class="line"><span>        pre2 = pre1;</span></span>
<span class="line"><span>        pre1 = cur;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Math.max(pre2, pre1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="信件错排" tabindex="-1">信件错排 <a class="header-anchor" href="#信件错排" aria-label="Permalink to &quot;信件错排&quot;">​</a></h4><p>题目描述: 有 N 个 信 和 信封，它们被打乱，求错误装信方式的数量。</p><p>定义一个数组 dp 存储错误方式数量，dp[i] 表示前 i 个信和信封的错误方式数量。假设第 i 个信装到第 j 个信封里面，而第 j 个信装到第 k 个信封里面。根据 i 和 k 是否相等，有两种情况:</p><ul><li>i==k，交换 i 和 k 的信后，它们的信和信封在正确的位置，但是其余 i-2 封信有 dp[i-2] 种错误装信的方式。由于 j 有 i-1 种取值，因此共有 (i-1)*dp[i-2] 种错误装信方式。</li><li>i != k，交换 i 和 j 的信后，第 i 个信和信封在正确的位置，其余 i-1 封信有 dp[i-1] 种错误装信方式。由于 j 有 i-1 种取值，因此共有 (i-1)*dp[i-1] 种错误装信方式。</li></ul><p>综上所述，错误装信数量方式数量为:</p><p><img src="https://latex.codecogs.com/gif.latex?dp%5Bi%5D=(i-1)*dp%5Bi-2%5D+(i-1)*dp%5Bi-1%5D" alt=""></p><h4 id="母牛生产" tabindex="-1">母牛生产 <a class="header-anchor" href="#母牛生产" aria-label="Permalink to &quot;母牛生产&quot;">​</a></h4><p>题目描述: 假设农场中成熟的母牛每年都会生 1 头小母牛，并且永远不会死。第一年有 1 只小母牛，从第二年开始，母牛开始生小母牛。每只小母牛 3 年之后成熟又可以生小母牛。给定整数 N，求 N 年后牛的数量。</p><p>第 i 年成熟的牛的数量为:</p><p><img src="https://latex.codecogs.com/gif.latex?dp%5Bi%5D=dp%5Bi-1%5D+dp%5Bi-3%5D" alt=""></p><h3 id="矩阵路径" tabindex="-1">矩阵路径 <a class="header-anchor" href="#矩阵路径" aria-label="Permalink to &quot;矩阵路径&quot;">​</a></h3><h4 id="矩阵的最小路径和" tabindex="-1">矩阵的最小路径和 <a class="header-anchor" href="#矩阵的最小路径和" aria-label="Permalink to &quot;矩阵的最小路径和&quot;">​</a></h4><p><a href="https://leetcode.com/problems/minimum-path-sum/description/" target="_blank" rel="noreferrer">64. Minimum Path Sum (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[[1,3,1],</span></span>
<span class="line"><span> [1,5,1],</span></span>
<span class="line"><span> [4,2,1]]</span></span>
<span class="line"><span>Given the above grid map, return 7. Because the path 1→3→1→1→1 minimizes the sum.</span></span></code></pre></div><p>题目描述: 求从矩阵的左上角到右下角的最小路径和，每次只能向右和向下移动。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int minPathSum(int[][] grid) {</span></span>
<span class="line"><span>    if (grid.length == 0 || grid[0].length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int m = grid.length, n = grid[0].length;</span></span>
<span class="line"><span>    int[] dp = new int[n];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; m; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; n; j++) {</span></span>
<span class="line"><span>            if (i == 0) {</span></span>
<span class="line"><span>                dp[j] = dp[j - 1];</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                dp[j] = Math.min(dp[j - 1], dp[j]);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            dp[j] += grid[i][j];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[n - 1];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="矩阵的总路径数" tabindex="-1">矩阵的总路径数 <a class="header-anchor" href="#矩阵的总路径数" aria-label="Permalink to &quot;矩阵的总路径数&quot;">​</a></h4><p><a href="https://leetcode.com/problems/unique-paths/description/" target="_blank" rel="noreferrer">62. Unique Paths (Medium)在新窗口打开</a></p><p>题目描述: 统计从矩阵左上角到右下角的路径总数，每次只能向右或者向下移动。</p><p><img src="`+i+`" alt="image"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int uniquePaths(int m, int n) {</span></span>
<span class="line"><span>    int[] dp = new int[n];</span></span>
<span class="line"><span>    Arrays.fill(dp, 1);</span></span>
<span class="line"><span>    for (int i = 1; i &lt; m; i++) {</span></span>
<span class="line"><span>        for (int j = 1; j &lt; n; j++) {</span></span>
<span class="line"><span>            dp[j] = dp[j] + dp[j - 1];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[n - 1];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>也可以直接用数学公式求解，这是一个组合问题。机器人总共移动的次数 S=m+n-2，向下移动的次数 D=m-1，那么问题可以看成从 S 从取出 D 个位置的组合数量，这个问题的解为 C(S, D)。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int uniquePaths(int m, int n) {</span></span>
<span class="line"><span>    int S = m + n - 2;  // 总共的移动次数</span></span>
<span class="line"><span>    int D = m - 1;      // 向下的移动次数</span></span>
<span class="line"><span>    long ret = 1;</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= D; i++) {</span></span>
<span class="line"><span>        ret = ret * (S - D + i) / i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return (int) ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="数组区间" tabindex="-1">数组区间 <a class="header-anchor" href="#数组区间" aria-label="Permalink to &quot;数组区间&quot;">​</a></h3><h4 id="数组区间和" tabindex="-1">数组区间和 <a class="header-anchor" href="#数组区间和" aria-label="Permalink to &quot;数组区间和&quot;">​</a></h4><p><a href="https://leetcode.com/problems/range-sum-query-immutable/description/" target="_blank" rel="noreferrer">303. Range Sum Query - Immutable (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Given nums = [-2, 0, 3, -5, 2, -1]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sumRange(0, 2) -&gt; 1</span></span>
<span class="line"><span>sumRange(2, 5) -&gt; -1</span></span>
<span class="line"><span>sumRange(0, 5) -&gt; -3</span></span></code></pre></div><p>求区间 i ~ j 的和，可以转换为 sum[j] - sum[i-1]，其中 sum[i] 为 0 ~ i 的和。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class NumArray {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private int[] sums;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public NumArray(int[] nums) {</span></span>
<span class="line"><span>        sums = new int[nums.length + 1];</span></span>
<span class="line"><span>        for (int i = 1; i &lt;= nums.length; i++) {</span></span>
<span class="line"><span>            sums[i] = sums[i - 1] + nums[i - 1];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int sumRange(int i, int j) {</span></span>
<span class="line"><span>        return sums[j + 1] - sums[i];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="子数组最大的和" tabindex="-1">子数组最大的和 <a class="header-anchor" href="#子数组最大的和" aria-label="Permalink to &quot;子数组最大的和&quot;">​</a></h4><p><a href="https://leetcode.com/problems/maximum-subarray/description/" target="_blank" rel="noreferrer">53. Maximum Subarray (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>For example, given the array [-2,1,-3,4,-1,2,1,-5,4],</span></span>
<span class="line"><span>the contiguous subarray [4,-1,2,1] has the largest sum = 6.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int maxSubArray(int[] nums) {</span></span>
<span class="line"><span>    if (nums == null || nums.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int preSum = nums[0];</span></span>
<span class="line"><span>    int maxSum = preSum;</span></span>
<span class="line"><span>    for (int i = 1; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        preSum = preSum &gt; 0 ? preSum + nums[i] : nums[i];</span></span>
<span class="line"><span>        maxSum = Math.max(maxSum, preSum);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return maxSum;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="数组中等差递增子区间的个数" tabindex="-1">数组中等差递增子区间的个数 <a class="header-anchor" href="#数组中等差递增子区间的个数" aria-label="Permalink to &quot;数组中等差递增子区间的个数&quot;">​</a></h4><p><a href="https://leetcode.com/problems/arithmetic-slices/description/" target="_blank" rel="noreferrer">413. Arithmetic Slices (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>A = [1, 2, 3, 4]</span></span>
<span class="line"><span>return: 3, for 3 arithmetic slices in A: [1, 2, 3], [2, 3, 4] and [1, 2, 3, 4] itself.</span></span></code></pre></div><p>dp[i] 表示以 A[i] 为结尾的等差递增子区间的个数。</p><p>在 A[i] - A[i - 1] == A[i - 1] - A[i - 2] 的条件下，{A[i - 2], A[i - 1], A[i]} 是一个等差递增子区间。如果 {A[i - 3], A[i - 2], A[i - 1]} 是一个等差递增子区间，那么 {A[i - 3], A[i - 2], A[i - 1], A[i]} 也是等差递增子区间，dp[i] = dp[i-1] + 1。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int numberOfArithmeticSlices(int[] A) {</span></span>
<span class="line"><span>    if (A == null || A.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int n = A.length;</span></span>
<span class="line"><span>    int[] dp = new int[n];</span></span>
<span class="line"><span>    for (int i = 2; i &lt; n; i++) {</span></span>
<span class="line"><span>        if (A[i] - A[i - 1] == A[i - 1] - A[i - 2]) {</span></span>
<span class="line"><span>            dp[i] = dp[i - 1] + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int total = 0;</span></span>
<span class="line"><span>    for (int cnt : dp) {</span></span>
<span class="line"><span>        total += cnt;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return total;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="分割整数" tabindex="-1">分割整数 <a class="header-anchor" href="#分割整数" aria-label="Permalink to &quot;分割整数&quot;">​</a></h3><h4 id="分割整数的最大乘积" tabindex="-1">分割整数的最大乘积 <a class="header-anchor" href="#分割整数的最大乘积" aria-label="Permalink to &quot;分割整数的最大乘积&quot;">​</a></h4><p><a href="https://leetcode.com/problems/integer-break/description/" target="_blank" rel="noreferrer">343. Integer Break (Medim)在新窗口打开</a></p><p>题目描述: For example, given n = 2, return 1 (2 = 1 + 1); given n = 10, return 36 (10 = 3 + 3 + 4).</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int integerBreak(int n) {</span></span>
<span class="line"><span>    int[] dp = new int[n + 1];</span></span>
<span class="line"><span>    dp[1] = 1;</span></span>
<span class="line"><span>    for (int i = 2; i &lt;= n; i++) {</span></span>
<span class="line"><span>        for (int j = 1; j &lt;= i - 1; j++) {</span></span>
<span class="line"><span>            dp[i] = Math.max(dp[i], Math.max(j * dp[i - j], j * (i - j)));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[n];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="按平方数来分割整数" tabindex="-1">按平方数来分割整数 <a class="header-anchor" href="#按平方数来分割整数" aria-label="Permalink to &quot;按平方数来分割整数&quot;">​</a></h4><p><a href="https://leetcode.com/problems/perfect-squares/description/" target="_blank" rel="noreferrer">279. Perfect Squares(Medium)在新窗口打开</a></p><p>题目描述: For example, given n = 12, return 3 because 12 = 4 + 4 + 4; given n = 13, return 2 because 13 = 4 + 9.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int numSquares(int n) {</span></span>
<span class="line"><span>    List&lt;Integer&gt; squareList = generateSquareList(n);</span></span>
<span class="line"><span>    int[] dp = new int[n + 1];</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= n; i++) {</span></span>
<span class="line"><span>        int min = Integer.MAX_VALUE;</span></span>
<span class="line"><span>        for (int square : squareList) {</span></span>
<span class="line"><span>            if (square &gt; i) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            min = Math.min(min, dp[i - square] + 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        dp[i] = min;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[n];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private List&lt;Integer&gt; generateSquareList(int n) {</span></span>
<span class="line"><span>    List&lt;Integer&gt; squareList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    int diff = 3;</span></span>
<span class="line"><span>    int square = 1;</span></span>
<span class="line"><span>    while (square &lt;= n) {</span></span>
<span class="line"><span>        squareList.add(square);</span></span>
<span class="line"><span>        square += diff;</span></span>
<span class="line"><span>        diff += 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return squareList;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="分割整数构成字母字符串" tabindex="-1">分割整数构成字母字符串 <a class="header-anchor" href="#分割整数构成字母字符串" aria-label="Permalink to &quot;分割整数构成字母字符串&quot;">​</a></h4><p><a href="https://leetcode.com/problems/decode-ways/description/" target="_blank" rel="noreferrer">91. Decode Ways (Medium)在新窗口打开</a></p><p>题目描述: Given encoded message &quot;12&quot;, it could be decoded as &quot;AB&quot; (1 2) or &quot;L&quot; (12).</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int numDecodings(String s) {</span></span>
<span class="line"><span>    if (s == null || s.length() == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int n = s.length();</span></span>
<span class="line"><span>    int[] dp = new int[n + 1];</span></span>
<span class="line"><span>    dp[0] = 1;</span></span>
<span class="line"><span>    dp[1] = s.charAt(0) == &#39;0&#39; ? 0 : 1;</span></span>
<span class="line"><span>    for (int i = 2; i &lt;= n; i++) {</span></span>
<span class="line"><span>        int one = Integer.valueOf(s.substring(i - 1, i));</span></span>
<span class="line"><span>        if (one != 0) {</span></span>
<span class="line"><span>            dp[i] += dp[i - 1];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (s.charAt(i - 2) == &#39;0&#39;) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int two = Integer.valueOf(s.substring(i - 2, i));</span></span>
<span class="line"><span>        if (two &lt;= 26) {</span></span>
<span class="line"><span>            dp[i] += dp[i - 2];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[n];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="最长递增子序列" tabindex="-1">最长递增子序列 <a class="header-anchor" href="#最长递增子序列" aria-label="Permalink to &quot;最长递增子序列&quot;">​</a></h3><p>已知一个序列 {S1, S2,...,Sn}，取出若干数组成新的序列 {Si1, Si2,..., Sim}，其中 i1、i2 ... im 保持递增，即新序列中各个数仍然保持原数列中的先后顺序，称新序列为原序列的一个 子序列 。</p><p>如果在子序列中，当下标 ix &gt; iy 时，Six &gt; Siy，称子序列为原序列的一个 递增子序列 。</p><p>定义一个数组 dp 存储最长递增子序列的长度，dp[n] 表示以 Sn 结尾的序列的最长递增子序列长度。对于一个递增子序列 {Si1, Si2,...,Sim}，如果 im &lt; n 并且 Sim &lt; Sn，此时 {Si1, Si2,..., Sim, Sn} 为一个递增子序列，递增子序列的长度增加 1。满足上述条件的递增子序列中，长度最长的那个递增子序列就是要找的，在长度最长的递增子序列上加上 Sn 就构成了以 Sn 为结尾的最长递增子序列。因此 dp[n] = max{ dp[i]+1 | Si &lt; Sn &amp;&amp; i &lt; n} 。</p><p>因为在求 dp[n] 时可能无法找到一个满足条件的递增子序列，此时 {Sn} 就构成了递增子序列，需要对前面的求解方程做修改，令 dp[n] 最小为 1，即:</p><p><img src="https://latex.codecogs.com/gif.latex?dp%5Bn%5D=max%7B1,dp%5Bi%5D+1%7CS_i%3CS_n&amp;&amp;i%3Cn%7D" alt=""></p><p>对于一个长度为 N 的序列，最长递增子序列并不一定会以 SN 为结尾，因此 dp[N] 不是序列的最长递增子序列的长度，需要遍历 dp 数组找出最大值才是所要的结果，max{ dp[i] | 1 &lt;= i &lt;= N} 即为所求。</p><h4 id="最长递增子序列-1" tabindex="-1">最长递增子序列 <a class="header-anchor" href="#最长递增子序列-1" aria-label="Permalink to &quot;最长递增子序列&quot;">​</a></h4><p><a href="https://leetcode.com/problems/longest-increasing-subsequence/description/" target="_blank" rel="noreferrer">300. Longest Increasing Subsequence (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int lengthOfLIS(int[] nums) {</span></span>
<span class="line"><span>    int n = nums.length;</span></span>
<span class="line"><span>    int[] dp = new int[n];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; n; i++) {</span></span>
<span class="line"><span>        int max = 1;</span></span>
<span class="line"><span>        for (int j = 0; j &lt; i; j++) {</span></span>
<span class="line"><span>            if (nums[i] &gt; nums[j]) {</span></span>
<span class="line"><span>                max = Math.max(max, dp[j] + 1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        dp[i] = max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Arrays.stream(dp).max().orElse(0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用 Stream 求最大值会导致运行时间过长，可以改成以下形式:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int ret = 0;</span></span>
<span class="line"><span>for (int i = 0; i &lt; n; i++) {</span></span>
<span class="line"><span>    ret = Math.max(ret, dp[i]);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>return ret;</span></span></code></pre></div><p>以上解法的时间复杂度为 O(N2)，可以使用二分查找将时间复杂度降低为 O(NlogN)。</p><p>定义一个 tails 数组，其中 tails[i] 存储长度为 i + 1 的最长递增子序列的最后一个元素。对于一个元素 x，</p><ul><li>如果它大于 tails 数组所有的值，那么把它添加到 tails 后面，表示最长递增子序列长度加 1；</li><li>如果 tails[i-1] &lt; x &lt;= tails[i]，那么更新 tails[i-1] = x。</li></ul><p>例如对于数组 [4,3,6,5]，有:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tails      len      num</span></span>
<span class="line"><span>[]         0        4</span></span>
<span class="line"><span>[4]        1        3</span></span>
<span class="line"><span>[3]        1        6</span></span>
<span class="line"><span>[3,6]      2        5</span></span>
<span class="line"><span>[3,5]      2        null</span></span></code></pre></div><p>可以看出 tails 数组保持有序，因此在查找 Si 位于 tails 数组的位置时就可以使用二分查找。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int lengthOfLIS(int[] nums) {</span></span>
<span class="line"><span>    int n = nums.length;</span></span>
<span class="line"><span>    int[] tails = new int[n];</span></span>
<span class="line"><span>    int len = 0;</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        int index = binarySearch(tails, len, num);</span></span>
<span class="line"><span>        tails[index] = num;</span></span>
<span class="line"><span>        if (index == len) {</span></span>
<span class="line"><span>            len++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return len;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int binarySearch(int[] tails, int len, int key) {</span></span>
<span class="line"><span>    int l = 0, h = len;</span></span>
<span class="line"><span>    while (l &lt; h) {</span></span>
<span class="line"><span>        int mid = l + (h - l) / 2;</span></span>
<span class="line"><span>        if (tails[mid] == key) {</span></span>
<span class="line"><span>            return mid;</span></span>
<span class="line"><span>        } else if (tails[mid] &gt; key) {</span></span>
<span class="line"><span>            h = mid;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            l = mid + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return l;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="一组整数对能够构成的最长链" tabindex="-1">一组整数对能够构成的最长链 <a class="header-anchor" href="#一组整数对能够构成的最长链" aria-label="Permalink to &quot;一组整数对能够构成的最长链&quot;">​</a></h4><p><a href="https://leetcode.com/problems/maximum-length-of-pair-chain/description/" target="_blank" rel="noreferrer">646. Maximum Length of Pair Chain (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [[1,2], [2,3], [3,4]]</span></span>
<span class="line"><span>Output: 2</span></span>
<span class="line"><span>Explanation: The longest chain is [1,2] -&gt; [3,4]</span></span></code></pre></div><p>题目描述: 对于 (a, b) 和 (c, d) ，如果 b &lt; c，则它们可以构成一条链。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findLongestChain(int[][] pairs) {</span></span>
<span class="line"><span>    if (pairs == null || pairs.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Arrays.sort(pairs, (a, b) -&gt; (a[0] - b[0]));</span></span>
<span class="line"><span>    int n = pairs.length;</span></span>
<span class="line"><span>    int[] dp = new int[n];</span></span>
<span class="line"><span>    Arrays.fill(dp, 1);</span></span>
<span class="line"><span>    for (int i = 1; i &lt; n; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; i; j++) {</span></span>
<span class="line"><span>            if (pairs[j][1] &lt; pairs[i][0]) {</span></span>
<span class="line"><span>                dp[i] = Math.max(dp[i], dp[j] + 1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Arrays.stream(dp).max().orElse(0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="最长摆动子序列" tabindex="-1">最长摆动子序列 <a class="header-anchor" href="#最长摆动子序列" aria-label="Permalink to &quot;最长摆动子序列&quot;">​</a></h4><p><a href="https://leetcode.com/problems/wiggle-subsequence/description/" target="_blank" rel="noreferrer">376. Wiggle Subsequence (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [1,7,4,9,2,5]</span></span>
<span class="line"><span>Output: 6</span></span>
<span class="line"><span>The entire sequence is a wiggle sequence.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Input: [1,17,5,10,13,15,10,5,16,8]</span></span>
<span class="line"><span>Output: 7</span></span>
<span class="line"><span>There are several subsequences that achieve this length. One is [1,17,10,13,10,16,8].</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Input: [1,2,3,4,5,6,7,8,9]</span></span>
<span class="line"><span>Output: 2</span></span></code></pre></div><p>要求: 使用 O(N) 时间复杂度求解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int wiggleMaxLength(int[] nums) {</span></span>
<span class="line"><span>    if (nums == null || nums.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int up = 1, down = 1;</span></span>
<span class="line"><span>    for (int i = 1; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        if (nums[i] &gt; nums[i - 1]) {</span></span>
<span class="line"><span>            up = down + 1;</span></span>
<span class="line"><span>        } else if (nums[i] &lt; nums[i - 1]) {</span></span>
<span class="line"><span>            down = up + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Math.max(up, down);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="最长公共子序列" tabindex="-1">最长公共子序列 <a class="header-anchor" href="#最长公共子序列" aria-label="Permalink to &quot;最长公共子序列&quot;">​</a></h3><p>对于两个子序列 S1 和 S2，找出它们最长的公共子序列。</p><p>定义一个二维数组 dp 用来存储最长公共子序列的长度，其中 dp[i][j] 表示 S1 的前 i 个字符与 S2 的前 j 个字符最长公共子序列的长度。考虑 S1i 与 S2j 值是否相等，分为两种情况:</p><ul><li>当 S1i==S2j 时，那么就能在 S1 的前 i-1 个字符与 S2 的前 j-1 个字符最长公共子序列的基础上再加上 S1i 这个值，最长公共子序列长度加 1，即 dp[i][j] = dp[i-1][j-1] + 1。</li><li>当 S1i != S2j 时，此时最长公共子序列为 S1 的前 i-1 个字符和 S2 的前 j 个字符最长公共子序列，或者 S1 的前 i 个字符和 S2 的前 j-1 个字符最长公共子序列，取它们的最大者，即 dp[i][j] = max{ dp[i-1][j], dp[i][j-1] }。</li></ul><p>综上，最长公共子序列的状态转移方程为:</p><p><img src="https://latex.codecogs.com/gif.latex?dp%5Bi%5D%5Bj%5D=%5Cleft%7B%5Cbegin%7Barray%7D%7Brcl%7Ddp%5Bi-1%5D%5Bj-1%5D&amp;&amp;%7BS1_i==S2_j%7D%5Cmax(dp%5Bi-1%5D%5Bj%5D,dp%5Bi%5D%5Bj-1%5D)&amp;&amp;%7BS1_i%3C%3ES2_j%7D%5Cend%7Barray%7D%5Cright." alt=""></p><p>对于长度为 N 的序列 S1 和长度为 M 的序列 S2，dp[N][M] 就是序列 S1 和序列 S2 的最长公共子序列长度。</p><p>与最长递增子序列相比，最长公共子序列有以下不同点:</p><ul><li>针对的是两个序列，求它们的最长公共子序列。</li><li>在最长递增子序列中，dp[i] 表示以 Si 为结尾的最长递增子序列长度，子序列必须包含 Si ；在最长公共子序列中，dp[i][j] 表示 S1 中前 i 个字符与 S2 中前 j 个字符的最长公共子序列长度，不一定包含 S1i 和 S2j。</li><li>在求最终解时，最长公共子序列中 dp[N][M] 就是最终解，而最长递增子序列中 dp[N] 不是最终解，因为以 SN 为结尾的最长递增子序列不一定是整个序列最长递增子序列，需要遍历一遍 dp 数组找到最大者。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int lengthOfLCS(int[] nums1, int[] nums2) {</span></span>
<span class="line"><span>    int n1 = nums1.length, n2 = nums2.length;</span></span>
<span class="line"><span>    int[][] dp = new int[n1 + 1][n2 + 1];</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= n1; i++) {</span></span>
<span class="line"><span>        for (int j = 1; j &lt;= n2; j++) {</span></span>
<span class="line"><span>            if (nums1[i - 1] == nums2[j - 1]) {</span></span>
<span class="line"><span>                dp[i][j] = dp[i - 1][j - 1] + 1;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[n1][n2];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_0-1-背包" tabindex="-1">0-1 背包 <a class="header-anchor" href="#_0-1-背包" aria-label="Permalink to &quot;0-1 背包&quot;">​</a></h3><p>有一个容量为 N 的背包，要用这个背包装下物品的价值最大，这些物品有两个属性: 体积 w 和价值 v。</p><p>定义一个二维数组 dp 存储最大价值，其中 dp[i][j] 表示前 i 件物品体积不超过 j 的情况下能达到的最大价值。设第 i 件物品体积为 w，价值为 v，根据第 i 件物品是否添加到背包中，可以分两种情况讨论:</p><ul><li>第 i 件物品没添加到背包，总体积不超过 j 的前 i 件物品的最大价值就是总体积不超过 j 的前 i-1 件物品的最大价值，dp[i][j] = dp[i-1][j]。</li><li>第 i 件物品添加到背包中，dp[i][j] = dp[i-1][j-w] + v。</li></ul><p>第 i 件物品可添加也可以不添加，取决于哪种情况下最大价值更大。因此，0-1 背包的状态转移方程为:</p><p><img src="https://latex.codecogs.com/gif.latex?dp%5Bi%5D%5Bj%5D=max(dp%5Bi-1%5D%5Bj%5D,dp%5Bi-1%5D%5Bj-w%5D+v)" alt=""></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int knapsack(int W, int N, int[] weights, int[] values) {</span></span>
<span class="line"><span>    int[][] dp = new int[N + 1][W + 1];</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= N; i++) {</span></span>
<span class="line"><span>        int w = weights[i - 1], v = values[i - 1];</span></span>
<span class="line"><span>        for (int j = 1; j &lt;= W; j++) {</span></span>
<span class="line"><span>            if (j &gt;= w) {</span></span>
<span class="line"><span>                dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - w] + v);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                dp[i][j] = dp[i - 1][j];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[N][W];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="空间优化" tabindex="-1">空间优化 <a class="header-anchor" href="#空间优化" aria-label="Permalink to &quot;空间优化&quot;">​</a></h4><p>在程序实现时可以对 0-1 背包做优化。观察状态转移方程可以知道，前 i 件物品的状态仅与前 i-1 件物品的状态有关，因此可以将 dp 定义为一维数组，其中 dp[j] 既可以表示 dp[i-1][j] 也可以表示 dp[i][j]。此时，</p><p><img src="https://latex.codecogs.com/gif.latex?dp%5Bj%5D=max(dp%5Bj%5D,dp%5Bj-w%5D+v)" alt=""></p><p>因为 dp[j-w] 表示 dp[i-1][j-w]，因此不能先求 dp[i][j-w]，以防将 dp[i-1][j-w] 覆盖。也就是说要先计算 dp[i][j] 再计算 dp[i][j-w]，在程序实现时需要按倒序来循环求解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int knapsack(int W, int N, int[] weights, int[] values) {</span></span>
<span class="line"><span>    int[] dp = new int[W + 1];</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= N; i++) {</span></span>
<span class="line"><span>        int w = weights[i - 1], v = values[i - 1];</span></span>
<span class="line"><span>        for (int j = W; j &gt;= 1; j--) {</span></span>
<span class="line"><span>            if (j &gt;= w) {</span></span>
<span class="line"><span>                dp[j] = Math.max(dp[j], dp[j - w] + v);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[W];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>无法使用贪心算法的解释</p><p>0-1 背包问题无法使用贪心算法来求解，也就是说不能按照先添加性价比最高的物品来达到最优，这是因为这种方式可能造成背包空间的浪费，从而无法达到最优。考虑下面的物品和一个容量为 5 的背包，如果先添加物品 0 再添加物品 1，那么只能存放的价值为 16，浪费了大小为 2 的空间。最优的方式是存放物品 1 和物品 2，价值为 22.</p><table tabindex="0"><thead><tr><th>id</th><th>w</th><th>v</th><th>v/w</th></tr></thead><tbody><tr><td>0</td><td>1</td><td>6</td><td>6</td></tr><tr><td>1</td><td>2</td><td>10</td><td>5</td></tr><tr><td>2</td><td>3</td><td>12</td><td>4</td></tr></tbody></table><p>变种</p><ul><li><p>完全背包: 物品数量为无限个</p></li><li><p>多重背包: 物品数量有限制</p></li><li><p>多维费用背包: 物品不仅有重量，还有体积，同时考虑这两种限制</p></li><li><p>其它: 物品之间相互约束或者依赖</p></li></ul><h4 id="划分数组为和相等的两部分" tabindex="-1">划分数组为和相等的两部分 <a class="header-anchor" href="#划分数组为和相等的两部分" aria-label="Permalink to &quot;划分数组为和相等的两部分&quot;">​</a></h4><p><a href="https://leetcode.com/problems/partition-equal-subset-sum/description/" target="_blank" rel="noreferrer">416. Partition Equal Subset Sum (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [1, 5, 11, 5]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output: true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Explanation: The array can be partitioned as [1, 5, 5] and [11].</span></span></code></pre></div><p>可以看成一个背包大小为 sum/2 的 0-1 背包问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean canPartition(int[] nums) {</span></span>
<span class="line"><span>    int sum = computeArraySum(nums);</span></span>
<span class="line"><span>    if (sum % 2 != 0) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int W = sum / 2;</span></span>
<span class="line"><span>    boolean[] dp = new boolean[W + 1];</span></span>
<span class="line"><span>    dp[0] = true;</span></span>
<span class="line"><span>    Arrays.sort(nums);</span></span>
<span class="line"><span>    for (int num : nums) {                 // 0-1 背包一个物品只能用一次</span></span>
<span class="line"><span>        for (int i = W; i &gt;= num; i--) {   // 从后往前，先计算 dp[i] 再计算 dp[i-num]</span></span>
<span class="line"><span>            dp[i] = dp[i] || dp[i - num];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[W];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int computeArraySum(int[] nums) {</span></span>
<span class="line"><span>    int sum = 0;</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        sum += num;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sum;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="改变一组数的正负号使得它们的和为一给定数" tabindex="-1">改变一组数的正负号使得它们的和为一给定数 <a class="header-anchor" href="#改变一组数的正负号使得它们的和为一给定数" aria-label="Permalink to &quot;改变一组数的正负号使得它们的和为一给定数&quot;">​</a></h4><p><a href="https://leetcode.com/problems/target-sum/description/" target="_blank" rel="noreferrer">494. Target Sum (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: nums is [1, 1, 1, 1, 1], S is 3.</span></span>
<span class="line"><span>Output: 5</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-1+1+1+1+1 = 3</span></span>
<span class="line"><span>+1-1+1+1+1 = 3</span></span>
<span class="line"><span>+1+1-1+1+1 = 3</span></span>
<span class="line"><span>+1+1+1-1+1 = 3</span></span>
<span class="line"><span>+1+1+1+1-1 = 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>There are 5 ways to assign symbols to make the sum of nums be target 3.</span></span></code></pre></div><p>该问题可以转换为 Subset Sum 问题，从而使用 0-1 背包的方法来求解。</p><p>可以将这组数看成两部分，P 和 N，其中 P 使用正号，N 使用负号，有以下推导:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>                  sum(P) - sum(N) = target</span></span>
<span class="line"><span>sum(P) + sum(N) + sum(P) - sum(N) = target + sum(P) + sum(N)</span></span>
<span class="line"><span>                       2 * sum(P) = target + sum(nums)</span></span></code></pre></div><p>因此只要找到一个子集，令它们都取正号，并且和等于 (target + sum(nums))/2，就证明存在解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findTargetSumWays(int[] nums, int S) {</span></span>
<span class="line"><span>    int sum = computeArraySum(nums);</span></span>
<span class="line"><span>    if (sum &lt; S || (sum + S) % 2 == 1) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int W = (sum + S) / 2;</span></span>
<span class="line"><span>    int[] dp = new int[W + 1];</span></span>
<span class="line"><span>    dp[0] = 1;</span></span>
<span class="line"><span>    Arrays.sort(nums);</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        for (int i = W; i &gt;= num; i--) {</span></span>
<span class="line"><span>            dp[i] = dp[i] + dp[i - num];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[W];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int computeArraySum(int[] nums) {</span></span>
<span class="line"><span>    int sum = 0;</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        sum += num;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sum;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>DFS 解法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findTargetSumWays(int[] nums, int S) {</span></span>
<span class="line"><span>    return findTargetSumWays(nums, 0, S);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int findTargetSumWays(int[] nums, int start, int S) {</span></span>
<span class="line"><span>    if (start == nums.length) {</span></span>
<span class="line"><span>        return S == 0 ? 1 : 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return findTargetSumWays(nums, start + 1, S + nums[start])</span></span>
<span class="line"><span>            + findTargetSumWays(nums, start + 1, S - nums[start]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="字符串按单词列表分割" tabindex="-1">字符串按单词列表分割 <a class="header-anchor" href="#字符串按单词列表分割" aria-label="Permalink to &quot;字符串按单词列表分割&quot;">​</a></h4><p><a href="https://leetcode.com/problems/word-break/description/" target="_blank" rel="noreferrer">139. Word Break (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>s = &quot;leetcode&quot;,</span></span>
<span class="line"><span>dict = [&quot;leet&quot;, &quot;code&quot;].</span></span>
<span class="line"><span>Return true because &quot;leetcode&quot; can be segmented as &quot;leet code&quot;.</span></span></code></pre></div><p>dict 中的单词没有使用次数的限制，因此这是一个完全背包问题。</p><p>0-1 背包和完全背包在实现上的不同之处是，0-1 背包对物品的迭代是在最外层，而完全背包对物品的迭代是在最里层。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean wordBreak(String s, List&lt;String&gt; wordDict) {</span></span>
<span class="line"><span>    int n = s.length();</span></span>
<span class="line"><span>    boolean[] dp = new boolean[n + 1];</span></span>
<span class="line"><span>    dp[0] = true;</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= n; i++) {</span></span>
<span class="line"><span>        for (String word : wordDict) {   // 完全一个物品可以使用多次</span></span>
<span class="line"><span>            int len = word.length();</span></span>
<span class="line"><span>            if (len &lt;= i &amp;&amp; word.equals(s.substring(i - len, i))) {</span></span>
<span class="line"><span>                dp[i] = dp[i] || dp[i - len];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[n];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_01-字符构成最多的字符串" tabindex="-1">01 字符构成最多的字符串 <a class="header-anchor" href="#_01-字符构成最多的字符串" aria-label="Permalink to &quot;01 字符构成最多的字符串&quot;">​</a></h4><p><a href="https://leetcode.com/problems/ones-and-zeroes/description/" target="_blank" rel="noreferrer">474. Ones and Zeroes (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: Array = {&quot;10&quot;, &quot;0001&quot;, &quot;111001&quot;, &quot;1&quot;, &quot;0&quot;}, m = 5, n = 3</span></span>
<span class="line"><span>Output: 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Explanation: There are totally 4 strings can be formed by the using of 5 0s and 3 1s, which are &quot;10&quot;,&quot;0001&quot;,&quot;1&quot;,&quot;0&quot;</span></span></code></pre></div><p>这是一个多维费用的 0-1 背包问题，有两个背包大小，0 的数量和 1 的数量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findMaxForm(String[] strs, int m, int n) {</span></span>
<span class="line"><span>    if (strs == null || strs.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int[][] dp = new int[m + 1][n + 1];</span></span>
<span class="line"><span>    for (String s : strs) {    // 每个字符串只能用一次</span></span>
<span class="line"><span>        int ones = 0, zeros = 0;</span></span>
<span class="line"><span>        for (char c : s.toCharArray()) {</span></span>
<span class="line"><span>            if (c == &#39;0&#39;) {</span></span>
<span class="line"><span>                zeros++;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                ones++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        for (int i = m; i &gt;= zeros; i--) {</span></span>
<span class="line"><span>            for (int j = n; j &gt;= ones; j--) {</span></span>
<span class="line"><span>                dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[m][n];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="找零钱的最少硬币数" tabindex="-1">找零钱的最少硬币数 <a class="header-anchor" href="#找零钱的最少硬币数" aria-label="Permalink to &quot;找零钱的最少硬币数&quot;">​</a></h4><p><a href="https://leetcode.com/problems/coin-change/description/" target="_blank" rel="noreferrer">322. Coin Change (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Example 1:</span></span>
<span class="line"><span>coins = [1, 2, 5], amount = 11</span></span>
<span class="line"><span>return 3 (11 = 5 + 5 + 1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Example 2:</span></span>
<span class="line"><span>coins = [2], amount = 3</span></span>
<span class="line"><span>return -1.</span></span></code></pre></div><p>题目描述: 给一些面额的硬币，要求用这些硬币来组成给定面额的钱数，并且使得硬币数量最少。硬币可以重复使用。</p><ul><li>物品: 硬币</li><li>物品大小: 面额</li><li>物品价值: 数量</li></ul><p>因为硬币可以重复使用，因此这是一个完全背包问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int coinChange(int[] coins, int amount) {</span></span>
<span class="line"><span>    if (coins == null || coins.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int[] minimum = new int[amount + 1];</span></span>
<span class="line"><span>    Arrays.fill(minimum, amount + 1);</span></span>
<span class="line"><span>    minimum[0] = 0;</span></span>
<span class="line"><span>    Arrays.sort(coins);</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= amount; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; coins.length &amp;&amp; coins[j] &lt;= i; j++) {</span></span>
<span class="line"><span>            minimum[i] = Math.min(minimum[i], minimum[i - coins[j]] + 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return minimum[amount] &gt; amount ? -1 : minimum[amount];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="组合总和" tabindex="-1">组合总和 <a class="header-anchor" href="#组合总和" aria-label="Permalink to &quot;组合总和&quot;">​</a></h4><p><a href="https://leetcode.com/problems/combination-sum-iv/description/" target="_blank" rel="noreferrer">377. Combination Sum IV (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nums = [1, 2, 3]</span></span>
<span class="line"><span>target = 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>The possible combination ways are:</span></span>
<span class="line"><span>(1, 1, 1, 1)</span></span>
<span class="line"><span>(1, 1, 2)</span></span>
<span class="line"><span>(1, 2, 1)</span></span>
<span class="line"><span>(1, 3)</span></span>
<span class="line"><span>(2, 1, 1)</span></span>
<span class="line"><span>(2, 2)</span></span>
<span class="line"><span>(3, 1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Note that different sequences are counted as different combinations.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Therefore the output is 7.</span></span></code></pre></div><h4 id="完全背包。" tabindex="-1">完全背包。 <a class="header-anchor" href="#完全背包。" aria-label="Permalink to &quot;完全背包。&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int combinationSum4(int[] nums, int target) {</span></span>
<span class="line"><span>    if (nums == null || nums.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int[] maximum = new int[target + 1];</span></span>
<span class="line"><span>    maximum[0] = 1;</span></span>
<span class="line"><span>    Arrays.sort(nums);</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= target; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; nums.length &amp;&amp; nums[j] &lt;= i; j++) {</span></span>
<span class="line"><span>            maximum[i] += maximum[i - nums[j]];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return maximum[target];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="股票交易" tabindex="-1">股票交易 <a class="header-anchor" href="#股票交易" aria-label="Permalink to &quot;股票交易&quot;">​</a></h3><h4 id="需要冷却期的股票交易" tabindex="-1">需要冷却期的股票交易 <a class="header-anchor" href="#需要冷却期的股票交易" aria-label="Permalink to &quot;需要冷却期的股票交易&quot;">​</a></h4><p><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/description/" target="_blank" rel="noreferrer">309. Best Time to Buy and Sell Stock with Cooldown(Medium)在新窗口打开</a></p><p>题目描述: 交易之后需要有一天的冷却时间。</p><p><img src="`+l+`" alt="image"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int maxProfit(int[] prices) {</span></span>
<span class="line"><span>    if (prices == null || prices.length == 0) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int N = prices.length;</span></span>
<span class="line"><span>    int[] buy = new int[N];</span></span>
<span class="line"><span>    int[] s1 = new int[N];</span></span>
<span class="line"><span>    int[] sell = new int[N];</span></span>
<span class="line"><span>    int[] s2 = new int[N];</span></span>
<span class="line"><span>    s1[0] = buy[0] = -prices[0];</span></span>
<span class="line"><span>    sell[0] = s2[0] = 0;</span></span>
<span class="line"><span>    for (int i = 1; i &lt; N; i++) {</span></span>
<span class="line"><span>        buy[i] = s2[i - 1] - prices[i];</span></span>
<span class="line"><span>        s1[i] = Math.max(buy[i - 1], s1[i - 1]);</span></span>
<span class="line"><span>        sell[i] = Math.max(buy[i - 1], s1[i - 1]) + prices[i];</span></span>
<span class="line"><span>        s2[i] = Math.max(s2[i - 1], sell[i - 1]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Math.max(sell[N - 1], s2[N - 1]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="需要交易费用的股票交易" tabindex="-1">需要交易费用的股票交易 <a class="header-anchor" href="#需要交易费用的股票交易" aria-label="Permalink to &quot;需要交易费用的股票交易&quot;">​</a></h4><p><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/description/" target="_blank" rel="noreferrer">714. Best Time to Buy and Sell Stock with Transaction Fee (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: prices = [1, 3, 2, 8, 4, 9], fee = 2</span></span>
<span class="line"><span>Output: 8</span></span>
<span class="line"><span>Explanation: The maximum profit can be achieved by:</span></span>
<span class="line"><span>Buying at prices[0] = 1</span></span>
<span class="line"><span>Selling at prices[3] = 8</span></span>
<span class="line"><span>Buying at prices[4] = 4</span></span>
<span class="line"><span>Selling at prices[5] = 9</span></span>
<span class="line"><span>The total profit is ((8 - 1) - 2) + ((9 - 4) - 2) = 8.</span></span></code></pre></div><p>题目描述: 每交易一次，都要支付一定的费用。</p><p><img src="`+t+`" alt="image"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int maxProfit(int[] prices, int fee) {</span></span>
<span class="line"><span>    int N = prices.length;</span></span>
<span class="line"><span>    int[] buy = new int[N];</span></span>
<span class="line"><span>    int[] s1 = new int[N];</span></span>
<span class="line"><span>    int[] sell = new int[N];</span></span>
<span class="line"><span>    int[] s2 = new int[N];</span></span>
<span class="line"><span>    s1[0] = buy[0] = -prices[0];</span></span>
<span class="line"><span>    sell[0] = s2[0] = 0;</span></span>
<span class="line"><span>    for (int i = 1; i &lt; N; i++) {</span></span>
<span class="line"><span>        buy[i] = Math.max(sell[i - 1], s2[i - 1]) - prices[i];</span></span>
<span class="line"><span>        s1[i] = Math.max(buy[i - 1], s1[i - 1]);</span></span>
<span class="line"><span>        sell[i] = Math.max(buy[i - 1], s1[i - 1]) - fee + prices[i];</span></span>
<span class="line"><span>        s2[i] = Math.max(s2[i - 1], sell[i - 1]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Math.max(sell[N - 1], s2[N - 1]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="买入和售出股票最大的收益" tabindex="-1">买入和售出股票最大的收益 <a class="header-anchor" href="#买入和售出股票最大的收益" aria-label="Permalink to &quot;买入和售出股票最大的收益&quot;">​</a></h4><p><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/" target="_blank" rel="noreferrer">121. Best Time to Buy and Sell Stock (Easy)在新窗口打开</a></p><p>题目描述: 只进行一次交易。</p><p>只要记录前面的最小价格，将这个最小价格作为买入价格，然后将当前的价格作为售出价格，查看当前收益是不是最大收益。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int maxProfit(int[] prices) {</span></span>
<span class="line"><span>    int n = prices.length;</span></span>
<span class="line"><span>    if (n == 0) return 0;</span></span>
<span class="line"><span>    int soFarMin = prices[0];</span></span>
<span class="line"><span>    int max = 0;</span></span>
<span class="line"><span>    for (int i = 1; i &lt; n; i++) {</span></span>
<span class="line"><span>        if (soFarMin &gt; prices[i]) soFarMin = prices[i];</span></span>
<span class="line"><span>        else max = Math.max(max, prices[i] - soFarMin);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return max;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="只能进行两次的股票交易" tabindex="-1">只能进行两次的股票交易 <a class="header-anchor" href="#只能进行两次的股票交易" aria-label="Permalink to &quot;只能进行两次的股票交易&quot;">​</a></h4><p><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/" target="_blank" rel="noreferrer">123. Best Time to Buy and Sell Stock III (Hard)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int maxProfit(int[] prices) {</span></span>
<span class="line"><span>    int firstBuy = Integer.MIN_VALUE, firstSell = 0;</span></span>
<span class="line"><span>    int secondBuy = Integer.MIN_VALUE, secondSell = 0;</span></span>
<span class="line"><span>    for (int curPrice : prices) {</span></span>
<span class="line"><span>        if (firstBuy &lt; -curPrice) {</span></span>
<span class="line"><span>            firstBuy = -curPrice;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (firstSell &lt; firstBuy + curPrice) {</span></span>
<span class="line"><span>            firstSell = firstBuy + curPrice;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (secondBuy &lt; firstSell - curPrice) {</span></span>
<span class="line"><span>            secondBuy = firstSell - curPrice;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (secondSell &lt; secondBuy + curPrice) {</span></span>
<span class="line"><span>            secondSell = secondBuy + curPrice;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return secondSell;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="只能进行-k-次的股票交易" tabindex="-1">只能进行 k 次的股票交易 <a class="header-anchor" href="#只能进行-k-次的股票交易" aria-label="Permalink to &quot;只能进行 k 次的股票交易&quot;">​</a></h4><p><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/description/" target="_blank" rel="noreferrer">188. Best Time to Buy and Sell Stock IV (Hard)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int maxProfit(int k, int[] prices) {</span></span>
<span class="line"><span>    int n = prices.length;</span></span>
<span class="line"><span>    if (k &gt;= n / 2) {   // 这种情况下该问题退化为普通的股票交易问题</span></span>
<span class="line"><span>        int maxProfit = 0;</span></span>
<span class="line"><span>        for (int i = 1; i &lt; n; i++) {</span></span>
<span class="line"><span>            if (prices[i] &gt; prices[i - 1]) {</span></span>
<span class="line"><span>                maxProfit += prices[i] - prices[i - 1];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return maxProfit;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int[][] maxProfit = new int[k + 1][n];</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= k; i++) {</span></span>
<span class="line"><span>        int localMax = maxProfit[i - 1][0] - prices[0];</span></span>
<span class="line"><span>        for (int j = 1; j &lt; n; j++) {</span></span>
<span class="line"><span>            maxProfit[i][j] = Math.max(maxProfit[i][j - 1], prices[j] + localMax);</span></span>
<span class="line"><span>            localMax = Math.max(localMax, maxProfit[i - 1][j] - prices[j]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return maxProfit[k][n - 1];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="字符串编辑" tabindex="-1">字符串编辑 <a class="header-anchor" href="#字符串编辑" aria-label="Permalink to &quot;字符串编辑&quot;">​</a></h3><h4 id="删除两个字符串的字符使它们相等" tabindex="-1">删除两个字符串的字符使它们相等 <a class="header-anchor" href="#删除两个字符串的字符使它们相等" aria-label="Permalink to &quot;删除两个字符串的字符使它们相等&quot;">​</a></h4><p><a href="https://leetcode.com/problems/delete-operation-for-two-strings/description/" target="_blank" rel="noreferrer">583. Delete Operation for Two Strings (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: &quot;sea&quot;, &quot;eat&quot;</span></span>
<span class="line"><span>Output: 2</span></span>
<span class="line"><span>Explanation: You need one step to make &quot;sea&quot; to &quot;ea&quot; and another step to make &quot;eat&quot; to &quot;ea&quot;.</span></span></code></pre></div><p>可以转换为求两个字符串的最长公共子序列问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int minDistance(String word1, String word2) {</span></span>
<span class="line"><span>    int m = word1.length(), n = word2.length();</span></span>
<span class="line"><span>    int[][] dp = new int[m + 1][n + 1];</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= m; i++) {</span></span>
<span class="line"><span>        for (int j = 1; j &lt;= n; j++) {</span></span>
<span class="line"><span>            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {</span></span>
<span class="line"><span>                dp[i][j] = dp[i - 1][j - 1] + 1;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return m + n - 2 * dp[m][n];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="编辑距离" tabindex="-1">编辑距离 <a class="header-anchor" href="#编辑距离" aria-label="Permalink to &quot;编辑距离&quot;">​</a></h4><p><a href="https://leetcode.com/problems/edit-distance/description/" target="_blank" rel="noreferrer">72. Edit Distance (Hard)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Example 1:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Input: word1 = &quot;horse&quot;, word2 = &quot;ros&quot;</span></span>
<span class="line"><span>Output: 3</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>horse -&gt; rorse (replace &#39;h&#39; with &#39;r&#39;)</span></span>
<span class="line"><span>rorse -&gt; rose (remove &#39;r&#39;)</span></span>
<span class="line"><span>rose -&gt; ros (remove &#39;e&#39;)</span></span>
<span class="line"><span>Example 2:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Input: word1 = &quot;intention&quot;, word2 = &quot;execution&quot;</span></span>
<span class="line"><span>Output: 5</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>intention -&gt; inention (remove &#39;t&#39;)</span></span>
<span class="line"><span>inention -&gt; enention (replace &#39;i&#39; with &#39;e&#39;)</span></span>
<span class="line"><span>enention -&gt; exention (replace &#39;n&#39; with &#39;x&#39;)</span></span>
<span class="line"><span>exention -&gt; exection (replace &#39;n&#39; with &#39;c&#39;)</span></span>
<span class="line"><span>exection -&gt; execution (insert &#39;u&#39;)</span></span></code></pre></div><p>题目描述: 修改一个字符串成为另一个字符串，使得修改次数最少。一次修改操作包括: 插入一个字符、删除一个字符、替换一个字符。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int minDistance(String word1, String word2) {</span></span>
<span class="line"><span>    if (word1 == null || word2 == null) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int m = word1.length(), n = word2.length();</span></span>
<span class="line"><span>    int[][] dp = new int[m + 1][n + 1];</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= m; i++) {</span></span>
<span class="line"><span>        dp[i][0] = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= n; i++) {</span></span>
<span class="line"><span>        dp[0][i] = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= m; i++) {</span></span>
<span class="line"><span>        for (int j = 1; j &lt;= n; j++) {</span></span>
<span class="line"><span>            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {</span></span>
<span class="line"><span>                dp[i][j] = dp[i - 1][j - 1];</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                dp[i][j] = Math.min(dp[i - 1][j - 1], Math.min(dp[i][j - 1], dp[i - 1][j])) + 1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[m][n];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="复制粘贴字符" tabindex="-1">复制粘贴字符 <a class="header-anchor" href="#复制粘贴字符" aria-label="Permalink to &quot;复制粘贴字符&quot;">​</a></h4><p><a href="https://leetcode.com/problems/2-keys-keyboard/description/" target="_blank" rel="noreferrer">650. 2 Keys Keyboard (Medium)在新窗口打开</a></p><p>题目描述: 最开始只有一个字符 A，问需要多少次操作能够得到 n 个字符 A，每次操作可以复制当前所有的字符，或者粘贴。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: 3</span></span>
<span class="line"><span>Output: 3</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>Intitally, we have one character &#39;A&#39;.</span></span>
<span class="line"><span>In step 1, we use Copy All operation.</span></span>
<span class="line"><span>In step 2, we use Paste operation to get &#39;AA&#39;.</span></span>
<span class="line"><span>In step 3, we use Paste operation to get &#39;AAA&#39;.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int minSteps(int n) {</span></span>
<span class="line"><span>    if (n == 1) return 0;</span></span>
<span class="line"><span>    for (int i = 2; i &lt;= Math.sqrt(n); i++) {</span></span>
<span class="line"><span>        if (n % i == 0) return i + minSteps(n / i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return n;</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int minSteps(int n) {</span></span>
<span class="line"><span>    int[] dp = new int[n + 1];</span></span>
<span class="line"><span>    int h = (int) Math.sqrt(n);</span></span>
<span class="line"><span>    for (int i = 2; i &lt;= n; i++) {</span></span>
<span class="line"><span>        dp[i] = i;</span></span>
<span class="line"><span>        for (int j = 2; j &lt;= h; j++) {</span></span>
<span class="line"><span>            if (i % j == 0) {</span></span>
<span class="line"><span>                dp[i] = dp[j] + dp[i / j];</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dp[n];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,210)]))}const v=s(c,[["render",r]]);export{b as __pageData,v as default};
