import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/collection/TreeMap_base.png",t="/vitepress-blog-template/images/collection/TreeMap_rotateLeft.png",i="/vitepress-blog-template/images/collection/TreeMap_rotateRight.png",c="/vitepress-blog-template/images/collection/TreeMap_successor.png",r="/vitepress-blog-template/images/collection/TreeMap_getEntry.png",o="/vitepress-blog-template/images/collection/TreeMap_put.png",d="/vitepress-blog-template/images/collection/TreeMap_fixAfterDeletion.png",v=JSON.parse('{"title":"Map - TreeSet & TreeMap 源码解析","description":"","frontmatter":{},"headers":[],"relativePath":"java/collection/java-map-TreeMap&TreeSet.md","filePath":"java/collection/java-map-TreeMap&TreeSet.md","lastUpdated":1737706346000}'),f={name:"java/collection/java-map-TreeMap&TreeSet.md"};function g(h,n,u,b,m,x){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="map-treeset-treemap-源码解析" tabindex="-1">Map - TreeSet &amp; TreeMap 源码解析 <a class="header-anchor" href="#map-treeset-treemap-源码解析" aria-label="Permalink to &quot;Map - TreeSet &amp; TreeMap 源码解析&quot;">​</a></h1><blockquote><p>本文主要对Map - TreeSet &amp; TreeMap 源码解析。@pdai</p></blockquote><h2 id="java-7-treeset-treemap" tabindex="-1">Java 7 - TreeSet &amp; TreeMap <a class="header-anchor" href="#java-7-treeset-treemap" aria-label="Permalink to &quot;Java 7 - TreeSet &amp; TreeMap&quot;">​</a></h2><h3 id="总体介绍" tabindex="-1">总体介绍 <a class="header-anchor" href="#总体介绍" aria-label="Permalink to &quot;总体介绍&quot;">​</a></h3><p>之所以把_TreeSet_和_TreeMap_放在一起讲解，是因为二者在Java里有着相同的实现，前者仅仅是对后者做了一层包装，也就是说___TreeSet_里面有一个_TreeMap_(适配器模式)**。因此本文将重点分析_TreeMap_。</p><p>Java _TreeMap_实现了_SortedMap_接口，也就是说会按照<code>key</code>的大小顺序对_Map_中的元素进行排序，<code>key</code>大小的评判可以通过其本身的自然顺序(natural ordering)，也可以通过构造时传入的比较器(Comparator)。</p><p><strong>_TreeMap_底层通过红黑树(Red-Black tree)实现</strong>，也就意味着<code>containsKey()</code>, <code>get()</code>, <code>put()</code>, <code>remove()</code>都有着<code>log(n)</code>的时间复杂度。其具体算法实现参照了《算法导论》。</p><p><img src="'+l+'" alt="TreeMap_base.png"></p><p>出于性能原因，_TreeMap_是非同步的(not synchronized)，如果需要在多线程环境使用，需要程序员手动同步；或者通过如下方式将_TreeMap_包装成(wrapped)同步的:</p><p><code>SortedMap m = Collections.synchronizedSortedMap(new TreeMap(...));</code></p><p><strong>红黑树是一种近似平衡的二叉查找树，它能够确保任何一个节点的左右子树的高度差不会超过二者中较低那个的一倍</strong>。具体来说，红黑树是满足如下条件的二叉查找树(binary search tree):</p><ol><li>每个节点要么是红色，要么是黑色。</li><li>根节点必须是黑色</li><li>红色节点不能连续(也即是，红色节点的孩子和父亲都不能是红色)。</li><li>对于每个节点，从该点至<code>null</code>(树尾端)的任何路径，都含有相同个数的黑色节点。</li></ol><p>在树的结构发生改变时(插入或者删除操作)，往往会破坏上述条件3或条件4，需要通过调整使得查找树重新满足红黑树的约束条件。</p><h3 id="预备知识" tabindex="-1">预备知识 <a class="header-anchor" href="#预备知识" aria-label="Permalink to &quot;预备知识&quot;">​</a></h3><p>前文说到当查找树的结构发生改变时，红黑树的约束条件可能被破坏，需要通过调整使得查找树重新满足红黑树的约束条件。调整可以分为两类: 一类是颜色调整，即改变某个节点的颜色；另一类是结构调整，即改变检索树的结构关系。结构调整过程包含两个基本操作** : 左旋(Rotate Left)，右旋(RotateRight)**。</p><h4 id="左旋" tabindex="-1">左旋 <a class="header-anchor" href="#左旋" aria-label="Permalink to &quot;左旋&quot;">​</a></h4><p>左旋的过程是将<code>x</code>的右子树绕<code>x</code>逆时针旋转，使得<code>x</code>的右子树成为<code>x</code>的父亲，同时修改相关节点的引用。旋转之后，二叉查找树的属性仍然满足。</p><p><img src="'+t+`" alt="TreeMap_rotateLeft.png"></p><p>_TreeMap_中左旋代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Rotate Left</span></span>
<span class="line"><span>private void rotateLeft(Entry&lt;K,V&gt; p) {</span></span>
<span class="line"><span>    if (p != null) {</span></span>
<span class="line"><span>        Entry&lt;K,V&gt; r = p.right;</span></span>
<span class="line"><span>        p.right = r.left;</span></span>
<span class="line"><span>        if (r.left != null)</span></span>
<span class="line"><span>            r.left.parent = p;</span></span>
<span class="line"><span>        r.parent = p.parent;</span></span>
<span class="line"><span>        if (p.parent == null)</span></span>
<span class="line"><span>            root = r;</span></span>
<span class="line"><span>        else if (p.parent.left == p)</span></span>
<span class="line"><span>            p.parent.left = r;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            p.parent.right = r;</span></span>
<span class="line"><span>        r.left = p;</span></span>
<span class="line"><span>        p.parent = r;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="右旋" tabindex="-1">右旋 <a class="header-anchor" href="#右旋" aria-label="Permalink to &quot;右旋&quot;">​</a></h4><p>右旋的过程是将<code>x</code>的左子树绕<code>x</code>顺时针旋转，使得<code>x</code>的左子树成为<code>x</code>的父亲，同时修改相关节点的引用。旋转之后，二叉查找树的属性仍然满足。</p><p><img src="`+i+`" alt="TreeMap_rotateRight.png"></p><p>_TreeMap_中右旋代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Rotate Right</span></span>
<span class="line"><span>private void rotateRight(Entry&lt;K,V&gt; p) {</span></span>
<span class="line"><span>    if (p != null) {</span></span>
<span class="line"><span>        Entry&lt;K,V&gt; l = p.left;</span></span>
<span class="line"><span>        p.left = l.right;</span></span>
<span class="line"><span>        if (l.right != null) l.right.parent = p;</span></span>
<span class="line"><span>        l.parent = p.parent;</span></span>
<span class="line"><span>        if (p.parent == null)</span></span>
<span class="line"><span>            root = l;</span></span>
<span class="line"><span>        else if (p.parent.right == p)</span></span>
<span class="line"><span>            p.parent.right = l;</span></span>
<span class="line"><span>        else p.parent.left = l;</span></span>
<span class="line"><span>        l.right = p;</span></span>
<span class="line"><span>        p.parent = l;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="寻找节点后继" tabindex="-1">寻找节点后继 <a class="header-anchor" href="#寻找节点后继" aria-label="Permalink to &quot;寻找节点后继&quot;">​</a></h4><p>对于一棵二叉查找树，给定节点t，其后继(树中比大于t的最小的那个元素)可以通过如下方式找到:</p><blockquote><ol><li>t的右子树不空，则t的后继是其右子树中最小的那个元素。</li><li>t的右孩子为空，则t的后继是其第一个向左走的祖先。</li></ol></blockquote><p>后继节点在红黑树的删除操作中将会用到。</p><p><img src="`+c+`" alt="TreeMap_successor.png"></p><p>_TreeMap_中寻找节点后继的代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 寻找节点后继函数successor()</span></span>
<span class="line"><span>static &lt;K,V&gt; TreeMap.Entry&lt;K,V&gt; successor(Entry&lt;K,V&gt; t) {</span></span>
<span class="line"><span>    if (t == null)</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    else if (t.right != null) {// 1. t的右子树不空，则t的后继是其右子树中最小的那个元素</span></span>
<span class="line"><span>        Entry&lt;K,V&gt; p = t.right;</span></span>
<span class="line"><span>        while (p.left != null)</span></span>
<span class="line"><span>            p = p.left;</span></span>
<span class="line"><span>        return p;</span></span>
<span class="line"><span>    } else {// 2. t的右孩子为空，则t的后继是其第一个向左走的祖先</span></span>
<span class="line"><span>        Entry&lt;K,V&gt; p = t.parent;</span></span>
<span class="line"><span>        Entry&lt;K,V&gt; ch = t;</span></span>
<span class="line"><span>        while (p != null &amp;&amp; ch == p.right) {</span></span>
<span class="line"><span>            ch = p;</span></span>
<span class="line"><span>            p = p.parent;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return p;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="方法剖析" tabindex="-1">方法剖析 <a class="header-anchor" href="#方法剖析" aria-label="Permalink to &quot;方法剖析&quot;">​</a></h3><h4 id="get" tabindex="-1">get() <a class="header-anchor" href="#get" aria-label="Permalink to &quot;get()&quot;">​</a></h4><p><code>get(Object key)</code>方法根据指定的<code>key</code>值返回对应的<code>value</code>，该方法调用了<code>getEntry(Object key)</code>得到相应的<code>entry</code>，然后返回<code>entry.value</code>。因此<code>getEntry()</code>是算法的核心。算法思想是根据<code>key</code>的自然顺序(或者比较器顺序)对二叉查找树进行查找，直到找到满足<code>k.compareTo(p.key) == 0</code>的<code>entry</code>。</p><p><img src="`+r+`" alt="TreeMap_getEntry.png"></p><p>具体代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//getEntry()方法</span></span>
<span class="line"><span>final Entry&lt;K,V&gt; getEntry(Object key) {</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    if (key == null)//不允许key值为null</span></span>
<span class="line"><span>        throw new NullPointerException();</span></span>
<span class="line"><span>    Comparable&lt;? super K&gt; k = (Comparable&lt;? super K&gt;) key;//使用元素的自然顺序</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; p = root;</span></span>
<span class="line"><span>    while (p != null) {</span></span>
<span class="line"><span>        int cmp = k.compareTo(p.key);</span></span>
<span class="line"><span>        if (cmp &lt; 0)//向左找</span></span>
<span class="line"><span>            p = p.left;</span></span>
<span class="line"><span>        else if (cmp &gt; 0)//向右找</span></span>
<span class="line"><span>            p = p.right;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            return p;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="put" tabindex="-1">put() <a class="header-anchor" href="#put" aria-label="Permalink to &quot;put()&quot;">​</a></h4><p><code>put(K key, V value)</code>方法是将指定的<code>key</code>, <code>value</code>对添加到<code>map</code>里。该方法首先会对<code>map</code>做一次查找，看是否包含该元组，如果已经包含则直接返回，查找过程类似于<code>getEntry()</code>方法；如果没有找到则会在红黑树中插入新的<code>entry</code>，如果插入之后破坏了红黑树的约束条件，还需要进行调整(旋转，改变某些节点的颜色)。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V put(K key, V value) {</span></span>
<span class="line"><span>	......</span></span>
<span class="line"><span>    int cmp;</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; parent;</span></span>
<span class="line"><span>    if (key == null)</span></span>
<span class="line"><span>        throw new NullPointerException();</span></span>
<span class="line"><span>    Comparable&lt;? super K&gt; k = (Comparable&lt;? super K&gt;) key;//使用元素的自然顺序</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        parent = t;</span></span>
<span class="line"><span>        cmp = k.compareTo(t.key);</span></span>
<span class="line"><span>        if (cmp &lt; 0) t = t.left;//向左找</span></span>
<span class="line"><span>        else if (cmp &gt; 0) t = t.right;//向右找</span></span>
<span class="line"><span>        else return t.setValue(value);</span></span>
<span class="line"><span>    } while (t != null);</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; e = new Entry&lt;&gt;(key, value, parent);//创建并插入新的entry</span></span>
<span class="line"><span>    if (cmp &lt; 0) parent.left = e;</span></span>
<span class="line"><span>    else parent.right = e;</span></span>
<span class="line"><span>    fixAfterInsertion(e);//调整</span></span>
<span class="line"><span>    size++;</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码的插入部分并不难理解: 首先在红黑树上找到合适的位置，然后创建新的<code>entry</code>并插入(当然，新插入的节点一定是树的叶子)。难点是调整函数<code>fixAfterInsertion()</code>，前面已经说过，调整往往需要1.改变某些节点的颜色，2.对某些节点进行旋转。</p><p><img src="`+o+`" alt="TreeMap_put.png"></p><p>调整函数<code>fixAfterInsertion()</code>的具体代码如下，其中用到了上文中提到的<code>rotateLeft()</code>和<code>rotateRight()</code>函数。通过代码我们能够看到，情况2其实是落在情况3内的。情况4～情况6跟前三种情况是对称的，因此图解中并没有画出后三种情况，读者可以参考代码自行理解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//红黑树调整函数fixAfterInsertion()</span></span>
<span class="line"><span>private void fixAfterInsertion(Entry&lt;K,V&gt; x) {</span></span>
<span class="line"><span>    x.color = RED;</span></span>
<span class="line"><span>    while (x != null &amp;&amp; x != root &amp;&amp; x.parent.color == RED) {</span></span>
<span class="line"><span>        if (parentOf(x) == leftOf(parentOf(parentOf(x)))) {</span></span>
<span class="line"><span>            Entry&lt;K,V&gt; y = rightOf(parentOf(parentOf(x)));</span></span>
<span class="line"><span>            if (colorOf(y) == RED) {</span></span>
<span class="line"><span>                setColor(parentOf(x), BLACK);              // 情况1</span></span>
<span class="line"><span>                setColor(y, BLACK);                        // 情况1</span></span>
<span class="line"><span>                setColor(parentOf(parentOf(x)), RED);      // 情况1</span></span>
<span class="line"><span>                x = parentOf(parentOf(x));                 // 情况1</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                if (x == rightOf(parentOf(x))) {</span></span>
<span class="line"><span>                    x = parentOf(x);                       // 情况2</span></span>
<span class="line"><span>                    rotateLeft(x);                         // 情况2</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                setColor(parentOf(x), BLACK);              // 情况3</span></span>
<span class="line"><span>                setColor(parentOf(parentOf(x)), RED);      // 情况3</span></span>
<span class="line"><span>                rotateRight(parentOf(parentOf(x)));        // 情况3</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            Entry&lt;K,V&gt; y = leftOf(parentOf(parentOf(x)));</span></span>
<span class="line"><span>            if (colorOf(y) == RED) {</span></span>
<span class="line"><span>                setColor(parentOf(x), BLACK);              // 情况4</span></span>
<span class="line"><span>                setColor(y, BLACK);                        // 情况4</span></span>
<span class="line"><span>                setColor(parentOf(parentOf(x)), RED);      // 情况4</span></span>
<span class="line"><span>                x = parentOf(parentOf(x));                 // 情况4</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                if (x == leftOf(parentOf(x))) {</span></span>
<span class="line"><span>                    x = parentOf(x);                       // 情况5</span></span>
<span class="line"><span>                    rotateRight(x);                        // 情况5</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                setColor(parentOf(x), BLACK);              // 情况6</span></span>
<span class="line"><span>                setColor(parentOf(parentOf(x)), RED);      // 情况6</span></span>
<span class="line"><span>                rotateLeft(parentOf(parentOf(x)));         // 情况6</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    root.color = BLACK;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="remove" tabindex="-1">remove() <a class="header-anchor" href="#remove" aria-label="Permalink to &quot;remove()&quot;">​</a></h4><p><code>remove(Object key)</code>的作用是删除<code>key</code>值对应的<code>entry</code>，该方法首先通过上文中提到的<code>getEntry(Object key)</code>方法找到<code>key</code>值对应的<code>entry</code>，然后调用<code>deleteEntry(Entry&lt;K,V&gt; entry)</code>删除对应的<code>entry</code>。由于删除操作会改变红黑树的结构，有可能破坏红黑树的约束条件，因此有可能要进行调整。</p><p><code>getEntry()</code>函数前面已经讲解过，这里重点放<code>deleteEntry()</code>上，该函数删除指定的<code>entry</code>并在红黑树的约束被破坏时进行调用<code>fixAfterDeletion(Entry&lt;K,V&gt; x)</code>进行调整。</p><p><strong>由于红黑树是一棵增强版的二叉查找树，红黑树的删除操作跟普通二叉查找树的删除操作也就非常相似，唯一的区别是红黑树在节点删除之后可能需要进行调整</strong>。现在考虑一棵普通二叉查找树的删除过程，可以简单分为两种情况:</p><blockquote><ol><li>删除点p的左右子树都为空，或者只有一棵子树非空。</li><li>删除点p的左右子树都非空。</li></ol></blockquote><p>对于上述情况1，处理起来比较简单，直接将p删除(左右子树都为空时)，或者用非空子树替代p(只有一棵子树非空时)；对于情况2，可以用p的后继s(树中大于x的最小的那个元素)代替p，然后使用情况1删除s(此时s一定满足情况1.可以画画看)。</p><p>基于以上逻辑，红黑树的节点删除函数<code>deleteEntry()</code>代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 红黑树entry删除函数deleteEntry()</span></span>
<span class="line"><span>private void deleteEntry(Entry&lt;K,V&gt; p) {</span></span>
<span class="line"><span>    modCount++;</span></span>
<span class="line"><span>    size--;</span></span>
<span class="line"><span>    if (p.left != null &amp;&amp; p.right != null) {// 2. 删除点p的左右子树都非空。</span></span>
<span class="line"><span>        Entry&lt;K,V&gt; s = successor(p);// 后继</span></span>
<span class="line"><span>        p.key = s.key;</span></span>
<span class="line"><span>        p.value = s.value;</span></span>
<span class="line"><span>        p = s;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Entry&lt;K,V&gt; replacement = (p.left != null ? p.left : p.right);</span></span>
<span class="line"><span>    if (replacement != null) {// 1. 删除点p只有一棵子树非空。</span></span>
<span class="line"><span>        replacement.parent = p.parent;</span></span>
<span class="line"><span>        if (p.parent == null)</span></span>
<span class="line"><span>            root = replacement;</span></span>
<span class="line"><span>        else if (p == p.parent.left)</span></span>
<span class="line"><span>            p.parent.left  = replacement;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            p.parent.right = replacement;</span></span>
<span class="line"><span>        p.left = p.right = p.parent = null;</span></span>
<span class="line"><span>        if (p.color == BLACK)</span></span>
<span class="line"><span>            fixAfterDeletion(replacement);// 调整</span></span>
<span class="line"><span>    } else if (p.parent == null) {</span></span>
<span class="line"><span>        root = null;</span></span>
<span class="line"><span>    } else { // 1. 删除点p的左右子树都为空</span></span>
<span class="line"><span>        if (p.color == BLACK)</span></span>
<span class="line"><span>            fixAfterDeletion(p);// 调整</span></span>
<span class="line"><span>        if (p.parent != null) {</span></span>
<span class="line"><span>            if (p == p.parent.left)</span></span>
<span class="line"><span>                p.parent.left = null;</span></span>
<span class="line"><span>            else if (p == p.parent.right)</span></span>
<span class="line"><span>                p.parent.right = null;</span></span>
<span class="line"><span>            p.parent = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中占据大量代码行的，是用来修改父子节点间引用关系的代码，其逻辑并不难理解。下面着重讲解删除后调整函数<code>fixAfterDeletion()</code>。首先请思考一下，删除了哪些点才会导致调整？<strong>只有删除点是BLACK的时候，才会触发调整函数</strong>，因为删除RED节点不会破坏红黑树的任何约束，而删除BLACK节点会破坏规则4。</p><p>跟上文中讲过的<code>fixAfterInsertion()</code>函数一样，这里也要分成若干种情况。记住，<strong>无论有多少情况，具体的调整操作只有两种: 1.改变某些节点的颜色，2.对某些节点进行旋转。</strong></p><p><img src="`+d+`" alt="TreeMap_fixAfterDeletion.png"></p><p>上述图解的总体思想是: 将情况1首先转换成情况2，或者转换成情况3和情况4。当然，该图解并不意味着调整过程一定是从情况1开始。通过后续代码我们还会发现几个有趣的规则: a).如果是由情况1之后紧接着进入的情况2，那么情况2之后一定会退出循环(因为x为红色)；b).一旦进入情况3和情况4，一定会退出循环(因为x为root)。</p><p>删除后调整函数<code>fixAfterDeletion()</code>的具体代码如下，其中用到了上文中提到的<code>rotateLeft()</code>和<code>rotateRight()</code>函数。通过代码我们能够看到，情况3其实是落在情况4内的。情况5～情况8跟前四种情况是对称的，因此图解中并没有画出后四种情况，读者可以参考代码自行理解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void fixAfterDeletion(Entry&lt;K,V&gt; x) {</span></span>
<span class="line"><span>    while (x != root &amp;&amp; colorOf(x) == BLACK) {</span></span>
<span class="line"><span>        if (x == leftOf(parentOf(x))) {</span></span>
<span class="line"><span>            Entry&lt;K,V&gt; sib = rightOf(parentOf(x));</span></span>
<span class="line"><span>            if (colorOf(sib) == RED) {</span></span>
<span class="line"><span>                setColor(sib, BLACK);                   // 情况1</span></span>
<span class="line"><span>                setColor(parentOf(x), RED);             // 情况1</span></span>
<span class="line"><span>                rotateLeft(parentOf(x));                // 情况1</span></span>
<span class="line"><span>                sib = rightOf(parentOf(x));             // 情况1</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (colorOf(leftOf(sib))  == BLACK &amp;&amp;</span></span>
<span class="line"><span>                colorOf(rightOf(sib)) == BLACK) {</span></span>
<span class="line"><span>                setColor(sib, RED);                     // 情况2</span></span>
<span class="line"><span>                x = parentOf(x);                        // 情况2</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                if (colorOf(rightOf(sib)) == BLACK) {</span></span>
<span class="line"><span>                    setColor(leftOf(sib), BLACK);       // 情况3</span></span>
<span class="line"><span>                    setColor(sib, RED);                 // 情况3</span></span>
<span class="line"><span>                    rotateRight(sib);                   // 情况3</span></span>
<span class="line"><span>                    sib = rightOf(parentOf(x));         // 情况3</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                setColor(sib, colorOf(parentOf(x)));    // 情况4</span></span>
<span class="line"><span>                setColor(parentOf(x), BLACK);           // 情况4</span></span>
<span class="line"><span>                setColor(rightOf(sib), BLACK);          // 情况4</span></span>
<span class="line"><span>                rotateLeft(parentOf(x));                // 情况4</span></span>
<span class="line"><span>                x = root;                               // 情况4</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else { // 跟前四种情况对称</span></span>
<span class="line"><span>            Entry&lt;K,V&gt; sib = leftOf(parentOf(x));</span></span>
<span class="line"><span>            if (colorOf(sib) == RED) {</span></span>
<span class="line"><span>                setColor(sib, BLACK);                   // 情况5</span></span>
<span class="line"><span>                setColor(parentOf(x), RED);             // 情况5</span></span>
<span class="line"><span>                rotateRight(parentOf(x));               // 情况5</span></span>
<span class="line"><span>                sib = leftOf(parentOf(x));              // 情况5</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (colorOf(rightOf(sib)) == BLACK &amp;&amp;</span></span>
<span class="line"><span>                colorOf(leftOf(sib)) == BLACK) {</span></span>
<span class="line"><span>                setColor(sib, RED);                     // 情况6</span></span>
<span class="line"><span>                x = parentOf(x);                        // 情况6</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                if (colorOf(leftOf(sib)) == BLACK) {</span></span>
<span class="line"><span>                    setColor(rightOf(sib), BLACK);      // 情况7</span></span>
<span class="line"><span>                    setColor(sib, RED);                 // 情况7</span></span>
<span class="line"><span>                    rotateLeft(sib);                    // 情况7</span></span>
<span class="line"><span>                    sib = leftOf(parentOf(x));          // 情况7</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                setColor(sib, colorOf(parentOf(x)));    // 情况8</span></span>
<span class="line"><span>                setColor(parentOf(x), BLACK);           // 情况8</span></span>
<span class="line"><span>                setColor(leftOf(sib), BLACK);           // 情况8</span></span>
<span class="line"><span>                rotateRight(parentOf(x));               // 情况8</span></span>
<span class="line"><span>                x = root;                               // 情况8</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    setColor(x, BLACK);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="treeset" tabindex="-1">TreeSet <a class="header-anchor" href="#treeset" aria-label="Permalink to &quot;TreeSet&quot;">​</a></h3><p>前面已经说过<code>TreeSet</code>是对<code>TreeMap</code>的简单包装，对<code>TreeSet</code>的函数调用都会转换成合适的<code>TreeMap</code>方法，因此<code>TreeSet</code>的实现非常简单。这里不再赘述。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// TreeSet是对TreeMap的简单包装</span></span>
<span class="line"><span>public class TreeSet&lt;E&gt; extends AbstractSet&lt;E&gt;</span></span>
<span class="line"><span>    implements NavigableSet&lt;E&gt;, Cloneable, java.io.Serializable</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	......</span></span>
<span class="line"><span>    private transient NavigableMap&lt;E,Object&gt; m;</span></span>
<span class="line"><span>    // Dummy value to associate with an Object in the backing Map</span></span>
<span class="line"><span>    private static final Object PRESENT = new Object();</span></span>
<span class="line"><span>    public TreeSet() {</span></span>
<span class="line"><span>        this.m = new TreeMap&lt;E,Object&gt;();// TreeSet里面有一个TreeMap</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    public boolean add(E e) {</span></span>
<span class="line"><span>        return m.put(e, PRESENT)==null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,63)]))}const O=s(f,[["render",g]]);export{v as __pageData,O as default};
