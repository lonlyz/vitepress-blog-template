import{_ as n,c as s,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/alg/alg-sort-bubble-1.jpg",d=JSON.parse('{"title":"排序 - 冒泡排序(Bubble Sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-bubble.md","filePath":"algorithm/alg-sort-x-bubble.md","lastUpdated":1737706346000}'),e={name:"algorithm/alg-sort-x-bubble.md"};function t(c,a,o,r,b,u){return l(),s("div",null,a[0]||(a[0]=[p('<h1 id="排序-冒泡排序-bubble-sort" tabindex="-1">排序 - 冒泡排序(Bubble Sort) <a class="header-anchor" href="#排序-冒泡排序-bubble-sort" aria-label="Permalink to &quot;排序 - 冒泡排序(Bubble Sort)&quot;">​</a></h1><blockquote><p>最简单和最基本的排序。@pdai</p></blockquote><h2 id="冒泡排序介绍" tabindex="-1">冒泡排序介绍 <a class="header-anchor" href="#冒泡排序介绍" aria-label="Permalink to &quot;冒泡排序介绍&quot;">​</a></h2><p>它是一种较简单的排序算法。它会遍历若干次要排序的数列，每次遍历时，它都会从前往后依次的比较相邻两个数的大小；如果前者比后者大，则交换它们的位置。这样，一次遍历之后，最大的元素就在数列的末尾！ 采用相同的方法再次遍历时，第二大的元素就被排列在最大元素之前。重复此操作，直到整个数列都有序为止！</p><h2 id="冒泡排序实现" tabindex="-1">冒泡排序实现 <a class="header-anchor" href="#冒泡排序实现" aria-label="Permalink to &quot;冒泡排序实现&quot;">​</a></h2><p>下面以数列{20,40,30,10,60,50}为例，演示它的冒泡排序过程(如下图)。</p><p><img src="'+i+`" alt="error.图片加载失败"></p><p>我们先分析第1趟排序</p><ul><li>当i=5,j=0时，a[0]&lt;a[1]。此时，不做任何处理！</li><li>当i=5,j=1时，a[1]&gt;a[2]。此时，交换a[1]和a[2]的值；交换之后，a[1]=30，a[2]=40。</li><li>当i=5,j=2时，a[2]&gt;a[3]。此时，交换a[2]和a[3]的值；交换之后，a[2]=10，a[3]=40。</li><li>当i=5,j=3时，a[3]&lt;a[4]。此时，不做任何处理！</li><li>当i=5,j=4时，a[4]&gt;a[5]。此时，交换a[4]和a[5]的值；交换之后，a[4]=50，a[3]=60。</li></ul><p>于是，第1趟排序完之后，数列{20,40,30,10,60,50}变成了{20,30,10,40,50,60}。此时，数列末尾的值最大。</p><p>根据这种方法:</p><ul><li>第2趟排序完之后，数列中a[5...6]是有序的。</li><li>第3趟排序完之后，数列中a[4...6]是有序的。</li><li>第4趟排序完之后，数列中a[3...6]是有序的。</li><li>第5趟排序完之后，数列中a[1...6]是有序的。整个数列也就是有序的了。</li></ul><h2 id="复杂度和稳定性" tabindex="-1">复杂度和稳定性 <a class="header-anchor" href="#复杂度和稳定性" aria-label="Permalink to &quot;复杂度和稳定性&quot;">​</a></h2><h3 id="冒泡排序时间复杂度" tabindex="-1">冒泡排序时间复杂度 <a class="header-anchor" href="#冒泡排序时间复杂度" aria-label="Permalink to &quot;冒泡排序时间复杂度&quot;">​</a></h3><p>冒泡排序的时间复杂度是O(N2)。 假设被排序的数列中有N个数。遍历一趟的时间复杂度是O(N)，需要遍历多少次呢? N-1次！因此，冒泡排序的时间复杂度是O(N2)。</p><h3 id="冒泡排序稳定性" tabindex="-1">冒泡排序稳定性 <a class="header-anchor" href="#冒泡排序稳定性" aria-label="Permalink to &quot;冒泡排序稳定性&quot;">​</a></h3><p>冒泡排序是稳定的算法，它满足稳定算法的定义。 算法稳定性 -- 假设在数列中存在a[i]=a[j]，若在排序之前，a[i]在a[j]前面；并且排序之后，a[i]仍然在a[j]前面。则这个排序算法是稳定的！</p><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 冒泡排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/11</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class BubbleSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 冒泡排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void bubbleSort1(int[] a, int n) {</span></span>
<span class="line"><span>        int i,j;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i=n-1; i&gt;0; i--) {</span></span>
<span class="line"><span>            // 将a[0...i]中最大的数据放在末尾</span></span>
<span class="line"><span>            for (j=0; j&lt;i; j++) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (a[j] &gt; a[j+1]) {</span></span>
<span class="line"><span>                    // 交换a[j]和a[j+1]</span></span>
<span class="line"><span>                    int tmp = a[j];</span></span>
<span class="line"><span>                    a[j] = a[j+1];</span></span>
<span class="line"><span>                    a[j+1] = tmp;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 冒泡排序(改进版)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     n -- 数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void bubbleSort2(int[] a, int n) {</span></span>
<span class="line"><span>        int i,j;</span></span>
<span class="line"><span>        int flag;                 // 标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i=n-1; i&gt;0; i--) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            flag = 0;            // 初始化标记为0</span></span>
<span class="line"><span>            // 将a[0...i]中最大的数据放在末尾</span></span>
<span class="line"><span>            for (j=0; j&lt;i; j++) {</span></span>
<span class="line"><span>                if (a[j] &gt; a[j+1]) {</span></span>
<span class="line"><span>                    // 交换a[j]和a[j+1]</span></span>
<span class="line"><span>                    int tmp = a[j];</span></span>
<span class="line"><span>                    a[j] = a[j+1];</span></span>
<span class="line"><span>                    a[j+1] = tmp;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    flag = 1;    // 若发生交换，则设标记为1</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (flag==0)</span></span>
<span class="line"><span>                break;            // 若没发生交换，则说明数列已有序。</span></span>
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
<span class="line"><span>        bubbleSort1(a, a.length);</span></span>
<span class="line"><span>        //bubbleSort2(a, a.length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3596232.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3596232.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,23)]))}const g=n(e,[["render",t]]);export{d as __pageData,g as default};
