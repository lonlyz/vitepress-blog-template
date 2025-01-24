import{_ as s}from"./chunks/java-thread-x-juc-concurrentlinkedqueue-1.BvntpAp6.js";import{_ as a,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-2.png",t="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-3.png",c="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-4.png",r="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-5.png",o="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-6.png",u="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-7.png",d="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-8.png",h="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-9.png",m="/vitepress-blog-template/images/thread/java-thread-x-juc-concurrentlinkedqueue-10.png",N=JSON.parse('{"title":"JUC集合: ConcurrentLinkedQueue详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-collection-ConcurrentLinkedQueue.md","filePath":"java/thread/java-thread-x-juc-collection-ConcurrentLinkedQueue.md","lastUpdated":1737706346000}'),g={name:"java/thread/java-thread-x-juc-collection-ConcurrentLinkedQueue.md"};function b(f,n,k,v,q,C){return l(),p("div",null,n[0]||(n[0]=[e('<h1 id="juc集合-concurrentlinkedqueue详解" tabindex="-1">JUC集合: ConcurrentLinkedQueue详解 <a class="header-anchor" href="#juc集合-concurrentlinkedqueue详解" aria-label="Permalink to &quot;JUC集合: ConcurrentLinkedQueue详解&quot;">​</a></h1><blockquote><p>ConcurerntLinkedQueue一个基于链接节点的无界线程安全队列。此队列按照 FIFO(先进先出)原则对元素进行排序。队列的头部是队列中时间最长的元素。队列的尾部 是队列中时间最短的元素。新的元素插入到队列的尾部，队列获取操作从队列头部获得元素。当多个线程共享访问一个公共 collection 时，ConcurrentLinkedQueue是一个恰当的选择。此队列不允许使用null元素。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>要想用线程安全的队列有哪些选择? Vector，<code>Collections.synchronizedList(List&lt;T&gt; list)</code>, ConcurrentLinkedQueue等</li><li>ConcurrentLinkedQueue实现的数据结构?</li><li>ConcurrentLinkedQueue底层原理? 全程无锁(CAS)</li><li>ConcurrentLinkedQueue的核心方法有哪些? offer()，poll()，peek()，isEmpty()等队列常用方法</li><li>说说ConcurrentLinkedQueue的HOPS(延迟更新的策略)的设计?</li><li>ConcurrentLinkedQueue适合什么样的使用场景?</li></ul><h2 id="concurrentlinkedqueue数据结构" tabindex="-1">ConcurrentLinkedQueue数据结构 <a class="header-anchor" href="#concurrentlinkedqueue数据结构" aria-label="Permalink to &quot;ConcurrentLinkedQueue数据结构&quot;">​</a></h2><p>通过源码分析可知，ConcurrentLinkedQueue的数据结构与LinkedBlockingQueue的数据结构相同，都是使用的链表结构。ConcurrentLinkedQueue的数据结构如下:</p><p><img src="'+s+`" alt="error.图片加载失败"></p><p>说明: ConcurrentLinkedQueue采用的链表结构，并且包含有一个头节点和一个尾结点。</p><h2 id="concurrentlinkedqueue源码分析" tabindex="-1">ConcurrentLinkedQueue源码分析 <a class="header-anchor" href="#concurrentlinkedqueue源码分析" aria-label="Permalink to &quot;ConcurrentLinkedQueue源码分析&quot;">​</a></h2><h3 id="类的继承关系" tabindex="-1">类的继承关系 <a class="header-anchor" href="#类的继承关系" aria-label="Permalink to &quot;类的继承关系&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ConcurrentLinkedQueue&lt;E&gt; extends AbstractQueue&lt;E&gt;</span></span>
<span class="line"><span>        implements Queue&lt;E&gt;, java.io.Serializable {}</span></span></code></pre></div><p>说明: ConcurrentLinkedQueue继承了抽象类AbstractQueue，AbstractQueue定义了对队列的基本操作；同时实现了Queue接口，Queue定义了对队列的基本操作，同时，还实现了Serializable接口，表示可以被序列化。</p><h3 id="类的内部类" tabindex="-1">类的内部类 <a class="header-anchor" href="#类的内部类" aria-label="Permalink to &quot;类的内部类&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static class Node&lt;E&gt; {</span></span>
<span class="line"><span>    // 元素</span></span>
<span class="line"><span>    volatile E item;</span></span>
<span class="line"><span>    // next域</span></span>
<span class="line"><span>    volatile Node&lt;E&gt; next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Constructs a new node.  Uses relaxed write because item can</span></span>
<span class="line"><span>        * only be seen after publication via casNext.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 构造函数</span></span>
<span class="line"><span>    Node(E item) {</span></span>
<span class="line"><span>        // 设置item的值</span></span>
<span class="line"><span>        UNSAFE.putObject(this, itemOffset, item);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 比较并替换item值</span></span>
<span class="line"><span>    boolean casItem(E cmp, E val) {</span></span>
<span class="line"><span>        return UNSAFE.compareAndSwapObject(this, itemOffset, cmp, val);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    void lazySetNext(Node&lt;E&gt; val) {</span></span>
<span class="line"><span>        // 设置next域的值，并不会保证修改对其他线程立即可见</span></span>
<span class="line"><span>        UNSAFE.putOrderedObject(this, nextOffset, val);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 比较并替换next域的值</span></span>
<span class="line"><span>    boolean casNext(Node&lt;E&gt; cmp, Node&lt;E&gt; val) {</span></span>
<span class="line"><span>        return UNSAFE.compareAndSwapObject(this, nextOffset, cmp, val);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Unsafe mechanics</span></span>
<span class="line"><span>    // 反射机制</span></span>
<span class="line"><span>    private static final sun.misc.Unsafe UNSAFE;</span></span>
<span class="line"><span>    // item域的偏移量</span></span>
<span class="line"><span>    private static final long itemOffset;</span></span>
<span class="line"><span>    // next域的偏移量</span></span>
<span class="line"><span>    private static final long nextOffset;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            UNSAFE = sun.misc.Unsafe.getUnsafe();</span></span>
<span class="line"><span>            Class&lt;?&gt; k = Node.class;</span></span>
<span class="line"><span>            itemOffset = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (k.getDeclaredField(&quot;item&quot;));</span></span>
<span class="line"><span>            nextOffset = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (k.getDeclaredField(&quot;next&quot;));</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            throw new Error(e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: Node类表示链表结点，用于存放元素，包含item域和next域，item域表示元素，next域表示下一个结点，其利用反射机制和CAS机制来更新item域和next域，保证原子性。</p><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ConcurrentLinkedQueue&lt;E&gt; extends AbstractQueue&lt;E&gt;</span></span>
<span class="line"><span>        implements Queue&lt;E&gt;, java.io.Serializable {</span></span>
<span class="line"><span>    // 版本序列号        </span></span>
<span class="line"><span>    private static final long serialVersionUID = 196745693267521676L;</span></span>
<span class="line"><span>    // 反射机制</span></span>
<span class="line"><span>    private static final sun.misc.Unsafe UNSAFE;</span></span>
<span class="line"><span>    // head域的偏移量</span></span>
<span class="line"><span>    private static final long headOffset;</span></span>
<span class="line"><span>    // tail域的偏移量</span></span>
<span class="line"><span>    private static final long tailOffset;</span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            UNSAFE = sun.misc.Unsafe.getUnsafe();</span></span>
<span class="line"><span>            Class&lt;?&gt; k = ConcurrentLinkedQueue.class;</span></span>
<span class="line"><span>            headOffset = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (k.getDeclaredField(&quot;head&quot;));</span></span>
<span class="line"><span>            tailOffset = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (k.getDeclaredField(&quot;tail&quot;));</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            throw new Error(e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 头节点</span></span>
<span class="line"><span>    private transient volatile Node&lt;E&gt; head;</span></span>
<span class="line"><span>    // 尾结点</span></span>
<span class="line"><span>    private transient volatile Node&lt;E&gt; tail;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 属性中包含了head域和tail域，表示链表的头节点和尾结点，同时，ConcurrentLinkedQueue也使用了反射机制和CAS机制来更新头节点和尾结点，保证原子性。</p><h3 id="类的构造函数" tabindex="-1">类的构造函数 <a class="header-anchor" href="#类的构造函数" aria-label="Permalink to &quot;类的构造函数&quot;">​</a></h3><ul><li><code>ConcurrentLinkedQueue()</code>型构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ConcurrentLinkedQueue() {</span></span>
<span class="line"><span>    // 初始化头节点与尾结点</span></span>
<span class="line"><span>    head = tail = new Node&lt;E&gt;(null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该构造函数用于创建一个最初为空的 ConcurrentLinkedQueue，头节点与尾结点指向同一个结点，该结点的item域为null，next域也为null。</p><ul><li><code>ConcurrentLinkedQueue(Collection&lt;? extends E&gt;)</code>型构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ConcurrentLinkedQueue(Collection&lt;? extends E&gt; c) {</span></span>
<span class="line"><span>    Node&lt;E&gt; h = null, t = null;</span></span>
<span class="line"><span>    for (E e : c) { // 遍历c集合</span></span>
<span class="line"><span>        // 保证元素不为空</span></span>
<span class="line"><span>        checkNotNull(e);</span></span>
<span class="line"><span>        // 新生一个结点</span></span>
<span class="line"><span>        Node&lt;E&gt; newNode = new Node&lt;E&gt;(e);</span></span>
<span class="line"><span>        if (h == null) // 头节点为null</span></span>
<span class="line"><span>            // 赋值头节点与尾结点</span></span>
<span class="line"><span>            h = t = newNode;</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            // 直接头节点的next域</span></span>
<span class="line"><span>            t.lazySetNext(newNode);</span></span>
<span class="line"><span>            // 重新赋值头节点</span></span>
<span class="line"><span>            t = newNode;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (h == null) // 头节点为null</span></span>
<span class="line"><span>        // 新生头节点与尾结点</span></span>
<span class="line"><span>        h = t = new Node&lt;E&gt;(null);</span></span>
<span class="line"><span>    // 赋值头节点</span></span>
<span class="line"><span>    head = h;</span></span>
<span class="line"><span>    // 赋值尾结点</span></span>
<span class="line"><span>    tail = t;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该构造函数用于创建一个最初包含给定 collection 元素的 ConcurrentLinkedQueue，按照此 collection 迭代器的遍历顺序来添加元素。</p><h3 id="核心函数分析" tabindex="-1">核心函数分析 <a class="header-anchor" href="#核心函数分析" aria-label="Permalink to &quot;核心函数分析&quot;">​</a></h3><h4 id="offer函数" tabindex="-1">offer函数 <a class="header-anchor" href="#offer函数" aria-label="Permalink to &quot;offer函数&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean offer(E e) {</span></span>
<span class="line"><span>    // 元素不为null</span></span>
<span class="line"><span>    checkNotNull(e);</span></span>
<span class="line"><span>    // 新生一个结点</span></span>
<span class="line"><span>    final Node&lt;E&gt; newNode = new Node&lt;E&gt;(e);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (Node&lt;E&gt; t = tail, p = t;;) { // 无限循环</span></span>
<span class="line"><span>        // q为p结点的下一个结点</span></span>
<span class="line"><span>        Node&lt;E&gt; q = p.next;</span></span>
<span class="line"><span>        if (q == null) { // q结点为null</span></span>
<span class="line"><span>            // p is last node</span></span>
<span class="line"><span>            if (p.casNext(null, newNode)) { // 比较并进行替换p结点的next域</span></span>
<span class="line"><span>                // Successful CAS is the linearization point</span></span>
<span class="line"><span>                // for e to become an element of this queue,</span></span>
<span class="line"><span>                // and for newNode to become &quot;live&quot;.</span></span>
<span class="line"><span>                if (p != t) // p不等于t结点，不一致    // hop two nodes at a time</span></span>
<span class="line"><span>                    // 比较并替换尾结点</span></span>
<span class="line"><span>                    casTail(t, newNode);  // Failure is OK.</span></span>
<span class="line"><span>                // 返回</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // Lost CAS race to another thread; re-read next</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (p == q) // p结点等于q结点</span></span>
<span class="line"><span>            // We have fallen off list.  If tail is unchanged, it</span></span>
<span class="line"><span>            // will also be off-list, in which case we need to</span></span>
<span class="line"><span>            // jump to head, from which all live nodes are always</span></span>
<span class="line"><span>            // reachable.  Else the new tail is a better bet.</span></span>
<span class="line"><span>            // 原来的尾结点与现在的尾结点是否相等，若相等，则p赋值为head，否则，赋值为现在的尾结点</span></span>
<span class="line"><span>            p = (t != (t = tail)) ? t : head;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            // Check for tail updates after two hops.</span></span>
<span class="line"><span>            // 重新赋值p结点</span></span>
<span class="line"><span>            p = (p != t &amp;&amp; t != (t = tail)) ? t : q;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: offer函数用于将指定元素插入此队列的尾部。下面模拟offer函数的操作，队列状态的变化(假设单线程添加元素，连续添加10、20两个元素)。</p><p><img src="`+i+'" alt="error.图片加载失败"></p><ul><li>若ConcurrentLinkedQueue的初始状态如上图所示，即队列为空。单线程添加元素，此时，添加元素10，则状态如下所示</li></ul><p><img src="'+t+'" alt="error.图片加载失败"></p><ul><li>如上图所示，添加元素10后，tail没有变化，还是指向之前的结点，继续添加元素20，则状态如下所示</li></ul><p><img src="'+c+`" alt="error.图片加载失败"></p><ul><li>如上图所示，添加元素20后，tail指向了最新添加的结点。</li></ul><h4 id="poll函数" tabindex="-1">poll函数 <a class="header-anchor" href="#poll函数" aria-label="Permalink to &quot;poll函数&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public E poll() {</span></span>
<span class="line"><span>    restartFromHead:</span></span>
<span class="line"><span>    for (;;) { // 无限循环</span></span>
<span class="line"><span>        for (Node&lt;E&gt; h = head, p = h, q;;) { // 保存头节点</span></span>
<span class="line"><span>            // item项</span></span>
<span class="line"><span>            E item = p.item;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (item != null &amp;&amp; p.casItem(item, null)) { // item不为null并且比较并替换item成功</span></span>
<span class="line"><span>                // Successful CAS is the linearization point</span></span>
<span class="line"><span>                // for item to be removed from this queue.</span></span>
<span class="line"><span>                if (p != h) // p不等于h    // hop two nodes at a time</span></span>
<span class="line"><span>                    // 更新头节点</span></span>
<span class="line"><span>                    updateHead(h, ((q = p.next) != null) ? q : p); </span></span>
<span class="line"><span>                // 返回item</span></span>
<span class="line"><span>                return item;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if ((q = p.next) == null) { // q结点为null</span></span>
<span class="line"><span>                // 更新头节点</span></span>
<span class="line"><span>                updateHead(h, p);</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (p == q) // p等于q</span></span>
<span class="line"><span>                // 继续循环</span></span>
<span class="line"><span>                continue restartFromHead;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                // p赋值为q</span></span>
<span class="line"><span>                p = q;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数用于获取并移除此队列的头，如果此队列为空，则返回null。下面模拟poll函数的操作，队列状态的变化(假设单线程操作，状态为之前offer10、20后的状态，poll两次)。</p><p><img src="`+r+'" alt="error.图片加载失败"></p><ul><li>队列初始状态如上图所示，在poll操作后，队列的状态如下图所示</li></ul><p><img src="'+o+'" alt="error.图片加载失败"></p><ul><li>如上图可知，poll操作后，head改变了，并且head所指向的结点的item变为了null。再进行一次poll操作，队列的状态如下图所示。</li></ul><p><img src="'+u+`" alt="error.图片加载失败"></p><ul><li>如上图可知，poll操作后，head结点没有变化，只是指示的结点的item域变成了null。</li></ul><h4 id="remove函数" tabindex="-1">remove函数 <a class="header-anchor" href="#remove函数" aria-label="Permalink to &quot;remove函数&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean remove(Object o) {</span></span>
<span class="line"><span>    // 元素为null，返回</span></span>
<span class="line"><span>    if (o == null) return false;</span></span>
<span class="line"><span>    Node&lt;E&gt; pred = null;</span></span>
<span class="line"><span>    for (Node&lt;E&gt; p = first(); p != null; p = succ(p)) { // 获取第一个存活的结点</span></span>
<span class="line"><span>        // 第一个存活结点的item值</span></span>
<span class="line"><span>        E item = p.item;</span></span>
<span class="line"><span>        if (item != null &amp;&amp;</span></span>
<span class="line"><span>            o.equals(item) &amp;&amp;</span></span>
<span class="line"><span>            p.casItem(item, null)) { // 找到item相等的结点，并且将该结点的item设置为null</span></span>
<span class="line"><span>            // p的后继结点</span></span>
<span class="line"><span>            Node&lt;E&gt; next = succ(p);</span></span>
<span class="line"><span>            if (pred != null &amp;&amp; next != null) // pred不为null并且next不为null</span></span>
<span class="line"><span>                // 比较并替换next域</span></span>
<span class="line"><span>                pred.casNext(p, next);</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // pred赋值为p</span></span>
<span class="line"><span>        pred = p;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数用于从队列中移除指定元素的单个实例(如果存在)。其中，会调用到first函数和succ函数，first函数的源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Node&lt;E&gt; first() {</span></span>
<span class="line"><span>    restartFromHead:</span></span>
<span class="line"><span>    for (;;) { // 无限循环，确保成功</span></span>
<span class="line"><span>        for (Node&lt;E&gt; h = head, p = h, q;;) {</span></span>
<span class="line"><span>            // p结点的item域是否为null</span></span>
<span class="line"><span>            boolean hasItem = (p.item != null);</span></span>
<span class="line"><span>            if (hasItem || (q = p.next) == null) { // item不为null或者next域为null</span></span>
<span class="line"><span>                // 更新头节点</span></span>
<span class="line"><span>                updateHead(h, p);</span></span>
<span class="line"><span>                // 返回结点</span></span>
<span class="line"><span>                return hasItem ? p : null;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (p == q) // p等于q</span></span>
<span class="line"><span>                // 继续从头节点开始</span></span>
<span class="line"><span>                continue restartFromHead;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                // p赋值为q</span></span>
<span class="line"><span>                p = q;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: first函数用于找到链表中第一个存活的结点。succ函数源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final Node&lt;E&gt; succ(Node&lt;E&gt; p) {</span></span>
<span class="line"><span>    // p结点的next域</span></span>
<span class="line"><span>    Node&lt;E&gt; next = p.next;</span></span>
<span class="line"><span>    // 如果next域为自身，则返回头节点，否则，返回next</span></span>
<span class="line"><span>    return (p == next) ? head : next;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: succ用于获取结点的下一个结点。如果结点的next域指向自身，则返回head头节点，否则，返回next结点。下面模拟remove函数的操作，队列状态的变化(假设单线程操作，状态为之前offer10、20后的状态，执行remove(10)、remove(20)操作)。</p><p><img src="`+d+'" alt="error.图片加载失败"></p><ul><li>如上图所示，为ConcurrentLinkedQueue的初始状态，remove(10)后的状态如下图所示</li></ul><p><img src="'+h+'" alt="error.图片加载失败"></p><ul><li>如上图所示，当执行remove(10)后，head指向了head结点之前指向的结点的下一个结点，并且head结点的item域置为null。继续执行remove(20)，状态如下图所示</li></ul><p><img src="'+m+`" alt="error.图片加载失败"></p><ul><li>如上图所示，执行remove(20)后，head与tail指向同一个结点，item域为null。</li></ul><h4 id="size函数" tabindex="-1">size函数 <a class="header-anchor" href="#size函数" aria-label="Permalink to &quot;size函数&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int size() {</span></span>
<span class="line"><span>    // 计数</span></span>
<span class="line"><span>    int count = 0;</span></span>
<span class="line"><span>    for (Node&lt;E&gt; p = first(); p != null; p = succ(p)) // 从第一个存活的结点开始往后遍历</span></span>
<span class="line"><span>        if (p.item != null) // 结点的item域不为null</span></span>
<span class="line"><span>            // Collection.size() spec says to max out</span></span>
<span class="line"><span>            if (++count == Integer.MAX_VALUE) // 增加计数，若达到最大值，则跳出循环</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>    // 返回大小</span></span>
<span class="line"><span>    return count;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数用于返回ConcurrenLinkedQueue的大小，从第一个存活的结点(first)开始，往后遍历链表，当结点的item域不为null时，增加计数，之后返回大小。</p><h2 id="concurrentlinkedqueue示例" tabindex="-1">ConcurrentLinkedQueue示例 <a class="header-anchor" href="#concurrentlinkedqueue示例" aria-label="Permalink to &quot;ConcurrentLinkedQueue示例&quot;">​</a></h2><p>下面通过一个示例来了解ConcurrentLinkedQueue的使用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.ConcurrentLinkedQueue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class PutThread extends Thread {</span></span>
<span class="line"><span>    private ConcurrentLinkedQueue&lt;Integer&gt; clq;</span></span>
<span class="line"><span>    public PutThread(ConcurrentLinkedQueue&lt;Integer&gt; clq) {</span></span>
<span class="line"><span>        this.clq = clq;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 10; i++) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                System.out.println(&quot;add &quot; + i);</span></span>
<span class="line"><span>                clq.add(i);</span></span>
<span class="line"><span>                Thread.sleep(100);</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class GetThread extends Thread {</span></span>
<span class="line"><span>    private ConcurrentLinkedQueue&lt;Integer&gt; clq;</span></span>
<span class="line"><span>    public GetThread(ConcurrentLinkedQueue&lt;Integer&gt; clq) {</span></span>
<span class="line"><span>        this.clq = clq;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 10; i++) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                System.out.println(&quot;poll &quot; + clq.poll());</span></span>
<span class="line"><span>                Thread.sleep(100);</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ConcurrentLinkedQueueDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ConcurrentLinkedQueue&lt;Integer&gt; clq = new ConcurrentLinkedQueue&lt;Integer&gt;();</span></span>
<span class="line"><span>        PutThread p1 = new PutThread(clq);</span></span>
<span class="line"><span>        GetThread g1 = new GetThread(clq);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        p1.start();</span></span>
<span class="line"><span>        g1.start();</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果(某一次):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>add 0</span></span>
<span class="line"><span>poll null</span></span>
<span class="line"><span>add 1</span></span>
<span class="line"><span>poll 0</span></span>
<span class="line"><span>add 2</span></span>
<span class="line"><span>poll 1</span></span>
<span class="line"><span>add 3</span></span>
<span class="line"><span>poll 2</span></span>
<span class="line"><span>add 4</span></span>
<span class="line"><span>poll 3</span></span>
<span class="line"><span>add 5</span></span>
<span class="line"><span>poll 4</span></span>
<span class="line"><span>poll 5</span></span>
<span class="line"><span>add 6</span></span>
<span class="line"><span>add 7</span></span>
<span class="line"><span>poll 6</span></span>
<span class="line"><span>poll 7</span></span>
<span class="line"><span>add 8</span></span>
<span class="line"><span>add 9</span></span>
<span class="line"><span>poll 8</span></span></code></pre></div><p>说明: GetThread线程不会因为ConcurrentLinkedQueue队列为空而等待，而是直接返回null，所以当实现队列不空时，等待时，则需要用户自己实现等待逻辑。</p><h2 id="再深入理解" tabindex="-1">再深入理解 <a class="header-anchor" href="#再深入理解" aria-label="Permalink to &quot;再深入理解&quot;">​</a></h2><h3 id="hops-延迟更新的策略-的设计" tabindex="-1">HOPS(延迟更新的策略)的设计 <a class="header-anchor" href="#hops-延迟更新的策略-的设计" aria-label="Permalink to &quot;HOPS(延迟更新的策略)的设计&quot;">​</a></h3><p>通过上面对offer和poll方法的分析，我们发现tail和head是延迟更新的，两者更新触发时机为：</p><ul><li><p><code>tail更新触发时机</code>：当tail指向的节点的下一个节点不为null的时候，会执行定位队列真正的队尾节点的操作，找到队尾节点后完成插入之后才会通过casTail进行tail更新；当tail指向的节点的下一个节点为null的时候，只插入节点不更新tail。</p></li><li><p><code>head更新触发时机</code>：当head指向的节点的item域为null的时候，会执行定位队列真正的队头节点的操作，找到队头节点后完成删除之后才会通过updateHead进行head更新；当head指向的节点的item域不为null的时候，只删除节点不更新head。</p></li></ul><p>并且在更新操作时，源码中会有注释为：<code>hop two nodes at a time</code>。所以这种延迟更新的策略就被叫做HOPS的大概原因是这个(猜的 😃)，从上面更新时的状态图可以看出，head和tail的更新是“跳着的”即中间总是间隔了一个。那么这样设计的意图是什么呢?</p><p>如果让tail永远作为队列的队尾节点，实现的代码量会更少，而且逻辑更易懂。但是，这样做有一个缺点，如果大量的入队操作，每次都要执行CAS进行tail的更新，汇总起来对性能也会是大大的损耗。如果能减少CAS更新的操作，无疑可以大大提升入队的操作效率，所以doug lea大师每间隔1次(tail和队尾节点的距离为1)进行才利用CAS更新tail。对head的更新也是同样的道理，虽然，这样设计会多出在循环中定位队尾节点，但总体来说读的操作效率要远远高于写的性能，因此，多出来的在循环中定位尾节点的操作的性能损耗相对而言是很小的。</p><h3 id="concurrentlinkedqueue适合的场景" tabindex="-1">ConcurrentLinkedQueue适合的场景 <a class="header-anchor" href="#concurrentlinkedqueue适合的场景" aria-label="Permalink to &quot;ConcurrentLinkedQueue适合的场景&quot;">​</a></h3><p>ConcurrentLinkedQueue通过无锁来做到了更高的并发量，是个高性能的队列，但是使用场景相对不如阻塞队列常见，毕竟取数据也要不停的去循环，不如阻塞的逻辑好设计，但是在并发量特别大的情况下，是个不错的选择，性能上好很多，而且这个队列的设计也是特别费力，尤其的使用的改良算法和对哨兵的处理。整体的思路都是比较严谨的，这个也是使用了无锁造成的，我们自己使用无锁的条件的话，这个队列是个不错的参考。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5539142.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5539142.html，在此基础上做了增改。</a></li><li><a href="https://blog.csdn.net/u011521203/article/details/80214968" target="_blank" rel="noreferrer">https://blog.csdn.net/u011521203/article/details/80214968</a></li><li><a href="https://blog.csdn.net/u014493323/article/details/81177194" target="_blank" rel="noreferrer">https://blog.csdn.net/u014493323/article/details/81177194</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,79)]))}const Q=a(g,[["render",b]]);export{N as __pageData,Q as default};
