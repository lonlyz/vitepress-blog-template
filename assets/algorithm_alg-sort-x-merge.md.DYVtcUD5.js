import{_ as n,c as s,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/alg/alg-sort-merge-1.jpg",i="/vitepress-blog-template/images/alg/alg-sort-merge-2.jpg",t="/vitepress-blog-template/images/alg/alg-sort-merge-3.jpg",q=JSON.parse('{"title":"排序 - 归并排序(Merge Sort)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-sort-x-merge.md","filePath":"algorithm/alg-sort-x-merge.md","lastUpdated":1737706346000}'),r={name:"algorithm/alg-sort-x-merge.md"};function c(o,a,d,h,m,u){return l(),s("div",null,a[0]||(a[0]=[p('<h1 id="排序-归并排序-merge-sort" tabindex="-1">排序 - 归并排序(Merge Sort) <a class="header-anchor" href="#排序-归并排序-merge-sort" aria-label="Permalink to &quot;排序 - 归并排序(Merge Sort)&quot;">​</a></h1><blockquote><p>将两个的有序数列合并成一个有序数列，我们称之为&quot;归并&quot;。归并排序(Merge Sort)就是利用归并思想对数列进行排序。@pdai</p></blockquote><h2 id="归并排序介绍" tabindex="-1">归并排序介绍 <a class="header-anchor" href="#归并排序介绍" aria-label="Permalink to &quot;归并排序介绍&quot;">​</a></h2><p>根据具体的实现，归并排序包括&quot;从上往下&quot;和&quot;从下往上&quot;2种方式。</p><h3 id="从下往上的归并排序" tabindex="-1">从下往上的归并排序 <a class="header-anchor" href="#从下往上的归并排序" aria-label="Permalink to &quot;从下往上的归并排序&quot;">​</a></h3><p>将待排序的数列分成若干个长度为1的子数列，然后将这些数列两两合并；得到若干个长度为2的有序数列，再将这些数列两两合并；得到若干个长度为4的有序数列，再将它们两两合并；直接合并成一个数列为止。这样就得到了我们想要的排序结果。(参考下面的图片)</p><h3 id="从上往下的归并排序" tabindex="-1">从上往下的归并排序 <a class="header-anchor" href="#从上往下的归并排序" aria-label="Permalink to &quot;从上往下的归并排序&quot;">​</a></h3><p>它与&quot;从下往上&quot;在排序上是反方向的。它基本包括3步:</p><ul><li><code>分解</code> -- 将当前区间一分为二，即求分裂点 mid = (low + high)/2;</li><li><code>求解</code> -- 递归地对两个子区间a[low...mid] 和 a[mid+1...high]进行归并排序。递归的终结条件是子区间长度为1。</li><li><code>合并</code> -- 将已排序的两个子区间a[low...mid]和 a[mid+1...high]归并为一个有序的区间a[low...high]。</li></ul><p><img src="'+e+'" alt="error.图片加载失败"></p><h2 id="归并排序实现" tabindex="-1">归并排序实现 <a class="header-anchor" href="#归并排序实现" aria-label="Permalink to &quot;归并排序实现&quot;">​</a></h2><h3 id="从上往下的归并排序-1" tabindex="-1">从上往下的归并排序 <a class="header-anchor" href="#从上往下的归并排序-1" aria-label="Permalink to &quot;从上往下的归并排序&quot;">​</a></h3><p>从上往下的归并排序采用了递归的方式实现。它的原理非常简单，如下图:</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p>通过&quot;从上往下的归并排序&quot;来对数组{80,30,60,40,20,10,50,70}进行排序时:</p><ul><li>将数组{80,30,60,40,20,10,50,70}看作由两个有序的子数组{80,30,60,40}和{20,10,50,70}组成。对两个有序子树组进行排序即可。</li><li>将子数组{80,30,60,40}看作由两个有序的子数组{80,30}和{60,40}组成。 <ul><li>将子数组{20,10,50,70}看作由两个有序的子数组{20,10}和{50,70}组成。</li></ul></li><li>将子数组{80,30}看作由两个有序的子数组{80}和{30}组成。 <ul><li>将子数组{60,40}看作由两个有序的子数组{60}和{40}组成。</li><li>将子数组{20,10}看作由两个有序的子数组{20}和{10}组成。</li><li>将子数组{50,70}看作由两个有序的子数组{50}和{70}组成。</li></ul></li></ul><h3 id="从下往上的归并排序-1" tabindex="-1">从下往上的归并排序 <a class="header-anchor" href="#从下往上的归并排序-1" aria-label="Permalink to &quot;从下往上的归并排序&quot;">​</a></h3><p>从下往上的归并排序的思想正好与&quot;从下往上的归并排序&quot;相反。如下图:</p><p><img src="'+t+`" alt="error.图片加载失败"></p><p>通过&quot;从下往上的归并排序&quot;来对数组{80,30,60,40,20,10,50,70}进行排序时:</p><ul><li>将数组{80,30,60,40,20,10,50,70}看作由8个有序的子数组{80},{30},{60},{40},{20},{10},{50}和{70}组成。</li><li>将这8个有序的子数列两两合并。得到4个有序的子树列{30,80},{40,60},{10,20}和{50,70}。</li><li>将这4个有序的子数列两两合并。得到2个有序的子树列{30,40,60,80}和{10,20,50,70}。</li><li>将这2个有序的子数列两两合并。得到1个有序的子树列{10,20,30,40,50,60,70,80}。</li></ul><h2 id="归并排序的时间复杂度和稳定性" tabindex="-1">归并排序的时间复杂度和稳定性 <a class="header-anchor" href="#归并排序的时间复杂度和稳定性" aria-label="Permalink to &quot;归并排序的时间复杂度和稳定性&quot;">​</a></h2><h3 id="归并排序时间复杂度" tabindex="-1">归并排序时间复杂度 <a class="header-anchor" href="#归并排序时间复杂度" aria-label="Permalink to &quot;归并排序时间复杂度&quot;">​</a></h3><p>归并排序的时间复杂度是O(N*lgN)。</p><p>假设被排序的数列中有N个数。遍历一趟的时间复杂度是O(N)，需要遍历多少次呢? 归并排序的形式就是一棵二叉树，它需要遍历的次数就是二叉树的深度，而根据完全二叉树的可以得出它的时间复杂度是O(N*lgN)。</p><h3 id="归并排序稳定性" tabindex="-1">归并排序稳定性 <a class="header-anchor" href="#归并排序稳定性" aria-label="Permalink to &quot;归并排序稳定性&quot;">​</a></h3><p>归并排序是稳定的算法，它满足稳定算法的定义。</p><p><code>算法稳定性</code> -- 假设在数列中存在a[i]=a[j]，若在排序之前，a[i]在a[j]前面；并且排序之后，a[i]仍然在a[j]前面。则这个排序算法是稳定的！</p><h2 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 归并排序: Java</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2014/03/12</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MergeSort {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 将一个数组中的两个相邻有序区间合并成一个</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 包含两个有序区间的数组</span></span>
<span class="line"><span>     *     start -- 第1个有序区间的起始地址。</span></span>
<span class="line"><span>     *     mid   -- 第1个有序区间的结束地址。也是第2个有序区间的起始地址。</span></span>
<span class="line"><span>     *     end   -- 第2个有序区间的结束地址。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void merge(int[] a, int start, int mid, int end) {</span></span>
<span class="line"><span>        int[] tmp = new int[end-start+1];    // tmp是汇总2个有序区的临时区域</span></span>
<span class="line"><span>        int i = start;            // 第1个有序区的索引</span></span>
<span class="line"><span>        int j = mid + 1;        // 第2个有序区的索引</span></span>
<span class="line"><span>        int k = 0;                // 临时区域的索引</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(i &lt;= mid &amp;&amp; j &lt;= end) {</span></span>
<span class="line"><span>            if (a[i] &lt;= a[j])</span></span>
<span class="line"><span>                tmp[k++] = a[i++];</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                tmp[k++] = a[j++];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(i &lt;= mid)</span></span>
<span class="line"><span>            tmp[k++] = a[i++];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(j &lt;= end)</span></span>
<span class="line"><span>            tmp[k++] = a[j++];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 将排序后的元素，全部都整合到数组a中。</span></span>
<span class="line"><span>        for (i = 0; i &lt; k; i++)</span></span>
<span class="line"><span>            a[start + i] = tmp[i];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        tmp=null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 归并排序(从上往下)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     start -- 数组的起始地址</span></span>
<span class="line"><span>     *     endi -- 数组的结束地址</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void mergeSortUp2Down(int[] a, int start, int end) {</span></span>
<span class="line"><span>        if(a==null || start &gt;= end)</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int mid = (end + start)/2;</span></span>
<span class="line"><span>        mergeSortUp2Down(a, start, mid); // 递归排序a[start...mid]</span></span>
<span class="line"><span>        mergeSortUp2Down(a, mid+1, end); // 递归排序a[mid+1...end]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // a[start...mid] 和 a[mid...end]是两个有序空间，</span></span>
<span class="line"><span>        // 将它们排序成一个有序空间a[start...end]</span></span>
<span class="line"><span>        merge(a, start, mid, end);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 对数组a做若干次合并: 数组a的总长度为len，将它分为若干个长度为gap的子数组；</span></span>
<span class="line"><span>     *             将&quot;每2个相邻的子数组&quot; 进行合并排序。</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     *     len -- 数组的长度</span></span>
<span class="line"><span>     *     gap -- 子数组的长度</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void mergeGroups(int[] a, int len, int gap) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        int twolen = 2 * gap;    // 两个相邻的子数组的长度</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 将&quot;每2个相邻的子数组&quot; 进行合并排序。</span></span>
<span class="line"><span>        for(i = 0; i+2*gap-1 &lt; len; i+=(2*gap))</span></span>
<span class="line"><span>            merge(a, i, i+gap-1, i+2*gap-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 若 i+gap-1 &lt; len-1，则剩余一个子数组没有配对。</span></span>
<span class="line"><span>        // 将该子数组合并到已排序的数组中。</span></span>
<span class="line"><span>        if ( i+gap-1 &lt; len-1)</span></span>
<span class="line"><span>            merge(a, i, i + gap - 1, len - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 归并排序(从下往上)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     a -- 待排序的数组</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void mergeSortDown2Up(int[] a) {</span></span>
<span class="line"><span>        if (a==null)</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for(int n = 1; n &lt; a.length; n*=2)</span></span>
<span class="line"><span>            mergeGroups(a, a.length, n);</span></span>
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
<span class="line"><span>        mergeSortUp2Down(a, 0, a.length-1);        // 归并排序(从上往下)</span></span>
<span class="line"><span>        //mergeSortDown2Up(a);                    // 归并排序(从下往上)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.printf(&quot;after  sort:&quot;);</span></span>
<span class="line"><span>        for (i=0; i&lt;a.length; i++)</span></span>
<span class="line"><span>            System.out.printf(&quot;%d &quot;, a[i]);</span></span>
<span class="line"><span>        System.out.printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>提示</p><p>本文主要参考至 <a href="https://www.cnblogs.com/skywang12345/p/3602369.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3602369.html</a>, 在此基础上做了内容的增改。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,34)]))}const b=n(r,[["render",c]]);export{q as __pageData,b as default};
