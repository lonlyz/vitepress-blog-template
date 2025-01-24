import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const h=JSON.parse('{"title":"线性表 - 数组和矩阵","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-array.md","filePath":"algorithm/alg-basic-array.md","lastUpdated":1737706346000}'),l={name:"algorithm/alg-basic-array.md"};function i(t,n,c,r,o,u){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="线性表-数组和矩阵" tabindex="-1">线性表 - 数组和矩阵 <a class="header-anchor" href="#线性表-数组和矩阵" aria-label="Permalink to &quot;线性表 - 数组和矩阵&quot;">​</a></h1><blockquote><p>数组是一种连续存储线性结构，元素类型相同，大小相等，数组是多维的，通过使用整型索引值来访问他们的元素，数组尺寸不能改变。@pdai</p></blockquote><h2 id="知识点" tabindex="-1">知识点 <a class="header-anchor" href="#知识点" aria-label="Permalink to &quot;知识点&quot;">​</a></h2><p>数组的优点:</p><ul><li>存取速度快</li></ul><p>数组的缺点:</p><ul><li>事先必须知道数组的长度</li><li>插入删除元素很慢</li><li>空间通常是有限制的</li><li>需要大块连续的内存块</li><li>插入删除元素的效率很低</li></ul><p>JDK中关于ArrayList的实现，请参考:</p><p><a href="https://pdai.tech/md/java/collection/java-collection-ArrayList.html" target="_blank" rel="noreferrer">《Java - ArrayList 源码解析》</a></p><h2 id="数组与矩阵相关题目" tabindex="-1">数组与矩阵相关题目 <a class="header-anchor" href="#数组与矩阵相关题目" aria-label="Permalink to &quot;数组与矩阵相关题目&quot;">​</a></h2><p><strong>把数组中的 0 移到末尾</strong></p><p><a href="https://leetcode.com/problems/move-zeroes/description/" target="_blank" rel="noreferrer">283. Move Zeroes (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>For example, given nums = [0, 1, 0, 3, 12], after calling your function, nums should be [1, 3, 12, 0, 0].</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void moveZeroes(int[] nums) {</span></span>
<span class="line"><span>    int idx = 0;</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        if (num != 0) {</span></span>
<span class="line"><span>            nums[idx++] = num;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    while (idx &lt; nums.length) {</span></span>
<span class="line"><span>        nums[idx++] = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>改变矩阵维度</strong></p><p><a href="https://leetcode.com/problems/reshape-the-matrix/description/" target="_blank" rel="noreferrer">566. Reshape the Matrix (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>nums =</span></span>
<span class="line"><span>[[1,2],</span></span>
<span class="line"><span> [3,4]]</span></span>
<span class="line"><span>r = 1, c = 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output:</span></span>
<span class="line"><span>[[1,2,3,4]]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>The row-traversing of nums is [1,2,3,4]. The new reshaped matrix is a 1 * 4 matrix, fill it row by row by using the previous list.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[][] matrixReshape(int[][] nums, int r, int c) {</span></span>
<span class="line"><span>    int m = nums.length, n = nums[0].length;</span></span>
<span class="line"><span>    if (m * n != r * c) {</span></span>
<span class="line"><span>        return nums;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int[][] reshapedNums = new int[r][c];</span></span>
<span class="line"><span>    int index = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; r; i++) {</span></span>
<span class="line"><span>        for (int j = 0; j &lt; c; j++) {</span></span>
<span class="line"><span>            reshapedNums[i][j] = nums[index / n][index % n];</span></span>
<span class="line"><span>            index++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return reshapedNums;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>找出数组中最长的连续 1</strong></p><p><a href="https://leetcode.com/problems/max-consecutive-ones/description/" target="_blank" rel="noreferrer">485. Max Consecutive Ones (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findMaxConsecutiveOnes(int[] nums) {</span></span>
<span class="line"><span>    int max = 0, cur = 0;</span></span>
<span class="line"><span>    for (int x : nums) {</span></span>
<span class="line"><span>        cur = x == 0 ? 0 : cur + 1;</span></span>
<span class="line"><span>        max = Math.max(max, cur);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return max;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>有序矩阵查找</strong></p><p><a href="https://leetcode.com/problems/search-a-2d-matrix-ii/description/" target="_blank" rel="noreferrer">240. Search a 2D Matrix II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[</span></span>
<span class="line"><span>   [ 1,  5,  9],</span></span>
<span class="line"><span>   [10, 11, 13],</span></span>
<span class="line"><span>   [12, 13, 15]</span></span>
<span class="line"><span>]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean searchMatrix(int[][] matrix, int target) {</span></span>
<span class="line"><span>    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return false;</span></span>
<span class="line"><span>    int m = matrix.length, n = matrix[0].length;</span></span>
<span class="line"><span>    int row = 0, col = n - 1;</span></span>
<span class="line"><span>    while (row &lt; m &amp;&amp; col &gt;= 0) {</span></span>
<span class="line"><span>        if (target == matrix[row][col]) return true;</span></span>
<span class="line"><span>        else if (target &lt; matrix[row][col]) col--;</span></span>
<span class="line"><span>        else row++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>有序矩阵的 Kth Element</strong></p><p><a href="https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/description/" target="_blank" rel="noreferrer">378. Kth Smallest Element in a Sorted Matrix ((Medium))在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>matrix = [</span></span>
<span class="line"><span>  [ 1,  5,  9],</span></span>
<span class="line"><span>  [10, 11, 13],</span></span>
<span class="line"><span>  [12, 13, 15]</span></span>
<span class="line"><span>],</span></span>
<span class="line"><span>k = 8,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>return 13.</span></span></code></pre></div><p>解题参考: <a href="https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/discuss/85173" target="_blank" rel="noreferrer">Share my thoughts and Clean Java Code在新窗口打开</a></p><p>二分查找解法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int kthSmallest(int[][] matrix, int k) {</span></span>
<span class="line"><span>    int m = matrix.length, n = matrix[0].length;</span></span>
<span class="line"><span>    int lo = matrix[0][0], hi = matrix[m - 1][n - 1];</span></span>
<span class="line"><span>    while (lo &lt;= hi) {</span></span>
<span class="line"><span>        int mid = lo + (hi - lo) / 2;</span></span>
<span class="line"><span>        int cnt = 0;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; m; i++) {</span></span>
<span class="line"><span>            for (int j = 0; j &lt; n &amp;&amp; matrix[i][j] &lt;= mid; j++) {</span></span>
<span class="line"><span>                cnt++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (cnt &lt; k) lo = mid + 1;</span></span>
<span class="line"><span>        else hi = mid - 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return lo;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>堆解法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int kthSmallest(int[][] matrix, int k) {</span></span>
<span class="line"><span>    int m = matrix.length, n = matrix[0].length;</span></span>
<span class="line"><span>    PriorityQueue&lt;Tuple&gt; pq = new PriorityQueue&lt;Tuple&gt;();</span></span>
<span class="line"><span>    for(int j = 0; j &lt; n; j++) pq.offer(new Tuple(0, j, matrix[0][j]));</span></span>
<span class="line"><span>    for(int i = 0; i &lt; k - 1; i++) { // 小根堆，去掉 k - 1 个堆顶元素，此时堆顶元素就是第 k 的数</span></span>
<span class="line"><span>        Tuple t = pq.poll();</span></span>
<span class="line"><span>        if(t.x == m - 1) continue;</span></span>
<span class="line"><span>        pq.offer(new Tuple(t.x + 1, t.y, matrix[t.x + 1][t.y]));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return pq.poll().val;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Tuple implements Comparable&lt;Tuple&gt; {</span></span>
<span class="line"><span>    int x, y, val;</span></span>
<span class="line"><span>    public Tuple(int x, int y, int val) {</span></span>
<span class="line"><span>        this.x = x; this.y = y; this.val = val;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int compareTo(Tuple that) {</span></span>
<span class="line"><span>        return this.val - that.val;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>一个数组元素在 [1, n] 之间，其中一个数被替换为另一个数，找出重复的数和丢失的数</strong></p><p><a href="https://leetcode.com/problems/set-mismatch/description/" target="_blank" rel="noreferrer">645. Set Mismatch (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: nums = [1,2,2,4]</span></span>
<span class="line"><span>Output: [2,3]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: nums = [1,2,2,4]</span></span>
<span class="line"><span>Output: [2,3]</span></span></code></pre></div><p>最直接的方法是先对数组进行排序，这种方法时间复杂度为 O(NlogN)。本题可以以 O(N) 的时间复杂度、O(1) 空间复杂度来求解。</p><p>主要思想是通过交换数组元素，使得数组上的元素在正确的位置上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[] findErrorNums(int[] nums) {</span></span>
<span class="line"><span>    for (int i = 0; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        while (nums[i] != i + 1 &amp;&amp; nums[nums[i] - 1] != nums[i]) {</span></span>
<span class="line"><span>            swap(nums, i, nums[i] - 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 0; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        if (nums[i] != i + 1) {</span></span>
<span class="line"><span>            return new int[]{nums[i], i + 1};</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void swap(int[] nums, int i, int j) {</span></span>
<span class="line"><span>    int tmp = nums[i];</span></span>
<span class="line"><span>    nums[i] = nums[j];</span></span>
<span class="line"><span>    nums[j] = tmp;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>类似题目:</p><ul><li><a href="https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/description/" target="_blank" rel="noreferrer">448. Find All Numbers Disappeared in an Array (Easy)在新窗口打开</a>，寻找所有丢失的元素</li><li><a href="https://leetcode.com/problems/find-all-duplicates-in-an-array/description/" target="_blank" rel="noreferrer">442. Find All Duplicates in an Array (Medium)在新窗口打开</a>，寻找所有重复的元素。</li></ul><p><strong>找出数组中重复的数，数组值在 [1, n] 之间</strong></p><p><a href="https://leetcode.com/problems/find-the-duplicate-number/description/" target="_blank" rel="noreferrer">287. Find the Duplicate Number (Medium)在新窗口打开</a></p><p>要求不能修改数组，也不能使用额外的空间。</p><p>二分查找解法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findDuplicate(int[] nums) {</span></span>
<span class="line"><span>     int l = 1, h = nums.length - 1;</span></span>
<span class="line"><span>     while (l &lt;= h) {</span></span>
<span class="line"><span>         int mid = l + (h - l) / 2;</span></span>
<span class="line"><span>         int cnt = 0;</span></span>
<span class="line"><span>         for (int i = 0; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>             if (nums[i] &lt;= mid) cnt++;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         if (cnt &gt; mid) h = mid - 1;</span></span>
<span class="line"><span>         else l = mid + 1;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     return l;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>双指针解法，类似于有环链表中找出环的入口:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findDuplicate(int[] nums) {</span></span>
<span class="line"><span>    int slow = nums[0], fast = nums[nums[0]];</span></span>
<span class="line"><span>    while (slow != fast) {</span></span>
<span class="line"><span>        slow = nums[slow];</span></span>
<span class="line"><span>        fast = nums[nums[fast]];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fast = 0;</span></span>
<span class="line"><span>    while (slow != fast) {</span></span>
<span class="line"><span>        slow = nums[slow];</span></span>
<span class="line"><span>        fast = nums[fast];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return slow;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>数组相邻差值的个数</strong></p><p><a href="https://leetcode.com/problems/beautiful-arrangement-ii/description/" target="_blank" rel="noreferrer">667. Beautiful Arrangement II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: n = 3, k = 2</span></span>
<span class="line"><span>Output: [1, 3, 2]</span></span>
<span class="line"><span>Explanation: The [1, 3, 2] has three different positive integers ranging from 1 to 3, and the [2, 1] has exactly 2 distinct integers: 1 and 2.</span></span></code></pre></div><p>题目描述: 数组元素为 1~n 的整数，要求构建数组，使得相邻元素的差值不相同的个数为 k。</p><p>让前 k+1 个元素构建出 k 个不相同的差值，序列为: 1 k+1 2 k 3 k-1 ... k/2 k/2+1.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[] constructArray(int n, int k) {</span></span>
<span class="line"><span>    int[] ret = new int[n];</span></span>
<span class="line"><span>    ret[0] = 1;</span></span>
<span class="line"><span>    for (int i = 1, interval = k; i &lt;= k; i++, interval--) {</span></span>
<span class="line"><span>        ret[i] = i % 2 == 1 ? ret[i - 1] + interval : ret[i - 1] - interval;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = k + 1; i &lt; n; i++) {</span></span>
<span class="line"><span>        ret[i] = i + 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>数组的度</strong></p><p><a href="https://leetcode.com/problems/degree-of-an-array/description/" target="_blank" rel="noreferrer">697. Degree of an Array (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [1,2,2,3,1,4,2]</span></span>
<span class="line"><span>Output: 6</span></span></code></pre></div><p>题目描述: 数组的度定义为元素出现的最高频率，例如上面的数组度为 3。要求找到一个最小的子数组，这个子数组的度和原数组一样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findShortestSubArray(int[] nums) {</span></span>
<span class="line"><span>    Map&lt;Integer, Integer&gt; numsCnt = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    Map&lt;Integer, Integer&gt; numsLastIndex = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    Map&lt;Integer, Integer&gt; numsFirstIndex = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    for (int i = 0; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        int num = nums[i];</span></span>
<span class="line"><span>        numsCnt.put(num, numsCnt.getOrDefault(num, 0) + 1);</span></span>
<span class="line"><span>        numsLastIndex.put(num, i);</span></span>
<span class="line"><span>        if (!numsFirstIndex.containsKey(num)) {</span></span>
<span class="line"><span>            numsFirstIndex.put(num, i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int maxCnt = 0;</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        maxCnt = Math.max(maxCnt, numsCnt.get(num));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int ret = nums.length;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        int num = nums[i];</span></span>
<span class="line"><span>        int cnt = numsCnt.get(num);</span></span>
<span class="line"><span>        if (cnt != maxCnt) continue;</span></span>
<span class="line"><span>        ret = Math.min(ret, numsLastIndex.get(num) - numsFirstIndex.get(num) + 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>对角元素相等的矩阵</strong></p><p><a href="https://leetcode.com/problems/toeplitz-matrix/description/" target="_blank" rel="noreferrer">766. Toeplitz Matrix (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1234</span></span>
<span class="line"><span>5123</span></span>
<span class="line"><span>9512</span></span>
<span class="line"><span></span></span>
<span class="line"><span>In the above grid, the diagonals are &quot;[9]&quot;, &quot;[5, 5]&quot;, &quot;[1, 1, 1]&quot;, &quot;[2, 2, 2]&quot;, &quot;[3, 3]&quot;, &quot;[4]&quot;, and in each diagonal all elements are the same, so the answer is True.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean isToeplitzMatrix(int[][] matrix) {</span></span>
<span class="line"><span>    for (int i = 0; i &lt; matrix[0].length; i++) {</span></span>
<span class="line"><span>        if (!check(matrix, matrix[0][i], 0, i)) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 0; i &lt; matrix.length; i++) {</span></span>
<span class="line"><span>        if (!check(matrix, matrix[i][0], i, 0)) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean check(int[][] matrix, int expectValue, int row, int col) {</span></span>
<span class="line"><span>    if (row &gt;= matrix.length || col &gt;= matrix[0].length) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (matrix[row][col] != expectValue) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return check(matrix, expectValue, row + 1, col + 1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>嵌套数组</strong></p><p><a href="https://leetcode.com/problems/array-nesting/description/" target="_blank" rel="noreferrer">565. Array Nesting (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: A = [5,4,0,3,1,6,2]</span></span>
<span class="line"><span>Output: 4</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>A[0] = 5, A[1] = 4, A[2] = 0, A[3] = 3, A[4] = 1, A[5] = 6, A[6] = 2.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>One of the longest S[K]:</span></span>
<span class="line"><span>S[0] = {A[0], A[5], A[6], A[2]} = {5, 6, 2, 0}</span></span></code></pre></div><p>题目描述: S[i] 表示一个集合，集合的第一个元素是 A[i]，第二个元素是 A[A[i]]，如此嵌套下去。求最大的 S[i]。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int arrayNesting(int[] nums) {</span></span>
<span class="line"><span>    int max = 0;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        int cnt = 0;</span></span>
<span class="line"><span>        for (int j = i; nums[j] != -1; ) {</span></span>
<span class="line"><span>            cnt++;</span></span>
<span class="line"><span>            int t = nums[j];</span></span>
<span class="line"><span>            nums[j] = -1; // 标记该位置已经被访问</span></span>
<span class="line"><span>            j = t;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        max = Math.max(max, cnt);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return max;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>分隔数组</strong></p><p><a href="https://leetcode.com/problems/max-chunks-to-make-sorted/description/" target="_blank" rel="noreferrer">769. Max Chunks To Make Sorted (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: arr = [1,0,2,3,4]</span></span>
<span class="line"><span>Output: 4</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>We can split into two chunks, such as [1, 0], [2, 3, 4].</span></span>
<span class="line"><span>However, splitting into [1, 0], [2], [3], [4] is the highest number of chunks possible.</span></span></code></pre></div><p>题目描述: 分隔数组，使得对每部分排序后数组就为有序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int maxChunksToSorted(int[] arr) {</span></span>
<span class="line"><span>    if (arr == null) return 0;</span></span>
<span class="line"><span>    int ret = 0;</span></span>
<span class="line"><span>    int right = arr[0];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; arr.length; i++) {</span></span>
<span class="line"><span>        right = Math.max(right, arr[i]);</span></span>
<span class="line"><span>        if (right == i) ret++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,75)]))}const m=s(l,[["render",i]]);export{h as __pageData,m as default};
