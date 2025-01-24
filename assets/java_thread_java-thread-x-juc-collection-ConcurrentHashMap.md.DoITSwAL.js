import{_ as s}from"./chunks/java-thread-x-concurrent-hashmap-1.B5VToQH_.js";import{_ as a,c as p,ai as l,o as e}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/thread/java-thread-x-concurrent-hashmap-2.png",f=JSON.parse('{"title":"JUC集合: ConcurrentHashMap详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-collection-ConcurrentHashMap.md","filePath":"java/thread/java-thread-x-juc-collection-ConcurrentHashMap.md","lastUpdated":1737706346000}'),t={name:"java/thread/java-thread-x-juc-collection-ConcurrentHashMap.md"};function c(r,n,o,h,u,d){return e(),p("div",null,n[0]||(n[0]=[l('<h1 id="juc集合-concurrenthashmap详解" tabindex="-1">JUC集合: ConcurrentHashMap详解 <a class="header-anchor" href="#juc集合-concurrenthashmap详解" aria-label="Permalink to &quot;JUC集合: ConcurrentHashMap详解&quot;">​</a></h1><blockquote><p>JDK1.7之前的ConcurrentHashMap使用分段锁机制实现，JDK1.8则使用数组+链表+红黑树数据结构和CAS原子操作实现ConcurrentHashMap；本文将分别介绍这两种方式的实现方案及其区别。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>为什么HashTable慢? 它的并发度是什么? 那么ConcurrentHashMap并发度是什么?</li><li>ConcurrentHashMap在JDK1.7和JDK1.8中实现有什么差别? JDK1.8解決了JDK1.7中什么问题</li><li>ConcurrentHashMap JDK1.7实现的原理是什么? 分段锁机制</li><li>ConcurrentHashMap JDK1.8实现的原理是什么? 数组+链表+红黑树，CAS</li><li>ConcurrentHashMap JDK1.7中Segment数(concurrencyLevel)默认值是多少? 为何一旦初始化就不可再扩容?</li><li>ConcurrentHashMap JDK1.7说说其put的机制?</li><li>ConcurrentHashMap JDK1.7是如何扩容的? rehash(注：segment 数组不能扩容，扩容是 segment 数组某个位置内部的数组 HashEntry&lt;K,V&gt;[] 进行扩容)</li><li>ConcurrentHashMap JDK1.8是如何扩容的? tryPresize</li><li>ConcurrentHashMap JDK1.8链表转红黑树的时机是什么? 临界值为什么是8?</li><li>ConcurrentHashMap JDK1.8是如何进行数据迁移的? transfer</li></ul><h2 id="为什么hashtable慢" tabindex="-1">为什么HashTable慢 <a class="header-anchor" href="#为什么hashtable慢" aria-label="Permalink to &quot;为什么HashTable慢&quot;">​</a></h2><p>Hashtable之所以效率低下主要是因为其实现使用了synchronized关键字对put等操作进行加锁，而synchronized关键字加锁是对整个对象进行加锁，也就是说在进行put等修改Hash表的操作时，锁住了整个Hash表，从而使得其表现的效率低下。</p><h2 id="concurrenthashmap-jdk-1-7" tabindex="-1">ConcurrentHashMap - JDK 1.7 <a class="header-anchor" href="#concurrenthashmap-jdk-1-7" aria-label="Permalink to &quot;ConcurrentHashMap - JDK 1.7&quot;">​</a></h2><p>在JDK1.5~1.7版本，Java使用了分段锁机制实现ConcurrentHashMap.</p><p>简而言之，ConcurrentHashMap在对象中保存了一个Segment数组，即将整个Hash表划分为多个分段；而每个Segment元素，即每个分段则类似于一个Hashtable；这样，在执行put操作时首先根据hash算法定位到元素属于哪个Segment，然后对该Segment加锁即可。因此，ConcurrentHashMap在多线程并发编程中可是实现多线程put操作。接下来分析JDK1.7版本中ConcurrentHashMap的实现原理。</p><h3 id="数据结构" tabindex="-1">数据结构 <a class="header-anchor" href="#数据结构" aria-label="Permalink to &quot;数据结构&quot;">​</a></h3><p>整个 ConcurrentHashMap 由一个个 Segment 组成，Segment 代表”部分“或”一段“的意思，所以很多地方都会将其描述为分段锁。注意，行文中，我很多地方用了“槽”来代表一个 segment。</p><p>简单理解就是，ConcurrentHashMap 是一个 Segment 数组，Segment 通过继承 ReentrantLock 来进行加锁，所以每次需要加锁的操作锁住的是一个 segment，这样只要保证每个 Segment 是线程安全的，也就实现了全局的线程安全。</p><p><img src="'+s+`" alt="error.图片加载失败"></p><p><code>concurrencyLevel</code>: 并行级别、并发数、Segment 数，怎么翻译不重要，理解它。默认是 16，也就是说 ConcurrentHashMap 有 16 个 Segments，所以理论上，这个时候，最多可以同时支持 16 个线程并发写，只要它们的操作分别分布在不同的 Segment 上。这个值可以在初始化的时候设置为其他值，但是一旦初始化以后，它是不可以扩容的。</p><p>再具体到每个 Segment 内部，其实每个 Segment 很像之前介绍的 HashMap，不过它要保证线程安全，所以处理起来要麻烦些。</p><h3 id="初始化" tabindex="-1">初始化 <a class="header-anchor" href="#初始化" aria-label="Permalink to &quot;初始化&quot;">​</a></h3><ul><li><p>initialCapacity: 初始容量，这个值指的是整个 ConcurrentHashMap 的初始容量，实际操作的时候需要平均分给每个 Segment。</p></li><li><p>loadFactor: 负载因子，之前我们说了，Segment 数组不可以扩容，所以这个负载因子是给每个 Segment 内部使用的。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ConcurrentHashMap(int initialCapacity,</span></span>
<span class="line"><span>                         float loadFactor, int concurrencyLevel) {</span></span>
<span class="line"><span>    if (!(loadFactor &gt; 0) || initialCapacity &lt; 0 || concurrencyLevel &lt;= 0)</span></span>
<span class="line"><span>        throw new IllegalArgumentException();</span></span>
<span class="line"><span>    if (concurrencyLevel &gt; MAX_SEGMENTS)</span></span>
<span class="line"><span>        concurrencyLevel = MAX_SEGMENTS;</span></span>
<span class="line"><span>    // Find power-of-two sizes best matching arguments</span></span>
<span class="line"><span>    int sshift = 0;</span></span>
<span class="line"><span>    int ssize = 1;</span></span>
<span class="line"><span>    // 计算并行级别 ssize，因为要保持并行级别是 2 的 n 次方</span></span>
<span class="line"><span>    while (ssize &lt; concurrencyLevel) {</span></span>
<span class="line"><span>        ++sshift;</span></span>
<span class="line"><span>        ssize &lt;&lt;= 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 我们这里先不要那么烧脑，用默认值，concurrencyLevel 为 16，sshift 为 4</span></span>
<span class="line"><span>    // 那么计算出 segmentShift 为 28，segmentMask 为 15，后面会用到这两个值</span></span>
<span class="line"><span>    this.segmentShift = 32 - sshift;</span></span>
<span class="line"><span>    this.segmentMask = ssize - 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (initialCapacity &gt; MAXIMUM_CAPACITY)</span></span>
<span class="line"><span>        initialCapacity = MAXIMUM_CAPACITY;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // initialCapacity 是设置整个 map 初始的大小，</span></span>
<span class="line"><span>    // 这里根据 initialCapacity 计算 Segment 数组中每个位置可以分到的大小</span></span>
<span class="line"><span>    // 如 initialCapacity 为 64，那么每个 Segment 或称之为&quot;槽&quot;可以分到 4 个</span></span>
<span class="line"><span>    int c = initialCapacity / ssize;</span></span>
<span class="line"><span>    if (c * ssize &lt; initialCapacity)</span></span>
<span class="line"><span>        ++c;</span></span>
<span class="line"><span>    // 默认 MIN_SEGMENT_TABLE_CAPACITY 是 2，这个值也是有讲究的，因为这样的话，对于具体的槽上，</span></span>
<span class="line"><span>    // 插入一个元素不至于扩容，插入第二个的时候才会扩容</span></span>
<span class="line"><span>    int cap = MIN_SEGMENT_TABLE_CAPACITY; </span></span>
<span class="line"><span>    while (cap &lt; c)</span></span>
<span class="line"><span>        cap &lt;&lt;= 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建 Segment 数组，</span></span>
<span class="line"><span>    // 并创建数组的第一个元素 segment[0]</span></span>
<span class="line"><span>    Segment&lt;K,V&gt; s0 =</span></span>
<span class="line"><span>        new Segment&lt;K,V&gt;(loadFactor, (int)(cap * loadFactor),</span></span>
<span class="line"><span>                         (HashEntry&lt;K,V&gt;[])new HashEntry[cap]);</span></span>
<span class="line"><span>    Segment&lt;K,V&gt;[] ss = (Segment&lt;K,V&gt;[])new Segment[ssize];</span></span>
<span class="line"><span>    // 往数组写入 segment[0]</span></span>
<span class="line"><span>    UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]</span></span>
<span class="line"><span>    this.segments = ss;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>初始化完成，我们得到了一个 Segment 数组。</p><p>我们就当是用 new ConcurrentHashMap() 无参构造函数进行初始化的，那么初始化完成后:</p><ul><li>Segment 数组长度为 16，不可以扩容</li><li>Segment[i] 的默认大小为 2，负载因子是 0.75，得出初始阈值为 1.5，也就是以后插入第一个元素不会触发扩容，插入第二个会进行第一次扩容</li><li>这里初始化了 segment[0]，其他位置还是 null，至于为什么要初始化 segment[0]，后面的代码会介绍</li><li>当前 segmentShift 的值为 32 - 4 = 28，segmentMask 为 16 - 1 = 15，姑且把它们简单翻译为移位数和掩码，这两个值马上就会用到</li></ul><h3 id="put-过程分析" tabindex="-1">put 过程分析 <a class="header-anchor" href="#put-过程分析" aria-label="Permalink to &quot;put 过程分析&quot;">​</a></h3><p>我们先看 put 的主流程，对于其中的一些关键细节操作，后面会进行详细介绍。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V put(K key, V value) {</span></span>
<span class="line"><span>    Segment&lt;K,V&gt; s;</span></span>
<span class="line"><span>    if (value == null)</span></span>
<span class="line"><span>        throw new NullPointerException();</span></span>
<span class="line"><span>    // 1. 计算 key 的 hash 值</span></span>
<span class="line"><span>    int hash = hash(key);</span></span>
<span class="line"><span>    // 2. 根据 hash 值找到 Segment 数组中的位置 j</span></span>
<span class="line"><span>    //    hash 是 32 位，无符号右移 segmentShift(28) 位，剩下高 4 位，</span></span>
<span class="line"><span>    //    然后和 segmentMask(15) 做一次与操作，也就是说 j 是 hash 值的高 4 位，也就是槽的数组下标</span></span>
<span class="line"><span>    int j = (hash &gt;&gt;&gt; segmentShift) &amp; segmentMask;</span></span>
<span class="line"><span>    // 刚刚说了，初始化的时候初始化了 segment[0]，但是其他位置还是 null，</span></span>
<span class="line"><span>    // ensureSegment(j) 对 segment[j] 进行初始化</span></span>
<span class="line"><span>    if ((s = (Segment&lt;K,V&gt;)UNSAFE.getObject          // nonvolatile; recheck</span></span>
<span class="line"><span>         (segments, (j &lt;&lt; SSHIFT) + SBASE)) == null) //  in ensureSegment</span></span>
<span class="line"><span>        s = ensureSegment(j);</span></span>
<span class="line"><span>    // 3. 插入新值到 槽 s 中</span></span>
<span class="line"><span>    return s.put(key, hash, value, false);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第一层皮很简单，根据 hash 值很快就能找到相应的 Segment，之后就是 Segment 内部的 put 操作了。</p><p>Segment 内部是由 <code>数组+链表</code> 组成的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final V put(K key, int hash, V value, boolean onlyIfAbsent) {</span></span>
<span class="line"><span>    // 在往该 segment 写入前，需要先获取该 segment 的独占锁</span></span>
<span class="line"><span>    //    先看主流程，后面还会具体介绍这部分内容</span></span>
<span class="line"><span>    HashEntry&lt;K,V&gt; node = tryLock() ? null :</span></span>
<span class="line"><span>        scanAndLockForPut(key, hash, value);</span></span>
<span class="line"><span>    V oldValue;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 这个是 segment 内部的数组</span></span>
<span class="line"><span>        HashEntry&lt;K,V&gt;[] tab = table;</span></span>
<span class="line"><span>        // 再利用 hash 值，求应该放置的数组下标</span></span>
<span class="line"><span>        int index = (tab.length - 1) &amp; hash;</span></span>
<span class="line"><span>        // first 是数组该位置处的链表的表头</span></span>
<span class="line"><span>        HashEntry&lt;K,V&gt; first = entryAt(tab, index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 下面这串 for 循环虽然很长，不过也很好理解，想想该位置没有任何元素和已经存在一个链表这两种情况</span></span>
<span class="line"><span>        for (HashEntry&lt;K,V&gt; e = first;;) {</span></span>
<span class="line"><span>            if (e != null) {</span></span>
<span class="line"><span>                K k;</span></span>
<span class="line"><span>                if ((k = e.key) == key ||</span></span>
<span class="line"><span>                    (e.hash == hash &amp;&amp; key.equals(k))) {</span></span>
<span class="line"><span>                    oldValue = e.value;</span></span>
<span class="line"><span>                    if (!onlyIfAbsent) {</span></span>
<span class="line"><span>                        // 覆盖旧值</span></span>
<span class="line"><span>                        e.value = value;</span></span>
<span class="line"><span>                        ++modCount;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // 继续顺着链表走</span></span>
<span class="line"><span>                e = e.next;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else {</span></span>
<span class="line"><span>                // node 到底是不是 null，这个要看获取锁的过程，不过和这里都没有关系。</span></span>
<span class="line"><span>                // 如果不为 null，那就直接将它设置为链表表头；如果是null，初始化并设置为链表表头。</span></span>
<span class="line"><span>                if (node != null)</span></span>
<span class="line"><span>                    node.setNext(first);</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    node = new HashEntry&lt;K,V&gt;(hash, key, value, first);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                int c = count + 1;</span></span>
<span class="line"><span>                // 如果超过了该 segment 的阈值，这个 segment 需要扩容</span></span>
<span class="line"><span>                if (c &gt; threshold &amp;&amp; tab.length &lt; MAXIMUM_CAPACITY)</span></span>
<span class="line"><span>                    rehash(node); // 扩容后面也会具体分析</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    // 没有达到阈值，将 node 放到数组 tab 的 index 位置，</span></span>
<span class="line"><span>                    // 其实就是将新的节点设置成原链表的表头</span></span>
<span class="line"><span>                    setEntryAt(tab, index, node);</span></span>
<span class="line"><span>                ++modCount;</span></span>
<span class="line"><span>                count = c;</span></span>
<span class="line"><span>                oldValue = null;</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        // 解锁</span></span>
<span class="line"><span>        unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return oldValue;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>整体流程还是比较简单的，由于有独占锁的保护，所以 segment 内部的操作并不复杂。至于这里面的并发问题，我们稍后再进行介绍。</p><p>到这里 put 操作就结束了，接下来，我们说一说其中几步关键的操作。</p><h3 id="初始化槽-ensuresegment" tabindex="-1">初始化槽: ensureSegment <a class="header-anchor" href="#初始化槽-ensuresegment" aria-label="Permalink to &quot;初始化槽: ensureSegment&quot;">​</a></h3><p>ConcurrentHashMap 初始化的时候会初始化第一个槽 segment[0]，对于其他槽来说，在插入第一个值的时候进行初始化。</p><p>这里需要考虑并发，因为很可能会有多个线程同时进来初始化同一个槽 segment[k]，不过只要有一个成功了就可以。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Segment&lt;K,V&gt; ensureSegment(int k) {</span></span>
<span class="line"><span>    final Segment&lt;K,V&gt;[] ss = this.segments;</span></span>
<span class="line"><span>    long u = (k &lt;&lt; SSHIFT) + SBASE; // raw offset</span></span>
<span class="line"><span>    Segment&lt;K,V&gt; seg;</span></span>
<span class="line"><span>    if ((seg = (Segment&lt;K,V&gt;)UNSAFE.getObjectVolatile(ss, u)) == null) {</span></span>
<span class="line"><span>        // 这里看到为什么之前要初始化 segment[0] 了，</span></span>
<span class="line"><span>        // 使用当前 segment[0] 处的数组长度和负载因子来初始化 segment[k]</span></span>
<span class="line"><span>        // 为什么要用“当前”，因为 segment[0] 可能早就扩容过了</span></span>
<span class="line"><span>        Segment&lt;K,V&gt; proto = ss[0];</span></span>
<span class="line"><span>        int cap = proto.table.length;</span></span>
<span class="line"><span>        float lf = proto.loadFactor;</span></span>
<span class="line"><span>        int threshold = (int)(cap * lf);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 初始化 segment[k] 内部的数组</span></span>
<span class="line"><span>        HashEntry&lt;K,V&gt;[] tab = (HashEntry&lt;K,V&gt;[])new HashEntry[cap];</span></span>
<span class="line"><span>        if ((seg = (Segment&lt;K,V&gt;)UNSAFE.getObjectVolatile(ss, u))</span></span>
<span class="line"><span>            == null) { // 再次检查一遍该槽是否被其他线程初始化了。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            Segment&lt;K,V&gt; s = new Segment&lt;K,V&gt;(lf, threshold, tab);</span></span>
<span class="line"><span>            // 使用 while 循环，内部用 CAS，当前线程成功设值或其他线程成功设值后，退出</span></span>
<span class="line"><span>            while ((seg = (Segment&lt;K,V&gt;)UNSAFE.getObjectVolatile(ss, u))</span></span>
<span class="line"><span>                   == null) {</span></span>
<span class="line"><span>                if (UNSAFE.compareAndSwapObject(ss, u, null, seg = s))</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return seg;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>总的来说，ensureSegment(int k) 比较简单，对于并发操作使用 CAS 进行控制。</p><h3 id="获取写入锁-scanandlockforput" tabindex="-1">获取写入锁: scanAndLockForPut <a class="header-anchor" href="#获取写入锁-scanandlockforput" aria-label="Permalink to &quot;获取写入锁: scanAndLockForPut&quot;">​</a></h3><p>前面我们看到，在往某个 segment 中 put 的时候，首先会调用 node = tryLock() ? null : scanAndLockForPut(key, hash, value)，也就是说先进行一次 tryLock() 快速获取该 segment 的独占锁，如果失败，那么进入到 scanAndLockForPut 这个方法来获取锁。</p><p>下面我们来具体分析这个方法中是怎么控制加锁的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private HashEntry&lt;K,V&gt; scanAndLockForPut(K key, int hash, V value) {</span></span>
<span class="line"><span>    HashEntry&lt;K,V&gt; first = entryForHash(this, hash);</span></span>
<span class="line"><span>    HashEntry&lt;K,V&gt; e = first;</span></span>
<span class="line"><span>    HashEntry&lt;K,V&gt; node = null;</span></span>
<span class="line"><span>    int retries = -1; // negative while locating node</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 循环获取锁</span></span>
<span class="line"><span>    while (!tryLock()) {</span></span>
<span class="line"><span>        HashEntry&lt;K,V&gt; f; // to recheck first below</span></span>
<span class="line"><span>        if (retries &lt; 0) {</span></span>
<span class="line"><span>            if (e == null) {</span></span>
<span class="line"><span>                if (node == null) // speculatively create node</span></span>
<span class="line"><span>                    // 进到这里说明数组该位置的链表是空的，没有任何元素</span></span>
<span class="line"><span>                    // 当然，进到这里的另一个原因是 tryLock() 失败，所以该槽存在并发，不一定是该位置</span></span>
<span class="line"><span>                    node = new HashEntry&lt;K,V&gt;(hash, key, value, null);</span></span>
<span class="line"><span>                retries = 0;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (key.equals(e.key))</span></span>
<span class="line"><span>                retries = 0;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                // 顺着链表往下走</span></span>
<span class="line"><span>                e = e.next;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 重试次数如果超过 MAX_SCAN_RETRIES(单核1多核64)，那么不抢了，进入到阻塞队列等待锁</span></span>
<span class="line"><span>        //    lock() 是阻塞方法，直到获取锁后返回</span></span>
<span class="line"><span>        else if (++retries &gt; MAX_SCAN_RETRIES) {</span></span>
<span class="line"><span>            lock();</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if ((retries &amp; 1) == 0 &amp;&amp;</span></span>
<span class="line"><span>                 // 这个时候是有大问题了，那就是有新的元素进到了链表，成为了新的表头</span></span>
<span class="line"><span>                 //     所以这边的策略是，相当于重新走一遍这个 scanAndLockForPut 方法</span></span>
<span class="line"><span>                 (f = entryForHash(this, hash)) != first) {</span></span>
<span class="line"><span>            e = first = f; // re-traverse if entry changed</span></span>
<span class="line"><span>            retries = -1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return node;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法有两个出口，一个是 tryLock() 成功了，循环终止，另一个就是重试次数超过了 MAX_SCAN_RETRIES，进到 lock() 方法，此方法会阻塞等待，直到成功拿到独占锁。</p><p>这个方法就是看似复杂，但是其实就是做了一件事，那就是获取该 segment 的独占锁，如果需要的话顺便实例化了一下 node。</p><h3 id="扩容-rehash" tabindex="-1">扩容: rehash <a class="header-anchor" href="#扩容-rehash" aria-label="Permalink to &quot;扩容: rehash&quot;">​</a></h3><p>重复一下，segment 数组不能扩容，扩容是 segment 数组某个位置内部的数组 HashEntry&lt;K,V&gt;[] 进行扩容，扩容后，容量为原来的 2 倍。</p><p>首先，我们要回顾一下触发扩容的地方，put 的时候，如果判断该值的插入会导致该 segment 的元素个数超过阈值，那么先进行扩容，再插值，读者这个时候可以回去 put 方法看一眼。</p><p>该方法不需要考虑并发，因为到这里的时候，是持有该 segment 的独占锁的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 方法参数上的 node 是这次扩容后，需要添加到新的数组中的数据。</span></span>
<span class="line"><span>private void rehash(HashEntry&lt;K,V&gt; node) {</span></span>
<span class="line"><span>    HashEntry&lt;K,V&gt;[] oldTable = table;</span></span>
<span class="line"><span>    int oldCapacity = oldTable.length;</span></span>
<span class="line"><span>    // 2 倍</span></span>
<span class="line"><span>    int newCapacity = oldCapacity &lt;&lt; 1;</span></span>
<span class="line"><span>    threshold = (int)(newCapacity * loadFactor);</span></span>
<span class="line"><span>    // 创建新数组</span></span>
<span class="line"><span>    HashEntry&lt;K,V&gt;[] newTable =</span></span>
<span class="line"><span>        (HashEntry&lt;K,V&gt;[]) new HashEntry[newCapacity];</span></span>
<span class="line"><span>    // 新的掩码，如从 16 扩容到 32，那么 sizeMask 为 31，对应二进制 ‘000...00011111’</span></span>
<span class="line"><span>    int sizeMask = newCapacity - 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 遍历原数组，老套路，将原数组位置 i 处的链表拆分到 新数组位置 i 和 i+oldCap 两个位置</span></span>
<span class="line"><span>    for (int i = 0; i &lt; oldCapacity ; i++) {</span></span>
<span class="line"><span>        // e 是链表的第一个元素</span></span>
<span class="line"><span>        HashEntry&lt;K,V&gt; e = oldTable[i];</span></span>
<span class="line"><span>        if (e != null) {</span></span>
<span class="line"><span>            HashEntry&lt;K,V&gt; next = e.next;</span></span>
<span class="line"><span>            // 计算应该放置在新数组中的位置，</span></span>
<span class="line"><span>            // 假设原数组长度为 16，e 在 oldTable[3] 处，那么 idx 只可能是 3 或者是 3 + 16 = 19</span></span>
<span class="line"><span>            int idx = e.hash &amp; sizeMask;</span></span>
<span class="line"><span>            if (next == null)   // 该位置处只有一个元素，那比较好办</span></span>
<span class="line"><span>                newTable[idx] = e;</span></span>
<span class="line"><span>            else { // Reuse consecutive sequence at same slot</span></span>
<span class="line"><span>                // e 是链表表头</span></span>
<span class="line"><span>                HashEntry&lt;K,V&gt; lastRun = e;</span></span>
<span class="line"><span>                // idx 是当前链表的头节点 e 的新位置</span></span>
<span class="line"><span>                int lastIdx = idx;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                // 下面这个 for 循环会找到一个 lastRun 节点，这个节点之后的所有元素是将要放到一起的</span></span>
<span class="line"><span>                for (HashEntry&lt;K,V&gt; last = next;</span></span>
<span class="line"><span>                     last != null;</span></span>
<span class="line"><span>                     last = last.next) {</span></span>
<span class="line"><span>                    int k = last.hash &amp; sizeMask;</span></span>
<span class="line"><span>                    if (k != lastIdx) {</span></span>
<span class="line"><span>                        lastIdx = k;</span></span>
<span class="line"><span>                        lastRun = last;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // 将 lastRun 及其之后的所有节点组成的这个链表放到 lastIdx 这个位置</span></span>
<span class="line"><span>                newTable[lastIdx] = lastRun;</span></span>
<span class="line"><span>                // 下面的操作是处理 lastRun 之前的节点，</span></span>
<span class="line"><span>                //    这些节点可能分配在另一个链表中，也可能分配到上面的那个链表中</span></span>
<span class="line"><span>                for (HashEntry&lt;K,V&gt; p = e; p != lastRun; p = p.next) {</span></span>
<span class="line"><span>                    V v = p.value;</span></span>
<span class="line"><span>                    int h = p.hash;</span></span>
<span class="line"><span>                    int k = h &amp; sizeMask;</span></span>
<span class="line"><span>                    HashEntry&lt;K,V&gt; n = newTable[k];</span></span>
<span class="line"><span>                    newTable[k] = new HashEntry&lt;K,V&gt;(h, p.key, v, n);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 将新来的 node 放到新数组中刚刚的 两个链表之一 的 头部</span></span>
<span class="line"><span>    int nodeIndex = node.hash &amp; sizeMask; // add the new node</span></span>
<span class="line"><span>    node.setNext(newTable[nodeIndex]);</span></span>
<span class="line"><span>    newTable[nodeIndex] = node;</span></span>
<span class="line"><span>    table = newTable;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的扩容比之前的 HashMap 要复杂一些，代码难懂一点。上面有两个挨着的 for 循环，第一个 for 有什么用呢?</p><p>仔细一看发现，如果没有第一个 for 循环，也是可以工作的，但是，这个 for 循环下来，如果 lastRun 的后面还有比较多的节点，那么这次就是值得的。因为我们只需要克隆 lastRun 前面的节点，后面的一串节点跟着 lastRun 走就是了，不需要做任何操作。</p><p>我觉得 Doug Lea 的这个想法也是挺有意思的，不过比较坏的情况就是每次 lastRun 都是链表的最后一个元素或者很靠后的元素，那么这次遍历就有点浪费了。不过 Doug Lea 也说了，根据统计，如果使用默认的阈值，大约只有 1/6 的节点需要克隆。</p><h3 id="get-过程分析" tabindex="-1">get 过程分析 <a class="header-anchor" href="#get-过程分析" aria-label="Permalink to &quot;get 过程分析&quot;">​</a></h3><p>相对于 put 来说，get 就很简单了。</p><ul><li>计算 hash 值，找到 segment 数组中的具体位置，或我们前面用的“槽”</li><li>槽中也是一个数组，根据 hash 找到数组中具体的位置</li><li>到这里是链表了，顺着链表进行查找即可</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V get(Object key) {</span></span>
<span class="line"><span>    Segment&lt;K,V&gt; s; // manually integrate access methods to reduce overhead</span></span>
<span class="line"><span>    HashEntry&lt;K,V&gt;[] tab;</span></span>
<span class="line"><span>    // 1. hash 值</span></span>
<span class="line"><span>    int h = hash(key);</span></span>
<span class="line"><span>    long u = (((h &gt;&gt;&gt; segmentShift) &amp; segmentMask) &lt;&lt; SSHIFT) + SBASE;</span></span>
<span class="line"><span>    // 2. 根据 hash 找到对应的 segment</span></span>
<span class="line"><span>    if ((s = (Segment&lt;K,V&gt;)UNSAFE.getObjectVolatile(segments, u)) != null &amp;&amp;</span></span>
<span class="line"><span>        (tab = s.table) != null) {</span></span>
<span class="line"><span>        // 3. 找到segment 内部数组相应位置的链表，遍历</span></span>
<span class="line"><span>        for (HashEntry&lt;K,V&gt; e = (HashEntry&lt;K,V&gt;) UNSAFE.getObjectVolatile</span></span>
<span class="line"><span>                 (tab, ((long)(((tab.length - 1) &amp; h)) &lt;&lt; TSHIFT) + TBASE);</span></span>
<span class="line"><span>             e != null; e = e.next) {</span></span>
<span class="line"><span>            K k;</span></span>
<span class="line"><span>            if ((k = e.key) == key || (e.hash == h &amp;&amp; key.equals(k)))</span></span>
<span class="line"><span>                return e.value;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="并发问题分析" tabindex="-1">并发问题分析 <a class="header-anchor" href="#并发问题分析" aria-label="Permalink to &quot;并发问题分析&quot;">​</a></h3><p>现在我们已经说完了 put 过程和 get 过程，我们可以看到 get 过程中是没有加锁的，那自然我们就需要去考虑并发问题。</p><p>添加节点的操作 put 和删除节点的操作 remove 都是要加 segment 上的独占锁的，所以它们之间自然不会有问题，我们需要考虑的问题就是 get 的时候在同一个 segment 中发生了 put 或 remove 操作。</p><ul><li>put 操作的线程安全性。 <ul><li>初始化槽，这个我们之前就说过了，使用了 CAS 来初始化 Segment 中的数组。</li><li>添加节点到链表的操作是插入到表头的，所以，如果这个时候 get 操作在链表遍历的过程已经到了中间，是不会影响的。当然，另一个并发问题就是 get 操作在 put 之后，需要保证刚刚插入表头的节点被读取，这个依赖于 setEntryAt 方法中使用的 UNSAFE.putOrderedObject。</li><li>扩容。扩容是新创建了数组，然后进行迁移数据，最后面将 newTable 设置给属性 table。所以，如果 get 操作此时也在进行，那么也没关系，如果 get 先行，那么就是在旧的 table 上做查询操作；而 put 先行，那么 put 操作的可见性保证就是 table 使用了 volatile 关键字。</li></ul></li><li>remove 操作的线程安全性。 <ul><li>remove 操作我们没有分析源码，所以这里说的读者感兴趣的话还是需要到源码中去求实一下的。</li><li>get 操作需要遍历链表，但是 remove 操作会&quot;破坏&quot;链表。</li><li>如果 remove 破坏的节点 get 操作已经过去了，那么这里不存在任何问题。</li><li>如果 remove 先破坏了一个节点，分两种情况考虑。 1、如果此节点是头节点，那么需要将头节点的 next 设置为数组该位置的元素，table 虽然使用了 volatile 修饰，但是 volatile 并不能提供数组内部操作的可见性保证，所以源码中使用了 UNSAFE 来操作数组，请看方法 setEntryAt。2、如果要删除的节点不是头节点，它会将要删除节点的后继节点接到前驱节点中，这里的并发保证就是 next 属性是 volatile 的。</li></ul></li></ul><h2 id="concurrenthashmap-jdk-1-8" tabindex="-1">ConcurrentHashMap - JDK 1.8 <a class="header-anchor" href="#concurrenthashmap-jdk-1-8" aria-label="Permalink to &quot;ConcurrentHashMap - JDK 1.8&quot;">​</a></h2><p>在JDK1.7之前，ConcurrentHashMap是通过分段锁机制来实现的，所以其最大并发度受Segment的个数限制。因此，在JDK1.8中，ConcurrentHashMap的实现原理摒弃了这种设计，而是选择了与HashMap类似的数组+链表+红黑树的方式实现，而加锁则采用CAS和synchronized实现。</p><h3 id="数据结构-1" tabindex="-1">数据结构 <a class="header-anchor" href="#数据结构-1" aria-label="Permalink to &quot;数据结构&quot;">​</a></h3><p><img src="`+i+`" alt="error.图片加载失败"></p><p>结构上和 Java8 的 HashMap 基本上一样，不过它要保证线程安全性，所以在源码上确实要复杂一些。</p><h3 id="初始化-1" tabindex="-1">初始化 <a class="header-anchor" href="#初始化-1" aria-label="Permalink to &quot;初始化&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 这构造函数里，什么都不干</span></span>
<span class="line"><span>public ConcurrentHashMap() {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public ConcurrentHashMap(int initialCapacity) {</span></span>
<span class="line"><span>    if (initialCapacity &lt; 0)</span></span>
<span class="line"><span>        throw new IllegalArgumentException();</span></span>
<span class="line"><span>    int cap = ((initialCapacity &gt;= (MAXIMUM_CAPACITY &gt;&gt;&gt; 1)) ?</span></span>
<span class="line"><span>               MAXIMUM_CAPACITY :</span></span>
<span class="line"><span>               tableSizeFor(initialCapacity + (initialCapacity &gt;&gt;&gt; 1) + 1));</span></span>
<span class="line"><span>    this.sizeCtl = cap;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个初始化方法有点意思，通过提供初始容量，计算了 sizeCtl，sizeCtl = 【 (1.5 * initialCapacity + 1)，然后向上取最近的 2 的 n 次方】。如 initialCapacity 为 10，那么得到 sizeCtl 为 16，如果 initialCapacity 为 11，得到 sizeCtl 为 32。</p><p>sizeCtl 这个属性使用的场景很多，不过只要跟着文章的思路来，就不会被它搞晕了。</p><h3 id="put-过程分析-1" tabindex="-1">put 过程分析 <a class="header-anchor" href="#put-过程分析-1" aria-label="Permalink to &quot;put 过程分析&quot;">​</a></h3><p>仔细地一行一行代码看下去:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V put(K key, V value) {</span></span>
<span class="line"><span>    return putVal(key, value, false);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>final V putVal(K key, V value, boolean onlyIfAbsent) {</span></span>
<span class="line"><span>    if (key == null || value == null) throw new NullPointerException();</span></span>
<span class="line"><span>    // 得到 hash 值</span></span>
<span class="line"><span>    int hash = spread(key.hashCode());</span></span>
<span class="line"><span>    // 用于记录相应链表的长度</span></span>
<span class="line"><span>    int binCount = 0;</span></span>
<span class="line"><span>    for (Node&lt;K,V&gt;[] tab = table;;) {</span></span>
<span class="line"><span>        Node&lt;K,V&gt; f; int n, i, fh;</span></span>
<span class="line"><span>        // 如果数组&quot;空&quot;，进行数组初始化</span></span>
<span class="line"><span>        if (tab == null || (n = tab.length) == 0)</span></span>
<span class="line"><span>            // 初始化数组，后面会详细介绍</span></span>
<span class="line"><span>            tab = initTable();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 找该 hash 值对应的数组下标，得到第一个节点 f</span></span>
<span class="line"><span>        else if ((f = tabAt(tab, i = (n - 1) &amp; hash)) == null) {</span></span>
<span class="line"><span>            // 如果数组该位置为空，</span></span>
<span class="line"><span>            //    用一次 CAS 操作将这个新值放入其中即可，这个 put 操作差不多就结束了，可以拉到最后面了</span></span>
<span class="line"><span>            //          如果 CAS 失败，那就是有并发操作，进到下一个循环就好了</span></span>
<span class="line"><span>            if (casTabAt(tab, i, null,</span></span>
<span class="line"><span>                         new Node&lt;K,V&gt;(hash, key, value, null)))</span></span>
<span class="line"><span>                break;                   // no lock when adding to empty bin</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // hash 居然可以等于 MOVED，这个需要到后面才能看明白，不过从名字上也能猜到，肯定是因为在扩容</span></span>
<span class="line"><span>        else if ((fh = f.hash) == MOVED)</span></span>
<span class="line"><span>            // 帮助数据迁移，这个等到看完数据迁移部分的介绍后，再理解这个就很简单了</span></span>
<span class="line"><span>            tab = helpTransfer(tab, f);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        else { // 到这里就是说，f 是该位置的头节点，而且不为空</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            V oldVal = null;</span></span>
<span class="line"><span>            // 获取数组该位置的头节点的监视器锁</span></span>
<span class="line"><span>            synchronized (f) {</span></span>
<span class="line"><span>                if (tabAt(tab, i) == f) {</span></span>
<span class="line"><span>                    if (fh &gt;= 0) { // 头节点的 hash 值大于 0，说明是链表</span></span>
<span class="line"><span>                        // 用于累加，记录链表的长度</span></span>
<span class="line"><span>                        binCount = 1;</span></span>
<span class="line"><span>                        // 遍历链表</span></span>
<span class="line"><span>                        for (Node&lt;K,V&gt; e = f;; ++binCount) {</span></span>
<span class="line"><span>                            K ek;</span></span>
<span class="line"><span>                            // 如果发现了&quot;相等&quot;的 key，判断是否要进行值覆盖，然后也就可以 break 了</span></span>
<span class="line"><span>                            if (e.hash == hash &amp;&amp;</span></span>
<span class="line"><span>                                ((ek = e.key) == key ||</span></span>
<span class="line"><span>                                 (ek != null &amp;&amp; key.equals(ek)))) {</span></span>
<span class="line"><span>                                oldVal = e.val;</span></span>
<span class="line"><span>                                if (!onlyIfAbsent)</span></span>
<span class="line"><span>                                    e.val = value;</span></span>
<span class="line"><span>                                break;</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                            // 到了链表的最末端，将这个新值放到链表的最后面</span></span>
<span class="line"><span>                            Node&lt;K,V&gt; pred = e;</span></span>
<span class="line"><span>                            if ((e = e.next) == null) {</span></span>
<span class="line"><span>                                pred.next = new Node&lt;K,V&gt;(hash, key,</span></span>
<span class="line"><span>                                                          value, null);</span></span>
<span class="line"><span>                                break;</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    else if (f instanceof TreeBin) { // 红黑树</span></span>
<span class="line"><span>                        Node&lt;K,V&gt; p;</span></span>
<span class="line"><span>                        binCount = 2;</span></span>
<span class="line"><span>                        // 调用红黑树的插值方法插入新节点</span></span>
<span class="line"><span>                        if ((p = ((TreeBin&lt;K,V&gt;)f).putTreeVal(hash, key,</span></span>
<span class="line"><span>                                                       value)) != null) {</span></span>
<span class="line"><span>                            oldVal = p.val;</span></span>
<span class="line"><span>                            if (!onlyIfAbsent)</span></span>
<span class="line"><span>                                p.val = value;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (binCount != 0) {</span></span>
<span class="line"><span>                // 判断是否要将链表转换为红黑树，临界值和 HashMap 一样，也是 8</span></span>
<span class="line"><span>                if (binCount &gt;= TREEIFY_THRESHOLD)</span></span>
<span class="line"><span>                    // 这个方法和 HashMap 中稍微有一点点不同，那就是它不是一定会进行红黑树转换，</span></span>
<span class="line"><span>                    // 如果当前数组的长度小于 64，那么会选择进行数组扩容，而不是转换为红黑树</span></span>
<span class="line"><span>                    //    具体源码我们就不看了，扩容部分后面说</span></span>
<span class="line"><span>                    treeifyBin(tab, i);</span></span>
<span class="line"><span>                if (oldVal != null)</span></span>
<span class="line"><span>                    return oldVal;</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // </span></span>
<span class="line"><span>    addCount(1L, binCount);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="初始化数组-inittable" tabindex="-1">初始化数组: initTable <a class="header-anchor" href="#初始化数组-inittable" aria-label="Permalink to &quot;初始化数组: initTable&quot;">​</a></h3><p>这个比较简单，主要就是初始化一个合适大小的数组，然后会设置 sizeCtl。</p><p>初始化方法中的并发问题是通过对 sizeCtl 进行一个 CAS 操作来控制的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final Node&lt;K,V&gt;[] initTable() {</span></span>
<span class="line"><span>    Node&lt;K,V&gt;[] tab; int sc;</span></span>
<span class="line"><span>    while ((tab = table) == null || tab.length == 0) {</span></span>
<span class="line"><span>        // 初始化的&quot;功劳&quot;被其他线程&quot;抢去&quot;了</span></span>
<span class="line"><span>        if ((sc = sizeCtl) &lt; 0)</span></span>
<span class="line"><span>            Thread.yield(); // lost initialization race; just spin</span></span>
<span class="line"><span>        // CAS 一下，将 sizeCtl 设置为 -1，代表抢到了锁</span></span>
<span class="line"><span>        else if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                if ((tab = table) == null || tab.length == 0) {</span></span>
<span class="line"><span>                    // DEFAULT_CAPACITY 默认初始容量是 16</span></span>
<span class="line"><span>                    int n = (sc &gt; 0) ? sc : DEFAULT_CAPACITY;</span></span>
<span class="line"><span>                    // 初始化数组，长度为 16 或初始化时提供的长度</span></span>
<span class="line"><span>                    Node&lt;K,V&gt;[] nt = (Node&lt;K,V&gt;[])new Node&lt;?,?&gt;[n];</span></span>
<span class="line"><span>                    // 将这个数组赋值给 table，table 是 volatile 的</span></span>
<span class="line"><span>                    table = tab = nt;</span></span>
<span class="line"><span>                    // 如果 n 为 16 的话，那么这里 sc = 12</span></span>
<span class="line"><span>                    // 其实就是 0.75 * n</span></span>
<span class="line"><span>                    sc = n - (n &gt;&gt;&gt; 2);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                // 设置 sizeCtl 为 sc，我们就当是 12 吧</span></span>
<span class="line"><span>                sizeCtl = sc;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return tab;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="链表转红黑树-treeifybin" tabindex="-1">链表转红黑树: treeifyBin <a class="header-anchor" href="#链表转红黑树-treeifybin" aria-label="Permalink to &quot;链表转红黑树: treeifyBin&quot;">​</a></h3><p>前面我们在 put 源码分析也说过，treeifyBin 不一定就会进行红黑树转换，也可能是仅仅做数组扩容。我们还是进行源码分析吧。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final void treeifyBin(Node&lt;K,V&gt;[] tab, int index) {</span></span>
<span class="line"><span>    Node&lt;K,V&gt; b; int n, sc;</span></span>
<span class="line"><span>    if (tab != null) {</span></span>
<span class="line"><span>        // MIN_TREEIFY_CAPACITY 为 64</span></span>
<span class="line"><span>        // 所以，如果数组长度小于 64 的时候，其实也就是 32 或者 16 或者更小的时候，会进行数组扩容</span></span>
<span class="line"><span>        if ((n = tab.length) &lt; MIN_TREEIFY_CAPACITY)</span></span>
<span class="line"><span>            // 后面我们再详细分析这个方法</span></span>
<span class="line"><span>            tryPresize(n &lt;&lt; 1);</span></span>
<span class="line"><span>        // b 是头节点</span></span>
<span class="line"><span>        else if ((b = tabAt(tab, index)) != null &amp;&amp; b.hash &gt;= 0) {</span></span>
<span class="line"><span>            // 加锁</span></span>
<span class="line"><span>            synchronized (b) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (tabAt(tab, index) == b) {</span></span>
<span class="line"><span>                    // 下面就是遍历链表，建立一颗红黑树</span></span>
<span class="line"><span>                    TreeNode&lt;K,V&gt; hd = null, tl = null;</span></span>
<span class="line"><span>                    for (Node&lt;K,V&gt; e = b; e != null; e = e.next) {</span></span>
<span class="line"><span>                        TreeNode&lt;K,V&gt; p =</span></span>
<span class="line"><span>                            new TreeNode&lt;K,V&gt;(e.hash, e.key, e.val,</span></span>
<span class="line"><span>                                              null, null);</span></span>
<span class="line"><span>                        if ((p.prev = tl) == null)</span></span>
<span class="line"><span>                            hd = p;</span></span>
<span class="line"><span>                        else</span></span>
<span class="line"><span>                            tl.next = p;</span></span>
<span class="line"><span>                        tl = p;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    // 将红黑树设置到数组相应位置中</span></span>
<span class="line"><span>                    setTabAt(tab, index, new TreeBin&lt;K,V&gt;(hd));</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="扩容-trypresize" tabindex="-1">扩容: tryPresize <a class="header-anchor" href="#扩容-trypresize" aria-label="Permalink to &quot;扩容: tryPresize&quot;">​</a></h3><p>如果说 Java8 ConcurrentHashMap 的源码不简单，那么说的就是扩容操作和迁移操作。</p><p>这个方法要完完全全看懂还需要看之后的 transfer 方法，读者应该提前知道这点。</p><p>这里的扩容也是做翻倍扩容的，扩容后数组容量为原来的 2 倍。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 首先要说明的是，方法参数 size 传进来的时候就已经翻了倍了</span></span>
<span class="line"><span>private final void tryPresize(int size) {</span></span>
<span class="line"><span>    // c: size 的 1.5 倍，再加 1，再往上取最近的 2 的 n 次方。</span></span>
<span class="line"><span>    int c = (size &gt;= (MAXIMUM_CAPACITY &gt;&gt;&gt; 1)) ? MAXIMUM_CAPACITY :</span></span>
<span class="line"><span>        tableSizeFor(size + (size &gt;&gt;&gt; 1) + 1);</span></span>
<span class="line"><span>    int sc;</span></span>
<span class="line"><span>    while ((sc = sizeCtl) &gt;= 0) {</span></span>
<span class="line"><span>        Node&lt;K,V&gt;[] tab = table; int n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 这个 if 分支和之前说的初始化数组的代码基本上是一样的，在这里，我们可以不用管这块代码</span></span>
<span class="line"><span>        if (tab == null || (n = tab.length) == 0) {</span></span>
<span class="line"><span>            n = (sc &gt; c) ? sc : c;</span></span>
<span class="line"><span>            if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    if (table == tab) {</span></span>
<span class="line"><span>                        @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>                        Node&lt;K,V&gt;[] nt = (Node&lt;K,V&gt;[])new Node&lt;?,?&gt;[n];</span></span>
<span class="line"><span>                        table = nt;</span></span>
<span class="line"><span>                        sc = n - (n &gt;&gt;&gt; 2); // 0.75 * n</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } finally {</span></span>
<span class="line"><span>                    sizeCtl = sc;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (c &lt;= sc || n &gt;= MAXIMUM_CAPACITY)</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        else if (tab == table) {</span></span>
<span class="line"><span>            // 我没看懂 rs 的真正含义是什么，不过也关系不大</span></span>
<span class="line"><span>            int rs = resizeStamp(n);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (sc &lt; 0) {</span></span>
<span class="line"><span>                Node&lt;K,V&gt;[] nt;</span></span>
<span class="line"><span>                if ((sc &gt;&gt;&gt; RESIZE_STAMP_SHIFT) != rs || sc == rs + 1 ||</span></span>
<span class="line"><span>                    sc == rs + MAX_RESIZERS || (nt = nextTable) == null ||</span></span>
<span class="line"><span>                    transferIndex &lt;= 0)</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                // 2. 用 CAS 将 sizeCtl 加 1，然后执行 transfer 方法</span></span>
<span class="line"><span>                //    此时 nextTab 不为 null</span></span>
<span class="line"><span>                if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1))</span></span>
<span class="line"><span>                    transfer(tab, nt);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 1. 将 sizeCtl 设置为 (rs &lt;&lt; RESIZE_STAMP_SHIFT) + 2)</span></span>
<span class="line"><span>            //     我是没看懂这个值真正的意义是什么? 不过可以计算出来的是，结果是一个比较大的负数</span></span>
<span class="line"><span>            //  调用 transfer 方法，此时 nextTab 参数为 null</span></span>
<span class="line"><span>            else if (U.compareAndSwapInt(this, SIZECTL, sc,</span></span>
<span class="line"><span>                                         (rs &lt;&lt; RESIZE_STAMP_SHIFT) + 2))</span></span>
<span class="line"><span>                transfer(tab, null);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法的核心在于 sizeCtl 值的操作，首先将其设置为一个负数，然后执行 transfer(tab, null)，再下一个循环将 sizeCtl 加 1，并执行 transfer(tab, nt)，之后可能是继续 sizeCtl 加 1，并执行 transfer(tab, nt)。</p><p>所以，可能的操作就是执行 1 次 transfer(tab, null) + 多次 transfer(tab, nt)，这里怎么结束循环的需要看完 transfer 源码才清楚。</p><h3 id="数据迁移-transfer" tabindex="-1">数据迁移: transfer <a class="header-anchor" href="#数据迁移-transfer" aria-label="Permalink to &quot;数据迁移: transfer&quot;">​</a></h3><p>下面这个方法有点长，将原来的 tab 数组的元素迁移到新的 nextTab 数组中。</p><p>虽然我们之前说的 tryPresize 方法中多次调用 transfer 不涉及多线程，但是这个 transfer 方法可以在其他地方被调用，典型地，我们之前在说 put 方法的时候就说过了，请往上看 put 方法，是不是有个地方调用了 helpTransfer 方法，helpTransfer 方法会调用 transfer 方法的。</p><p>此方法支持多线程执行，外围调用此方法的时候，会保证第一个发起数据迁移的线程，nextTab 参数为 null，之后再调用此方法的时候，nextTab 不会为 null。</p><p>阅读源码之前，先要理解并发操作的机制。原数组长度为 n，所以我们有 n 个迁移任务，让每个线程每次负责一个小任务是最简单的，每做完一个任务再检测是否有其他没做完的任务，帮助迁移就可以了，而 Doug Lea 使用了一个 stride，简单理解就是步长，每个线程每次负责迁移其中的一部分，如每次迁移 16 个小任务。所以，我们就需要一个全局的调度者来安排哪个线程执行哪几个任务，这个就是属性 transferIndex 的作用。</p><p>第一个发起数据迁移的线程会将 transferIndex 指向原数组最后的位置，然后从后往前的 stride 个任务属于第一个线程，然后将 transferIndex 指向新的位置，再往前的 stride 个任务属于第二个线程，依此类推。当然，这里说的第二个线程不是真的一定指代了第二个线程，也可以是同一个线程，这个读者应该能理解吧。其实就是将一个大的迁移任务分为了一个个任务包。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final void transfer(Node&lt;K,V&gt;[] tab, Node&lt;K,V&gt;[] nextTab) {</span></span>
<span class="line"><span>    int n = tab.length, stride;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // stride 在单核下直接等于 n，多核模式下为 (n&gt;&gt;&gt;3)/NCPU，最小值是 16</span></span>
<span class="line"><span>    // stride 可以理解为”步长“，有 n 个位置是需要进行迁移的，</span></span>
<span class="line"><span>    //   将这 n 个任务分为多个任务包，每个任务包有 stride 个任务</span></span>
<span class="line"><span>    if ((stride = (NCPU &gt; 1) ? (n &gt;&gt;&gt; 3) / NCPU : n) &lt; MIN_TRANSFER_STRIDE)</span></span>
<span class="line"><span>        stride = MIN_TRANSFER_STRIDE; // subdivide range</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 如果 nextTab 为 null，先进行一次初始化</span></span>
<span class="line"><span>    //    前面我们说了，外围会保证第一个发起迁移的线程调用此方法时，参数 nextTab 为 null</span></span>
<span class="line"><span>    //       之后参与迁移的线程调用此方法时，nextTab 不会为 null</span></span>
<span class="line"><span>    if (nextTab == null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 容量翻倍</span></span>
<span class="line"><span>            Node&lt;K,V&gt;[] nt = (Node&lt;K,V&gt;[])new Node&lt;?,?&gt;[n &lt;&lt; 1];</span></span>
<span class="line"><span>            nextTab = nt;</span></span>
<span class="line"><span>        } catch (Throwable ex) {      // try to cope with OOME</span></span>
<span class="line"><span>            sizeCtl = Integer.MAX_VALUE;</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // nextTable 是 ConcurrentHashMap 中的属性</span></span>
<span class="line"><span>        nextTable = nextTab;</span></span>
<span class="line"><span>        // transferIndex 也是 ConcurrentHashMap 的属性，用于控制迁移的位置</span></span>
<span class="line"><span>        transferIndex = n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int nextn = nextTab.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ForwardingNode 翻译过来就是正在被迁移的 Node</span></span>
<span class="line"><span>    // 这个构造方法会生成一个Node，key、value 和 next 都为 null，关键是 hash 为 MOVED</span></span>
<span class="line"><span>    // 后面我们会看到，原数组中位置 i 处的节点完成迁移工作后，</span></span>
<span class="line"><span>    //    就会将位置 i 处设置为这个 ForwardingNode，用来告诉其他线程该位置已经处理过了</span></span>
<span class="line"><span>    //    所以它其实相当于是一个标志。</span></span>
<span class="line"><span>    ForwardingNode&lt;K,V&gt; fwd = new ForwardingNode&lt;K,V&gt;(nextTab);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // advance 指的是做完了一个位置的迁移工作，可以准备做下一个位置的了</span></span>
<span class="line"><span>    boolean advance = true;</span></span>
<span class="line"><span>    boolean finishing = false; // to ensure sweep before committing nextTab</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 下面这个 for 循环，最难理解的在前面，而要看懂它们，应该先看懂后面的，然后再倒回来看</span></span>
<span class="line"><span>     * </span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // i 是位置索引，bound 是边界，注意是从后往前</span></span>
<span class="line"><span>    for (int i = 0, bound = 0;;) {</span></span>
<span class="line"><span>        Node&lt;K,V&gt; f; int fh;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 下面这个 while 真的是不好理解</span></span>
<span class="line"><span>        // advance 为 true 表示可以进行下一个位置的迁移了</span></span>
<span class="line"><span>        //   简单理解结局: i 指向了 transferIndex，bound 指向了 transferIndex-stride</span></span>
<span class="line"><span>        while (advance) {</span></span>
<span class="line"><span>            int nextIndex, nextBound;</span></span>
<span class="line"><span>            if (--i &gt;= bound || finishing)</span></span>
<span class="line"><span>                advance = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 将 transferIndex 值赋给 nextIndex</span></span>
<span class="line"><span>            // 这里 transferIndex 一旦小于等于 0，说明原数组的所有位置都有相应的线程去处理了</span></span>
<span class="line"><span>            else if ((nextIndex = transferIndex) &lt;= 0) {</span></span>
<span class="line"><span>                i = -1;</span></span>
<span class="line"><span>                advance = false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (U.compareAndSwapInt</span></span>
<span class="line"><span>                     (this, TRANSFERINDEX, nextIndex,</span></span>
<span class="line"><span>                      nextBound = (nextIndex &gt; stride ?</span></span>
<span class="line"><span>                                   nextIndex - stride : 0))) {</span></span>
<span class="line"><span>                // 看括号中的代码，nextBound 是这次迁移任务的边界，注意，是从后往前</span></span>
<span class="line"><span>                bound = nextBound;</span></span>
<span class="line"><span>                i = nextIndex - 1;</span></span>
<span class="line"><span>                advance = false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (i &lt; 0 || i &gt;= n || i + n &gt;= nextn) {</span></span>
<span class="line"><span>            int sc;</span></span>
<span class="line"><span>            if (finishing) {</span></span>
<span class="line"><span>                // 所有的迁移操作已经完成</span></span>
<span class="line"><span>                nextTable = null;</span></span>
<span class="line"><span>                // 将新的 nextTab 赋值给 table 属性，完成迁移</span></span>
<span class="line"><span>                table = nextTab;</span></span>
<span class="line"><span>                // 重新计算 sizeCtl: n 是原数组长度，所以 sizeCtl 得出的值将是新数组长度的 0.75 倍</span></span>
<span class="line"><span>                sizeCtl = (n &lt;&lt; 1) - (n &gt;&gt;&gt; 1);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 之前我们说过，sizeCtl 在迁移前会设置为 (rs &lt;&lt; RESIZE_STAMP_SHIFT) + 2</span></span>
<span class="line"><span>            // 然后，每有一个线程参与迁移就会将 sizeCtl 加 1，</span></span>
<span class="line"><span>            // 这里使用 CAS 操作对 sizeCtl 进行减 1，代表做完了属于自己的任务</span></span>
<span class="line"><span>            if (U.compareAndSwapInt(this, SIZECTL, sc = sizeCtl, sc - 1)) {</span></span>
<span class="line"><span>                // 任务结束，方法退出</span></span>
<span class="line"><span>                if ((sc - 2) != resizeStamp(n) &lt;&lt; RESIZE_STAMP_SHIFT)</span></span>
<span class="line"><span>                    return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                // 到这里，说明 (sc - 2) == resizeStamp(n) &lt;&lt; RESIZE_STAMP_SHIFT，</span></span>
<span class="line"><span>                // 也就是说，所有的迁移任务都做完了，也就会进入到上面的 if(finishing){} 分支了</span></span>
<span class="line"><span>                finishing = advance = true;</span></span>
<span class="line"><span>                i = n; // recheck before commit</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 如果位置 i 处是空的，没有任何节点，那么放入刚刚初始化的 ForwardingNode ”空节点“</span></span>
<span class="line"><span>        else if ((f = tabAt(tab, i)) == null)</span></span>
<span class="line"><span>            advance = casTabAt(tab, i, null, fwd);</span></span>
<span class="line"><span>        // 该位置处是一个 ForwardingNode，代表该位置已经迁移过了</span></span>
<span class="line"><span>        else if ((fh = f.hash) == MOVED)</span></span>
<span class="line"><span>            advance = true; // already processed</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            // 对数组该位置处的结点加锁，开始处理数组该位置处的迁移工作</span></span>
<span class="line"><span>            synchronized (f) {</span></span>
<span class="line"><span>                if (tabAt(tab, i) == f) {</span></span>
<span class="line"><span>                    Node&lt;K,V&gt; ln, hn;</span></span>
<span class="line"><span>                    // 头节点的 hash 大于 0，说明是链表的 Node 节点</span></span>
<span class="line"><span>                    if (fh &gt;= 0) {</span></span>
<span class="line"><span>                        // 下面这一块和 Java7 中的 ConcurrentHashMap 迁移是差不多的，</span></span>
<span class="line"><span>                        // 需要将链表一分为二，</span></span>
<span class="line"><span>                        //   找到原链表中的 lastRun，然后 lastRun 及其之后的节点是一起进行迁移的</span></span>
<span class="line"><span>                        //   lastRun 之前的节点需要进行克隆，然后分到两个链表中</span></span>
<span class="line"><span>                        int runBit = fh &amp; n;</span></span>
<span class="line"><span>                        Node&lt;K,V&gt; lastRun = f;</span></span>
<span class="line"><span>                        for (Node&lt;K,V&gt; p = f.next; p != null; p = p.next) {</span></span>
<span class="line"><span>                            int b = p.hash &amp; n;</span></span>
<span class="line"><span>                            if (b != runBit) {</span></span>
<span class="line"><span>                                runBit = b;</span></span>
<span class="line"><span>                                lastRun = p;</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        if (runBit == 0) {</span></span>
<span class="line"><span>                            ln = lastRun;</span></span>
<span class="line"><span>                            hn = null;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        else {</span></span>
<span class="line"><span>                            hn = lastRun;</span></span>
<span class="line"><span>                            ln = null;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        for (Node&lt;K,V&gt; p = f; p != lastRun; p = p.next) {</span></span>
<span class="line"><span>                            int ph = p.hash; K pk = p.key; V pv = p.val;</span></span>
<span class="line"><span>                            if ((ph &amp; n) == 0)</span></span>
<span class="line"><span>                                ln = new Node&lt;K,V&gt;(ph, pk, pv, ln);</span></span>
<span class="line"><span>                            else</span></span>
<span class="line"><span>                                hn = new Node&lt;K,V&gt;(ph, pk, pv, hn);</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        // 其中的一个链表放在新数组的位置 i</span></span>
<span class="line"><span>                        setTabAt(nextTab, i, ln);</span></span>
<span class="line"><span>                        // 另一个链表放在新数组的位置 i+n</span></span>
<span class="line"><span>                        setTabAt(nextTab, i + n, hn);</span></span>
<span class="line"><span>                        // 将原数组该位置处设置为 fwd，代表该位置已经处理完毕，</span></span>
<span class="line"><span>                        //    其他线程一旦看到该位置的 hash 值为 MOVED，就不会进行迁移了</span></span>
<span class="line"><span>                        setTabAt(tab, i, fwd);</span></span>
<span class="line"><span>                        // advance 设置为 true，代表该位置已经迁移完毕</span></span>
<span class="line"><span>                        advance = true;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    else if (f instanceof TreeBin) {</span></span>
<span class="line"><span>                        // 红黑树的迁移</span></span>
<span class="line"><span>                        TreeBin&lt;K,V&gt; t = (TreeBin&lt;K,V&gt;)f;</span></span>
<span class="line"><span>                        TreeNode&lt;K,V&gt; lo = null, loTail = null;</span></span>
<span class="line"><span>                        TreeNode&lt;K,V&gt; hi = null, hiTail = null;</span></span>
<span class="line"><span>                        int lc = 0, hc = 0;</span></span>
<span class="line"><span>                        for (Node&lt;K,V&gt; e = t.first; e != null; e = e.next) {</span></span>
<span class="line"><span>                            int h = e.hash;</span></span>
<span class="line"><span>                            TreeNode&lt;K,V&gt; p = new TreeNode&lt;K,V&gt;</span></span>
<span class="line"><span>                                (h, e.key, e.val, null, null);</span></span>
<span class="line"><span>                            if ((h &amp; n) == 0) {</span></span>
<span class="line"><span>                                if ((p.prev = loTail) == null)</span></span>
<span class="line"><span>                                    lo = p;</span></span>
<span class="line"><span>                                else</span></span>
<span class="line"><span>                                    loTail.next = p;</span></span>
<span class="line"><span>                                loTail = p;</span></span>
<span class="line"><span>                                ++lc;</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                            else {</span></span>
<span class="line"><span>                                if ((p.prev = hiTail) == null)</span></span>
<span class="line"><span>                                    hi = p;</span></span>
<span class="line"><span>                                else</span></span>
<span class="line"><span>                                    hiTail.next = p;</span></span>
<span class="line"><span>                                hiTail = p;</span></span>
<span class="line"><span>                                ++hc;</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        // 如果一分为二后，节点数小于等于6，那么将红黑树转换回链表</span></span>
<span class="line"><span>                        ln = (lc &lt;= UNTREEIFY_THRESHOLD) ? untreeify(lo) :</span></span>
<span class="line"><span>                            (hc != 0) ? new TreeBin&lt;K,V&gt;(lo) : t;</span></span>
<span class="line"><span>                        hn = (hc &lt;= UNTREEIFY_THRESHOLD) ? untreeify(hi) :</span></span>
<span class="line"><span>                            (lc != 0) ? new TreeBin&lt;K,V&gt;(hi) : t;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                        // 将 ln 放置在新数组的位置 i</span></span>
<span class="line"><span>                        setTabAt(nextTab, i, ln);</span></span>
<span class="line"><span>                        // 将 hn 放置在新数组的位置 i+n</span></span>
<span class="line"><span>                        setTabAt(nextTab, i + n, hn);</span></span>
<span class="line"><span>                        // 将原数组该位置处设置为 fwd，代表该位置已经处理完毕，</span></span>
<span class="line"><span>                        //    其他线程一旦看到该位置的 hash 值为 MOVED，就不会进行迁移了</span></span>
<span class="line"><span>                        setTabAt(tab, i, fwd);</span></span>
<span class="line"><span>                        // advance 设置为 true，代表该位置已经迁移完毕</span></span>
<span class="line"><span>                        advance = true;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说到底，transfer 这个方法并没有实现所有的迁移任务，每次调用这个方法只实现了 transferIndex 往前 stride 个位置的迁移工作，其他的需要由外围来控制。</p><p>这个时候，再回去仔细看 tryPresize 方法可能就会更加清晰一些了。</p><h3 id="get-过程分析-1" tabindex="-1">get 过程分析 <a class="header-anchor" href="#get-过程分析-1" aria-label="Permalink to &quot;get 过程分析&quot;">​</a></h3><p>get 方法从来都是最简单的，这里也不例外:</p><ul><li>计算 hash 值</li><li>根据 hash 值找到数组对应位置: (n - 1) &amp; h</li><li>根据该位置处结点性质进行相应查找 <ul><li>如果该位置为 null，那么直接返回 null 就可以了</li><li>如果该位置处的节点刚好就是我们需要的，返回该节点的值即可</li><li>如果该位置节点的 hash 值小于 0，说明正在扩容，或者是红黑树，后面我们再介绍 find 方法</li><li>如果以上 3 条都不满足，那就是链表，进行遍历比对即可</li></ul></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V get(Object key) {</span></span>
<span class="line"><span>    Node&lt;K,V&gt;[] tab; Node&lt;K,V&gt; e, p; int n, eh; K ek;</span></span>
<span class="line"><span>    int h = spread(key.hashCode());</span></span>
<span class="line"><span>    if ((tab = table) != null &amp;&amp; (n = tab.length) &gt; 0 &amp;&amp;</span></span>
<span class="line"><span>        (e = tabAt(tab, (n - 1) &amp; h)) != null) {</span></span>
<span class="line"><span>        // 判断头节点是否就是我们需要的节点</span></span>
<span class="line"><span>        if ((eh = e.hash) == h) {</span></span>
<span class="line"><span>            if ((ek = e.key) == key || (ek != null &amp;&amp; key.equals(ek)))</span></span>
<span class="line"><span>                return e.val;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 如果头节点的 hash 小于 0，说明 正在扩容，或者该位置是红黑树</span></span>
<span class="line"><span>        else if (eh &lt; 0)</span></span>
<span class="line"><span>            // 参考 ForwardingNode.find(int h, Object k) 和 TreeBin.find(int h, Object k)</span></span>
<span class="line"><span>            return (p = e.find(h, key)) != null ? p.val : null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 遍历链表</span></span>
<span class="line"><span>        while ((e = e.next) != null) {</span></span>
<span class="line"><span>            if (e.hash == h &amp;&amp;</span></span>
<span class="line"><span>                ((ek = e.key) == key || (ek != null &amp;&amp; key.equals(ek))))</span></span>
<span class="line"><span>                return e.val;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>简单说一句，此方法的大部分内容都很简单，只有正好碰到扩容的情况，ForwardingNode.find(int h, Object k) 稍微复杂一些，不过在了解了数据迁移的过程后，这个也就不难了，所以限于篇幅这里也不展开说了。</p><h2 id="对比总结" tabindex="-1">对比总结 <a class="header-anchor" href="#对比总结" aria-label="Permalink to &quot;对比总结&quot;">​</a></h2><ul><li><code>HashTable</code> : 使用了synchronized关键字对put等操作进行加锁;</li><li><code>ConcurrentHashMap JDK1.7</code>: 使用分段锁机制实现;</li><li><code>ConcurrentHashMap JDK1.8</code>: 则使用数组+链表+红黑树数据结构和CAS原子操作实现;</li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://blog.csdn.net/defonds/article/details/44021605#t7" target="_blank" rel="noreferrer">https://blog.csdn.net/defonds/article/details/44021605#t7</a></li><li><a href="http://tutorials.jenkov.com/java-concurrency/index.html" target="_blank" rel="noreferrer">http://tutorials.jenkov.com/java-concurrency/index.html</a></li><li><a href="https://juejin.im/post/5aeeaba8f265da0b9d781d16" target="_blank" rel="noreferrer">https://juejin.im/post/5aeeaba8f265da0b9d781d16</a></li><li><a href="https://www.javadoop.com/post/hashmap#Java7%20ConcurrentHashMap" target="_blank" rel="noreferrer">https://www.javadoop.com/post/hashmap#Java7 ConcurrentHashMap</a></li><li><a href="https://blog.csdn.net/Bill%5C_Xiang%5C_/article/details/81122044" target="_blank" rel="noreferrer">https://blog.csdn.net/Bill\\_Xiang\\_/article/details/81122044</a></li><li><a href="https://www.cnblogs.com/leesf456/p/5453341.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5453341.html</a></li><li><a href="https://www.cnblogs.com/huaizuo/archive/2016/04/20/5413069.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/huaizuo/archive/2016/04/20/5413069.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,103)]))}const m=a(t,[["render",c]]);export{f as __pageData,m as default};
