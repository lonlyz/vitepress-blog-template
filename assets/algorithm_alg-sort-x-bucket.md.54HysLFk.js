import{_ as s,c as n,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/alg/alg-sort-bucket-1.jpg",d=JSON.parse('{"title":"排序 - 桶排序(Bucket Sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-bucket.md","filePath":"algorithm/alg-sort-x-bucket.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-sort-x-bucket.md"};function i(c,a,r,o,u,h){return l(),n("div",null,a[0]||(a[0]=[p('<h1 id="排序-桶排序-bucket-sort" tabindex="-1">排序 - 桶排序(Bucket Sort) <a class="header-anchor" href="#排序-桶排序-bucket-sort" aria-label="Permalink to &quot;排序 - 桶排序(Bucket Sort)&quot;">​</a></h1><blockquote><p>桶排序(Bucket Sort)的原理很简单，将数组分到有限数量的桶子里。每个桶子再个别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排序）。@pdai</p></blockquote><h2 id="桶排序介绍" tabindex="-1">桶排序介绍 <a class="header-anchor" href="#桶排序介绍" aria-label="Permalink to &quot;桶排序介绍&quot;">​</a></h2><p>假设待排序的数组a中共有N个整数，并且已知数组a中数据的范围[0, MAX)。在桶排序时，创建容量为MAX的桶数组r，并将桶数组元素都初始化为0；将容量为MAX的桶数组中的每一个单元都看作一个&quot;桶&quot;。</p><p>在排序时，逐个遍历数组a，将数组a的值，作为&quot;桶数组r&quot;的下标。当a中数据被读取时，就将桶的值加1。例如，读取到数组a[3]=5，则将r[5]的值+1。</p><h2 id="桶排序实现" tabindex="-1">桶排序实现 <a class="header-anchor" href="#桶排序实现" aria-label="Permalink to &quot;桶排序实现&quot;">​</a></h2><p>假设a={8,2,3,4,3,6,6,3,9}, max=10。此时，将数组a的所有数据都放到需要为0-9的桶中。如下图:</p><p><img src="'+e+`" alt="error.图片加载失败"></p><p>在将数据放到桶中之后，再通过一定的算法，将桶中的数据提出出来并转换成有序数组。就得到我们想要的结果了。</p><h2 id="桶排序复杂度和稳定性" tabindex="-1">桶排序复杂度和稳定性 <a class="header-anchor" href="#桶排序复杂度和稳定性" aria-label="Permalink to &quot;桶排序复杂度和稳定性&quot;">​</a></h2><h3 id="桶排序复杂度" tabindex="-1">桶排序复杂度 <a class="header-anchor" href="#桶排序复杂度" aria-label="Permalink to &quot;桶排序复杂度&quot;">​</a></h3><ul><li>平均时间复杂度: O(n + k)</li><li>最佳时间复杂度: O(n + k)</li><li>最差时间复杂度: O(n ^ 2)</li><li>空间复杂度: O(n * k)</li></ul><p>桶排序最好情况下使用线性时间O(n)，桶排序的时间复杂度，取决与对各个桶之间数据进行排序的时间复杂度，因为其它部分的时间复杂度都为O(n)。很显然，桶划分的越小，各个桶之间的数据越少，排序所用的时间也会越少。但相应的空间消耗就会增大。</p><h3 id="桶排序稳定性" tabindex="-1">桶排序稳定性 <a class="header-anchor" href="#桶排序稳定性" aria-label="Permalink to &quot;桶排序稳定性&quot;">​</a></h3><p>稳定性: 稳定</p><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 桶排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/13</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class BucketSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 桶排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序数组</span></span>
<span class="line"><span>     *     max -- 数组a中最大值的范围</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void bucketSort(int[] a, int max) {</span></span>
<span class="line"><span>        int[] buckets;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (a==null || max&lt;1)</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 创建一个容量为max的数组buckets，并且将buckets中的所有数据都初始化为0。</span></span>
<span class="line"><span>        buckets = new int[max];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 1. 计数</span></span>
<span class="line"><span>        for(int i = 0; i &lt; a.length; i++) </span></span>
<span class="line"><span>            buckets[a[i]]++; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 2. 排序</span></span>
<span class="line"><span>        for (int i = 0, j = 0; i &lt; max; i++) {</span></span>
<span class="line"><span>            while( (buckets[i]--) &gt;0 ) {</span></span>
<span class="line"><span>                a[j++] = i;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        buckets = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        int a[] = {8,2,3,4,3,6,6,3,9};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;before sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        bucketSort(a, 10); // 桶排序</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3602737.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3602737.html</a>, 在此基础上做了内容的增改。</p><p>其它参考：</p><ul><li><p><a href="https://www.cnblogs.com/bqwzx/p/11029264.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/bqwzx/p/11029264.html</a></p></li><li><p><a href="https://www.cnblogs.com/hokky/p/8529042.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/hokky/p/8529042.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,23)]))}const m=s(t,[["render",i]]);export{d as __pageData,m as default};
