import{_ as n,c as e,ai as s,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/collection/PriorityQueue_base.png",o="/vitepress-blog-template/images/collection/PriorityQueue_offer.png",i="/vitepress-blog-template/images/collection/PriorityQueue_peek.png",t="/vitepress-blog-template/images/collection/PriorityQueue_poll.png",c="/vitepress-blog-template/images/collection/PriorityQueue_remove2.png",f=JSON.parse('{"title":"Collection - PriorityQueue源码解析","description":"","frontmatter":{},"headers":[],"relativePath":"java/collection/java-collection-PriorityQueue.md","filePath":"java/collection/java-collection-PriorityQueue.md","lastUpdated":1737706346000}'),r={name:"java/collection/java-collection-PriorityQueue.md"};function d(u,a,h,m,g,b){return p(),e("div",null,a[0]||(a[0]=[s('<h1 id="collection-priorityqueue源码解析" tabindex="-1">Collection - PriorityQueue源码解析 <a class="header-anchor" href="#collection-priorityqueue源码解析" aria-label="Permalink to &quot;Collection - PriorityQueue源码解析&quot;">​</a></h1><blockquote><p>本文主要对Collection - PriorityQueue进行源码解析。@pdai</p></blockquote><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p>前面以Java <em>ArrayDeque_为例讲解了_Stack_和_Queue</em>，其实还有一种特殊的队列叫做_PriorityQueue_，即优先队列。<strong>优先队列的作用是能保证每次取出的元素都是队列中权值最小的</strong>(Java的优先队列每次取最小元素，C++的优先队列每次取最大元素)。这里牵涉到了大小关系，<strong>元素大小的评判可以通过元素本身的自然顺序(<em>natural ordering</em>)，也可以通过构造时传入的比较器</strong>(<em>Comparator</em>，类似于C++的仿函数)。</p><p>Java中_PriorityQueue_实现了_Queue_接口，不允许放入<code>null</code>元素；其通过堆实现，具体说是通过完全二叉树(<em>complete binary tree</em>)实现的<strong>小顶堆</strong>(任意一个非叶子节点的权值，都不大于其左右子节点的权值)，也就意味着可以通过数组来作为_PriorityQueue_的底层实现。</p><p><img src="'+l+'" alt="PriorityQueue_base.png"></p><p>上图中我们给每个元素按照层序遍历的方式进行了编号，如果你足够细心，会发现父节点和子节点的编号是有联系的，更确切的说父子节点的编号之间有如下关系:</p><p><code>leftNo = parentNo*2+1</code></p><p><code>rightNo = parentNo*2+2</code></p><p><code>parentNo = (nodeNo-1)/2</code></p><p>通过上述三个公式，可以轻易计算出某个节点的父节点以及子节点的下标。这也就是为什么可以直接用数组来存储堆的原因。</p><p><em>PriorityQueue_的<code>peek()</code>和<code>element</code>操作是常数时间，<code>add()</code>, <code>offer()</code>, 无参数的<code>remove()</code>以及<code>poll()</code>方法的时间复杂度都是_log(N)</em>。</p><h2 id="方法剖析" tabindex="-1">方法剖析 <a class="header-anchor" href="#方法剖析" aria-label="Permalink to &quot;方法剖析&quot;">​</a></h2><h3 id="add-和offer" tabindex="-1">add()和offer() <a class="header-anchor" href="#add-和offer" aria-label="Permalink to &quot;add()和offer()&quot;">​</a></h3><p><code>add(E e)</code>和<code>offer(E e)</code>的语义相同，都是向优先队列中插入元素，只是<code>Queue</code>接口规定二者对插入失败时的处理不同，前者在插入失败时抛出异常，后则则会返回<code>false</code>。对于_PriorityQueue_这两个方法其实没什么差别。</p><p><img src="'+o+`" alt="PriorityQueue_offer.png"></p><p>新加入的元素可能会破坏小顶堆的性质，因此需要进行必要的调整。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//offer(E e)</span></span>
<span class="line"><span>public boolean offer(E e) {</span></span>
<span class="line"><span>    if (e == null)//不允许放入null元素</span></span>
<span class="line"><span>        throw new NullPointerException();</span></span>
<span class="line"><span>    modCount++;</span></span>
<span class="line"><span>    int i = size;</span></span>
<span class="line"><span>    if (i &gt;= queue.length)</span></span>
<span class="line"><span>        grow(i + 1);//自动扩容</span></span>
<span class="line"><span>    size = i + 1;</span></span>
<span class="line"><span>    if (i == 0)//队列原来为空，这是插入的第一个元素</span></span>
<span class="line"><span>        queue[0] = e;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        siftUp(i, e);//调整</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，扩容函数<code>grow()</code>类似于<code>ArrayList</code>里的<code>grow()</code>函数，就是再申请一个更大的数组，并将原数组的元素复制过去，这里不再赘述。需要注意的是<code>siftUp(int k, E x)</code>方法，该方法用于插入元素<code>x</code>并维持堆的特性。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//siftUp()</span></span>
<span class="line"><span>private void siftUp(int k, E x) {</span></span>
<span class="line"><span>    while (k &gt; 0) {</span></span>
<span class="line"><span>        int parent = (k - 1) &gt;&gt;&gt; 1;//parentNo = (nodeNo-1)/2</span></span>
<span class="line"><span>        Object e = queue[parent];</span></span>
<span class="line"><span>        if (comparator.compare(x, (E) e) &gt;= 0)//调用比较器的比较方法</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        queue[k] = e;</span></span>
<span class="line"><span>        k = parent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    queue[k] = x;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>新加入的元素<code>x</code>可能会破坏小顶堆的性质，因此需要进行调整。调整的过程为** : 从<code>k</code>指定的位置开始，将<code>x</code>逐层与当前点的<code>parent</code>进行比较并交换，直到满足<code>x &gt;= queue[parent]</code>为止**。注意这里的比较可以是元素的自然顺序，也可以是依靠比较器的顺序。</p><h3 id="element-和peek" tabindex="-1">element()和peek() <a class="header-anchor" href="#element-和peek" aria-label="Permalink to &quot;element()和peek()&quot;">​</a></h3><p><code>element()</code>和<code>peek()</code>的语义完全相同，都是获取但不删除队首元素，也就是队列中权值最小的那个元素，二者唯一的区别是当方法失败时前者抛出异常，后者返回<code>null</code>。根据小顶堆的性质，堆顶那个元素就是全局最小的那个；由于堆用数组表示，根据下标关系，<code>0</code>下标处的那个元素既是堆顶元素。所以<strong>直接返回数组<code>0</code>下标处的那个元素即可</strong>。</p><p><img src="`+i+`" alt="PriorityQueue_peek.png"></p><p>代码也就非常简洁:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//peek()</span></span>
<span class="line"><span>public E peek() {</span></span>
<span class="line"><span>    if (size == 0)</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    return (E) queue[0];//0下标处的那个元素就是最小的那个</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="remove-和poll" tabindex="-1">remove()和poll() <a class="header-anchor" href="#remove-和poll" aria-label="Permalink to &quot;remove()和poll()&quot;">​</a></h3><p><code>remove()</code>和<code>poll()</code>方法的语义也完全相同，都是获取并删除队首元素，区别是当方法失败时前者抛出异常，后者返回<code>null</code>。由于删除操作会改变队列的结构，为维护小顶堆的性质，需要进行必要的调整。</p><p><img src="`+t+`" alt="PriorityQueue_poll.png"> 代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public E poll() {</span></span>
<span class="line"><span>    if (size == 0)</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    int s = --size;</span></span>
<span class="line"><span>    modCount++;</span></span>
<span class="line"><span>    E result = (E) queue[0];//0下标处的那个元素就是最小的那个</span></span>
<span class="line"><span>    E x = (E) queue[s];</span></span>
<span class="line"><span>    queue[s] = null;</span></span>
<span class="line"><span>    if (s != 0)</span></span>
<span class="line"><span>        siftDown(0, x);//调整</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码首先记录<code>0</code>下标处的元素，并用最后一个元素替换<code>0</code>下标位置的元素，之后调用<code>siftDown()</code>方法对堆进行调整，最后返回原来<code>0</code>下标处的那个元素(也就是最小的那个元素)。重点是<code>siftDown(int k, E x)</code>方法，该方法的作用是<strong>从<code>k</code>指定的位置开始，将<code>x</code>逐层向下与当前点的左右孩子中较小的那个交换，直到<code>x</code>小于或等于左右孩子中的任何一个为止</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//siftDown()</span></span>
<span class="line"><span>private void siftDown(int k, E x) {</span></span>
<span class="line"><span>    int half = size &gt;&gt;&gt; 1;</span></span>
<span class="line"><span>    while (k &lt; half) {</span></span>
<span class="line"><span>    	//首先找到左右孩子中较小的那个，记录到c里，并用child记录其下标</span></span>
<span class="line"><span>        int child = (k &lt;&lt; 1) + 1;//leftNo = parentNo*2+1</span></span>
<span class="line"><span>        Object c = queue[child];</span></span>
<span class="line"><span>        int right = child + 1;</span></span>
<span class="line"><span>        if (right &lt; size &amp;&amp;</span></span>
<span class="line"><span>            comparator.compare((E) c, (E) queue[right]) &gt; 0)</span></span>
<span class="line"><span>            c = queue[child = right];</span></span>
<span class="line"><span>        if (comparator.compare(x, (E) c) &lt;= 0)</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        queue[k] = c;//然后用c取代原来的值</span></span>
<span class="line"><span>        k = child;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    queue[k] = x;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="remove-object-o" tabindex="-1">remove(Object o) <a class="header-anchor" href="#remove-object-o" aria-label="Permalink to &quot;remove(Object o)&quot;">​</a></h3><p><code>remove(Object o)</code>方法用于删除队列中跟<code>o</code>相等的某一个元素(如果有多个相等，只删除一个)，该方法不是_Queue_接口内的方法，而是_Collection_接口的方法。由于删除操作会改变队列结构，所以要进行调整；又由于删除元素的位置可能是任意的，所以调整过程比其它函数稍加繁琐。具体来说，<code>remove(Object o)</code>可以分为2种情况: 1. 删除的是最后一个元素。直接删除即可，不需要调整。2. 删除的不是最后一个元素，从删除点开始以最后一个元素为参照调用一次<code>siftDown()</code>即可。此处不再赘述。</p><p><img src="`+c+`" alt="PriorityQueue_remove2.png"></p><p>具体代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//remove(Object o)</span></span>
<span class="line"><span>public boolean remove(Object o) {</span></span>
<span class="line"><span>	//通过遍历数组的方式找到第一个满足o.equals(queue[i])元素的下标</span></span>
<span class="line"><span>    int i = indexOf(o);</span></span>
<span class="line"><span>    if (i == -1)</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    int s = --size;</span></span>
<span class="line"><span>    if (s == i) //情况1</span></span>
<span class="line"><span>        queue[i] = null;</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        E moved = (E) queue[s];</span></span>
<span class="line"><span>        queue[s] = null;</span></span>
<span class="line"><span>        siftDown(i, moved);//情况2</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li>深入理解Java PriorityQueue 结合源码对PriorityQueue进行讲解 <a href="http://www.cnblogs.com/CarpenterLee/p/5488070.html" target="_blank" rel="noreferrer">http://www.cnblogs.com/CarpenterLee/p/5488070.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,40)]))}const _=n(r,[["render",d]]);export{f as __pageData,_ as default};
