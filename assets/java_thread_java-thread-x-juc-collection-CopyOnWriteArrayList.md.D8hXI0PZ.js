import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"JUC集合: CopyOnWriteArrayList详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-collection-CopyOnWriteArrayList.md","filePath":"java/thread/java-thread-x-juc-collection-CopyOnWriteArrayList.md","lastUpdated":1737706346000}'),l={name:"java/thread/java-thread-x-juc-collection-CopyOnWriteArrayList.md"};function t(i,n,c,r,o,d){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="juc集合-copyonwritearraylist详解" tabindex="-1">JUC集合: CopyOnWriteArrayList详解 <a class="header-anchor" href="#juc集合-copyonwritearraylist详解" aria-label="Permalink to &quot;JUC集合: CopyOnWriteArrayList详解&quot;">​</a></h1><blockquote><p>CopyOnWriteArrayList是ArrayList 的一个线程安全的变体，其中所有可变操作(add、set 等等)都是通过对底层数组进行一次新的拷贝来实现的。COW模式的体现。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>请先说说非并发集合中Fail-fast机制?</li><li>再为什么说ArrayList查询快而增删慢?</li><li>对比ArrayList说说CopyOnWriteArrayList的增删改查实现原理? COW基于拷贝</li><li>再说下弱一致性的迭代器原理是怎么样的? <code>COWIterator&lt;E&gt;</code></li><li>CopyOnWriteArrayList为什么并发安全且性能比Vector好?</li><li>CopyOnWriteArrayList有何缺陷，说说其应用场景?</li></ul><h2 id="copyonwritearraylist源码分析" tabindex="-1">CopyOnWriteArrayList源码分析 <a class="header-anchor" href="#copyonwritearraylist源码分析" aria-label="Permalink to &quot;CopyOnWriteArrayList源码分析&quot;">​</a></h2><h3 id="类的继承关系" tabindex="-1">类的继承关系 <a class="header-anchor" href="#类的继承关系" aria-label="Permalink to &quot;类的继承关系&quot;">​</a></h3><p>CopyOnWriteArrayList实现了List接口，List接口定义了对列表的基本操作；同时实现了RandomAccess接口，表示可以随机访问(数组具有随机访问的特性)；同时实现了Cloneable接口，表示可克隆；同时也实现了Serializable接口，表示可被序列化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CopyOnWriteArrayList&lt;E&gt; implements List&lt;E&gt;, RandomAccess, Cloneable, java.io.Serializable {}</span></span></code></pre></div><h3 id="类的内部类" tabindex="-1">类的内部类 <a class="header-anchor" href="#类的内部类" aria-label="Permalink to &quot;类的内部类&quot;">​</a></h3><ul><li>COWIterator类</li></ul><p>COWIterator表示迭代器，其也有一个Object类型的数组作为CopyOnWriteArrayList数组的快照，这种快照风格的迭代器方法在创建迭代器时使用了对当时数组状态的引用。此数组在迭代器的生存期内不会更改，因此不可能发生冲突，并且迭代器保证不会抛出 ConcurrentModificationException。创建迭代器以后，迭代器就不会反映列表的添加、移除或者更改。在迭代器上进行的元素更改操作(remove、set 和 add)不受支持。这些方法将抛出 UnsupportedOperationException。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static final class COWIterator&lt;E&gt; implements ListIterator&lt;E&gt; {</span></span>
<span class="line"><span>    /** Snapshot of the array */</span></span>
<span class="line"><span>    // 快照</span></span>
<span class="line"><span>    private final Object[] snapshot;</span></span>
<span class="line"><span>    /** Index of element to be returned by subsequent call to next.  */</span></span>
<span class="line"><span>    // 游标</span></span>
<span class="line"><span>    private int cursor;</span></span>
<span class="line"><span>    // 构造函数</span></span>
<span class="line"><span>    private COWIterator(Object[] elements, int initialCursor) {</span></span>
<span class="line"><span>        cursor = initialCursor;</span></span>
<span class="line"><span>        snapshot = elements;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 是否还有下一项</span></span>
<span class="line"><span>    public boolean hasNext() {</span></span>
<span class="line"><span>        return cursor &lt; snapshot.length;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 是否有上一项</span></span>
<span class="line"><span>    public boolean hasPrevious() {</span></span>
<span class="line"><span>        return cursor &gt; 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // next项</span></span>
<span class="line"><span>    @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>    public E next() {</span></span>
<span class="line"><span>        if (! hasNext()) // 不存在下一项，抛出异常</span></span>
<span class="line"><span>            throw new NoSuchElementException();</span></span>
<span class="line"><span>        // 返回下一项</span></span>
<span class="line"><span>        return (E) snapshot[cursor++];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>    public E previous() {</span></span>
<span class="line"><span>        if (! hasPrevious())</span></span>
<span class="line"><span>            throw new NoSuchElementException();</span></span>
<span class="line"><span>        return (E) snapshot[--cursor];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 下一项索引</span></span>
<span class="line"><span>    public int nextIndex() {</span></span>
<span class="line"><span>        return cursor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 上一项索引</span></span>
<span class="line"><span>    public int previousIndex() {</span></span>
<span class="line"><span>        return cursor-1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Not supported. Always throws UnsupportedOperationException.</span></span>
<span class="line"><span>        * @throws UnsupportedOperationException always; {@code remove}</span></span>
<span class="line"><span>        *         is not supported by this iterator.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 不支持remove操作</span></span>
<span class="line"><span>    public void remove() {</span></span>
<span class="line"><span>        throw new UnsupportedOperationException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Not supported. Always throws UnsupportedOperationException.</span></span>
<span class="line"><span>        * @throws UnsupportedOperationException always; {@code set}</span></span>
<span class="line"><span>        *         is not supported by this iterator.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 不支持set操作</span></span>
<span class="line"><span>    public void set(E e) {</span></span>
<span class="line"><span>        throw new UnsupportedOperationException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Not supported. Always throws UnsupportedOperationException.</span></span>
<span class="line"><span>        * @throws UnsupportedOperationException always; {@code add}</span></span>
<span class="line"><span>        *         is not supported by this iterator.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 不支持add操作</span></span>
<span class="line"><span>    public void add(E e) {</span></span>
<span class="line"><span>        throw new UnsupportedOperationException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void forEachRemaining(Consumer&lt;? super E&gt; action) {</span></span>
<span class="line"><span>        Objects.requireNonNull(action);</span></span>
<span class="line"><span>        Object[] elements = snapshot;</span></span>
<span class="line"><span>        final int size = elements.length;</span></span>
<span class="line"><span>        for (int i = cursor; i &lt; size; i++) {</span></span>
<span class="line"><span>            @SuppressWarnings(&quot;unchecked&quot;) E e = (E) elements[i];</span></span>
<span class="line"><span>            action.accept(e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        cursor = size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><p>属性中有一个可重入锁，用来保证线程安全访问，还有一个Object类型的数组，用来存放具体的元素。当然，也使用到了反射机制和CAS来保证原子性的修改lock域。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CopyOnWriteArrayList&lt;E&gt;</span></span>
<span class="line"><span>    implements List&lt;E&gt;, RandomAccess, Cloneable, java.io.Serializable {</span></span>
<span class="line"><span>    // 版本序列号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 8673264195747942595L;</span></span>
<span class="line"><span>    // 可重入锁</span></span>
<span class="line"><span>    final transient ReentrantLock lock = new ReentrantLock();</span></span>
<span class="line"><span>    // 对象数组，用于存放元素</span></span>
<span class="line"><span>    private transient volatile Object[] array;</span></span>
<span class="line"><span>    // 反射机制</span></span>
<span class="line"><span>    private static final sun.misc.Unsafe UNSAFE;</span></span>
<span class="line"><span>    // lock域的内存偏移量</span></span>
<span class="line"><span>    private static final long lockOffset;</span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            UNSAFE = sun.misc.Unsafe.getUnsafe();</span></span>
<span class="line"><span>            Class&lt;?&gt; k = CopyOnWriteArrayList.class;</span></span>
<span class="line"><span>            lockOffset = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (k.getDeclaredField(&quot;lock&quot;));</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            throw new Error(e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="类的构造函数" tabindex="-1">类的构造函数 <a class="header-anchor" href="#类的构造函数" aria-label="Permalink to &quot;类的构造函数&quot;">​</a></h3><ul><li>默认构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public CopyOnWriteArrayList() {</span></span>
<span class="line"><span>    // 设置数组</span></span>
<span class="line"><span>    setArray(new Object[0]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>CopyOnWriteArrayList(Collection&lt;? extends E&gt;)</code>型构造函数　 该构造函数用于创建一个按 collection 的迭代器返回元素的顺序包含指定 collection 元素的列表。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public CopyOnWriteArrayList(Collection&lt;? extends E&gt; c) {</span></span>
<span class="line"><span>    Object[] elements;</span></span>
<span class="line"><span>    if (c.getClass() == CopyOnWriteArrayList.class) // 类型相同</span></span>
<span class="line"><span>        // 获取c集合的数组</span></span>
<span class="line"><span>        elements = ((CopyOnWriteArrayList&lt;?&gt;)c).getArray();</span></span>
<span class="line"><span>    else { // 类型不相同</span></span>
<span class="line"><span>        // 将c集合转化为数组并赋值给elements</span></span>
<span class="line"><span>        elements = c.toArray();</span></span>
<span class="line"><span>        // c.toArray might (incorrectly) not return Object[] (see 6260652)</span></span>
<span class="line"><span>        if (elements.getClass() != Object[].class) // elements类型不为Object[]类型</span></span>
<span class="line"><span>            // 将elements数组转化为Object[]类型的数组</span></span>
<span class="line"><span>            elements = Arrays.copyOf(elements, elements.length, Object[].class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 设置数组</span></span>
<span class="line"><span>    setArray(elements);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该构造函数的处理流程如下</p><ul><li><p>判断传入的集合c的类型是否为CopyOnWriteArrayList类型，若是，则获取该集合类型的底层数组(Object[])，并且设置当前CopyOnWriteArrayList的数组(Object[]数组)，进入步骤③；否则，进入步骤②</p></li><li><p>将传入的集合转化为数组elements，判断elements的类型是否为Object[]类型(toArray方法可能不会返回Object类型的数组)，若不是，则将elements转化为Object类型的数组。进入步骤③</p></li><li><p>设置当前CopyOnWriteArrayList的Object[]为elements。</p></li><li><p><code>CopyOnWriteArrayList(E[])</code>型构造函数</p></li></ul><p>该构造函数用于创建一个保存给定数组的副本的列表。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public CopyOnWriteArrayList(E[] toCopyIn) {</span></span>
<span class="line"><span>    // 将toCopyIn转化为Object[]类型数组，然后设置当前数组</span></span>
<span class="line"><span>    setArray(Arrays.copyOf(toCopyIn, toCopyIn.length, Object[].class));</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="核心函数分析" tabindex="-1">核心函数分析 <a class="header-anchor" href="#核心函数分析" aria-label="Permalink to &quot;核心函数分析&quot;">​</a></h3><p>对于CopyOnWriteArrayList的函数分析，主要明白Arrays.copyOf方法即可理解CopyOnWriteArrayList其他函数的意义。</p><h4 id="copyof函数" tabindex="-1">copyOf函数 <a class="header-anchor" href="#copyof函数" aria-label="Permalink to &quot;copyOf函数&quot;">​</a></h4><p>该函数用于复制指定的数组，截取或用 null 填充(如有必要)，以使副本具有指定的长度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &lt;T,U&gt; T[] copyOf(U[] original, int newLength, Class&lt;? extends T[]&gt; newType) {</span></span>
<span class="line"><span>    @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>    // 确定copy的类型(将newType转化为Object类型，将Object[].class转化为Object类型，判断两者是否相等，若相等，则生成指定长度的Object数组</span></span>
<span class="line"><span>    // 否则,生成指定长度的新类型的数组)</span></span>
<span class="line"><span>    T[] copy = ((Object)newType == (Object)Object[].class)</span></span>
<span class="line"><span>        ? (T[]) new Object[newLength]</span></span>
<span class="line"><span>        : (T[]) Array.newInstance(newType.getComponentType(), newLength);</span></span>
<span class="line"><span>    // 将original数组从下标0开始，复制长度为(original.length和newLength的较小者),复制到copy数组中(也从下标0开始)</span></span>
<span class="line"><span>    System.arraycopy(original, 0, copy, 0,</span></span>
<span class="line"><span>                        Math.min(original.length, newLength));</span></span>
<span class="line"><span>    return copy;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="add函数" tabindex="-1">add函数 <a class="header-anchor" href="#add函数" aria-label="Permalink to &quot;add函数&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean add(E e) {</span></span>
<span class="line"><span>    // 可重入锁</span></span>
<span class="line"><span>    final ReentrantLock lock = this.lock;</span></span>
<span class="line"><span>    // 获取锁</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 元素数组</span></span>
<span class="line"><span>        Object[] elements = getArray();</span></span>
<span class="line"><span>        // 数组长度</span></span>
<span class="line"><span>        int len = elements.length;</span></span>
<span class="line"><span>        // 复制数组</span></span>
<span class="line"><span>        Object[] newElements = Arrays.copyOf(elements, len + 1);</span></span>
<span class="line"><span>        // 存放元素e</span></span>
<span class="line"><span>        newElements[len] = e;</span></span>
<span class="line"><span>        // 设置数组</span></span>
<span class="line"><span>        setArray(newElements);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        // 释放锁</span></span>
<span class="line"><span>        lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>此函数用于将指定元素添加到此列表的尾部，处理流程如下</p><ul><li><p>获取锁(保证多线程的安全访问)，获取当前的Object数组，获取Object数组的长度为length，进入步骤②。</p></li><li><p>根据Object数组复制一个长度为length+1的Object数组为newElements(此时，newElements[length]为null)，进入下一步骤。</p></li><li><p>将下标为length的数组元素newElements[length]设置为元素e，再设置当前Object[]为newElements，释放锁，返回。这样就完成了元素的添加。</p></li></ul><h4 id="addifabsent方法" tabindex="-1">addIfAbsent方法 <a class="header-anchor" href="#addifabsent方法" aria-label="Permalink to &quot;addIfAbsent方法&quot;">​</a></h4><p>该函数用于添加元素(如果数组中不存在，则添加；否则，不添加，直接返回)，可以保证多线程环境下不会重复添加元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private boolean addIfAbsent(E e, Object[] snapshot) {</span></span>
<span class="line"><span>    // 重入锁</span></span>
<span class="line"><span>    final ReentrantLock lock = this.lock;</span></span>
<span class="line"><span>    // 获取锁</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 获取数组</span></span>
<span class="line"><span>        Object[] current = getArray();</span></span>
<span class="line"><span>        // 数组长度</span></span>
<span class="line"><span>        int len = current.length;</span></span>
<span class="line"><span>        if (snapshot != current) { // 快照不等于当前数组，对数组进行了修改</span></span>
<span class="line"><span>            // Optimize for lost race to another addXXX operation</span></span>
<span class="line"><span>            // 取较小者</span></span>
<span class="line"><span>            int common = Math.min(snapshot.length, len);</span></span>
<span class="line"><span>            for (int i = 0; i &lt; common; i++) // 遍历</span></span>
<span class="line"><span>                if (current[i] != snapshot[i] &amp;&amp; eq(e, current[i])) // 当前数组的元素与快照的元素不相等并且e与当前元素相等</span></span>
<span class="line"><span>                    // 表示在snapshot与current之间修改了数组，并且设置了数组某一元素为e，已经存在</span></span>
<span class="line"><span>                    // 返回</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>            if (indexOf(e, current, common, len) &gt;= 0) // 在当前数组中找到e元素</span></span>
<span class="line"><span>                    // 返回</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 复制数组</span></span>
<span class="line"><span>        Object[] newElements = Arrays.copyOf(current, len + 1);</span></span>
<span class="line"><span>        // 对数组len索引的元素赋值为e</span></span>
<span class="line"><span>        newElements[len] = e;</span></span>
<span class="line"><span>        // 设置数组</span></span>
<span class="line"><span>        setArray(newElements);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        // 释放锁</span></span>
<span class="line"><span>        lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该函数的流程如下:</p><p>① 获取锁，获取当前数组为current，current长度为len，判断数组之前的快照snapshot是否等于当前数组current，若不相等，则进入步骤②；否则，进入步骤④</p><p>② 不相等，表示在snapshot与current之间，对数组进行了修改(如进行了add、set、remove等操作)，获取长度(snapshot与current之间的较小者)，对current进行遍历操作，若遍历过程发现snapshot与current的元素不相等并且current的元素与指定元素相等(可能进行了set操作)，进入步骤⑤，否则，进入步骤③</p><p>③ 在当前数组中索引指定元素，若能够找到，进入步骤⑤，否则，进入步骤④</p><p>④ 复制当前数组current为newElements，长度为len+1，此时newElements[len]为null。再设置newElements[len]为指定元素e，再设置数组，进入步骤⑤</p><p>⑤ 释放锁，返回。</p><h4 id="set函数" tabindex="-1">set函数 <a class="header-anchor" href="#set函数" aria-label="Permalink to &quot;set函数&quot;">​</a></h4><p>此函数用于用指定的元素替代此列表指定位置上的元素，也是基于数组的复制来实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public E set(int index, E element) {</span></span>
<span class="line"><span>    // 可重入锁</span></span>
<span class="line"><span>    final ReentrantLock lock = this.lock;</span></span>
<span class="line"><span>    // 获取锁</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 获取数组</span></span>
<span class="line"><span>        Object[] elements = getArray();</span></span>
<span class="line"><span>        // 获取index索引的元素</span></span>
<span class="line"><span>        E oldValue = get(elements, index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (oldValue != element) { // 旧值等于element</span></span>
<span class="line"><span>            // 数组长度</span></span>
<span class="line"><span>            int len = elements.length;</span></span>
<span class="line"><span>            // 复制数组</span></span>
<span class="line"><span>            Object[] newElements = Arrays.copyOf(elements, len);</span></span>
<span class="line"><span>            // 重新赋值index索引的值</span></span>
<span class="line"><span>            newElements[index] = element;</span></span>
<span class="line"><span>            // 设置数组</span></span>
<span class="line"><span>            setArray(newElements);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            // Not quite a no-op; ensures volatile write semantics</span></span>
<span class="line"><span>            // 设置数组</span></span>
<span class="line"><span>            setArray(elements);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 返回旧值</span></span>
<span class="line"><span>        return oldValue;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        // 释放锁</span></span>
<span class="line"><span>        lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="remove函数" tabindex="-1">remove函数 <a class="header-anchor" href="#remove函数" aria-label="Permalink to &quot;remove函数&quot;">​</a></h4><p>此函数用于移除此列表指定位置上的元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public E remove(int index) {</span></span>
<span class="line"><span>    // 可重入锁</span></span>
<span class="line"><span>    final ReentrantLock lock = this.lock;</span></span>
<span class="line"><span>    // 获取锁</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 获取数组</span></span>
<span class="line"><span>        Object[] elements = getArray();</span></span>
<span class="line"><span>        // 数组长度</span></span>
<span class="line"><span>        int len = elements.length;</span></span>
<span class="line"><span>        // 获取旧值</span></span>
<span class="line"><span>        E oldValue = get(elements, index);</span></span>
<span class="line"><span>        // 需要移动的元素个数</span></span>
<span class="line"><span>        int numMoved = len - index - 1;</span></span>
<span class="line"><span>        if (numMoved == 0) // 移动个数为0</span></span>
<span class="line"><span>            // 复制后设置数组</span></span>
<span class="line"><span>            setArray(Arrays.copyOf(elements, len - 1));</span></span>
<span class="line"><span>        else { // 移动个数不为0</span></span>
<span class="line"><span>            // 新生数组</span></span>
<span class="line"><span>            Object[] newElements = new Object[len - 1];</span></span>
<span class="line"><span>            // 复制index索引之前的元素</span></span>
<span class="line"><span>            System.arraycopy(elements, 0, newElements, 0, index);</span></span>
<span class="line"><span>            // 复制index索引之后的元素</span></span>
<span class="line"><span>            System.arraycopy(elements, index + 1, newElements, index,</span></span>
<span class="line"><span>                                numMoved);</span></span>
<span class="line"><span>            // 设置索引</span></span>
<span class="line"><span>            setArray(newElements);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 返回旧值</span></span>
<span class="line"><span>        return oldValue;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        // 释放锁</span></span>
<span class="line"><span>        lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>处理流程如下</p><p>① 获取锁，获取数组elements，数组长度为length，获取索引的值elements[index]，计算需要移动的元素个数(length - index - 1),若个数为0，则表示移除的是数组的最后一个元素，复制elements数组，复制长度为length-1，然后设置数组，进入步骤③；否则，进入步骤②</p><p>② 先复制index索引前的元素，再复制index索引后的元素，然后设置数组。</p><p>③ 释放锁，返回旧值。</p><h2 id="copyonwritearraylist示例" tabindex="-1">CopyOnWriteArrayList示例 <a class="header-anchor" href="#copyonwritearraylist示例" aria-label="Permalink to &quot;CopyOnWriteArrayList示例&quot;">​</a></h2><p>下面通过一个示例来了解CopyOnWriteArrayList的使用: 在程序中，有一个PutThread线程会每隔50ms就向CopyOnWriteArrayList中添加一个元素，并且两次使用了迭代器，迭代器输出的内容都是生成迭代器时，CopyOnWriteArrayList的Object数组的快照的内容，在迭代的过程中，往CopyOnWriteArrayList中添加元素也不会抛出异常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.Iterator;</span></span>
<span class="line"><span>import java.util.concurrent.CopyOnWriteArrayList;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class PutThread extends Thread {</span></span>
<span class="line"><span>    private CopyOnWriteArrayList&lt;Integer&gt; cowal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public PutThread(CopyOnWriteArrayList&lt;Integer&gt; cowal) {</span></span>
<span class="line"><span>        this.cowal = cowal;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            for (int i = 100; i &lt; 110; i++) {</span></span>
<span class="line"><span>                cowal.add(i);</span></span>
<span class="line"><span>                Thread.sleep(50);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class CopyOnWriteArrayListDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        CopyOnWriteArrayList&lt;Integer&gt; cowal = new CopyOnWriteArrayList&lt;Integer&gt;();</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 10; i++) {</span></span>
<span class="line"><span>            cowal.add(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        PutThread p1 = new PutThread(cowal);</span></span>
<span class="line"><span>        p1.start();</span></span>
<span class="line"><span>        Iterator&lt;Integer&gt; iterator = cowal.iterator();</span></span>
<span class="line"><span>        while (iterator.hasNext()) {</span></span>
<span class="line"><span>            System.out.print(iterator.next() + &quot; &quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.println();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(200);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        iterator = cowal.iterator();</span></span>
<span class="line"><span>        while (iterator.hasNext()) {</span></span>
<span class="line"><span>            System.out.print(iterator.next() + &quot; &quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果(某一次)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0 1 2 3 4 5 6 7 8 9 100 </span></span>
<span class="line"><span>0 1 2 3 4 5 6 7 8 9 100 101 102 103</span></span></code></pre></div><h2 id="更深入理解" tabindex="-1">更深入理解 <a class="header-anchor" href="#更深入理解" aria-label="Permalink to &quot;更深入理解&quot;">​</a></h2><h3 id="copyonwritearraylist的缺陷和使用场景" tabindex="-1">CopyOnWriteArrayList的缺陷和使用场景 <a class="header-anchor" href="#copyonwritearraylist的缺陷和使用场景" aria-label="Permalink to &quot;CopyOnWriteArrayList的缺陷和使用场景&quot;">​</a></h3><p>CopyOnWriteArrayList 有几个缺点：</p><ul><li><p>由于写操作的时候，需要拷贝数组，会消耗内存，如果原数组的内容比较多的情况下，可能导致young gc或者full gc</p></li><li><p>不能用于实时读的场景，像拷贝数组、新增元素都需要时间，所以调用一个set操作后，读取到数据可能还是旧的,虽然CopyOnWriteArrayList 能做到最终一致性,但是还是没法满足实时性要求；</p></li></ul><p><strong>CopyOnWriteArrayList 合适读多写少的场景，不过这类慎用</strong></p><p>因为谁也没法保证CopyOnWriteArrayList 到底要放置多少数据，万一数据稍微有点多，每次add/set都要重新复制数组，这个代价实在太高昂了。在高性能的互联网应用中，这种操作分分钟引起故障。</p><h3 id="copyonwritearraylist为什么并发安全且性能比vector好" tabindex="-1">CopyOnWriteArrayList为什么并发安全且性能比Vector好? <a class="header-anchor" href="#copyonwritearraylist为什么并发安全且性能比vector好" aria-label="Permalink to &quot;CopyOnWriteArrayList为什么并发安全且性能比Vector好?&quot;">​</a></h3><p>Vector对单独的add，remove等方法都是在方法上加了synchronized; 并且如果一个线程A调用size时，另一个线程B 执行了remove，然后size的值就不是最新的，然后线程A调用remove就会越界(这时就需要再加一个Synchronized)。这样就导致有了双重锁，效率大大降低，何必呢。于是vector废弃了，要用就用CopyOnWriteArrayList 吧。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5547853.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5547853.html，在此基础上做了增改。</a></li><li><a href="https://blog.csdn.net/LuoZheng4698729/article/details/102824923" target="_blank" rel="noreferrer">https://blog.csdn.net/LuoZheng4698729/article/details/102824923</a></li><li><a href="https://blog.csdn.net/chuanyingcao2675/article/details/101048889" target="_blank" rel="noreferrer">https://blog.csdn.net/chuanyingcao2675/article/details/101048889</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,70)]))}const y=s(l,[["render",t]]);export{u as __pageData,y as default};
