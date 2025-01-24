import{_ as a,a as s}from"./chunks/ArrayList_add.lsAQMjpC.js";import{_ as e,c as p,ai as i,o as l}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/collection/ArrayList_grow.png",f=JSON.parse('{"title":"Collection - ArrayList 源码解析","description":"","frontmatter":{},"headers":[],"relativePath":"java/collection/java-collection-ArrayList.md","filePath":"java/collection/java-collection-ArrayList.md","lastUpdated":1737706346000}'),c={name:"java/collection/java-collection-ArrayList.md"};function o(r,n,d,h,m,u){return l(),p("div",null,n[0]||(n[0]=[i('<h1 id="collection-arraylist-源码解析" tabindex="-1">Collection - ArrayList 源码解析 <a class="header-anchor" href="#collection-arraylist-源码解析" aria-label="Permalink to &quot;Collection - ArrayList 源码解析&quot;">​</a></h1><blockquote><p>本文主要对Collection - ArrayList进行源码解析。@pdai</p></blockquote><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p>_ArrayList_实现了_List_接口，是顺序容器，即元素存放的数据与放进去的顺序相同，允许放入<code>null</code>元素，底层通过<strong>数组实现</strong>。除该类未实现同步外，其余跟_Vector_大致相同。每个_ArrayList_都有一个容量(capacity)，表示底层数组的实际大小，容器内存储元素的个数不能多于当前容量。当向容器中添加元素时，如果容量不足，容器会自动增大底层数组的大小。前面已经提过，Java泛型只是编译器提供的语法糖，所以这里的数组是一个Object数组，以便能够容纳任何类型的对象。</p><p><img src="'+a+`" alt="ArrayList_base"></p><p>size(), isEmpty(), get(), set()方法均能在常数时间内完成，add()方法的时间开销跟插入位置有关，addAll()方法的时间开销跟添加元素的个数成正比。其余方法大都是线性时间。</p><p>为追求效率，ArrayList没有实现同步(synchronized)，如果需要多个线程并发访问，用户可以手动同步，也可使用Vector替代。</p><h2 id="arraylist的实现" tabindex="-1">ArrayList的实现 <a class="header-anchor" href="#arraylist的实现" aria-label="Permalink to &quot;ArrayList的实现&quot;">​</a></h2><h3 id="底层数据结构" tabindex="-1">底层数据结构 <a class="header-anchor" href="#底层数据结构" aria-label="Permalink to &quot;底层数据结构&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	/**</span></span>
<span class="line"><span>     * The array buffer into which the elements of the ArrayList are stored.</span></span>
<span class="line"><span>     * The capacity of the ArrayList is the length of this array buffer. Any</span></span>
<span class="line"><span>     * empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA</span></span>
<span class="line"><span>     * will be expanded to DEFAULT_CAPACITY when the first element is added.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    transient Object[] elementData; // non-private to simplify nested class access</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * The size of the ArrayList (the number of elements it contains).</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @serial</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int size;</span></span></code></pre></div><h3 id="构造函数" tabindex="-1">构造函数 <a class="header-anchor" href="#构造函数" aria-label="Permalink to &quot;构造函数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	/**</span></span>
<span class="line"><span>     * Constructs an empty list with the specified initial capacity.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param  initialCapacity  the initial capacity of the list</span></span>
<span class="line"><span>     * @throws IllegalArgumentException if the specified initial capacity</span></span>
<span class="line"><span>     *         is negative</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public ArrayList(int initialCapacity) {</span></span>
<span class="line"><span>        if (initialCapacity &gt; 0) {</span></span>
<span class="line"><span>            this.elementData = new Object[initialCapacity];</span></span>
<span class="line"><span>        } else if (initialCapacity == 0) {</span></span>
<span class="line"><span>            this.elementData = EMPTY_ELEMENTDATA;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;Illegal Capacity: &quot;+</span></span>
<span class="line"><span>                                               initialCapacity);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Constructs an empty list with an initial capacity of ten.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public ArrayList() {</span></span>
<span class="line"><span>        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Constructs a list containing the elements of the specified</span></span>
<span class="line"><span>     * collection, in the order they are returned by the collection&#39;s</span></span>
<span class="line"><span>     * iterator.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param c the collection whose elements are to be placed into this list</span></span>
<span class="line"><span>     * @throws NullPointerException if the specified collection is null</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public ArrayList(Collection&lt;? extends E&gt; c) {</span></span>
<span class="line"><span>        elementData = c.toArray();</span></span>
<span class="line"><span>        if ((size = elementData.length) != 0) {</span></span>
<span class="line"><span>            // c.toArray might (incorrectly) not return Object[] (see 6260652)</span></span>
<span class="line"><span>            if (elementData.getClass() != Object[].class)</span></span>
<span class="line"><span>                elementData = Arrays.copyOf(elementData, size, Object[].class);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            // replace with empty array.</span></span>
<span class="line"><span>            this.elementData = EMPTY_ELEMENTDATA;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="自动扩容" tabindex="-1">自动扩容 <a class="header-anchor" href="#自动扩容" aria-label="Permalink to &quot;自动扩容&quot;">​</a></h3><p>每当向数组中添加元素时，都要去检查添加后元素的个数是否会超出当前数组的长度，如果超出，数组将会进行扩容，以满足添加数据的需求。数组扩容通过一个公开的方法ensureCapacity(int minCapacity)来实现。在实际添加大量元素前，我也可以使用ensureCapacity来手动增加ArrayList实例的容量，以减少递增式再分配的数量。</p><p>数组进行扩容时，会将老数组中的元素重新拷贝一份到新的数组中，每次数组容量的增长大约是其原容量的1.5倍。这种操作的代价是很高的，因此在实际使用时，我们应该尽量避免数组容量的扩张。当我们可预知要保存的元素的多少时，要在构造ArrayList实例时，就指定其容量，以避免数组扩容的发生。或者根据实际需求，通过调用ensureCapacity方法来手动增加ArrayList实例的容量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Increases the capacity of this &lt;tt&gt;ArrayList&lt;/tt&gt; instance, if</span></span>
<span class="line"><span>     * necessary, to ensure that it can hold at least the number of elements</span></span>
<span class="line"><span>     * specified by the minimum capacity argument.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param   minCapacity   the desired minimum capacity</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void ensureCapacity(int minCapacity) {</span></span>
<span class="line"><span>        int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)</span></span>
<span class="line"><span>            // any size if not default element table</span></span>
<span class="line"><span>            ? 0</span></span>
<span class="line"><span>            // larger than default for default empty table. It&#39;s already</span></span>
<span class="line"><span>            // supposed to be at default size.</span></span>
<span class="line"><span>            : DEFAULT_CAPACITY;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (minCapacity &gt; minExpand) {</span></span>
<span class="line"><span>            ensureExplicitCapacity(minCapacity);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void ensureCapacityInternal(int minCapacity) {</span></span>
<span class="line"><span>        if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {</span></span>
<span class="line"><span>            minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ensureExplicitCapacity(minCapacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void ensureExplicitCapacity(int minCapacity) {</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // overflow-conscious code</span></span>
<span class="line"><span>        if (minCapacity - elementData.length &gt; 0)</span></span>
<span class="line"><span>            grow(minCapacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * The maximum size of array to allocate.</span></span>
<span class="line"><span>     * Some VMs reserve some header words in an array.</span></span>
<span class="line"><span>     * Attempts to allocate larger arrays may result in</span></span>
<span class="line"><span>     * OutOfMemoryError: Requested array size exceeds VM limit</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Increases the capacity to ensure that it can hold at least the</span></span>
<span class="line"><span>     * number of elements specified by the minimum capacity argument.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param minCapacity the desired minimum capacity</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void grow(int minCapacity) {</span></span>
<span class="line"><span>        // overflow-conscious code</span></span>
<span class="line"><span>        int oldCapacity = elementData.length;</span></span>
<span class="line"><span>        int newCapacity = oldCapacity + (oldCapacity &gt;&gt; 1);</span></span>
<span class="line"><span>        if (newCapacity - minCapacity &lt; 0)</span></span>
<span class="line"><span>            newCapacity = minCapacity;</span></span>
<span class="line"><span>        if (newCapacity - MAX_ARRAY_SIZE &gt; 0)</span></span>
<span class="line"><span>            newCapacity = hugeCapacity(minCapacity);</span></span>
<span class="line"><span>        // minCapacity is usually close to size, so this is a win:</span></span>
<span class="line"><span>        elementData = Arrays.copyOf(elementData, newCapacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static int hugeCapacity(int minCapacity) {</span></span>
<span class="line"><span>        if (minCapacity &lt; 0) // overflow</span></span>
<span class="line"><span>            throw new OutOfMemoryError();</span></span>
<span class="line"><span>        return (minCapacity &gt; MAX_ARRAY_SIZE) ?</span></span>
<span class="line"><span>            Integer.MAX_VALUE :</span></span>
<span class="line"><span>            MAX_ARRAY_SIZE;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p><img src="`+t+`" alt="ArrayList_grow"></p><h3 id="add-addall" tabindex="-1">add(), addAll() <a class="header-anchor" href="#add-addall" aria-label="Permalink to &quot;add(), addAll()&quot;">​</a></h3><p>跟C++ 的_vector_不同，_ArrayList_没有<code>push_back()</code>方法，对应的方法是<code>add(E e)</code>，_ArrayList_也没有<code>insert()</code>方法，对应的方法是<code>add(int index, E e)</code>。这两个方法都是向容器中添加新元素，这可能会导致_capacity_不足，因此在添加元素之前，都需要进行剩余空间检查，如果需要则自动扩容。扩容操作最终是通过<code>grow()</code>方法完成的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Appends the specified element to the end of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param e element to be appended to this list</span></span>
<span class="line"><span>     * @return &lt;tt&gt;true&lt;/tt&gt; (as specified by {@link Collection#add})</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean add(E e) {</span></span>
<span class="line"><span>        ensureCapacityInternal(size + 1);  // Increments modCount!!</span></span>
<span class="line"><span>        elementData[size++] = e;</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Inserts the specified element at the specified position in this</span></span>
<span class="line"><span>     * list. Shifts the element currently at that position (if any) and</span></span>
<span class="line"><span>     * any subsequent elements to the right (adds one to their indices).</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param index index at which the specified element is to be inserted</span></span>
<span class="line"><span>     * @param element element to be inserted</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void add(int index, E element) {</span></span>
<span class="line"><span>        rangeCheckForAdd(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ensureCapacityInternal(size + 1);  // Increments modCount!!</span></span>
<span class="line"><span>        System.arraycopy(elementData, index, elementData, index + 1,</span></span>
<span class="line"><span>                         size - index);</span></span>
<span class="line"><span>        elementData[index] = element;</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p><img src="`+s+`" alt="ArrayList_add"></p><p><code>add(int index, E e)</code>需要先对元素进行移动，然后完成插入操作，也就意味着该方法有着线性的时间复杂度。</p><p><code>addAll()</code>方法能够一次添加多个元素，根据位置不同也有两个版本，一个是在末尾添加的<code>addAll(Collection&lt;? extends E&gt; c)</code>方法，一个是从指定位置开始插入的<code>addAll(int index, Collection&lt;? extends E&gt; c)</code>方法。跟<code>add()</code>方法类似，在插入之前也需要进行空间检查，如果需要则自动扩容；如果从指定位置插入，也会存在移动元素的情况。 <code>addAll()</code>的时间复杂度不仅跟插入元素的多少有关，也跟插入的位置相关。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Appends all of the elements in the specified collection to the end of</span></span>
<span class="line"><span>     * this list, in the order that they are returned by the</span></span>
<span class="line"><span>     * specified collection&#39;s Iterator.  The behavior of this operation is</span></span>
<span class="line"><span>     * undefined if the specified collection is modified while the operation</span></span>
<span class="line"><span>     * is in progress.  (This implies that the behavior of this call is</span></span>
<span class="line"><span>     * undefined if the specified collection is this list, and this</span></span>
<span class="line"><span>     * list is nonempty.)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param c collection containing elements to be added to this list</span></span>
<span class="line"><span>     * @return &lt;tt&gt;true&lt;/tt&gt; if this list changed as a result of the call</span></span>
<span class="line"><span>     * @throws NullPointerException if the specified collection is null</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean addAll(Collection&lt;? extends E&gt; c) {</span></span>
<span class="line"><span>        Object[] a = c.toArray();</span></span>
<span class="line"><span>        int numNew = a.length;</span></span>
<span class="line"><span>        ensureCapacityInternal(size + numNew);  // Increments modCount</span></span>
<span class="line"><span>        System.arraycopy(a, 0, elementData, size, numNew);</span></span>
<span class="line"><span>        size += numNew;</span></span>
<span class="line"><span>        return numNew != 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Inserts all of the elements in the specified collection into this</span></span>
<span class="line"><span>     * list, starting at the specified position.  Shifts the element</span></span>
<span class="line"><span>     * currently at that position (if any) and any subsequent elements to</span></span>
<span class="line"><span>     * the right (increases their indices).  The new elements will appear</span></span>
<span class="line"><span>     * in the list in the order that they are returned by the</span></span>
<span class="line"><span>     * specified collection&#39;s iterator.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param index index at which to insert the first element from the</span></span>
<span class="line"><span>     *              specified collection</span></span>
<span class="line"><span>     * @param c collection containing elements to be added to this list</span></span>
<span class="line"><span>     * @return &lt;tt&gt;true&lt;/tt&gt; if this list changed as a result of the call</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     * @throws NullPointerException if the specified collection is null</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean addAll(int index, Collection&lt;? extends E&gt; c) {</span></span>
<span class="line"><span>        rangeCheckForAdd(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Object[] a = c.toArray();</span></span>
<span class="line"><span>        int numNew = a.length;</span></span>
<span class="line"><span>        ensureCapacityInternal(size + numNew);  // Increments modCount</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int numMoved = size - index;</span></span>
<span class="line"><span>        if (numMoved &gt; 0)</span></span>
<span class="line"><span>            System.arraycopy(elementData, index, elementData, index + numNew,</span></span>
<span class="line"><span>                             numMoved);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.arraycopy(a, 0, elementData, index, numNew);</span></span>
<span class="line"><span>        size += numNew;</span></span>
<span class="line"><span>        return numNew != 0;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="set" tabindex="-1">set() <a class="header-anchor" href="#set" aria-label="Permalink to &quot;set()&quot;">​</a></h3><p>既然底层是一个数组_ArrayList_的<code>set()</code>方法也就变得非常简单，直接对数组的指定位置赋值即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public E set(int index, E element) {</span></span>
<span class="line"><span>    rangeCheck(index);//下标越界检查</span></span>
<span class="line"><span>    E oldValue = elementData(index);</span></span>
<span class="line"><span>    elementData[index] = element;//赋值到指定位置，复制的仅仅是引用</span></span>
<span class="line"><span>    return oldValue;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="get" tabindex="-1">get() <a class="header-anchor" href="#get" aria-label="Permalink to &quot;get()&quot;">​</a></h3><p><code>get()</code>方法同样很简单，唯一要注意的是由于底层数组是Object[]，得到元素后需要进行类型转换。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public E get(int index) {</span></span>
<span class="line"><span>    rangeCheck(index);</span></span>
<span class="line"><span>    return (E) elementData[index];//注意类型转换</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="remove" tabindex="-1">remove() <a class="header-anchor" href="#remove" aria-label="Permalink to &quot;remove()&quot;">​</a></h3><p><code>remove()</code>方法也有两个版本，一个是<code>remove(int index)</code>删除指定位置的元素，另一个是<code>remove(Object o)</code>删除第一个满足<code>o.equals(elementData[index])</code>的元素。删除操作是<code>add()</code>操作的逆过程，需要将删除点之后的元素向前移动一个位置。需要注意的是为了让GC起作用，必须显式的为最后一个位置赋<code>null</code>值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public E remove(int index) {</span></span>
<span class="line"><span>    rangeCheck(index);</span></span>
<span class="line"><span>    modCount++;</span></span>
<span class="line"><span>    E oldValue = elementData(index);</span></span>
<span class="line"><span>    int numMoved = size - index - 1;</span></span>
<span class="line"><span>    if (numMoved &gt; 0)</span></span>
<span class="line"><span>        System.arraycopy(elementData, index+1, elementData, index, numMoved);</span></span>
<span class="line"><span>    elementData[--size] = null; //清除该位置的引用，让GC起作用</span></span>
<span class="line"><span>    return oldValue;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>关于Java GC这里需要特别说明一下，<strong>有了垃圾收集器并不意味着一定不会有内存泄漏</strong>。对象能否被GC的依据是是否还有引用指向它，上面代码中如果不手动赋<code>null</code>值，除非对应的位置被其他元素覆盖，否则原来的对象就一直不会被回收。</p><h3 id="trimtosize" tabindex="-1">trimToSize() <a class="header-anchor" href="#trimtosize" aria-label="Permalink to &quot;trimToSize()&quot;">​</a></h3><p>ArrayList还给我们提供了将底层数组的容量调整为当前列表保存的实际元素的大小的功能。它可以通过trimToSize方法来实现。代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Trims the capacity of this &lt;tt&gt;ArrayList&lt;/tt&gt; instance to be the</span></span>
<span class="line"><span>     * list&#39;s current size.  An application can use this operation to minimize</span></span>
<span class="line"><span>     * the storage of an &lt;tt&gt;ArrayList&lt;/tt&gt; instance.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void trimToSize() {</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>        if (size &lt; elementData.length) {</span></span>
<span class="line"><span>            elementData = (size == 0)</span></span>
<span class="line"><span>              ? EMPTY_ELEMENTDATA</span></span>
<span class="line"><span>              : Arrays.copyOf(elementData, size);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="indexof-lastindexof" tabindex="-1">indexOf(), lastIndexOf() <a class="header-anchor" href="#indexof-lastindexof" aria-label="Permalink to &quot;indexOf(), lastIndexOf()&quot;">​</a></h3><p>获取元素的第一次出现的index:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>     * Returns the index of the first occurrence of the specified element</span></span>
<span class="line"><span>     * in this list, or -1 if this list does not contain the element.</span></span>
<span class="line"><span>     * More formally, returns the lowest index &lt;tt&gt;i&lt;/tt&gt; such that</span></span>
<span class="line"><span>     * &lt;tt&gt;(o==null&amp;nbsp;?&amp;nbsp;get(i)==null&amp;nbsp;:&amp;nbsp;o.equals(get(i)))&lt;/tt&gt;,</span></span>
<span class="line"><span>     * or -1 if there is no such index.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public int indexOf(Object o) {</span></span>
<span class="line"><span>        if (o == null) {</span></span>
<span class="line"><span>            for (int i = 0; i &lt; size; i++)</span></span>
<span class="line"><span>                if (elementData[i]==null)</span></span>
<span class="line"><span>                    return i;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            for (int i = 0; i &lt; size; i++)</span></span>
<span class="line"><span>                if (o.equals(elementData[i]))</span></span>
<span class="line"><span>                    return i;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>获取元素的最后一次出现的index:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the index of the last occurrence of the specified element</span></span>
<span class="line"><span>     * in this list, or -1 if this list does not contain the element.</span></span>
<span class="line"><span>     * More formally, returns the highest index &lt;tt&gt;i&lt;/tt&gt; such that</span></span>
<span class="line"><span>     * &lt;tt&gt;(o==null&amp;nbsp;?&amp;nbsp;get(i)==null&amp;nbsp;:&amp;nbsp;o.equals(get(i)))&lt;/tt&gt;,</span></span>
<span class="line"><span>     * or -1 if there is no such index.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public int lastIndexOf(Object o) {</span></span>
<span class="line"><span>        if (o == null) {</span></span>
<span class="line"><span>            for (int i = size-1; i &gt;= 0; i--)</span></span>
<span class="line"><span>                if (elementData[i]==null)</span></span>
<span class="line"><span>                    return i;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            for (int i = size-1; i &gt;= 0; i--)</span></span>
<span class="line"><span>                if (o.equals(elementData[i]))</span></span>
<span class="line"><span>                    return i;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="fail-fast机制" tabindex="-1">Fail-Fast机制: <a class="header-anchor" href="#fail-fast机制" aria-label="Permalink to &quot;Fail-Fast机制:&quot;">​</a></h3><p>ArrayList也采用了快速失败的机制，通过记录modCount参数来实现。在面对并发的修改时，迭代器很快就会完全失败，而不是冒着在将来某个不确定时间发生任意不确定行为的风险。</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li>深入Java集合学习系列: ArrayList的实现原理 <a href="http://zhangshixi.iteye.com/blog/674856" target="_blank" rel="noreferrer">http://zhangshixi.iteye.com/blog/674856</a></li><li>Java ArrayList源码剖析 结合源码对ArrayList进行讲解 <a href="http://www.cnblogs.com/CarpenterLee/p/5419880.html" target="_blank" rel="noreferrer">http://www.cnblogs.com/CarpenterLee/p/5419880.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,47)]))}const b=e(c,[["render",o]]);export{f as __pageData,b as default};
