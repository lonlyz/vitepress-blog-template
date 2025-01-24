import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"算法思想 - 二分法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-core-devide-two.md","filePath":"algorithm/alg-core-devide-two.md","lastUpdated":1737706346000}'),l={name:"algorithm/alg-core-devide-two.md"};function t(i,s,c,r,h,o){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="算法思想-二分法" tabindex="-1">算法思想 - 二分法 <a class="header-anchor" href="#算法思想-二分法" aria-label="Permalink to &quot;算法思想 - 二分法&quot;">​</a></h1><blockquote><p>本文主要介绍算法思想中分治算法重要的二分法，比如二分查找；二分查找也称折半查找（Binary Search），它是一种效率较高的查找方法。但是，折半查找要求线性表必须采用顺序存储结构，而且表中元素按关键字有序排列。@pdai</p></blockquote><h2 id="二分查找" tabindex="-1">二分查找 <a class="header-anchor" href="#二分查找" aria-label="Permalink to &quot;二分查找&quot;">​</a></h2><h3 id="正常实现" tabindex="-1">正常实现 <a class="header-anchor" href="#正常实现" aria-label="Permalink to &quot;正常实现&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int binarySearch(int[] nums, int key) {</span></span>
<span class="line"><span>    int l = 0, h = nums.length - 1;</span></span>
<span class="line"><span>    while (l &lt;= h) {</span></span>
<span class="line"><span>        int m = l + (h - l) / 2;</span></span>
<span class="line"><span>        if (nums[m] == key) {</span></span>
<span class="line"><span>            return m;</span></span>
<span class="line"><span>        } else if (nums[m] &gt; key) {</span></span>
<span class="line"><span>            h = m - 1;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            l = m + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return -1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="时间复杂度" tabindex="-1">时间复杂度 <a class="header-anchor" href="#时间复杂度" aria-label="Permalink to &quot;时间复杂度&quot;">​</a></h3><p>二分查找也称为折半查找，每次都能将查找区间减半，这种折半特性的算法时间复杂度都为 O(logN)。</p><p><strong>m 计算</strong></p><p>有两种计算中值 m 的方式:</p><ul><li>m = (l + h) / 2</li><li>m = l + (h - l) / 2</li></ul><p>l + h 可能出现加法溢出，最好使用第二种方式。</p><p><strong>返回值</strong></p><p>循环退出时如果仍然没有查找到 key，那么表示查找失败。可以有两种返回值:</p><ul><li>-1: 以一个错误码表示没有查找到 key</li><li>l: 将 key 插入到 nums 中的正确位置</li></ul><h3 id="二分查找变种" tabindex="-1">二分查找变种 <a class="header-anchor" href="#二分查找变种" aria-label="Permalink to &quot;二分查找变种&quot;">​</a></h3><p>二分查找可以有很多变种，变种实现要注意边界值的判断。例如在一个有重复元素的数组中查找 key 的最左位置的实现如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int binarySearch(int[] nums, int key) {</span></span>
<span class="line"><span>    int l = 0, h = nums.length - 1;</span></span>
<span class="line"><span>    while (l &lt; h) {</span></span>
<span class="line"><span>        int m = l + (h - l) / 2;</span></span>
<span class="line"><span>        if (nums[m] &gt;= key) {</span></span>
<span class="line"><span>            h = m;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            l = m + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return l;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该实现和正常实现有以下不同:</p><ul><li>循环条件为 l &lt; h</li><li>h 的赋值表达式为 h = m</li><li>最后返回 l 而不是 -1</li></ul><p>在 nums[m] &gt;= key 的情况下，可以推导出最左 key 位于 [l, m] 区间中，这是一个闭区间。h 的赋值表达式为 h = m，因为 m 位置也可能是解。</p><p>在 h 的赋值表达式为 h = mid 的情况下，如果循环条件为 l &lt;= h，那么会出现循环无法退出的情况，因此循环条件只能是 l &lt; h。以下演示了循环条件为 l &lt;= h 时循环无法退出的情况:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nums = {0, 1, 2}, key = 1</span></span>
<span class="line"><span>l   m   h</span></span>
<span class="line"><span>0   1   2  nums[m] &gt;= key</span></span>
<span class="line"><span>0   0   1  nums[m] &lt; key</span></span>
<span class="line"><span>1   1   1  nums[m] &gt;= key</span></span>
<span class="line"><span>1   1   1  nums[m] &gt;= key</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>当循环体退出时，不表示没有查找到 key，因此最后返回的结果不应该为 -1。为了验证有没有查找到，需要在调用端判断一下返回位置上的值和 key 是否相等。</p><h4 id="求开方" tabindex="-1">求开方 <a class="header-anchor" href="#求开方" aria-label="Permalink to &quot;求开方&quot;">​</a></h4><p><a href="https://leetcode.com/problems/sqrtx/description/" target="_blank" rel="noreferrer">69. Sqrt(x) (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: 4</span></span>
<span class="line"><span>Output: 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Input: 8</span></span>
<span class="line"><span>Output: 2</span></span>
<span class="line"><span>Explanation: The square root of 8 is 2.82842..., and since we want to return an integer, the decimal part will be truncated.</span></span></code></pre></div><p>一个数 x 的开方 sqrt 一定在 0 ~ x 之间，并且满足 sqrt == x / sqrt。可以利用二分查找在 0 ~ x 之间查找 sqrt。</p><p>对于 x = 8，它的开方是 2.82842...，最后应该返回 2 而不是 3。在循环条件为 l &lt;= h 并且循环退出时，h 总是比 l 小 1，也就是说 h = 2，l = 3，因此最后的返回值应该为 h 而不是 l。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int mySqrt(int x) {</span></span>
<span class="line"><span>    if (x &lt;= 1) {</span></span>
<span class="line"><span>        return x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int l = 1, h = x;</span></span>
<span class="line"><span>    while (l &lt;= h) {</span></span>
<span class="line"><span>        int mid = l + (h - l) / 2;</span></span>
<span class="line"><span>        int sqrt = x / mid;</span></span>
<span class="line"><span>        if (sqrt == mid) {</span></span>
<span class="line"><span>            return mid;</span></span>
<span class="line"><span>        } else if (mid &gt; sqrt) {</span></span>
<span class="line"><span>            h = mid - 1;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            l = mid + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return h;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="大于给定元素的最小元素" tabindex="-1">大于给定元素的最小元素 <a class="header-anchor" href="#大于给定元素的最小元素" aria-label="Permalink to &quot;大于给定元素的最小元素&quot;">​</a></h4><p><a href="https://leetcode.com/problems/find-smallest-letter-greater-than-target/description/" target="_blank" rel="noreferrer">744. Find Smallest Letter Greater Than Target (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>letters = [&quot;c&quot;, &quot;f&quot;, &quot;j&quot;]</span></span>
<span class="line"><span>target = &quot;d&quot;</span></span>
<span class="line"><span>Output: &quot;f&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Input:</span></span>
<span class="line"><span>letters = [&quot;c&quot;, &quot;f&quot;, &quot;j&quot;]</span></span>
<span class="line"><span>target = &quot;k&quot;</span></span>
<span class="line"><span>Output: &quot;c&quot;</span></span></code></pre></div><p>题目描述: 给定一个有序的字符数组 letters 和一个字符 target，要求找出 letters 中大于 target 的最小字符，如果找不到就返回第 1 个字符。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public char nextGreatestLetter(char[] letters, char target) {</span></span>
<span class="line"><span>    int n = letters.length;</span></span>
<span class="line"><span>    int l = 0, h = n - 1;</span></span>
<span class="line"><span>    while (l &lt;= h) {</span></span>
<span class="line"><span>        int m = l + (h - l) / 2;</span></span>
<span class="line"><span>        if (letters[m] &lt;= target) {</span></span>
<span class="line"><span>            l = m + 1;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            h = m - 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return l &lt; n ? letters[l] : letters[0];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="有序数组的-single-element" tabindex="-1">有序数组的 Single Element <a class="header-anchor" href="#有序数组的-single-element" aria-label="Permalink to &quot;有序数组的 Single Element&quot;">​</a></h4><p><a href="https://leetcode.com/problems/single-element-in-a-sorted-array/description/" target="_blank" rel="noreferrer">540. Single Element in a Sorted Array (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [1,1,2,3,3,4,4,8,8]</span></span>
<span class="line"><span>Output: 2</span></span></code></pre></div><p>题目描述: 一个有序数组只有一个数不出现两次，找出这个数。要求以 O(logN) 时间复杂度进行求解。</p><p>令 index 为 Single Element 在数组中的位置。如果 m 为偶数，并且 m + 1 &lt; index，那么 nums[m] == nums[m + 1]；m + 1 &gt;= index，那么 nums[m] != nums[m + 1]。</p><p>从上面的规律可以知道，如果 nums[m] == nums[m + 1]，那么 index 所在的数组位置为 [m + 2, h]，此时令 l = m + 2；如果 nums[m] != nums[m + 1]，那么 index 所在的数组位置为 [l, m]，此时令 h = m。</p><p>因为 h 的赋值表达式为 h = m，那么循环条件也就只能使用 l &lt; h 这种形式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int singleNonDuplicate(int[] nums) {</span></span>
<span class="line"><span>    int l = 0, h = nums.length - 1;</span></span>
<span class="line"><span>    while (l &lt; h) {</span></span>
<span class="line"><span>        int m = l + (h - l) / 2;</span></span>
<span class="line"><span>        if (m % 2 == 1) {</span></span>
<span class="line"><span>            m--;   // 保证 l/h/m 都在偶数位，使得查找区间大小一直都是奇数</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (nums[m] == nums[m + 1]) {</span></span>
<span class="line"><span>            l = m + 2;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            h = m;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return nums[l];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="第一个错误的版本" tabindex="-1">第一个错误的版本 <a class="header-anchor" href="#第一个错误的版本" aria-label="Permalink to &quot;第一个错误的版本&quot;">​</a></h4><p><a href="https://leetcode.com/problems/first-bad-version/description/" target="_blank" rel="noreferrer">278. First Bad Version (Easy)在新窗口打开</a></p><p>题目描述: 给定一个元素 n 代表有 [1, 2, ..., n] 版本，可以调用 isBadVersion(int x) 知道某个版本是否错误，要求找到第一个错误的版本。</p><p>如果第 m 个版本出错，则表示第一个错误的版本在 [l, m] 之间，令 h = m；否则第一个错误的版本在 [m + 1, h] 之间，令 l = m + 1。</p><p>因为 h 的赋值表达式为 h = m，因此循环条件为 l &lt; h。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int firstBadVersion(int n) {</span></span>
<span class="line"><span>    int l = 1, h = n;</span></span>
<span class="line"><span>    while (l &lt; h) {</span></span>
<span class="line"><span>        int mid = l + (h - l) / 2;</span></span>
<span class="line"><span>        if (isBadVersion(mid)) {</span></span>
<span class="line"><span>            h = mid;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            l = mid + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return l;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="旋转数组的最小数字" tabindex="-1">旋转数组的最小数字 <a class="header-anchor" href="#旋转数组的最小数字" aria-label="Permalink to &quot;旋转数组的最小数字&quot;">​</a></h4><p><a href="https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/" target="_blank" rel="noreferrer">153. Find Minimum in Rotated Sorted Array (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [3,4,5,1,2],</span></span>
<span class="line"><span>Output: 1</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findMin(int[] nums) {</span></span>
<span class="line"><span>    int l = 0, h = nums.length - 1;</span></span>
<span class="line"><span>    while (l &lt; h) {</span></span>
<span class="line"><span>        int m = l + (h - l) / 2;</span></span>
<span class="line"><span>        if (nums[m] &lt;= nums[h]) {</span></span>
<span class="line"><span>            h = m;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            l = m + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return nums[l];</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="查找区间" tabindex="-1">查找区间 <a class="header-anchor" href="#查找区间" aria-label="Permalink to &quot;查找区间&quot;">​</a></h4><p><a href="https://leetcode.com/problems/search-for-a-range/description/" target="_blank" rel="noreferrer">34. Search for a Range (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: nums = [5,7,7,8,8,10], target = 8</span></span>
<span class="line"><span>Output: [3,4]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Input: nums = [5,7,7,8,8,10], target = 6</span></span>
<span class="line"><span>Output: [-1,-1]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[] searchRange(int[] nums, int target) {</span></span>
<span class="line"><span>    int first = binarySearch(nums, target);</span></span>
<span class="line"><span>    int last = binarySearch(nums, target + 1) - 1;</span></span>
<span class="line"><span>    if (first == nums.length || nums[first] != target) {</span></span>
<span class="line"><span>        return new int[]{-1, -1};</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        return new int[]{first, Math.max(first, last)};</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int binarySearch(int[] nums, int target) {</span></span>
<span class="line"><span>    int l = 0, h = nums.length; // 注意 h 的初始值</span></span>
<span class="line"><span>    while (l &lt; h) {</span></span>
<span class="line"><span>        int m = l + (h - l) / 2;</span></span>
<span class="line"><span>        if (nums[m] &gt;= target) {</span></span>
<span class="line"><span>            h = m;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            l = m + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return l;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,57)]))}const m=n(l,[["render",t]]);export{u as __pageData,m as default};
