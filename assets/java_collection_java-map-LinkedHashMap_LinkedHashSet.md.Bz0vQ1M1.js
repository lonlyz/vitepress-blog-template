import{_ as e,c as n,ai as s,o as p}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/collection/LinkedHashMap_base.png",l="/vitepress-blog-template/images/collection/LinkedHashMap_addEntry.png",i="/vitepress-blog-template/images/collection/LinkedHashMap_removeEntryForKey.png",g=JSON.parse('{"title":"Map - LinkedHashSet&Map源码解析","description":"","frontmatter":{},"headers":[],"relativePath":"java/collection/java-map-LinkedHashMap&LinkedHashSet.md","filePath":"java/collection/java-map-LinkedHashMap&LinkedHashSet.md","lastUpdated":1737706346000}'),d={name:"java/collection/java-map-LinkedHashMap&LinkedHashSet.md"};function c(o,a,r,h,k,_){return p(),n("div",null,a[0]||(a[0]=[s('<h1 id="map-linkedhashset-map源码解析" tabindex="-1">Map - LinkedHashSet&amp;Map源码解析 <a class="header-anchor" href="#map-linkedhashset-map源码解析" aria-label="Permalink to &quot;Map - LinkedHashSet&amp;Map源码解析&quot;">​</a></h1><blockquote><p>本文主要对Map - LinkedHashSet&amp;Map 源码解析。@pdai</p></blockquote><h2 id="java-7-linkedhashset-map" tabindex="-1">Java 7 - LinkedHashSet&amp;Map <a class="header-anchor" href="#java-7-linkedhashset-map" aria-label="Permalink to &quot;Java 7 - LinkedHashSet&amp;Map&quot;">​</a></h2><h3 id="总体介绍" tabindex="-1">总体介绍 <a class="header-anchor" href="#总体介绍" aria-label="Permalink to &quot;总体介绍&quot;">​</a></h3><p>如果你已看过前面关于_HashSet_和_HashMap_，以及_TreeSet_和_TreeMap_的讲解，一定能够想到本文将要讲解的_LinkedHashSet_和_LinkedHashMap_其实也是一回事。<em>LinkedHashSet_和_LinkedHashMap_在Java里也有着相同的实现，前者仅仅是对后者做了一层包装，也就是说<strong>LinkedHashSet里面有一个LinkedHashMap(适配器模式)</strong>。因此本文将重点分析_LinkedHashMap</em>。</p><p><em>LinkedHashMap_实现了_Map_接口，即允许放入<code>key</code>为<code>null</code>的元素，也允许插入<code>value</code>为<code>null</code>的元素。从名字上可以看出该容器是_linked list_和_HashMap_的混合体，也就是说它同时满足_HashMap_和_linked list_的某些特性。**可将_LinkedHashMap_看作采用_linked list_增强的_HashMap</em>。**</p><p><img src="'+t+`" alt="LinkedHashMap_base.png"></p><p>事实上_LinkedHashMap_是_HashMap_的直接子类，<strong>二者唯一的区别是_LinkedHashMap_在_HashMap_的基础上，采用双向链表(doubly-linked list)的形式将所有<code>entry</code>连接起来，这样是为保证元素的迭代顺序跟插入顺序相同</strong>。上图给出了_LinkedHashMap_的结构图，主体部分跟_HashMap_完全一样，多了<code>header</code>指向双向链表的头部(是一个哑元)，<strong>该双向链表的迭代顺序就是<code>entry</code>的插入顺序</strong>。</p><p>除了可以保迭代历顺序，这种结构还有一个好处 : <strong>迭代_LinkedHashMap_时不需要像_HashMap_那样遍历整个<code>table</code>，而只需要直接遍历<code>header</code>指向的双向链表即可</strong>，也就是说_LinkedHashMap_的迭代时间就只跟<code>entry</code>的个数相关，而跟<code>table</code>的大小无关。</p><p>有两个参数可以影响_LinkedHashMap_的性能: 初始容量(inital capacity)和负载系数(load factor)。初始容量指定了初始<code>table</code>的大小，负载系数用来指定自动扩容的临界值。当<code>entry</code>的数量超过<code>capacity*load_factor</code>时，容器将自动扩容并重新哈希。对于插入元素较多的场景，将初始容量设大可以减少重新哈希的次数。</p><p>将对象放入到_LinkedHashMap_或_LinkedHashSet_中时，有两个方法需要特别关心: <code>hashCode()</code>和<code>equals()</code>。<strong><code>hashCode()</code>方法决定了对象会被放到哪个<code>bucket</code>里，当多个对象的哈希值冲突时，<code>equals()</code>方法决定了这些对象是否是“同一个对象”</strong>。所以，如果要将自定义的对象放入到<code>LinkedHashMap</code>或<code>LinkedHashSet</code>中，需要@Override <code>hashCode()</code>和<code>equals()</code>方法。</p><p>通过如下方式可以得到一个跟源_Map_ <strong>迭代顺序</strong>一样的_LinkedHashMap_:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void foo(Map m) {</span></span>
<span class="line"><span>    Map copy = new LinkedHashMap(m);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>出于性能原因，_LinkedHashMap_是非同步的(not synchronized)，如果需要在多线程环境使用，需要程序员手动同步；或者通过如下方式将_LinkedHashMap_包装成(wrapped)同步的:</p><p><code>Map m = Collections.synchronizedMap(new LinkedHashMap(...));</code></p><h3 id="方法剖析" tabindex="-1">方法剖析 <a class="header-anchor" href="#方法剖析" aria-label="Permalink to &quot;方法剖析&quot;">​</a></h3><h4 id="get" tabindex="-1">get() <a class="header-anchor" href="#get" aria-label="Permalink to &quot;get()&quot;">​</a></h4><p><code>get(Object key)</code>方法根据指定的<code>key</code>值返回对应的<code>value</code>。该方法跟<code>HashMap.get()</code>方法的流程几乎完全一样，读者可自行<a href="https://github.com/CarpenterLee/JCFInternals/blob/master/markdown/6-HashSet%20and%20HashMap.md#get" target="_blank" rel="noreferrer">参考前文在新窗口打开</a>，这里不再赘述。</p><h4 id="put" tabindex="-1">put() <a class="header-anchor" href="#put" aria-label="Permalink to &quot;put()&quot;">​</a></h4><p><code>put(K key, V value)</code>方法是将指定的<code>key, value</code>对添加到<code>map</code>里。该方法首先会对<code>map</code>做一次查找，看是否包含该元组，如果已经包含则直接返回，查找过程类似于<code>get()</code>方法；如果没有找到，则会通过<code>addEntry(int hash, K key, V value, int bucketIndex)</code>方法插入新的<code>entry</code>。</p><p>注意，这里的<strong>插入有两重含义</strong>:</p><blockquote><ol><li>从<code>table</code>的角度看，新的<code>entry</code>需要插入到对应的<code>bucket</code>里，当有哈希冲突时，采用头插法将新的<code>entry</code>插入到冲突链表的头部。</li><li>从<code>header</code>的角度看，新的<code>entry</code>需要插入到双向链表的尾部。</li></ol></blockquote><p><img src="`+l+`" alt="LinkedHashMap_addEntry.png"></p><p><code>addEntry()</code>代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// LinkedHashMap.addEntry()</span></span>
<span class="line"><span>void addEntry(int hash, K key, V value, int bucketIndex) {</span></span>
<span class="line"><span>    if ((size &gt;= threshold) &amp;&amp; (null != table[bucketIndex])) {</span></span>
<span class="line"><span>        resize(2 * table.length);// 自动扩容，并重新哈希</span></span>
<span class="line"><span>        hash = (null != key) ? hash(key) : 0;</span></span>
<span class="line"><span>        bucketIndex = hash &amp; (table.length-1);// hash%table.length</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 1.在冲突链表头部插入新的entry</span></span>
<span class="line"><span>    HashMap.Entry&lt;K,V&gt; old = table[bucketIndex];</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; e = new Entry&lt;&gt;(hash, key, value, old);</span></span>
<span class="line"><span>    table[bucketIndex] = e;</span></span>
<span class="line"><span>    // 2.在双向链表的尾部插入新的entry</span></span>
<span class="line"><span>    e.addBefore(header);</span></span>
<span class="line"><span>    size++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中用到了<code>addBefore()</code>方法将新<code>entry e</code>插入到双向链表头引用<code>header</code>的前面，这样<code>e</code>就成为双向链表中的最后一个元素。<code>addBefore()</code>的代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// LinkedHashMap.Entry.addBefor()，将this插入到existingEntry的前面</span></span>
<span class="line"><span>private void addBefore(Entry&lt;K,V&gt; existingEntry) {</span></span>
<span class="line"><span>    after  = existingEntry;</span></span>
<span class="line"><span>    before = existingEntry.before;</span></span>
<span class="line"><span>    before.after = this;</span></span>
<span class="line"><span>    after.before = this;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码只是简单修改相关<code>entry</code>的引用而已。</p><h4 id="remove" tabindex="-1">remove() <a class="header-anchor" href="#remove" aria-label="Permalink to &quot;remove()&quot;">​</a></h4><p><code>remove(Object key)</code>的作用是删除<code>key</code>值对应的<code>entry</code>，该方法的具体逻辑是在<code>removeEntryForKey(Object key)</code>里实现的。<code>removeEntryForKey()</code>方法会首先找到<code>key</code>值对应的<code>entry</code>，然后删除该<code>entry</code>(修改链表的相应引用)。查找过程跟<code>get()</code>方法类似。</p><p>注意，这里的<strong>删除也有两重含义</strong>:</p><blockquote><ol><li>从<code>table</code>的角度看，需要将该<code>entry</code>从对应的<code>bucket</code>里删除，如果对应的冲突链表不空，需要修改冲突链表的相应引用。</li><li>从<code>header</code>的角度来看，需要将该<code>entry</code>从双向链表中删除，同时修改链表中前面以及后面元素的相应引用。</li></ol></blockquote><p><img src="`+i+`" alt="LinkedHashMap_removeEntryForKey.png"></p><p><code>removeEntryForKey()</code>对应的代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// LinkedHashMap.removeEntryForKey()，删除key值对应的entry</span></span>
<span class="line"><span>final Entry&lt;K,V&gt; removeEntryForKey(Object key) {</span></span>
<span class="line"><span>	......</span></span>
<span class="line"><span>	int hash = (key == null) ? 0 : hash(key);</span></span>
<span class="line"><span>    int i = indexFor(hash, table.length);// hash&amp;(table.length-1)</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; prev = table[i];// 得到冲突链表</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; e = prev;</span></span>
<span class="line"><span>    while (e != null) {// 遍历冲突链表</span></span>
<span class="line"><span>        Entry&lt;K,V&gt; next = e.next;</span></span>
<span class="line"><span>        Object k;</span></span>
<span class="line"><span>        if (e.hash == hash &amp;&amp;</span></span>
<span class="line"><span>            ((k = e.key) == key || (key != null &amp;&amp; key.equals(k)))) {// 找到要删除的entry</span></span>
<span class="line"><span>            modCount++; size--;</span></span>
<span class="line"><span>            // 1. 将e从对应bucket的冲突链表中删除</span></span>
<span class="line"><span>            if (prev == e) table[i] = next;</span></span>
<span class="line"><span>            else prev.next = next;</span></span>
<span class="line"><span>            // 2. 将e从双向链表中删除</span></span>
<span class="line"><span>            e.before.after = e.after;</span></span>
<span class="line"><span>            e.after.before = e.before;</span></span>
<span class="line"><span>            return e;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        prev = e; e = next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return e;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="linkedhashset" tabindex="-1">LinkedHashSet <a class="header-anchor" href="#linkedhashset" aria-label="Permalink to &quot;LinkedHashSet&quot;">​</a></h3><p>前面已经说过_LinkedHashSet_是对_LinkedHashMap_的简单包装，对_LinkedHashSet_的函数调用都会转换成合适的_LinkedHashMap_方法，因此_LinkedHashSet_的实现非常简单，这里不再赘述。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LinkedHashSet&lt;E&gt;</span></span>
<span class="line"><span>    extends HashSet&lt;E&gt;</span></span>
<span class="line"><span>    implements Set&lt;E&gt;, Cloneable, java.io.Serializable {</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    // LinkedHashSet里面有一个LinkedHashMap</span></span>
<span class="line"><span>    public LinkedHashSet(int initialCapacity, float loadFactor) {</span></span>
<span class="line"><span>        map = new LinkedHashMap&lt;&gt;(initialCapacity, loadFactor);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>	......</span></span>
<span class="line"><span>    public boolean add(E e) {//简单的方法转换</span></span>
<span class="line"><span>        return map.put(e, PRESENT)==null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="linkedhashmap经典用法" tabindex="-1">LinkedHashMap经典用法 <a class="header-anchor" href="#linkedhashmap经典用法" aria-label="Permalink to &quot;LinkedHashMap经典用法&quot;">​</a></h3><p>_LinkedHashMap_除了可以保证迭代顺序外，还有一个非常有用的用法: 可以轻松实现一个采用了FIFO替换策略的缓存。具体说来，LinkedHashMap有一个子类方法<code>protected boolean removeEldestEntry(Map.Entry&lt;K,V&gt; eldest)</code>，该方法的作用是告诉Map是否要删除“最老”的Entry，所谓最老就是当前Map中最早插入的Entry，如果该方法返回<code>true</code>，最老的那个元素就会被删除。在每次插入新元素的之后LinkedHashMap会自动询问removeEldestEntry()是否要删除最老的元素。这样只需要在子类中重载该方法，当元素个数超过一定数量时让removeEldestEntry()返回true，就能够实现一个固定大小的FIFO策略的缓存。示例代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** 一个固定大小的FIFO替换策略的缓存 */</span></span>
<span class="line"><span>class FIFOCache&lt;K, V&gt; extends LinkedHashMap&lt;K, V&gt;{</span></span>
<span class="line"><span>    private final int cacheSize;</span></span>
<span class="line"><span>    public FIFOCache(int cacheSize){</span></span>
<span class="line"><span>        this.cacheSize = cacheSize;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 当Entry个数超过cacheSize时，删除最老的Entry</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected boolean removeEldestEntry(Map.Entry&lt;K,V&gt; eldest) {</span></span>
<span class="line"><span>       return size() &gt; cacheSize;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,42)]))}const u=e(d,[["render",c]]);export{g as __pageData,u as default};
