import{_ as s,c as n,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/alg/alg-sort-shell-1.jpg",i="/vitepress-blog-template/images/alg/alg-sort-shell-2.jpg",t="/vitepress-blog-template/images/alg/alg-sort-shell-3.jpg",b=JSON.parse('{"title":"排序 - Shell排序(Shell Sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-shell.md","filePath":"algorithm/alg-sort-x-shell.md","lastUpdated":1737706346000}'),c={name:"algorithm/alg-sort-x-shell.md"};function o(r,a,g,h,d,u){return l(),n("div",null,a[0]||(a[0]=[p('<h1 id="排序-shell排序-shell-sort" tabindex="-1">排序 - Shell排序(Shell Sort) <a class="header-anchor" href="#排序-shell排序-shell-sort" aria-label="Permalink to &quot;排序 - Shell排序(Shell Sort)&quot;">​</a></h1><blockquote><p>希尔排序(Shell Sort)是插入排序的一种，它是针对直接插入排序算法的改进。@pdai</p></blockquote><h2 id="希尔排序介绍" tabindex="-1">希尔排序介绍 <a class="header-anchor" href="#希尔排序介绍" aria-label="Permalink to &quot;希尔排序介绍&quot;">​</a></h2><p>希尔排序实质上是一种分组插入方法。它的基本思想是: 对于n个待排序的数列，取一个小于n的整数gap(gap被称为步长)将待排序元素分成若干个组子序列，所有距离为gap的倍数的记录放在同一个组中；然后，对各组内的元素进行直接插入排序。 这一趟排序完成之后，每一个组的元素都是有序的。然后减小gap的值，并重复执行上述的分组和排序。重复这样的操作，当gap=1时，整个数列就是有序的。</p><h2 id="希尔排序实现" tabindex="-1">希尔排序实现 <a class="header-anchor" href="#希尔排序实现" aria-label="Permalink to &quot;希尔排序实现&quot;">​</a></h2><p>下面以数列{80,30,60,40,20,10,50,70}为例，演示它的希尔排序过程。</p><p>第1趟: (gap=4)</p><p><img src="'+e+'" alt="error.图片加载失败"></p><p>当gap=4时,意味着将数列分为4个组: {80,20},{30,10},{60,50},{40,70}。 对应数列: {80,30,60,40,20,10,50,70} 对这4个组分别进行排序，排序结果: {20,80},{10,30},{50,60},{40,70}。 对应数列:</p><p>第2趟: (gap=2)</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p>当gap=2时,意味着将数列分为2个组: {20,50,80,60}, {10,40,30,70}。 对应数列: {20,10,50,40,80,30,60,70} 注意: {20,50,80,60}实际上有两个有序的数列{20,80}和{50,60}组成。 {10,40,30,70}实际上有两个有序的数列{10,30}和{40,70}组成。 对这2个组分别进行排序，排序结果: {20,50,60,80}, {10,30,40,70}。 对应数列:</p><p>第3趟: (gap=1)</p><p><img src="'+t+`" alt="error.图片加载失败"></p><p>当gap=1时,意味着将数列分为1个组: {20,10,50,30,60,40,80,70} 注意: {20,10,50,30,60,40,80,70}实际上有两个有序的数列{20,50,60,80}和{10,30,40,70}组成。 对这1个组分别进行排序，排序结果:</p><h2 id="希尔排序的时间复杂度和稳定性" tabindex="-1">希尔排序的时间复杂度和稳定性 <a class="header-anchor" href="#希尔排序的时间复杂度和稳定性" aria-label="Permalink to &quot;希尔排序的时间复杂度和稳定性&quot;">​</a></h2><h3 id="希尔排序时间复杂度" tabindex="-1">希尔排序时间复杂度 <a class="header-anchor" href="#希尔排序时间复杂度" aria-label="Permalink to &quot;希尔排序时间复杂度&quot;">​</a></h3><p>希尔排序的时间复杂度与增量(即，步长gap)的选取有关。例如，当增量为1时，希尔排序退化成了直接插入排序，此时的时间复杂度为O(N²)，而Hibbard增量的希尔排序的时间复杂度为O(N3/2)。</p><h3 id="希尔排序稳定性" tabindex="-1">希尔排序稳定性 <a class="header-anchor" href="#希尔排序稳定性" aria-label="Permalink to &quot;希尔排序稳定性&quot;">​</a></h3><p>希尔排序是按照不同步长对元素进行插入排序，当刚开始元素很无序的时候，步长最大，所以插入排序的元素个数很少，速度很快；当元素基本有序了，步长很小， 插入排序对于有序的序列效率很高。所以，希尔排序的时间复杂度会比O(n^2)好一些。由于多次插入排序，我们知道一次插入排序是稳定的，不会改变相同元素的相对顺序，但<strong>在不同的插入排序过程中，相同的元素可能在各自的插入排序中移动，最后其稳定性就会被打乱，所以shell排序是不稳定的</strong>。</p><p><code>算法稳定性</code> -- 假设在数列中存在a[i]=a[j]，若在排序之前，a[i]在a[j]前面；并且排序之后，a[i]仍然在a[j]前面。则这个排序算法是稳定的！</p><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 希尔排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/11</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ShellSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 希尔排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void shellSort1(int[] a, int n) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // gap为步长，每次减为原来的一半。</span></span>
<span class="line"><span>        for (int gap = n / 2; gap &gt; 0; gap /= 2) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 共gap个组，对每一组都执行直接插入排序</span></span>
<span class="line"><span>            for (int i = 0 ;i &lt; gap; i++) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                for (int j = i + gap; j &lt; n; j += gap) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    // 如果a[j] &lt; a[j-gap]，则寻找a[j]位置，并将后面数据的位置都后移。</span></span>
<span class="line"><span>                    if (a[j] &lt; a[j - gap]) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                        int tmp = a[j];</span></span>
<span class="line"><span>                        int k = j - gap;</span></span>
<span class="line"><span>                        while (k &gt;= 0 &amp;&amp; a[k] &gt; tmp) {</span></span>
<span class="line"><span>                            a[k + gap] = a[k];</span></span>
<span class="line"><span>                            k -= gap;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        a[k + gap] = tmp;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 对希尔排序中的单个组进行排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组总的长度</span></span>
<span class="line"><span>     *     i -- 组的起始位置</span></span>
<span class="line"><span>     *     gap -- 组的步长</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     *  组是&quot;从i开始，将相隔gap长度的数都取出&quot;所组成的！</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void groupSort(int[] a, int n, int i,int gap) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int j = i + gap; j &lt; n; j += gap) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 如果a[j] &lt; a[j-gap]，则寻找a[j]位置，并将后面数据的位置都后移。</span></span>
<span class="line"><span>            if (a[j] &lt; a[j - gap]) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                int tmp = a[j];</span></span>
<span class="line"><span>                int k = j - gap;</span></span>
<span class="line"><span>                while (k &gt;= 0 &amp;&amp; a[k] &gt; tmp) {</span></span>
<span class="line"><span>                    a[k + gap] = a[k];</span></span>
<span class="line"><span>                    k -= gap;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                a[k + gap] = tmp;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 希尔排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void shellSort2(int[] a, int n) {</span></span>
<span class="line"><span>        // gap为步长，每次减为原来的一半。</span></span>
<span class="line"><span>        for (int gap = n / 2; gap &gt; 0; gap /= 2) {</span></span>
<span class="line"><span>            // 共gap个组，对每一组都执行直接插入排序</span></span>
<span class="line"><span>            for (int i = 0 ;i &lt; gap; i++)</span></span>
<span class="line"><span>                groupSort(a, n, i, gap);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        int a[] = {80,30,60,40,20,10,50,70};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;before sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        shellSort1(a, a.length);</span></span>
<span class="line"><span>        //shellSort2(a, a.length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3597597.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3597597.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,27)]))}const f=s(c,[["render",o]]);export{b as __pageData,f as default};
