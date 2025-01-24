import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"线性表(散列) - 哈希表","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-hashtable.md","filePath":"algorithm/alg-basic-hashtable.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-basic-hashtable.md"};function l(i,n,o,c,r,u){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="线性表-散列-哈希表" tabindex="-1">线性表(散列) - 哈希表 <a class="header-anchor" href="#线性表-散列-哈希表" aria-label="Permalink to &quot;线性表(散列) - 哈希表&quot;">​</a></h1><blockquote><p>散列表（Hash table，也叫哈希表），是根据关键码值(Key value)而直接进行访问的数据结构。也就是说，它通过把关键码值映射到表中一个位置来访问记录，以加快查找的速度。这个映射函数叫做散列函数，存放记录的数组叫做散列表。@pdai</p></blockquote><h2 id="哈希表相关题目" tabindex="-1">哈希表相关题目 <a class="header-anchor" href="#哈希表相关题目" aria-label="Permalink to &quot;哈希表相关题目&quot;">​</a></h2><p>哈希表使用 O(N) 空间复杂度存储数据，并且以 O(1) 时间复杂度求解问题。</p><ul><li><p>Java 中的 <strong>HashSet</strong> 用于存储一个集合，可以查找元素是否在集合中。如果元素有穷，并且范围不大，那么可以用一个布尔数组来存储一个元素是否存在。例如对于只有小写字符的元素，就可以用一个长度为 26 的布尔数组来存储一个字符集合，使得空间复杂度降低为 O(1)。</p></li><li><p>Java 中的 <strong>HashMap</strong> 主要用于映射关系，从而把两个元素联系起来。HashMap 也可以用来对元素进行计数统计，此时键为元素，值为计数。和 HashSet 类似，如果元素有穷并且范围不大，可以用整型数组来进行统计。在对一个内容进行压缩或者其它转换时，利用 HashMap 可以把原始内容和转换后的内容联系起来。例如在一个简化 url 的系统中 <a href="https://leetcode.com/problems/encode-and-decode-tinyurl/description/" target="_blank" rel="noreferrer">Leetcdoe : 535. Encode and Decode TinyURL (Medium)在新窗口打开</a>，利用 HashMap 就可以存储精简后的 url 到原始 url 的映射，使得不仅可以显示简化的 url，也可以根据简化的 url 得到原始 url 从而定位到正确的资源。</p></li></ul><p><strong>数组中两个数的和为给定值</strong></p><p><a href="https://leetcode.com/problems/two-sum/description/" target="_blank" rel="noreferrer">1. Two Sum (Easy)在新窗口打开</a></p><p>可以先对数组进行排序，然后使用双指针方法或者二分查找方法。这样做的时间复杂度为 O(NlogN)，空间复杂度为 O(1)。</p><p>用 HashMap 存储数组元素和索引的映射，在访问到 nums[i] 时，判断 HashMap 中是否存在 target - nums[i]，如果存在说明 target - nums[i] 所在的索引和 i 就是要找的两个数。该方法的时间复杂度为 O(N)，空间复杂度为 O(N)，使用空间来换取时间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[] twoSum(int[] nums, int target) {</span></span>
<span class="line"><span>    HashMap&lt;Integer, Integer&gt; indexForNum = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    for (int i = 0; i &lt; nums.length; i++) {</span></span>
<span class="line"><span>        if (indexForNum.containsKey(target - nums[i])) {</span></span>
<span class="line"><span>            return new int[]{indexForNum.get(target - nums[i]), i};</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            indexForNum.put(nums[i], i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>判断数组是否含有重复元素</strong></p><p><a href="https://leetcode.com/problems/contains-duplicate/description/" target="_blank" rel="noreferrer">217. Contains Duplicate (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean containsDuplicate(int[] nums) {</span></span>
<span class="line"><span>    Set&lt;Integer&gt; set = new HashSet&lt;&gt;();</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        set.add(num);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return set.size() &lt; nums.length;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>最长和谐序列</strong></p><p><a href="https://leetcode.com/problems/longest-harmonious-subsequence/description/" target="_blank" rel="noreferrer">594. Longest Harmonious Subsequence (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [1,3,2,2,5,2,3,7]</span></span>
<span class="line"><span>Output: 5</span></span>
<span class="line"><span>Explanation: The longest harmonious subsequence is [3,2,2,2,3].</span></span></code></pre></div><p>和谐序列中最大数和最小数只差正好为 1，应该注意的是序列的元素不一定是数组的连续元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int findLHS(int[] nums) {</span></span>
<span class="line"><span>    Map&lt;Integer, Integer&gt; countForNum = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        countForNum.put(num, countForNum.getOrDefault(num, 0) + 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int longest = 0;</span></span>
<span class="line"><span>    for (int num : countForNum.keySet()) {</span></span>
<span class="line"><span>        if (countForNum.containsKey(num + 1)) {</span></span>
<span class="line"><span>            longest = Math.max(longest, countForNum.get(num + 1) + countForNum.get(num));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return longest;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>最长连续序列</strong></p><p><a href="https://leetcode.com/problems/longest-consecutive-sequence/description/" target="_blank" rel="noreferrer">128. Longest Consecutive Sequence (Hard)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Given [100, 4, 200, 1, 3, 2],</span></span>
<span class="line"><span>The longest consecutive elements sequence is [1, 2, 3, 4]. Return its length: 4.</span></span></code></pre></div><p>要求以 O(N) 的时间复杂度求解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int longestConsecutive(int[] nums) {</span></span>
<span class="line"><span>    Map&lt;Integer, Integer&gt; countForNum = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        countForNum.put(num, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int num : nums) {</span></span>
<span class="line"><span>        forward(countForNum, num);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return maxCount(countForNum);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int forward(Map&lt;Integer, Integer&gt; countForNum, int num) {</span></span>
<span class="line"><span>    if (!countForNum.containsKey(num)) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int cnt = countForNum.get(num);</span></span>
<span class="line"><span>    if (cnt &gt; 1) {</span></span>
<span class="line"><span>        return cnt;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    cnt = forward(countForNum, num + 1) + 1;</span></span>
<span class="line"><span>    countForNum.put(num, cnt);</span></span>
<span class="line"><span>    return cnt;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int maxCount(Map&lt;Integer, Integer&gt; countForNum) {</span></span>
<span class="line"><span>    int max = 0;</span></span>
<span class="line"><span>    for (int num : countForNum.keySet()) {</span></span>
<span class="line"><span>        max = Math.max(max, countForNum.get(num));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return max;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,24)]))}const d=s(t,[["render",l]]);export{g as __pageData,d as default};
