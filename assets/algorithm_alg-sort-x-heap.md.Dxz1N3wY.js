import{_ as n,c as s,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/alg/alg-sort-heap-1.jpg",i="/vitepress-blog-template/images/alg/alg-sort-heap-2.jpg",t="/vitepress-blog-template/images/alg/alg-sort-heap-3.jpg",c="/vitepress-blog-template/images/alg/alg-sort-heap-4.jpg",o="/vitepress-blog-template/images/alg/alg-sort-heap-5.jpg",r="/vitepress-blog-template/images/alg/alg-sort-heap-6.jpg",h="/vitepress-blog-template/images/alg/alg-sort-heap-7.jpg",m="/vitepress-blog-template/images/alg/alg-sort-heap-8.jpg",w=JSON.parse('{"title":"排序 - 堆排序(Heap Sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-heap.md","filePath":"algorithm/alg-sort-x-heap.md","lastUpdated":1737706346000}'),u={name:"algorithm/alg-sort-x-heap.md"};function g(d,a,q,_,b,f){return l(),s("div",null,a[0]||(a[0]=[p('<h1 id="排序-堆排序-heap-sort" tabindex="-1">排序 - 堆排序(Heap Sort) <a class="header-anchor" href="#排序-堆排序-heap-sort" aria-label="Permalink to &quot;排序 - 堆排序(Heap Sort)&quot;">​</a></h1><blockquote><p>堆排序是指利用堆这种数据结构所设计的一种排序算法。堆是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。@pdai</p></blockquote><h2 id="堆排序介绍" tabindex="-1">堆排序介绍 <a class="header-anchor" href="#堆排序介绍" aria-label="Permalink to &quot;堆排序介绍&quot;">​</a></h2><p>学习堆排序之前，有必要了解堆！若读者不熟悉堆，建议先了解堆(建议可以通过二叉堆，左倾堆，斜堆，二项堆或斐波那契堆等文章进行了解)，然后再来学习本章。</p><p>我们知道，堆分为&quot;最大堆&quot;和&quot;最小堆&quot;。最大堆通常被用来进行&quot;升序&quot;排序，而最小堆通常被用来进行&quot;降序&quot;排序。 鉴于最大堆和最小堆是对称关系，理解其中一种即可。本文将对最大堆实现的升序排序进行详细说明。</p><p>最大堆进行升序排序的基本思想: ① 初始化堆: 将数列a[1...n]构造成最大堆。 ② 交换数据: 将a[1]和a[n]交换，使a[n]是a[1...n]中的最大值；然后将a[1...n-1]重新调整为最大堆。 接着，将a[1]和a[n-1]交换，使a[n-1]是a[1...n-1]中的最大值；然后将a[1...n-2]重新调整为最大值。 依次类推，直到整个数列都是有序的。</p><p>下面，通过图文来解析堆排序的实现过程。注意实现中用到了&quot;数组实现的二叉堆的性质&quot;。 在第一个元素的索引为 0 的情形中:</p><ul><li>性质一: 索引为i的左孩子的索引是 (2*i+1);</li><li>性质二: 索引为i的右孩子的索引是 (2*i+2);</li><li>性质三: 索引为i的父结点的索引是 floor((i-1)/2);</li></ul><p><img src="'+e+'" alt="error.图片加载失败"></p><p>例如，对于最大堆{110,100,90,40,80,20,60,10,30,50,70}而言: 索引为0的左孩子的所有是1；索引为0的右孩子是2；索引为8的父节点是3。</p><h2 id="堆排序实现" tabindex="-1">堆排序实现 <a class="header-anchor" href="#堆排序实现" aria-label="Permalink to &quot;堆排序实现&quot;">​</a></h2><p>下面演示heap_sort_asc(a, n)对a={20,30,90,40,70,110,60,10,100,50,80}, n=11进行堆排序过程。下面是数组a对应的初始化结构:</p><p><img src="'+i+'" alt="error.图片加载失败"></p><h3 id="初始化堆" tabindex="-1">初始化堆 <a class="header-anchor" href="#初始化堆" aria-label="Permalink to &quot;初始化堆&quot;">​</a></h3><p>在堆排序算法中，首先要将待排序的数组转化成二叉堆。 下面演示将数组{20,30,90,40,70,110,60,10,100,50,80}转换为最大堆{110,100,90,40,80,20,60,10,30,50,70}的步骤。</p><ul><li>1.1 i=11/2-1，即i=4</li></ul><p><img src="'+t+'" alt="error.图片加载失败"></p><p>上面是maxheap_down(a, 4, 9)调整过程。maxheap_down(a, 4, 9)的作用是将a[4...9]进行下调；a[4]的左孩子是a[9]，右孩子是a[10]。调整时，选择左右孩子中较大的一个(即a[10])和a[4]交换。</p><ul><li>1.2 i=3</li></ul><p><img src="'+c+'" alt="error.图片加载失败"></p><p>上面是maxheap_down(a, 3, 9)调整过程。maxheap_down(a, 3, 9)的作用是将a[3...9]进行下调；a[3]的左孩子是a[7]，右孩子是a[8]。调整时，选择左右孩子中较大的一个(即a[8])和a[4]交换。</p><ul><li>1.3 i=2</li></ul><p><img src="'+o+'" alt="error.图片加载失败"></p><p>上面是maxheap_down(a, 2, 9)调整过程。maxheap_down(a, 2, 9)的作用是将a[2...9]进行下调；a[2]的左孩子是a[5]，右孩子是a[6]。调整时，选择左右孩子中较大的一个(即a[5])和a[2]交换。</p><ul><li>1.4 i=1</li></ul><p><img src="'+r+'" alt="error.图片加载失败"></p><p>上面是maxheap_down(a, 1, 9)调整过程。maxheap_down(a, 1, 9)的作用是将a[1...9]进行下调；a[1]的左孩子是a[3]，右孩子是a[4]。调整时，选择左右孩子中较大的一个(即a[3])和a[1]交换。交换之后，a[3]为30，它比它的右孩子a[8]要大，接着，再将它们交换。</p><ul><li>1.5 i=0</li></ul><p><img src="'+h+'" alt="error.图片加载失败"></p><p>上面是maxheap_down(a, 0, 9)调整过程。maxheap_down(a, 0, 9)的作用是将a[0...9]进行下调；a[0]的左孩子是a[1]，右孩子是a[2]。调整时，选择左右孩子中较大的一个(即a[2])和a[0]交换。交换之后，a[2]为20，它比它的左右孩子要大，选择较大的孩子(即左孩子)和a[2]交换。</p><p>调整完毕，就得到了最大堆。此时，数组{20,30,90,40,70,110,60,10,100,50,80}也就变成了{110,100,90,40,80,20,60,10,30,50,70}。</p><h3 id="交换数据" tabindex="-1">交换数据 <a class="header-anchor" href="#交换数据" aria-label="Permalink to &quot;交换数据&quot;">​</a></h3><p>在将数组转换成最大堆之后，接着要进行交换数据，从而使数组成为一个真正的有序数组。 交换数据部分相对比较简单，下面仅仅给出将最大值放在数组末尾的示意图。</p><p><img src="'+m+`" alt="error.图片加载失败"></p><p>上面是当n=10时，交换数据的示意图。 当n=10时，首先交换a[0]和a[10]，使得a[10]是a[0...10]之间的最大值；然后，调整a[0...9]使它称为最大堆。交换之后: a[10]是有序的！ 当n=9时， 首先交换a[0]和a[9]，使得a[9]是a[0...9]之间的最大值；然后，调整a[0...8]使它称为最大堆。交换之后: a[9...10]是有序的！ ... 依此类推，直到a[0...10]是有序的。</p><h2 id="堆排序复杂度和稳定性" tabindex="-1">堆排序复杂度和稳定性 <a class="header-anchor" href="#堆排序复杂度和稳定性" aria-label="Permalink to &quot;堆排序复杂度和稳定性&quot;">​</a></h2><h3 id="堆排序时间复杂度" tabindex="-1">堆排序时间复杂度 <a class="header-anchor" href="#堆排序时间复杂度" aria-label="Permalink to &quot;堆排序时间复杂度&quot;">​</a></h3><p>堆排序的时间复杂度是O(N*lgN)。</p><p>假设被排序的数列中有N个数。遍历一趟的时间复杂度是O(N)，需要遍历多少次呢? 堆排序是采用的二叉堆进行排序的，二叉堆就是一棵二叉树，它需要遍历的次数就是二叉树的深度，而根据完全二叉树的定义，它的深度至少是lg(N+1)。最多是多少呢? 由于二叉堆是完全二叉树，因此，它的深度最多也不会超过lg(2N)。因此，遍历一趟的时间复杂度是O(N)，而遍历次数介于lg(N+1)和lg(2N)之间；因此得出它的时间复杂度是O(N*lgN)。</p><h3 id="堆排序稳定性" tabindex="-1">堆排序稳定性 <a class="header-anchor" href="#堆排序稳定性" aria-label="Permalink to &quot;堆排序稳定性&quot;">​</a></h3><p>堆排序是不稳定的算法，它不满足稳定算法的定义。它在交换数据的时候，是比较父结点和子节点之间的数据，所以，即便是存在两个数值相等的兄弟节点，它们的相对顺序在排序也可能发生变化。</p><p><code>算法稳定性</code> -- 假设在数列中存在a[i]=a[j]，若在排序之前，a[i]在a[j]前面；并且排序之后，a[i]仍然在a[j]前面。则这个排序算法是稳定的！</p><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 堆排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/11</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class HeapSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * (最大)堆的向下调整算法</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 注: 数组实现的堆中，第N个节点的左孩子的索引值是(2N+1)，右孩子的索引是(2N+2)。</span></span>
<span class="line"><span>     *     其中，N为数组下标索引值，如数组中第1个数对应的N为0。</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     start -- 被下调节点的起始位置(一般为0，表示从第1个开始)</span></span>
<span class="line"><span>     *     end   -- 截至范围(一般为数组中最后一个元素的索引)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void maxHeapDown(int[] a, int start, int end) {</span></span>
<span class="line"><span>        int c = start;            // 当前(current)节点的位置</span></span>
<span class="line"><span>        int l = 2*c + 1;        // 左(left)孩子的位置</span></span>
<span class="line"><span>        int tmp = a[c];            // 当前(current)节点的大小</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (; l &lt;= end; c=l,l=2*l+1) {</span></span>
<span class="line"><span>            // &quot;l&quot;是左孩子，&quot;l+1&quot;是右孩子</span></span>
<span class="line"><span>            if ( l &lt; end &amp;&amp; a[l] &lt; a[l+1])</span></span>
<span class="line"><span>                l++;        // 左右两孩子中选择较大者，即m_heap[l+1]</span></span>
<span class="line"><span>            if (tmp &gt;= a[l])</span></span>
<span class="line"><span>                break;        // 调整结束</span></span>
<span class="line"><span>            else {            // 交换值</span></span>
<span class="line"><span>                a[c] = a[l];</span></span>
<span class="line"><span>                a[l]= tmp;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 堆排序(从小到大)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void heapSortAsc(int[] a, int n) {</span></span>
<span class="line"><span>        int i,tmp;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 从(n/2-1) --&gt; 0逐次遍历。遍历之后，得到的数组实际上是一个(最大)二叉堆。</span></span>
<span class="line"><span>        for (i = n / 2 - 1; i &gt;= 0; i--)</span></span>
<span class="line"><span>            maxHeapDown(a, i, n-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 从最后一个元素开始对序列进行调整，不断的缩小调整的范围直到第一个元素</span></span>
<span class="line"><span>        for (i = n - 1; i &gt; 0; i--) {</span></span>
<span class="line"><span>            // 交换a[0]和a[i]。交换后，a[i]是a[0...i]中最大的。</span></span>
<span class="line"><span>            tmp = a[0];</span></span>
<span class="line"><span>            a[0] = a[i];</span></span>
<span class="line"><span>            a[i] = tmp;</span></span>
<span class="line"><span>            // 调整a[0...i-1]，使得a[0...i-1]仍然是一个最大堆。</span></span>
<span class="line"><span>            // 即，保证a[i-1]是a[0...i-1]中的最大值。</span></span>
<span class="line"><span>            maxHeapDown(a, 0, i-1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * (最小)堆的向下调整算法</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 注: 数组实现的堆中，第N个节点的左孩子的索引值是(2N+1)，右孩子的索引是(2N+2)。</span></span>
<span class="line"><span>     *     其中，N为数组下标索引值，如数组中第1个数对应的N为0。</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     start -- 被下调节点的起始位置(一般为0，表示从第1个开始)</span></span>
<span class="line"><span>     *     end   -- 截至范围(一般为数组中最后一个元素的索引)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void minHeapDown(int[] a, int start, int end) {</span></span>
<span class="line"><span>        int c = start;            // 当前(current)节点的位置</span></span>
<span class="line"><span>        int l = 2*c + 1;        // 左(left)孩子的位置</span></span>
<span class="line"><span>        int tmp = a[c];            // 当前(current)节点的大小</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (; l &lt;= end; c=l,l=2*l+1) {</span></span>
<span class="line"><span>            // &quot;l&quot;是左孩子，&quot;l+1&quot;是右孩子</span></span>
<span class="line"><span>            if ( l &lt; end &amp;&amp; a[l] &gt; a[l+1])</span></span>
<span class="line"><span>                l++;        // 左右两孩子中选择较小者</span></span>
<span class="line"><span>            if (tmp &lt;= a[l])</span></span>
<span class="line"><span>                break;        // 调整结束</span></span>
<span class="line"><span>            else {            // 交换值</span></span>
<span class="line"><span>                a[c] = a[l];</span></span>
<span class="line"><span>                a[l]= tmp;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 堆排序(从大到小)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void heapSortDesc(int[] a, int n) {</span></span>
<span class="line"><span>        int i,tmp;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 从(n/2-1) --&gt; 0逐次遍历每。遍历之后，得到的数组实际上是一个最小堆。</span></span>
<span class="line"><span>        for (i = n / 2 - 1; i &gt;= 0; i--)</span></span>
<span class="line"><span>            minHeapDown(a, i, n-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 从最后一个元素开始对序列进行调整，不断的缩小调整的范围直到第一个元素</span></span>
<span class="line"><span>        for (i = n - 1; i &gt; 0; i--) {</span></span>
<span class="line"><span>            // 交换a[0]和a[i]。交换后，a[i]是a[0...i]中最小的。</span></span>
<span class="line"><span>            tmp = a[0];</span></span>
<span class="line"><span>            a[0] = a[i];</span></span>
<span class="line"><span>            a[i] = tmp;</span></span>
<span class="line"><span>            // 调整a[0...i-1]，使得a[0...i-1]仍然是一个最小堆。</span></span>
<span class="line"><span>            // 即，保证a[i-1]是a[0...i-1]中的最小值。</span></span>
<span class="line"><span>            minHeapDown(a, 0, i-1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        int a[] = {20,30,90,40,70,110,60,10,100,50,80};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;before sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        heapSortAsc(a, a.length);            // 升序排列</span></span>
<span class="line"><span>        //heapSortDesc(a, a.length);        // 降序排列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3602162.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3602162.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,48)]))}const k=n(u,[["render",g]]);export{w as __pageData,k as default};
