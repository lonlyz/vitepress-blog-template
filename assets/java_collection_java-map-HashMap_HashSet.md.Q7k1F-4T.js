import{_ as s,a as n}from"./chunks/java-collection-hashmap8.CNPYObvB.js";import{_ as p,c as e,ai as l,o as t}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/collection/HashMap_getEntry.png",c="/vitepress-blog-template/images/collection/HashMap_addEntry.png",o="/vitepress-blog-template/images/collection/HashMap_removeEntryForKey.png",v=JSON.parse('{"title":"Map - HashSet & HashMap 源码解析","description":"","frontmatter":{},"headers":[],"relativePath":"java/collection/java-map-HashMap&HashSet.md","filePath":"java/collection/java-map-HashMap&HashSet.md","lastUpdated":1737706346000}'),h={name:"java/collection/java-map-HashMap&HashSet.md"};function d(r,a,u,b,g,k){return t(),e("div",null,a[0]||(a[0]=[l('<h1 id="map-hashset-hashmap-源码解析" tabindex="-1">Map - HashSet &amp; HashMap 源码解析 <a class="header-anchor" href="#map-hashset-hashmap-源码解析" aria-label="Permalink to &quot;Map - HashSet &amp; HashMap 源码解析&quot;">​</a></h1><blockquote><p>本文主要对Map - HashSet &amp; HashMap进行源码解析。@pdai</p></blockquote><h2 id="java7-hashmap" tabindex="-1">Java7 HashMap <a class="header-anchor" href="#java7-hashmap" aria-label="Permalink to &quot;Java7 HashMap&quot;">​</a></h2><h3 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h3><p>之所以把_HashSet_和_HashMap_放在一起讲解，是因为二者在Java里有着相同的实现，前者仅仅是对后者做了一层包装，也就是说_HashSet_里面有一个_HashMap_(适配器模式)。因此本文将重点分析_HashMap_。</p><p>_HashMap_实现了_Map_接口，即允许放入<code>key</code>为<code>null</code>的元素，也允许插入<code>value</code>为<code>null</code>的元素；除该类未实现同步外，其余跟<code>Hashtable</code>大致相同；跟_TreeMap_不同，该容器不保证元素顺序，根据需要该容器可能会对元素重新哈希，元素的顺序也会被重新打散，因此不同时间迭代同一个_HashMap_的顺序可能会不同。 根据对冲突的处理方式不同，哈希表有两种实现方式，一种开放地址方式(Open addressing)，另一种是冲突链表方式(Separate chaining with linked lists)。<strong>Java7 _HashMap_采用的是冲突链表方式</strong>。</p><p><img src="'+s+'" alt="HashMap_base"></p><p>从上图容易看出，如果选择合适的哈希函数，<code>put()</code>和<code>get()</code>方法可以在常数时间内完成。但在对_HashMap_进行迭代时，需要遍历整个table以及后面跟的冲突链表。因此对于迭代比较频繁的场景，不宜将_HashMap_的初始大小设的过大。</p><p>有两个参数可以影响_HashMap_的性能: 初始容量(inital capacity)和负载系数(load factor)。初始容量指定了初始<code>table</code>的大小，负载系数用来指定自动扩容的临界值。当<code>entry</code>的数量超过<code>capacity*load_factor</code>时，容器将自动扩容并重新哈希。对于插入元素较多的场景，将初始容量设大可以减少重新哈希的次数。</p><p>将对象放入到_HashMap_或_HashSet_中时，有两个方法需要特别关心: <code>hashCode()</code>和<code>equals()</code>。<strong><code>hashCode()</code>方法决定了对象会被放到哪个<code>bucket</code>里，当多个对象的哈希值冲突时，<code>equals()</code>方法决定了这些对象是否是“同一个对象”</strong>。所以，如果要将自定义的对象放入到<code>HashMap</code>或<code>HashSet</code>中，需要**@Override** <code>hashCode()</code>和<code>equals()</code>方法。</p><h3 id="get" tabindex="-1">get() <a class="header-anchor" href="#get" aria-label="Permalink to &quot;get()&quot;">​</a></h3><p><code>get(Object key)</code>方法根据指定的<code>key</code>值返回对应的<code>value</code>，该方法调用了<code>getEntry(Object key)</code>得到相应的<code>entry</code>，然后返回<code>entry.getValue()</code>。因此<code>getEntry()</code>是算法的核心。 算法思想是首先通过<code>hash()</code>函数得到对应<code>bucket</code>的下标，然后依次遍历冲突链表，通过<code>key.equals(k)</code>方法来判断是否是要找的那个<code>entry</code>。</p><p><img src="'+i+`" alt="HashMap_getEntry"></p><p>上图中<code>hash(k)&amp;(table.length-1)</code>等价于<code>hash(k)%table.length</code>，原因是_HashMap_要求<code>table.length</code>必须是2的指数，因此<code>table.length-1</code>就是二进制低位全是1，跟<code>hash(k)</code>相与会将哈希值的高位全抹掉，剩下的就是余数了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//getEntry()方法</span></span>
<span class="line"><span>final Entry&lt;K,V&gt; getEntry(Object key) {</span></span>
<span class="line"><span>	......</span></span>
<span class="line"><span>	int hash = (key == null) ? 0 : hash(key);</span></span>
<span class="line"><span>    for (Entry&lt;K,V&gt; e = table[hash&amp;(table.length-1)];//得到冲突链表</span></span>
<span class="line"><span>         e != null; e = e.next) {//依次遍历冲突链表中的每个entry</span></span>
<span class="line"><span>        Object k;</span></span>
<span class="line"><span>        //依据equals()方法判断是否相等</span></span>
<span class="line"><span>        if (e.hash == hash &amp;&amp;</span></span>
<span class="line"><span>            ((k = e.key) == key || (key != null &amp;&amp; key.equals(k))))</span></span>
<span class="line"><span>            return e;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="put" tabindex="-1">put() <a class="header-anchor" href="#put" aria-label="Permalink to &quot;put()&quot;">​</a></h3><p><code>put(K key, V value)</code>方法是将指定的<code>key, value</code>对添加到<code>map</code>里。该方法首先会对<code>map</code>做一次查找，看是否包含该元组，如果已经包含则直接返回，查找过程类似于<code>getEntry()</code>方法；如果没有找到，则会通过<code>addEntry(int hash, K key, V value, int bucketIndex)</code>方法插入新的<code>entry</code>，插入方式为<strong>头插法</strong>。</p><p><img src="`+c+`" alt="HashMap_addEntry"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//addEntry()</span></span>
<span class="line"><span>void addEntry(int hash, K key, V value, int bucketIndex) {</span></span>
<span class="line"><span>    if ((size &gt;= threshold) &amp;&amp; (null != table[bucketIndex])) {</span></span>
<span class="line"><span>        resize(2 * table.length);//自动扩容，并重新哈希</span></span>
<span class="line"><span>        hash = (null != key) ? hash(key) : 0;</span></span>
<span class="line"><span>        bucketIndex = hash &amp; (table.length-1);//hash%table.length</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //在冲突链表头部插入新的entry</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; e = table[bucketIndex];</span></span>
<span class="line"><span>    table[bucketIndex] = new Entry&lt;&gt;(hash, key, value, e);</span></span>
<span class="line"><span>    size++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="remove" tabindex="-1">remove() <a class="header-anchor" href="#remove" aria-label="Permalink to &quot;remove()&quot;">​</a></h3><p><code>remove(Object key)</code>的作用是删除<code>key</code>值对应的<code>entry</code>，该方法的具体逻辑是在<code>removeEntryForKey(Object key)</code>里实现的。<code>removeEntryForKey()</code>方法会首先找到<code>key</code>值对应的<code>entry</code>，然后删除该<code>entry</code>(修改链表的相应引用)。查找过程跟<code>getEntry()</code>过程类似。</p><p><img src="`+o+`" alt="HashMap_removeEntryForKey"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//removeEntryForKey()</span></span>
<span class="line"><span>final Entry&lt;K,V&gt; removeEntryForKey(Object key) {</span></span>
<span class="line"><span>	......</span></span>
<span class="line"><span>	int hash = (key == null) ? 0 : hash(key);</span></span>
<span class="line"><span>    int i = indexFor(hash, table.length);//hash&amp;(table.length-1)</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; prev = table[i];//得到冲突链表</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; e = prev;</span></span>
<span class="line"><span>    while (e != null) {//遍历冲突链表</span></span>
<span class="line"><span>        Entry&lt;K,V&gt; next = e.next;</span></span>
<span class="line"><span>        Object k;</span></span>
<span class="line"><span>        if (e.hash == hash &amp;&amp;</span></span>
<span class="line"><span>            ((k = e.key) == key || (key != null &amp;&amp; key.equals(k)))) {//找到要删除的entry</span></span>
<span class="line"><span>            modCount++; size--;</span></span>
<span class="line"><span>            if (prev == e) table[i] = next;//删除的是冲突链表的第一个entry</span></span>
<span class="line"><span>            else prev.next = next;</span></span>
<span class="line"><span>            return e;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        prev = e; e = next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return e;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="java8-hashmap" tabindex="-1">Java8 HashMap <a class="header-anchor" href="#java8-hashmap" aria-label="Permalink to &quot;Java8 HashMap&quot;">​</a></h2><p>Java8 对 HashMap 进行了一些修改，最大的不同就是利用了红黑树，所以其由 <strong>数组+链表+红黑树</strong> 组成。</p><p>根据 Java7 HashMap 的介绍，我们知道，查找的时候，根据 hash 值我们能够快速定位到数组的具体下标，但是之后的话，需要顺着链表一个个比较下去才能找到我们需要的，时间复杂度取决于链表的长度，为 O(n)。</p><p>为了降低这部分的开销，在 Java8 中，当链表中的元素达到了 8 个时，会将链表转换为红黑树，在这些位置进行查找的时候可以降低时间复杂度为 O(logN)。</p><p>来一张图简单示意一下吧：</p><p><img src="`+n+`" alt="error.图片加载失败"></p><p>注意，上图是示意图，主要是描述结构，不会达到这个状态的，因为这么多数据的时候早就扩容了。</p><p>下面，我们还是用代码来介绍吧，个人感觉，Java8 的源码可读性要差一些，不过精简一些。</p><p>Java7 中使用 Entry 来代表每个 HashMap 中的数据节点，Java8 中使用 Node，基本没有区别，都是 key，value，hash 和 next 这四个属性，不过，Node 只能用于链表的情况，红黑树的情况需要使用 TreeNode。</p><p>我们根据数组元素中，第一个节点数据类型是 Node 还是 TreeNode 来判断该位置下是链表还是红黑树的。</p><h3 id="put-过程分析" tabindex="-1">put 过程分析 <a class="header-anchor" href="#put-过程分析" aria-label="Permalink to &quot;put 过程分析&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V put(K key, V value) {</span></span>
<span class="line"><span>    return putVal(hash(key), key, value, false, true);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 第四个参数 onlyIfAbsent 如果是 true，那么只有在不存在该 key 时才会进行 put 操作</span></span>
<span class="line"><span>// 第五个参数 evict 我们这里不关心</span></span>
<span class="line"><span>final V putVal(int hash, K key, V value, boolean onlyIfAbsent,</span></span>
<span class="line"><span>               boolean evict) {</span></span>
<span class="line"><span>    Node&lt;K,V&gt;[] tab; Node&lt;K,V&gt; p; int n, i;</span></span>
<span class="line"><span>    // 第一次 put 值的时候，会触发下面的 resize()，类似 java7 的第一次 put 也要初始化数组长度</span></span>
<span class="line"><span>    // 第一次 resize 和后续的扩容有些不一样，因为这次是数组从 null 初始化到默认的 16 或自定义的初始容量</span></span>
<span class="line"><span>    if ((tab = table) == null || (n = tab.length) == 0)</span></span>
<span class="line"><span>        n = (tab = resize()).length;</span></span>
<span class="line"><span>    // 找到具体的数组下标，如果此位置没有值，那么直接初始化一下 Node 并放置在这个位置就可以了</span></span>
<span class="line"><span>    if ((p = tab[i = (n - 1) &amp; hash]) == null)</span></span>
<span class="line"><span>        tab[i] = newNode(hash, key, value, null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    else {// 数组该位置有数据</span></span>
<span class="line"><span>        Node&lt;K,V&gt; e; K k;</span></span>
<span class="line"><span>        // 首先，判断该位置的第一个数据和我们要插入的数据，key 是不是&quot;相等&quot;，如果是，取出这个节点</span></span>
<span class="line"><span>        if (p.hash == hash &amp;&amp;</span></span>
<span class="line"><span>            ((k = p.key) == key || (key != null &amp;&amp; key.equals(k))))</span></span>
<span class="line"><span>            e = p;</span></span>
<span class="line"><span>        // 如果该节点是代表红黑树的节点，调用红黑树的插值方法，本文不展开说红黑树</span></span>
<span class="line"><span>        else if (p instanceof TreeNode)</span></span>
<span class="line"><span>            e = ((TreeNode&lt;K,V&gt;)p).putTreeVal(this, tab, hash, key, value);</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            // 到这里，说明数组该位置上是一个链表</span></span>
<span class="line"><span>            for (int binCount = 0; ; ++binCount) {</span></span>
<span class="line"><span>                // 插入到链表的最后面(Java7 是插入到链表的最前面)</span></span>
<span class="line"><span>                if ((e = p.next) == null) {</span></span>
<span class="line"><span>                    p.next = newNode(hash, key, value, null);</span></span>
<span class="line"><span>                    // TREEIFY_THRESHOLD 为 8，所以，如果新插入的值是链表中的第 8 个</span></span>
<span class="line"><span>                    // 会触发下面的 treeifyBin，也就是将链表转换为红黑树</span></span>
<span class="line"><span>                    if (binCount &gt;= TREEIFY_THRESHOLD - 1) // -1 for 1st</span></span>
<span class="line"><span>                        treeifyBin(tab, hash);</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // 如果在该链表中找到了&quot;相等&quot;的 key(== 或 equals)</span></span>
<span class="line"><span>                if (e.hash == hash &amp;&amp;</span></span>
<span class="line"><span>                    ((k = e.key) == key || (key != null &amp;&amp; key.equals(k))))</span></span>
<span class="line"><span>                    // 此时 break，那么 e 为链表中[与要插入的新值的 key &quot;相等&quot;]的 node</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                p = e;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // e!=null 说明存在旧值的key与要插入的key&quot;相等&quot;</span></span>
<span class="line"><span>        // 对于我们分析的put操作，下面这个 if 其实就是进行 &quot;值覆盖&quot;，然后返回旧值</span></span>
<span class="line"><span>        if (e != null) {</span></span>
<span class="line"><span>            V oldValue = e.value;</span></span>
<span class="line"><span>            if (!onlyIfAbsent || oldValue == null)</span></span>
<span class="line"><span>                e.value = value;</span></span>
<span class="line"><span>            afterNodeAccess(e);</span></span>
<span class="line"><span>            return oldValue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ++modCount;</span></span>
<span class="line"><span>    // 如果 HashMap 由于新插入这个值导致 size 已经超过了阈值，需要进行扩容</span></span>
<span class="line"><span>    if (++size &gt; threshold)</span></span>
<span class="line"><span>        resize();</span></span>
<span class="line"><span>    afterNodeInsertion(evict);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>和 Java7 稍微有点不一样的地方就是，Java7 是先扩容后插入新值的，Java8 先插值再扩容，不过这个不重要。</p><h3 id="数组扩容" tabindex="-1">数组扩容 <a class="header-anchor" href="#数组扩容" aria-label="Permalink to &quot;数组扩容&quot;">​</a></h3><p>resize() 方法用于初始化数组或数组扩容，每次扩容后，容量为原来的 2 倍，并进行数据迁移。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final Node&lt;K,V&gt;[] resize() {</span></span>
<span class="line"><span>    Node&lt;K,V&gt;[] oldTab = table;</span></span>
<span class="line"><span>    int oldCap = (oldTab == null) ? 0 : oldTab.length;</span></span>
<span class="line"><span>    int oldThr = threshold;</span></span>
<span class="line"><span>    int newCap, newThr = 0;</span></span>
<span class="line"><span>    if (oldCap &gt; 0) { // 对应数组扩容</span></span>
<span class="line"><span>        if (oldCap &gt;= MAXIMUM_CAPACITY) {</span></span>
<span class="line"><span>            threshold = Integer.MAX_VALUE;</span></span>
<span class="line"><span>            return oldTab;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 将数组大小扩大一倍</span></span>
<span class="line"><span>        else if ((newCap = oldCap &lt;&lt; 1) &lt; MAXIMUM_CAPACITY &amp;&amp;</span></span>
<span class="line"><span>                 oldCap &gt;= DEFAULT_INITIAL_CAPACITY)</span></span>
<span class="line"><span>            // 将阈值扩大一倍</span></span>
<span class="line"><span>            newThr = oldThr &lt;&lt; 1; // double threshold</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else if (oldThr &gt; 0) // 对应使用 new HashMap(int initialCapacity) 初始化后，第一次 put 的时候</span></span>
<span class="line"><span>        newCap = oldThr;</span></span>
<span class="line"><span>    else {// 对应使用 new HashMap() 初始化后，第一次 put 的时候</span></span>
<span class="line"><span>        newCap = DEFAULT_INITIAL_CAPACITY;</span></span>
<span class="line"><span>        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (newThr == 0) {</span></span>
<span class="line"><span>        float ft = (float)newCap * loadFactor;</span></span>
<span class="line"><span>        newThr = (newCap &lt; MAXIMUM_CAPACITY &amp;&amp; ft &lt; (float)MAXIMUM_CAPACITY ?</span></span>
<span class="line"><span>                  (int)ft : Integer.MAX_VALUE);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    threshold = newThr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 用新的数组大小初始化新的数组</span></span>
<span class="line"><span>    Node&lt;K,V&gt;[] newTab = (Node&lt;K,V&gt;[])new Node[newCap];</span></span>
<span class="line"><span>    table = newTab; // 如果是初始化数组，到这里就结束了，返回 newTab 即可</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (oldTab != null) {</span></span>
<span class="line"><span>        // 开始遍历原数组，进行数据迁移。</span></span>
<span class="line"><span>        for (int j = 0; j &lt; oldCap; ++j) {</span></span>
<span class="line"><span>            Node&lt;K,V&gt; e;</span></span>
<span class="line"><span>            if ((e = oldTab[j]) != null) {</span></span>
<span class="line"><span>                oldTab[j] = null;</span></span>
<span class="line"><span>                // 如果该数组位置上只有单个元素，那就简单了，简单迁移这个元素就可以了</span></span>
<span class="line"><span>                if (e.next == null)</span></span>
<span class="line"><span>                    newTab[e.hash &amp; (newCap - 1)] = e;</span></span>
<span class="line"><span>                // 如果是红黑树，具体我们就不展开了</span></span>
<span class="line"><span>                else if (e instanceof TreeNode)</span></span>
<span class="line"><span>                    ((TreeNode&lt;K,V&gt;)e).split(this, newTab, j, oldCap);</span></span>
<span class="line"><span>                else { </span></span>
<span class="line"><span>                    // 这块是处理链表的情况，</span></span>
<span class="line"><span>                    // 需要将此链表拆成两个链表，放到新的数组中，并且保留原来的先后顺序</span></span>
<span class="line"><span>                    // loHead、loTail 对应一条链表，hiHead、hiTail 对应另一条链表，代码还是比较简单的</span></span>
<span class="line"><span>                    Node&lt;K,V&gt; loHead = null, loTail = null;</span></span>
<span class="line"><span>                    Node&lt;K,V&gt; hiHead = null, hiTail = null;</span></span>
<span class="line"><span>                    Node&lt;K,V&gt; next;</span></span>
<span class="line"><span>                    do {</span></span>
<span class="line"><span>                        next = e.next;</span></span>
<span class="line"><span>                        if ((e.hash &amp; oldCap) == 0) {</span></span>
<span class="line"><span>                            if (loTail == null)</span></span>
<span class="line"><span>                                loHead = e;</span></span>
<span class="line"><span>                            else</span></span>
<span class="line"><span>                                loTail.next = e;</span></span>
<span class="line"><span>                            loTail = e;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        else {</span></span>
<span class="line"><span>                            if (hiTail == null)</span></span>
<span class="line"><span>                                hiHead = e;</span></span>
<span class="line"><span>                            else</span></span>
<span class="line"><span>                                hiTail.next = e;</span></span>
<span class="line"><span>                            hiTail = e;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    } while ((e = next) != null);</span></span>
<span class="line"><span>                    if (loTail != null) {</span></span>
<span class="line"><span>                        loTail.next = null;</span></span>
<span class="line"><span>                        // 第一条链表</span></span>
<span class="line"><span>                        newTab[j] = loHead;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    if (hiTail != null) {</span></span>
<span class="line"><span>                        hiTail.next = null;</span></span>
<span class="line"><span>                        // 第二条链表的新的位置是 j + oldCap，这个很好理解</span></span>
<span class="line"><span>                        newTab[j + oldCap] = hiHead;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return newTab;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="get-过程分析" tabindex="-1">get 过程分析 <a class="header-anchor" href="#get-过程分析" aria-label="Permalink to &quot;get 过程分析&quot;">​</a></h3><p>相对于 put 来说，get 真的太简单了。</p><ul><li>计算 key 的 hash 值，根据 hash 值找到对应数组下标: hash &amp; (length-1)</li><li>判断数组该位置处的元素是否刚好就是我们要找的，如果不是，走第三步</li><li>判断该元素类型是否是 TreeNode，如果是，用红黑树的方法取数据，如果不是，走第四步</li><li>遍历链表，直到找到相等(==或equals)的 key</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V get(Object key) {</span></span>
<span class="line"><span>    Node&lt;K,V&gt; e;</span></span>
<span class="line"><span>    return (e = getNode(hash(key), key)) == null ? null : e.value;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>final Node&lt;K,V&gt; getNode(int hash, Object key) {</span></span>
<span class="line"><span>    Node&lt;K,V&gt;[] tab; Node&lt;K,V&gt; first, e; int n; K k;</span></span>
<span class="line"><span>    if ((tab = table) != null &amp;&amp; (n = tab.length) &gt; 0 &amp;&amp;</span></span>
<span class="line"><span>        (first = tab[(n - 1) &amp; hash]) != null) {</span></span>
<span class="line"><span>        // 判断第一个节点是不是就是需要的</span></span>
<span class="line"><span>        if (first.hash == hash &amp;&amp; // always check first node</span></span>
<span class="line"><span>            ((k = first.key) == key || (key != null &amp;&amp; key.equals(k))))</span></span>
<span class="line"><span>            return first;</span></span>
<span class="line"><span>        if ((e = first.next) != null) {</span></span>
<span class="line"><span>            // 判断是否是红黑树</span></span>
<span class="line"><span>            if (first instanceof TreeNode)</span></span>
<span class="line"><span>                return ((TreeNode&lt;K,V&gt;)first).getTreeNode(hash, key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 链表遍历</span></span>
<span class="line"><span>            do {</span></span>
<span class="line"><span>                if (e.hash == hash &amp;&amp;</span></span>
<span class="line"><span>                    ((k = e.key) == key || (key != null &amp;&amp; key.equals(k))))</span></span>
<span class="line"><span>                    return e;</span></span>
<span class="line"><span>            } while ((e = e.next) != null);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="hashset" tabindex="-1">HashSet <a class="header-anchor" href="#hashset" aria-label="Permalink to &quot;HashSet&quot;">​</a></h2><p>前面已经说过_HashSet_是对_HashMap_的简单包装，对_HashSet_的函数调用都会转换成合适的_HashMap_方法，因此_HashSet_的实现非常简单，只有不到300行代码。这里不再赘述。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//HashSet是对HashMap的简单包装</span></span>
<span class="line"><span>public class HashSet&lt;E&gt;</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	......</span></span>
<span class="line"><span>	private transient HashMap&lt;E,Object&gt; map;//HashSet里面有一个HashMap</span></span>
<span class="line"><span>    // Dummy value to associate with an Object in the backing Map</span></span>
<span class="line"><span>    private static final Object PRESENT = new Object();</span></span>
<span class="line"><span>    public HashSet() {</span></span>
<span class="line"><span>        map = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    public boolean add(E e) {//简单的方法转换</span></span>
<span class="line"><span>        return map.put(e, PRESENT)==null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,47)]))}const _=p(h,[["render",d]]);export{v as __pageData,_ as default};
