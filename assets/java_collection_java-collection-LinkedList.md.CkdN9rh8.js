import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/collection/LinkedList_base.png",i="/vitepress-blog-template/images/collection/LinkedList_remove.png",t="/vitepress-blog-template/images/collection/LinkedList_add.png",x=JSON.parse('{"title":"Collection - LinkedList源码解析","description":"","frontmatter":{},"headers":[],"relativePath":"java/collection/java-collection-LinkedList.md","filePath":"java/collection/java-collection-LinkedList.md","lastUpdated":1737706346000}'),c={name:"java/collection/java-collection-LinkedList.md"};function o(r,n,d,h,u,m){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="collection-linkedlist源码解析" tabindex="-1">Collection - LinkedList源码解析 <a class="header-anchor" href="#collection-linkedlist源码解析" aria-label="Permalink to &quot;Collection - LinkedList源码解析&quot;">​</a></h1><blockquote><p>本文主要对Collection - LinkedList进行源码解析。@pdai</p></blockquote><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p><em>LinkedList_同时实现了_List_接口和_Deque_接口，也就是说它既可以看作一个顺序容器，又可以看作一个队列(<em>Queue</em>)，同时又可以看作一个栈(<em>Stack</em>)。这样看来，<em>LinkedList_简直就是个全能冠军。当你需要使用栈或者队列时，可以考虑使用_LinkedList</em>，一方面是因为Java官方已经声明不建议使用_Stack_类，更遗憾的是，Java里根本没有一个叫做_Queue_的类(它是个接口名字)。关于栈或队列，现在的首选是_ArrayDeque</em>，它有着比_LinkedList_(当作栈或队列使用时)有着更好的性能。</p><p><img src="'+l+`" alt="LinkedList_base"></p><p>_LinkedList_的实现方式决定了所有跟下标相关的操作都是线性时间，而在首段或者末尾删除元素只需要常数时间。为追求效率_LinkedList_没有实现同步(synchronized)，如果需要多个线程并发访问，可以先采用<code>Collections.synchronizedList()</code>方法对其进行包装。</p><h2 id="linkedlist实现" tabindex="-1">LinkedList实现 <a class="header-anchor" href="#linkedlist实现" aria-label="Permalink to &quot;LinkedList实现&quot;">​</a></h2><h3 id="底层数据结构" tabindex="-1">底层数据结构 <a class="header-anchor" href="#底层数据结构" aria-label="Permalink to &quot;底层数据结构&quot;">​</a></h3><p>_LinkedList_底层<strong>通过双向链表实现</strong>，本节将着重讲解插入和删除元素时双向链表的维护过程，也即是之间解跟_List_接口相关的函数，而将_Queue_和_Stack_以及_Deque_相关的知识放在下一节讲。双向链表的每个节点用内部类_Node_表示。_LinkedList_通过<code>first</code>和<code>last</code>引用分别指向链表的第一个和最后一个元素。注意这里没有所谓的哑元，当链表为空的时候<code>first</code>和<code>last</code>都指向<code>null</code>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    transient int size = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Pointer to first node.</span></span>
<span class="line"><span>     * Invariant: (first == null &amp;&amp; last == null) ||</span></span>
<span class="line"><span>     *            (first.prev == null &amp;&amp; first.item != null)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    transient Node&lt;E&gt; first;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Pointer to last node.</span></span>
<span class="line"><span>     * Invariant: (first == null &amp;&amp; last == null) ||</span></span>
<span class="line"><span>     *            (last.next == null &amp;&amp; last.item != null)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    transient Node&lt;E&gt; last;</span></span></code></pre></div><p>其中Node是私有的内部类:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    private static class Node&lt;E&gt; {</span></span>
<span class="line"><span>        E item;</span></span>
<span class="line"><span>        Node&lt;E&gt; next;</span></span>
<span class="line"><span>        Node&lt;E&gt; prev;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Node(Node&lt;E&gt; prev, E element, Node&lt;E&gt; next) {</span></span>
<span class="line"><span>            this.item = element;</span></span>
<span class="line"><span>            this.next = next;</span></span>
<span class="line"><span>            this.prev = prev;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="构造函数" tabindex="-1">构造函数 <a class="header-anchor" href="#构造函数" aria-label="Permalink to &quot;构造函数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Constructs an empty list.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public LinkedList() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Constructs a list containing the elements of the specified</span></span>
<span class="line"><span>     * collection, in the order they are returned by the collection&#39;s</span></span>
<span class="line"><span>     * iterator.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param  c the collection whose elements are to be placed into this list</span></span>
<span class="line"><span>     * @throws NullPointerException if the specified collection is null</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public LinkedList(Collection&lt;? extends E&gt; c) {</span></span>
<span class="line"><span>        this();</span></span>
<span class="line"><span>        addAll(c);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="getfirst-getlast" tabindex="-1">getFirst(), getLast() <a class="header-anchor" href="#getfirst-getlast" aria-label="Permalink to &quot;getFirst(), getLast()&quot;">​</a></h3><p>获取第一个元素， 和获取最后一个元素:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the first element in this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the first element in this list</span></span>
<span class="line"><span>     * @throws NoSuchElementException if this list is empty</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E getFirst() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; f = first;</span></span>
<span class="line"><span>        if (f == null)</span></span>
<span class="line"><span>            throw new NoSuchElementException();</span></span>
<span class="line"><span>        return f.item;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the last element in this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the last element in this list</span></span>
<span class="line"><span>     * @throws NoSuchElementException if this list is empty</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E getLast() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; l = last;</span></span>
<span class="line"><span>        if (l == null)</span></span>
<span class="line"><span>            throw new NoSuchElementException();</span></span>
<span class="line"><span>        return l.item;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="removefirst-removelast-remove-e-remove-index" tabindex="-1">removeFirst(), removeLast(), remove(e), remove(index) <a class="header-anchor" href="#removefirst-removelast-remove-e-remove-index" aria-label="Permalink to &quot;removeFirst(), removeLast(), remove(e), remove(index)&quot;">​</a></h3><p><code>remove()</code>方法也有两个版本，一个是删除跟指定元素相等的第一个元素<code>remove(Object o)</code>，另一个是删除指定下标处的元素<code>remove(int index)</code>。</p><p><img src="`+i+`" alt="LinkedList_remove.png"></p><p>删除元素 - 指的是删除第一次出现的这个元素, 如果没有这个元素，则返回false；判断的依据是equals方法， 如果equals，则直接unlink这个node；由于LinkedList可存放null元素，故也可以删除第一次出现null的元素；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Removes the first occurrence of the specified element from this list,</span></span>
<span class="line"><span>     * if it is present.  If this list does not contain the element, it is</span></span>
<span class="line"><span>     * unchanged.  More formally, removes the element with the lowest index</span></span>
<span class="line"><span>     * {@code i} such that</span></span>
<span class="line"><span>     * &lt;tt&gt;(o==null&amp;nbsp;?&amp;nbsp;get(i)==null&amp;nbsp;:&amp;nbsp;o.equals(get(i)))&lt;/tt&gt;</span></span>
<span class="line"><span>     * (if such an element exists).  Returns {@code true} if this list</span></span>
<span class="line"><span>     * contained the specified element (or equivalently, if this list</span></span>
<span class="line"><span>     * changed as a result of the call).</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param o element to be removed from this list, if present</span></span>
<span class="line"><span>     * @return {@code true} if this list contained the specified element</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean remove(Object o) {</span></span>
<span class="line"><span>        if (o == null) {</span></span>
<span class="line"><span>            for (Node&lt;E&gt; x = first; x != null; x = x.next) {</span></span>
<span class="line"><span>                if (x.item == null) {</span></span>
<span class="line"><span>                    unlink(x);</span></span>
<span class="line"><span>                    return true;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            for (Node&lt;E&gt; x = first; x != null; x = x.next) {</span></span>
<span class="line"><span>                if (o.equals(x.item)) {</span></span>
<span class="line"><span>                    unlink(x);</span></span>
<span class="line"><span>                    return true;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Unlinks non-null node x.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    E unlink(Node&lt;E&gt; x) {</span></span>
<span class="line"><span>        // assert x != null;</span></span>
<span class="line"><span>        final E element = x.item;</span></span>
<span class="line"><span>        final Node&lt;E&gt; next = x.next;</span></span>
<span class="line"><span>        final Node&lt;E&gt; prev = x.prev;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (prev == null) {// 第一个元素</span></span>
<span class="line"><span>            first = next;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            prev.next = next;</span></span>
<span class="line"><span>            x.prev = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (next == null) {// 最后一个元素</span></span>
<span class="line"><span>            last = prev;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            next.prev = prev;</span></span>
<span class="line"><span>            x.next = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        x.item = null; // GC</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>        return element;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p><code>remove(int index)</code>使用的是下标计数， 只需要判断该index是否有元素即可，如果有则直接unlink这个node。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Removes the element at the specified position in this list.  Shifts any</span></span>
<span class="line"><span>     * subsequent elements to the left (subtracts one from their indices).</span></span>
<span class="line"><span>     * Returns the element that was removed from the list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param index the index of the element to be removed</span></span>
<span class="line"><span>     * @return the element previously at the specified position</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E remove(int index) {</span></span>
<span class="line"><span>        checkElementIndex(index);</span></span>
<span class="line"><span>        return unlink(node(index));</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>删除head元素:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Removes and returns the first element from this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the first element from this list</span></span>
<span class="line"><span>     * @throws NoSuchElementException if this list is empty</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E removeFirst() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; f = first;</span></span>
<span class="line"><span>        if (f == null)</span></span>
<span class="line"><span>            throw new NoSuchElementException();</span></span>
<span class="line"><span>        return unlinkFirst(f);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Unlinks non-null first node f.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private E unlinkFirst(Node&lt;E&gt; f) {</span></span>
<span class="line"><span>        // assert f == first &amp;&amp; f != null;</span></span>
<span class="line"><span>        final E element = f.item;</span></span>
<span class="line"><span>        final Node&lt;E&gt; next = f.next;</span></span>
<span class="line"><span>        f.item = null;</span></span>
<span class="line"><span>        f.next = null; // help GC</span></span>
<span class="line"><span>        first = next;</span></span>
<span class="line"><span>        if (next == null)</span></span>
<span class="line"><span>            last = null;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            next.prev = null;</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>        return element;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>删除last元素:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	/**</span></span>
<span class="line"><span>     * Removes and returns the last element from this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the last element from this list</span></span>
<span class="line"><span>     * @throws NoSuchElementException if this list is empty</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E removeLast() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; l = last;</span></span>
<span class="line"><span>        if (l == null)</span></span>
<span class="line"><span>            throw new NoSuchElementException();</span></span>
<span class="line"><span>        return unlinkLast(l);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Unlinks non-null last node l.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private E unlinkLast(Node&lt;E&gt; l) {</span></span>
<span class="line"><span>        // assert l == last &amp;&amp; l != null;</span></span>
<span class="line"><span>        final E element = l.item;</span></span>
<span class="line"><span>        final Node&lt;E&gt; prev = l.prev;</span></span>
<span class="line"><span>        l.item = null;</span></span>
<span class="line"><span>        l.prev = null; // help GC</span></span>
<span class="line"><span>        last = prev;</span></span>
<span class="line"><span>        if (prev == null)</span></span>
<span class="line"><span>            first = null;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            prev.next = null;</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>        return element;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="add" tabindex="-1">add() <a class="header-anchor" href="#add" aria-label="Permalink to &quot;add()&quot;">​</a></h3><p>_add()_方法有两个版本，一个是<code>add(E e)</code>，该方法在_LinkedList_的末尾插入元素，因为有<code>last</code>指向链表末尾，在末尾插入元素的花费是常数时间。只需要简单修改几个相关引用即可；另一个是<code>add(int index, E element)</code>，该方法是在指定下表处插入元素，需要先通过线性查找找到具体位置，然后修改相关引用完成插入操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Appends the specified element to the end of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &lt;p&gt;This method is equivalent to {@link #addLast}.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param e element to be appended to this list</span></span>
<span class="line"><span>     * @return {@code true} (as specified by {@link Collection#add})</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean add(E e) {</span></span>
<span class="line"><span>        linkLast(e);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Links e as last element.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    void linkLast(E e) {</span></span>
<span class="line"><span>        final Node&lt;E&gt; l = last;</span></span>
<span class="line"><span>        final Node&lt;E&gt; newNode = new Node&lt;&gt;(l, e, null);</span></span>
<span class="line"><span>        last = newNode;</span></span>
<span class="line"><span>        if (l == null)</span></span>
<span class="line"><span>            first = newNode;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            l.next = newNode;</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p><img src="`+t+`" alt="LinkedList_add"></p><p><code>add(int index, E element)</code>, 当index==size时，等同于add(E e); 如果不是，则分两步: 1.先根据index找到要插入的位置,即node(index)方法；2.修改引用，完成插入操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Inserts the specified element at the specified position in this list.</span></span>
<span class="line"><span>     * Shifts the element currently at that position (if any) and any</span></span>
<span class="line"><span>     * subsequent elements to the right (adds one to their indices).</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param index index at which the specified element is to be inserted</span></span>
<span class="line"><span>     * @param element element to be inserted</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void add(int index, E element) {</span></span>
<span class="line"><span>        checkPositionIndex(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (index == size)</span></span>
<span class="line"><span>            linkLast(element);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            linkBefore(element, node(index));</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>上面代码中的<code>node(int index)</code>函数有一点小小的trick，因为链表双向的，可以从开始往后找，也可以从结尾往前找，具体朝那个方向找取决于条件<code>index &lt; (size &gt;&gt; 1)</code>，也即是index是靠近前端还是后端。从这里也可以看出，linkedList通过index检索元素的效率没有arrayList高。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the (non-null) Node at the specified element index.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    Node&lt;E&gt; node(int index) {</span></span>
<span class="line"><span>        // assert isElementIndex(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (index &lt; (size &gt;&gt; 1)) {</span></span>
<span class="line"><span>            Node&lt;E&gt; x = first;</span></span>
<span class="line"><span>            for (int i = 0; i &lt; index; i++)</span></span>
<span class="line"><span>                x = x.next;</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            Node&lt;E&gt; x = last;</span></span>
<span class="line"><span>            for (int i = size - 1; i &gt; index; i--)</span></span>
<span class="line"><span>                x = x.prev;</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="addall" tabindex="-1">addAll() <a class="header-anchor" href="#addall" aria-label="Permalink to &quot;addAll()&quot;">​</a></h3><p>addAll(index, c) 实现方式并不是直接调用add(index,e)来实现，主要是因为效率的问题，另一个是fail-fast中modCount只会增加1次；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Appends all of the elements in the specified collection to the end of</span></span>
<span class="line"><span>     * this list, in the order that they are returned by the specified</span></span>
<span class="line"><span>     * collection&#39;s iterator.  The behavior of this operation is undefined if</span></span>
<span class="line"><span>     * the specified collection is modified while the operation is in</span></span>
<span class="line"><span>     * progress.  (Note that this will occur if the specified collection is</span></span>
<span class="line"><span>     * this list, and it&#39;s nonempty.)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param c collection containing elements to be added to this list</span></span>
<span class="line"><span>     * @return {@code true} if this list changed as a result of the call</span></span>
<span class="line"><span>     * @throws NullPointerException if the specified collection is null</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean addAll(Collection&lt;? extends E&gt; c) {</span></span>
<span class="line"><span>        return addAll(size, c);</span></span>
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
<span class="line"><span>     * @param index index at which to insert the first element</span></span>
<span class="line"><span>     *              from the specified collection</span></span>
<span class="line"><span>     * @param c collection containing elements to be added to this list</span></span>
<span class="line"><span>     * @return {@code true} if this list changed as a result of the call</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     * @throws NullPointerException if the specified collection is null</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean addAll(int index, Collection&lt;? extends E&gt; c) {</span></span>
<span class="line"><span>        checkPositionIndex(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Object[] a = c.toArray();</span></span>
<span class="line"><span>        int numNew = a.length;</span></span>
<span class="line"><span>        if (numNew == 0)</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Node&lt;E&gt; pred, succ;</span></span>
<span class="line"><span>        if (index == size) {</span></span>
<span class="line"><span>            succ = null;</span></span>
<span class="line"><span>            pred = last;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            succ = node(index);</span></span>
<span class="line"><span>            pred = succ.prev;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (Object o : a) {</span></span>
<span class="line"><span>            @SuppressWarnings(&quot;unchecked&quot;) E e = (E) o;</span></span>
<span class="line"><span>            Node&lt;E&gt; newNode = new Node&lt;&gt;(pred, e, null);</span></span>
<span class="line"><span>            if (pred == null)</span></span>
<span class="line"><span>                first = newNode;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                pred.next = newNode;</span></span>
<span class="line"><span>            pred = newNode;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (succ == null) {</span></span>
<span class="line"><span>            last = pred;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            pred.next = succ;</span></span>
<span class="line"><span>            succ.prev = pred;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        size += numNew;</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="clear" tabindex="-1">clear() <a class="header-anchor" href="#clear" aria-label="Permalink to &quot;clear()&quot;">​</a></h3><p>为了让GC更快可以回收放置的元素，需要将node之间的引用关系赋空。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Removes all of the elements from this list.</span></span>
<span class="line"><span>     * The list will be empty after this call returns.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void clear() {</span></span>
<span class="line"><span>        // Clearing all of the links between nodes is &quot;unnecessary&quot;, but:</span></span>
<span class="line"><span>        // - helps a generational GC if the discarded nodes inhabit</span></span>
<span class="line"><span>        //   more than one generation</span></span>
<span class="line"><span>        // - is sure to free memory even if there is a reachable Iterator</span></span>
<span class="line"><span>        for (Node&lt;E&gt; x = first; x != null; ) {</span></span>
<span class="line"><span>            Node&lt;E&gt; next = x.next;</span></span>
<span class="line"><span>            x.item = null;</span></span>
<span class="line"><span>            x.next = null;</span></span>
<span class="line"><span>            x.prev = null;</span></span>
<span class="line"><span>            x = next;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        first = last = null;</span></span>
<span class="line"><span>        size = 0;</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="positional-access-方法" tabindex="-1">Positional Access 方法 <a class="header-anchor" href="#positional-access-方法" aria-label="Permalink to &quot;Positional Access 方法&quot;">​</a></h3><p>通过index获取元素</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the element at the specified position in this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param index index of the element to return</span></span>
<span class="line"><span>     * @return the element at the specified position in this list</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E get(int index) {</span></span>
<span class="line"><span>        checkElementIndex(index);</span></span>
<span class="line"><span>        return node(index).item;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>将某个位置的元素重新赋值:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Replaces the element at the specified position in this list with the</span></span>
<span class="line"><span>     * specified element.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param index index of the element to replace</span></span>
<span class="line"><span>     * @param element element to be stored at the specified position</span></span>
<span class="line"><span>     * @return the element previously at the specified position</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E set(int index, E element) {</span></span>
<span class="line"><span>        checkElementIndex(index);</span></span>
<span class="line"><span>        Node&lt;E&gt; x = node(index);</span></span>
<span class="line"><span>        E oldVal = x.item;</span></span>
<span class="line"><span>        x.item = element;</span></span>
<span class="line"><span>        return oldVal;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>将元素插入到指定index位置:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Inserts the specified element at the specified position in this list.</span></span>
<span class="line"><span>     * Shifts the element currently at that position (if any) and any</span></span>
<span class="line"><span>     * subsequent elements to the right (adds one to their indices).</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param index index at which the specified element is to be inserted</span></span>
<span class="line"><span>     * @param element element to be inserted</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void add(int index, E element) {</span></span>
<span class="line"><span>        checkPositionIndex(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (index == size)</span></span>
<span class="line"><span>            linkLast(element);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            linkBefore(element, node(index));</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>删除指定位置的元素:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Removes the element at the specified position in this list.  Shifts any</span></span>
<span class="line"><span>     * subsequent elements to the left (subtracts one from their indices).</span></span>
<span class="line"><span>     * Returns the element that was removed from the list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param index the index of the element to be removed</span></span>
<span class="line"><span>     * @return the element previously at the specified position</span></span>
<span class="line"><span>     * @throws IndexOutOfBoundsException {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E remove(int index) {</span></span>
<span class="line"><span>        checkElementIndex(index);</span></span>
<span class="line"><span>        return unlink(node(index));</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>其它位置的方法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Tells if the argument is the index of an existing element.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private boolean isElementIndex(int index) {</span></span>
<span class="line"><span>        return index &gt;= 0 &amp;&amp; index &lt; size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Tells if the argument is the index of a valid position for an</span></span>
<span class="line"><span>     * iterator or an add operation.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private boolean isPositionIndex(int index) {</span></span>
<span class="line"><span>        return index &gt;= 0 &amp;&amp; index &lt;= size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Constructs an IndexOutOfBoundsException detail message.</span></span>
<span class="line"><span>     * Of the many possible refactorings of the error handling code,</span></span>
<span class="line"><span>     * this &quot;outlining&quot; performs best with both server and client VMs.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String outOfBoundsMsg(int index) {</span></span>
<span class="line"><span>        return &quot;Index: &quot;+index+&quot;, Size: &quot;+size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void checkElementIndex(int index) {</span></span>
<span class="line"><span>        if (!isElementIndex(index))</span></span>
<span class="line"><span>            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void checkPositionIndex(int index) {</span></span>
<span class="line"><span>        if (!isPositionIndex(index))</span></span>
<span class="line"><span>            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="查找操作" tabindex="-1">查找操作 <a class="header-anchor" href="#查找操作" aria-label="Permalink to &quot;查找操作&quot;">​</a></h3><p>查找操作的本质是查找元素的下标:</p><p>查找第一次出现的index, 如果找不到返回-1；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the index of the first occurrence of the specified element</span></span>
<span class="line"><span>     * in this list, or -1 if this list does not contain the element.</span></span>
<span class="line"><span>     * More formally, returns the lowest index {@code i} such that</span></span>
<span class="line"><span>     * &lt;tt&gt;(o==null&amp;nbsp;?&amp;nbsp;get(i)==null&amp;nbsp;:&amp;nbsp;o.equals(get(i)))&lt;/tt&gt;,</span></span>
<span class="line"><span>     * or -1 if there is no such index.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param o element to search for</span></span>
<span class="line"><span>     * @return the index of the first occurrence of the specified element in</span></span>
<span class="line"><span>     *         this list, or -1 if this list does not contain the element</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public int indexOf(Object o) {</span></span>
<span class="line"><span>        int index = 0;</span></span>
<span class="line"><span>        if (o == null) {</span></span>
<span class="line"><span>            for (Node&lt;E&gt; x = first; x != null; x = x.next) {</span></span>
<span class="line"><span>                if (x.item == null)</span></span>
<span class="line"><span>                    return index;</span></span>
<span class="line"><span>                index++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            for (Node&lt;E&gt; x = first; x != null; x = x.next) {</span></span>
<span class="line"><span>                if (o.equals(x.item))</span></span>
<span class="line"><span>                    return index;</span></span>
<span class="line"><span>                index++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>查找最后一次出现的index, 如果找不到返回-1；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the index of the last occurrence of the specified element</span></span>
<span class="line"><span>     * in this list, or -1 if this list does not contain the element.</span></span>
<span class="line"><span>     * More formally, returns the highest index {@code i} such that</span></span>
<span class="line"><span>     * &lt;tt&gt;(o==null&amp;nbsp;?&amp;nbsp;get(i)==null&amp;nbsp;:&amp;nbsp;o.equals(get(i)))&lt;/tt&gt;,</span></span>
<span class="line"><span>     * or -1 if there is no such index.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param o element to search for</span></span>
<span class="line"><span>     * @return the index of the last occurrence of the specified element in</span></span>
<span class="line"><span>     *         this list, or -1 if this list does not contain the element</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public int lastIndexOf(Object o) {</span></span>
<span class="line"><span>        int index = size;</span></span>
<span class="line"><span>        if (o == null) {</span></span>
<span class="line"><span>            for (Node&lt;E&gt; x = last; x != null; x = x.prev) {</span></span>
<span class="line"><span>                index--;</span></span>
<span class="line"><span>                if (x.item == null)</span></span>
<span class="line"><span>                    return index;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            for (Node&lt;E&gt; x = last; x != null; x = x.prev) {</span></span>
<span class="line"><span>                index--;</span></span>
<span class="line"><span>                if (o.equals(x.item))</span></span>
<span class="line"><span>                    return index;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="queue-方法" tabindex="-1">Queue 方法 <a class="header-anchor" href="#queue-方法" aria-label="Permalink to &quot;Queue 方法&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   </span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Retrieves, but does not remove, the head (first element) of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the head of this list, or {@code null} if this list is empty</span></span>
<span class="line"><span>     * @since 1.5</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E peek() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; f = first;</span></span>
<span class="line"><span>        return (f == null) ? null : f.item;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Retrieves, but does not remove, the head (first element) of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the head of this list</span></span>
<span class="line"><span>     * @throws NoSuchElementException if this list is empty</span></span>
<span class="line"><span>     * @since 1.5</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E element() {</span></span>
<span class="line"><span>        return getFirst();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Retrieves and removes the head (first element) of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the head of this list, or {@code null} if this list is empty</span></span>
<span class="line"><span>     * @since 1.5</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E poll() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; f = first;</span></span>
<span class="line"><span>        return (f == null) ? null : unlinkFirst(f);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Retrieves and removes the head (first element) of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the head of this list</span></span>
<span class="line"><span>     * @throws NoSuchElementException if this list is empty</span></span>
<span class="line"><span>     * @since 1.5</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E remove() {</span></span>
<span class="line"><span>        return removeFirst();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Adds the specified element as the tail (last element) of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param e the element to add</span></span>
<span class="line"><span>     * @return {@code true} (as specified by {@link Queue#offer})</span></span>
<span class="line"><span>     * @since 1.5</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean offer(E e) {</span></span>
<span class="line"><span>        return add(e);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="deque-方法" tabindex="-1">Deque 方法 <a class="header-anchor" href="#deque-方法" aria-label="Permalink to &quot;Deque 方法&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Inserts the specified element at the front of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param e the element to insert</span></span>
<span class="line"><span>     * @return {@code true} (as specified by {@link Deque#offerFirst})</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean offerFirst(E e) {</span></span>
<span class="line"><span>        addFirst(e);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Inserts the specified element at the end of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param e the element to insert</span></span>
<span class="line"><span>     * @return {@code true} (as specified by {@link Deque#offerLast})</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean offerLast(E e) {</span></span>
<span class="line"><span>        addLast(e);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Retrieves, but does not remove, the first element of this list,</span></span>
<span class="line"><span>     * or returns {@code null} if this list is empty.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the first element of this list, or {@code null}</span></span>
<span class="line"><span>     *         if this list is empty</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E peekFirst() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; f = first;</span></span>
<span class="line"><span>        return (f == null) ? null : f.item;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Retrieves, but does not remove, the last element of this list,</span></span>
<span class="line"><span>     * or returns {@code null} if this list is empty.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the last element of this list, or {@code null}</span></span>
<span class="line"><span>     *         if this list is empty</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E peekLast() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; l = last;</span></span>
<span class="line"><span>        return (l == null) ? null : l.item;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Retrieves and removes the first element of this list,</span></span>
<span class="line"><span>     * or returns {@code null} if this list is empty.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the first element of this list, or {@code null} if</span></span>
<span class="line"><span>     *     this list is empty</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E pollFirst() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; f = first;</span></span>
<span class="line"><span>        return (f == null) ? null : unlinkFirst(f);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Retrieves and removes the last element of this list,</span></span>
<span class="line"><span>     * or returns {@code null} if this list is empty.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the last element of this list, or {@code null} if</span></span>
<span class="line"><span>     *     this list is empty</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E pollLast() {</span></span>
<span class="line"><span>        final Node&lt;E&gt; l = last;</span></span>
<span class="line"><span>        return (l == null) ? null : unlinkLast(l);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Pushes an element onto the stack represented by this list.  In other</span></span>
<span class="line"><span>     * words, inserts the element at the front of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &lt;p&gt;This method is equivalent to {@link #addFirst}.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param e the element to push</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void push(E e) {</span></span>
<span class="line"><span>        addFirst(e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Pops an element from the stack represented by this list.  In other</span></span>
<span class="line"><span>     * words, removes and returns the first element of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &lt;p&gt;This method is equivalent to {@link #removeFirst()}.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the element at the front of this list (which is the top</span></span>
<span class="line"><span>     *         of the stack represented by this list)</span></span>
<span class="line"><span>     * @throws NoSuchElementException if this list is empty</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public E pop() {</span></span>
<span class="line"><span>        return removeFirst();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Removes the first occurrence of the specified element in this</span></span>
<span class="line"><span>     * list (when traversing the list from head to tail).  If the list</span></span>
<span class="line"><span>     * does not contain the element, it is unchanged.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param o element to be removed from this list, if present</span></span>
<span class="line"><span>     * @return {@code true} if the list contained the specified element</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean removeFirstOccurrence(Object o) {</span></span>
<span class="line"><span>        return remove(o);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Removes the last occurrence of the specified element in this</span></span>
<span class="line"><span>     * list (when traversing the list from head to tail).  If the list</span></span>
<span class="line"><span>     * does not contain the element, it is unchanged.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param o element to be removed from this list, if present</span></span>
<span class="line"><span>     * @return {@code true} if the list contained the specified element</span></span>
<span class="line"><span>     * @since 1.6</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean removeLastOccurrence(Object o) {</span></span>
<span class="line"><span>        if (o == null) {</span></span>
<span class="line"><span>            for (Node&lt;E&gt; x = last; x != null; x = x.prev) {</span></span>
<span class="line"><span>                if (x.item == null) {</span></span>
<span class="line"><span>                    unlink(x);</span></span>
<span class="line"><span>                    return true;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            for (Node&lt;E&gt; x = last; x != null; x = x.prev) {</span></span>
<span class="line"><span>                if (o.equals(x.item)) {</span></span>
<span class="line"><span>                    unlink(x);</span></span>
<span class="line"><span>                    return true;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li>Java LinkedList源码剖析 结合源码对LinkedList进行讲解 <a href="http://www.cnblogs.com/CarpenterLee/p/5457150.html" target="_blank" rel="noreferrer">http://www.cnblogs.com/CarpenterLee/p/5457150.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,66)]))}const g=s(c,[["render",o]]);export{x as __pageData,g as default};
