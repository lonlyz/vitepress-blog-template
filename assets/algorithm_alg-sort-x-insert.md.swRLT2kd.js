import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/alg/alg-sort-insert-1.jpg",m=JSON.parse('{"title":"排序 - 插入排序(Insertion Sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-insert.md","filePath":"algorithm/alg-sort-x-insert.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-sort-x-insert.md"};function i(r,a,o,c,h,d){return e(),s("div",null,a[0]||(a[0]=[p('<h1 id="排序-插入排序-insertion-sort" tabindex="-1">排序 - 插入排序(Insertion Sort) <a class="header-anchor" href="#排序-插入排序-insertion-sort" aria-label="Permalink to &quot;排序 - 插入排序(Insertion Sort)&quot;">​</a></h1><blockquote><p>本文主要介绍插入排序。@pdai</p></blockquote><h2 id="插入排序介绍" tabindex="-1">插入排序介绍 <a class="header-anchor" href="#插入排序介绍" aria-label="Permalink to &quot;插入排序介绍&quot;">​</a></h2><p>直接插入排序(Straight Insertion Sort)的基本思想是: 把n个待排序的元素看成为一个有序表和一个无序表。开始时有序表中只包含1个元素，无序表中包含有n-1个元素，排序过程中每次从无序表中取出第一个元素，将它插入到有序表中的适当位置，使之成为新的有序表，重复n-1次可完成排序过程。</p><h2 id="插入排序实现" tabindex="-1">插入排序实现 <a class="header-anchor" href="#插入排序实现" aria-label="Permalink to &quot;插入排序实现&quot;">​</a></h2><p>下面选取直接插入排序的一个中间过程对其进行说明。假设{20,30,40,10,60,50}中的前3个数已经排列过，是有序的了；接下来对10进行排列。示意图如下:</p><p><img src="'+l+`" alt="error.图片加载失败"></p><p>图中将数列分为有序区和无序区。我们需要做的工作只有两个: (1)取出无序区中的第1个数，并找出它在有序区对应的位置。(2)将无序区的数据插入到有序区；若有必要的话，则对有序区中的相关数据进行移位。</p><h2 id="插入排序的时间复杂度和稳定性" tabindex="-1">插入排序的时间复杂度和稳定性 <a class="header-anchor" href="#插入排序的时间复杂度和稳定性" aria-label="Permalink to &quot;插入排序的时间复杂度和稳定性&quot;">​</a></h2><h3 id="插入排序时间复杂度" tabindex="-1">插入排序时间复杂度 <a class="header-anchor" href="#插入排序时间复杂度" aria-label="Permalink to &quot;插入排序时间复杂度&quot;">​</a></h3><p>直接插入排序的时间复杂度是O(N2)。</p><p>假设被排序的数列中有N个数。遍历一趟的时间复杂度是O(N)，需要遍历多少次呢? N-1！因此，直接插入排序的时间复杂度是O(N2)。</p><h3 id="插入排序稳定性" tabindex="-1">插入排序稳定性 <a class="header-anchor" href="#插入排序稳定性" aria-label="Permalink to &quot;插入排序稳定性&quot;">​</a></h3><p>直接插入排序是稳定的算法，它满足稳定算法的定义。</p><p><code>算法稳定性</code> -- 假设在数列中存在a[i]=a[j]，若在排序之前，a[i]在a[j]前面；并且排序之后，a[i]仍然在a[j]前面。则这个排序算法是稳定的！</p><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 直接插入排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/11</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class InsertSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 直接插入排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void insertSort(int[] a, int n) {</span></span>
<span class="line"><span>        int i, j, k;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i = 1; i &lt; n; i++) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //为a[i]在前面的a[0...i-1]有序区间中找一个合适的位置</span></span>
<span class="line"><span>            for (j = i - 1; j &gt;= 0; j--)</span></span>
<span class="line"><span>                if (a[j] &lt; a[i])</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //如找到了一个合适的位置</span></span>
<span class="line"><span>            if (j != i - 1) {</span></span>
<span class="line"><span>                //将比a[i]大的数据向后移</span></span>
<span class="line"><span>                int temp = a[i];</span></span>
<span class="line"><span>                for (k = i - 1; k &gt; j; k--)</span></span>
<span class="line"><span>                    a[k + 1] = a[k];</span></span>
<span class="line"><span>                //将a[i]放到正确位置上</span></span>
<span class="line"><span>                a[k + 1] = temp;</span></span>
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
<span class="line"><span>        insertSort(a, a.length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3596881.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3596881.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,21)]))}const f=n(t,[["render",i]]);export{m as __pageData,f as default};
