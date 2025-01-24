import{_ as s,c as n,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/alg/alg-sort-radix-1.jpg",i="/vitepress-blog-template/images/alg/alg-sort-radix-2.jpg",t="/vitepress-blog-template/images/alg/alg-sort-radix-3.jpg",m=JSON.parse('{"title":"排序 - 基数排序(Radix Sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-radix.md","filePath":"algorithm/alg-sort-x-radix.md","lastUpdated":1737706346000}'),c={name:"algorithm/alg-sort-x-radix.md"};function o(r,a,u,d,h,x){return l(),n("div",null,a[0]||(a[0]=[p('<h1 id="排序-基数排序-radix-sort" tabindex="-1">排序 - 基数排序(Radix Sort) <a class="header-anchor" href="#排序-基数排序-radix-sort" aria-label="Permalink to &quot;排序 - 基数排序(Radix Sort)&quot;">​</a></h1><blockquote><p>基数排序(Radix Sort)是桶排序的扩展. @pdai</p></blockquote><h2 id="基数排序介绍" tabindex="-1">基数排序介绍 <a class="header-anchor" href="#基数排序介绍" aria-label="Permalink to &quot;基数排序介绍&quot;">​</a></h2><p>它的基本思想是: 将整数按位数切割成不同的数字，然后按每个位数分别比较。 具体做法是: 将所有待比较数值统一为同样的数位长度，数位较短的数前面补零。然后，从最低位开始，依次进行一次排序。这样从最低位排序一直到最高位排序完成以后, 数列就变成一个有序序列。</p><h2 id="基数排序实现" tabindex="-1">基数排序实现 <a class="header-anchor" href="#基数排序实现" aria-label="Permalink to &quot;基数排序实现&quot;">​</a></h2><p>通过基数排序对数组{53, 3, 542, 748, 14, 214, 154, 63, 616}，它的示意图如下:</p><p><img src="'+e+'" alt="error.图片加载失败"></p><p>在上图中，首先将所有待比较树脂统一为统一位数长度，接着从最低位开始，依次进行排序。</p><ol><li>按照个位数进行排序。</li><li>按照十位数进行排序。</li><li>按照百位数进行排序。 排序后，数列就变成了一个有序序列。</li></ol><p>下面简单介绍一下对数组{53, 3, 542, 748, 14, 214, 154, 63, 616}按个位数进行排序的流程。</p><ul><li>个位的数值范围是[0,10)。因此，参见桶数组buckets[]，将数组按照个位数值添加到桶中。</li></ul><p><img src="'+i+'" alt="error.图片加载失败"></p><ul><li>接着是根据桶数组buckets[]来进行排序。假设将排序后的数组存在output[]中；找出output[]和buckets[]之间的联系就可以对数据进行排序了。</li></ul><p><img src="'+t+`" alt="error.图片加载失败"></p><h2 id="基数排序复杂度和稳定性" tabindex="-1">基数排序复杂度和稳定性 <a class="header-anchor" href="#基数排序复杂度和稳定性" aria-label="Permalink to &quot;基数排序复杂度和稳定性&quot;">​</a></h2><h3 id="基数排序复杂度" tabindex="-1">基数排序复杂度 <a class="header-anchor" href="#基数排序复杂度" aria-label="Permalink to &quot;基数排序复杂度&quot;">​</a></h3><h3 id="基数排序稳定性" tabindex="-1">基数排序稳定性 <a class="header-anchor" href="#基数排序稳定性" aria-label="Permalink to &quot;基数排序稳定性&quot;">​</a></h3><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 基数排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/15</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RadixSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 获取数组a中最大值</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 数组</span></span>
<span class="line"><span>     *     n -- 数组长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static int getMax(int[] a) {</span></span>
<span class="line"><span>        int max;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        max = a[0];</span></span>
<span class="line"><span>        for (int i = 1; i &lt; a.length; i++)</span></span>
<span class="line"><span>            if (a[i] &gt; max)</span></span>
<span class="line"><span>                max = a[i];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 对数组按照&quot;某个位数&quot;进行排序(桶排序)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 数组</span></span>
<span class="line"><span>     *     exp -- 指数。对数组a按照该指数进行排序。</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 例如，对于数组a={50, 3, 542, 745, 2014, 154, 63, 616}；</span></span>
<span class="line"><span>     *    (01) 当exp=1表示按照&quot;个位&quot;对数组a进行排序</span></span>
<span class="line"><span>     *    (02) 当exp=10表示按照&quot;十位&quot;对数组a进行排序</span></span>
<span class="line"><span>     *    (03) 当exp=100表示按照&quot;百位&quot;对数组a进行排序</span></span>
<span class="line"><span>     *    ...</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static void countSort(int[] a, int exp) {</span></span>
<span class="line"><span>        //int output[a.length];    // 存储&quot;被排序数据&quot;的临时数组</span></span>
<span class="line"><span>        int[] output = new int[a.length];    // 存储&quot;被排序数据&quot;的临时数组</span></span>
<span class="line"><span>        int[] buckets = new int[10];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 将数据出现的次数存储在buckets[]中</span></span>
<span class="line"><span>        for (int i = 0; i &lt; a.length; i++)</span></span>
<span class="line"><span>            buckets[ (a[i]/exp)%10 ]++;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 更改buckets[i]。目的是让更改后的buckets[i]的值，是该数据在output[]中的位置。</span></span>
<span class="line"><span>        for (int i = 1; i &lt; 10; i++)</span></span>
<span class="line"><span>            buckets[i] += buckets[i - 1];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 将数据存储到临时数组output[]中</span></span>
<span class="line"><span>        for (int i = a.length - 1; i &gt;= 0; i--) {</span></span>
<span class="line"><span>            output[buckets[ (a[i]/exp)%10 ] - 1] = a[i];</span></span>
<span class="line"><span>            buckets[ (a[i]/exp)%10 ]--;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 将排序好的数据赋值给a[]</span></span>
<span class="line"><span>        for (int i = 0; i &lt; a.length; i++)</span></span>
<span class="line"><span>            a[i] = output[i];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        output = null;</span></span>
<span class="line"><span>        buckets = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 基数排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 数组</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void radixSort(int[] a) {</span></span>
<span class="line"><span>        int exp;    // 指数。当对数组按各位进行排序时，exp=1；按十位进行排序时，exp=10；...</span></span>
<span class="line"><span>        int max = getMax(a);    // 数组a中的最大值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 从个位开始，对数组a按&quot;指数&quot;进行排序</span></span>
<span class="line"><span>        for (exp = 1; max/exp &gt; 0; exp *= 10)</span></span>
<span class="line"><span>            countSort(a, exp);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        int a[] = {53, 3, 542, 748, 14, 214, 154, 63, 616};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;before sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        radixSort(a);    // 基数排序</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3603669.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3603669.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,23)]))}const b=s(c,[["render",o]]);export{m as __pageData,b as default};
