import{_ as s,c as n,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/alg/alg-sort-fast-1.jpg",q=JSON.parse('{"title":"排序 - 快速排序(Quick Sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-fast.md","filePath":"algorithm/alg-sort-x-fast.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-sort-x-fast.md"};function e(o,a,c,r,u,h){return l(),n("div",null,a[0]||(a[0]=[p('<h1 id="排序-快速排序-quick-sort" tabindex="-1">排序 - 快速排序(Quick Sort) <a class="header-anchor" href="#排序-快速排序-quick-sort" aria-label="Permalink to &quot;排序 - 快速排序(Quick Sort)&quot;">​</a></h1><blockquote><p>快速排序(Quick Sort)使用分治法算法思想。@pdai</p></blockquote><h2 id="快速排序介绍" tabindex="-1">快速排序介绍 <a class="header-anchor" href="#快速排序介绍" aria-label="Permalink to &quot;快速排序介绍&quot;">​</a></h2><p>它的基本思想是: 选择一个基准数，通过一趟排序将要排序的数据分割成独立的两部分；其中一部分的所有数据都比另外一部分的所有数据都要小。然后，再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。</p><h2 id="快速排序实现" tabindex="-1">快速排序实现 <a class="header-anchor" href="#快速排序实现" aria-label="Permalink to &quot;快速排序实现&quot;">​</a></h2><ul><li>从数列中挑出一个基准值。</li><li>将所有比基准值小的摆放在基准前面，所有比基准值大的摆在基准的后面(相同的数可以到任一边)；在这个分区退出之后，该基准就处于数列的中间位置。</li><li>递归地把&quot;基准值前面的子数列&quot;和&quot;基准值后面的子数列&quot;进行排序。</li></ul><p>下面以数列a={30,40,60,10,20,50}为例，演示它的快速排序过程(如下图)。</p><p><img src="'+i+`" alt="error.图片加载失败"></p><p>上图只是给出了第1趟快速排序的流程。在第1趟中，设置x=a[i]，即x=30。</p><ul><li>从&quot;右 --&gt; 左&quot;查找小于x的数: 找到满足条件的数a[j]=20，此时j=4；然后将a[j]赋值a[i]，此时i=0；接着从左往右遍历。</li><li>从&quot;左 --&gt; 右&quot;查找大于x的数: 找到满足条件的数a[i]=40，此时i=1；然后将a[i]赋值a[j]，此时j=4；接着从右往左遍历。</li><li>从&quot;右 --&gt; 左&quot;查找小于x的数: 找到满足条件的数a[j]=10，此时j=3；然后将a[j]赋值a[i]，此时i=1；接着从左往右遍历。</li><li>从&quot;左 --&gt; 右&quot;查找大于x的数: 找到满足条件的数a[i]=60，此时i=2；然后将a[i]赋值a[j]，此时j=3；接着从右往左遍历。</li><li>从&quot;右 --&gt; 左&quot;查找小于x的数: 没有找到满足条件的数。当i&gt;=j时，停止查找；然后将x赋值给a[i]。此趟遍历结束！</li></ul><p>按照同样的方法，对子数列进行递归遍历。最后得到有序数组！</p><h2 id="快速排序时间复杂度和稳定性" tabindex="-1">快速排序时间复杂度和稳定性 <a class="header-anchor" href="#快速排序时间复杂度和稳定性" aria-label="Permalink to &quot;快速排序时间复杂度和稳定性&quot;">​</a></h2><h3 id="快速排序稳定性" tabindex="-1">快速排序稳定性 <a class="header-anchor" href="#快速排序稳定性" aria-label="Permalink to &quot;快速排序稳定性&quot;">​</a></h3><p>快速排序是不稳定的算法，它不满足稳定算法的定义。</p><p><code>算法稳定性</code> -- 假设在数列中存在a[i]=a[j]，若在排序之前，a[i]在a[j]前面；并且排序之后，a[i]仍然在a[j]前面。则这个排序算法是稳定的！</p><h3 id="快速排序时间复杂度" tabindex="-1">快速排序时间复杂度 <a class="header-anchor" href="#快速排序时间复杂度" aria-label="Permalink to &quot;快速排序时间复杂度&quot;">​</a></h3><blockquote><p>快速排序的时间复杂度在最坏情况下是O(N2)，平均的时间复杂度是O(N*lgN)。</p></blockquote><p>这句话很好理解: 假设被排序的数列中有N个数。遍历一次的时间复杂度是O(N)，需要遍历多少次呢? 至少lg(N+1)次，最多N次。</p><ul><li>为什么最少是lg(N+1)次? 快速排序是采用的分治法进行遍历的，我们将它看作一棵二叉树，它需要遍历的次数就是二叉树的深度，而根据完全二叉树的定义，它的深度至少是lg(N+1)。因此，快速排序的遍历次数最少是lg(N+1)次。</li><li>为什么最多是N次? 这个应该非常简单，还是将快速排序看作一棵二叉树，它的深度最大是N。因此，快读排序的遍历次数最多是N次。</li></ul><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 快速排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/11</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class QuickSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 快速排序</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     l -- 数组的左边界(例如，从起始位置开始排序，则l=0)</span></span>
<span class="line"><span>     *     r -- 数组的右边界(例如，排序截至到数组末尾，则r=a.length-1)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void quickSort(int[] a, int l, int r) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (l &lt; r) {</span></span>
<span class="line"><span>            int i,j,x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            i = l;</span></span>
<span class="line"><span>            j = r;</span></span>
<span class="line"><span>            x = a[i];</span></span>
<span class="line"><span>            while (i &lt; j) {</span></span>
<span class="line"><span>                while(i &lt; j &amp;&amp; a[j] &gt; x)</span></span>
<span class="line"><span>                    j--; // 从右向左找第一个小于x的数</span></span>
<span class="line"><span>                if(i &lt; j)</span></span>
<span class="line"><span>                    a[i++] = a[j];</span></span>
<span class="line"><span>                while(i &lt; j &amp;&amp; a[i] &lt; x)</span></span>
<span class="line"><span>                    i++; // 从左向右找第一个大于x的数</span></span>
<span class="line"><span>                if(i &lt; j)</span></span>
<span class="line"><span>                    a[j--] = a[i];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            a[i] = x;</span></span>
<span class="line"><span>            quickSort(a, l, i-1); /* 递归调用 */</span></span>
<span class="line"><span>            quickSort(a, i+1, r); /* 递归调用 */</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        int a[] = {30,40,60,10,20,50};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;before sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        quickSort(a, 0, a.length-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3596746.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3596746.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,25)]))}const g=s(t,[["render",e]]);export{q as __pageData,g as default};
