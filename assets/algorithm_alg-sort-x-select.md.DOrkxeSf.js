import{_ as n,c as s,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/alg/alg-sort-select-1.jpg",m=JSON.parse('{"title":"排序 - 选择排序(Selection sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-select.md","filePath":"algorithm/alg-sort-x-select.md","lastUpdated":1737706346000}'),i={name:"algorithm/alg-sort-x-select.md"};function t(o,a,r,c,h,u){return l(),s("div",null,a[0]||(a[0]=[p('<h1 id="排序-选择排序-selection-sort" tabindex="-1">排序 - 选择排序(Selection sort) <a class="header-anchor" href="#排序-选择排序-selection-sort" aria-label="Permalink to &quot;排序 - 选择排序(Selection sort)&quot;">​</a></h1><blockquote><p>选择排序(Selection sort)是一种简单直观的排序算法。@pdai</p></blockquote><h2 id="选择排序介绍" tabindex="-1">选择排序介绍 <a class="header-anchor" href="#选择排序介绍" aria-label="Permalink to &quot;选择排序介绍&quot;">​</a></h2><p>它的基本思想是: 首先在未排序的数列中找到最小(or最大)元素，然后将其存放到数列的起始位置；接着，再从剩余未排序的元素中继续寻找最小(or最大)元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。</p><h2 id="选择排序实现" tabindex="-1">选择排序实现 <a class="header-anchor" href="#选择排序实现" aria-label="Permalink to &quot;选择排序实现&quot;">​</a></h2><p>下面以数列{20,40,30,10,60,50}为例，演示它的选择排序过程(如下图)。</p><p><img src="'+e+`" alt="error.图片加载失败"></p><p>排序流程</p><ul><li>第1趟: i=0。找出a[1...5]中的最小值a[3]=10，然后将a[0]和a[3]互换。 数列变化: 20,40,30,10,60,50 -- &gt; 10,40,30,20,60,50</li><li>第2趟: i=1。找出a[2...5]中的最小值a[3]=20，然后将a[1]和a[3]互换。 数列变化: 10,40,30,20,60,50 -- &gt; 10,20,30,40,60,50</li><li>第3趟: i=2。找出a[3...5]中的最小值，由于该最小值大于a[2]，该趟不做任何处理。</li><li>第4趟: i=3。找出a[4...5]中的最小值，由于该最小值大于a[3]，该趟不做任何处理。</li><li>第5趟: i=4。交换a[4]和a[5]的数据。 数列变化: 10,20,30,40,60,50 -- &gt; 10,20,30,40,50,60</li></ul><h2 id="选择排序的时间复杂度和稳定性" tabindex="-1">选择排序的时间复杂度和稳定性 <a class="header-anchor" href="#选择排序的时间复杂度和稳定性" aria-label="Permalink to &quot;选择排序的时间复杂度和稳定性&quot;">​</a></h2><h3 id="选择排序时间复杂度" tabindex="-1">选择排序时间复杂度 <a class="header-anchor" href="#选择排序时间复杂度" aria-label="Permalink to &quot;选择排序时间复杂度&quot;">​</a></h3><p>选择排序的时间复杂度是O(N2)。</p><p>假设被排序的数列中有N个数。遍历一趟的时间复杂度是O(N)，需要遍历多少次呢? N-1！因此，选择排序的时间复杂度是O(N2)。</p><h3 id="选择排序稳定性" tabindex="-1">选择排序稳定性 <a class="header-anchor" href="#选择排序稳定性" aria-label="Permalink to &quot;选择排序稳定性&quot;">​</a></h3><blockquote><p>选择排序的稳定性是<strong>有一些争议</strong>的，不过一般提到排序算法，往往默认是数组实现，所以通常认为选择排序是不稳定的。知乎上有个<a href="https://www.zhihu.com/question/20926405" target="_blank" rel="noreferrer">讨论在新窗口打开</a>可以看下。</p></blockquote><ul><li><strong>回顾：什么是排序算法的稳定性</strong>？</li></ul><p>假定在待排序的记录序列中，存在多个具有相同的关键字的记录，若经过排序，这些记录的相对次序保持不变，即在原序列中，r[i]=r[j]，且r[i]在r[j]之前，而在排序后的序列中，r[i]仍在r[j]之前，则称这种排序算法是稳定的；否则称为不稳定的。</p><ul><li><strong>数组实现和链表实现的差异</strong></li></ul><p>用数组实现的选择排序是不稳定的，用链表实现的选择排序是稳定的。</p><p>不过，一般提到排序算法时，大家往往会默认是数组实现，所以选择排序是不稳定的。</p><ul><li><strong>此外，排序算法的稳定性也是可以改变的，只是需要额外的时间和空间</strong></li></ul><p>有很多办法可以将任意排序算法变成稳定的，但是，往往需要额外的时间或者空间；而我们<strong>默认情况谈算法的稳定性是不考虑这种实现的</strong>。</p><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 选择排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/11</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SelectSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 选择排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void selectSort(int[] a, int n) {</span></span>
<span class="line"><span>        int i;        // 有序区的末尾位置</span></span>
<span class="line"><span>        int j;        // 无序区的起始位置</span></span>
<span class="line"><span>        int min;    // 无序区中最小元素位置</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for(i=0; i&lt;n; i++) {</span></span>
<span class="line"><span>            min=i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 找出&quot;a[i+1] ... a[n]&quot;之间的最小元素，并赋值给min。</span></span>
<span class="line"><span>            for(j=i+1; j&lt;n; j++) {</span></span>
<span class="line"><span>                if(a[j] &lt; a[min])</span></span>
<span class="line"><span>                    min=j;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 若min!=i，则交换 a[i] 和 a[min]。</span></span>
<span class="line"><span>            // 交换之后，保证了a[0] ... a[i] 之间的元素是有序的。</span></span>
<span class="line"><span>            if(min != i) {</span></span>
<span class="line"><span>                int tmp = a[i];</span></span>
<span class="line"><span>                a[i] = a[min];</span></span>
<span class="line"><span>                a[min] = tmp;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        int[] a = {20,40,30,10,60,50};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;before sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        selectSort(a, a.length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3597641.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3597641.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,28)]))}const g=n(i,[["render",t]]);export{m as __pageData,g as default};
