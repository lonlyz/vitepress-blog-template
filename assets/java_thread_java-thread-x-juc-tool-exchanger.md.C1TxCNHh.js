import{_ as a,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"JUC工具类: Exchanger详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-tool-exchanger.md","filePath":"java/thread/java-thread-x-juc-tool-exchanger.md","lastUpdated":1737706346000}'),l={name:"java/thread/java-thread-x-juc-tool-exchanger.md"};function i(t,n,c,r,o,d){return e(),s("div",null,n[0]||(n[0]=[p(`<h1 id="juc工具类-exchanger详解" tabindex="-1">JUC工具类: Exchanger详解 <a class="header-anchor" href="#juc工具类-exchanger详解" aria-label="Permalink to &quot;JUC工具类: Exchanger详解&quot;">​</a></h1><blockquote><p>Exchanger是用于线程协作的工具类, 主要用于两个线程之间的数据交换。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解exchanger" tabindex="-1">带着BAT大厂的面试问题去理解Exchanger <a class="header-anchor" href="#带着bat大厂的面试问题去理解exchanger" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解Exchanger&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解Exchanger。@pdai</p><ul><li>Exchanger主要解决什么问题?</li><li>对比SynchronousQueue，为什么说Exchanger可被视为 SynchronousQueue 的双向形式?</li><li>Exchanger在不同的JDK版本中实现有什么差别?</li><li>Exchanger实现机制?</li><li>Exchanger已经有了slot单节点，为什么会加入arena node数组? 什么时候会用到数组?</li><li>arena可以确保不同的slot在arena中是不会相冲突的，那么是怎么保证的呢?</li><li>什么是伪共享，Exchanger中如何体现的?</li><li>Exchanger实现举例</li></ul><h2 id="exchanger简介" tabindex="-1">Exchanger简介 <a class="header-anchor" href="#exchanger简介" aria-label="Permalink to &quot;Exchanger简介&quot;">​</a></h2><p>Exchanger用于进行两个线程之间的数据交换。它提供一个同步点，在这个同步点，两个线程可以交换彼此的数据。这两个线程通过exchange()方法交换数据，当一个线程先执行exchange()方法后，它会一直等待第二个线程也执行exchange()方法，当这两个线程到达同步点时，这两个线程就可以交换数据了。</p><h2 id="exchanger实现机制" tabindex="-1">Exchanger实现机制 <a class="header-anchor" href="#exchanger实现机制" aria-label="Permalink to &quot;Exchanger实现机制&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (;;) {</span></span>
<span class="line"><span>    if (slot is empty) { // offer</span></span>
<span class="line"><span>        // slot为空时，将item 设置到Node 中        </span></span>
<span class="line"><span>        place item in a Node;</span></span>
<span class="line"><span>        if (can CAS slot from empty to node) {</span></span>
<span class="line"><span>            // 当将node通过CAS交换到slot中时，挂起线程等待被唤醒</span></span>
<span class="line"><span>            wait for release;</span></span>
<span class="line"><span>            // 被唤醒后返回node中匹配到的item</span></span>
<span class="line"><span>            return matching item in node;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else if (can CAS slot from node to empty) { // release</span></span>
<span class="line"><span>         // 将slot设置为空</span></span>
<span class="line"><span>        // 获取node中的item，将需要交换的数据设置到匹配的item</span></span>
<span class="line"><span>        get the item in node;</span></span>
<span class="line"><span>        set matching item in node;</span></span>
<span class="line"><span>        // 唤醒等待的线程</span></span>
<span class="line"><span>        release waiting thread;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // else retry on CAS failure</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>比如有2条线程A和B，A线程交换数据时，发现slot为空，则将需要交换的数据放在slot中等待其它线程进来交换数据，等线程B进来，读取A设置的数据，然后设置线程B需要交换的数据，然后唤醒A线程，原理就是这么简单。但是当多个线程之间进行交换数据时就会出现问题，所以Exchanger加入了slot数组。</p><h2 id="exchanger源码解析" tabindex="-1">Exchanger源码解析 <a class="header-anchor" href="#exchanger源码解析" aria-label="Permalink to &quot;Exchanger源码解析&quot;">​</a></h2><h3 id="内部类-participant" tabindex="-1">内部类 - Participant <a class="header-anchor" href="#内部类-participant" aria-label="Permalink to &quot;内部类 - Participant&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static final class Participant extends ThreadLocal&lt;Node&gt; {</span></span>
<span class="line"><span>    public Node initialValue() { return new Node(); }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Participant的作用是为每个线程保留唯一的一个Node节点, 它继承ThreadLocal，说明每个线程具有不同的状态。</p><h3 id="内部类-node" tabindex="-1">内部类 - Node <a class="header-anchor" href="#内部类-node" aria-label="Permalink to &quot;内部类 - Node&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@sun.misc.Contended static final class Node {</span></span>
<span class="line"><span>     // arena的下标，多个槽位的时候利用</span></span>
<span class="line"><span>    int index; </span></span>
<span class="line"><span>    // 上一次记录的Exchanger.bound</span></span>
<span class="line"><span>    int bound; </span></span>
<span class="line"><span>    // 在当前bound下CAS失败的次数；</span></span>
<span class="line"><span>    int collides;</span></span>
<span class="line"><span>    // 用于自旋；</span></span>
<span class="line"><span>    int hash; </span></span>
<span class="line"><span>    // 这个线程的当前项，也就是需要交换的数据；</span></span>
<span class="line"><span>    Object item; </span></span>
<span class="line"><span>    //做releasing操作的线程传递的项；</span></span>
<span class="line"><span>    volatile Object match; </span></span>
<span class="line"><span>    //挂起时设置线程值，其他情况下为null；</span></span>
<span class="line"><span>    volatile Thread parked;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Node定义中有两个变量值得思考：bound以及collides。前面提到了数组area是为了避免竞争而产生的，如果系统不存在竞争问题，那么完全没有必要开辟一个高效的arena来徒增系统的复杂性。首先通过单个slot的exchanger来交换数据，当探测到竞争时将安排不同的位置的slot来保存线程Node，并且可以确保没有slot会在同一个缓存行上。如何来判断会有竞争呢? CAS替换slot失败，如果失败，则通过记录冲突次数来扩展arena的尺寸，我们在记录冲突的过程中会跟踪“bound”的值，以及会重新计算冲突次数在bound的值被改变时。</p><h3 id="核心属性" tabindex="-1">核心属性 <a class="header-anchor" href="#核心属性" aria-label="Permalink to &quot;核心属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final Participant participant;</span></span>
<span class="line"><span>private volatile Node[] arena;</span></span>
<span class="line"><span>private volatile Node slot;</span></span></code></pre></div><ul><li><strong>为什么会有 <code>arena数组槽</code>?</strong></li></ul><p>slot为单个槽，arena为数组槽, 他们都是Node类型。在这里可能会感觉到疑惑，slot作为Exchanger交换数据的场景，应该只需要一个就可以了啊? 为何还多了一个Participant 和数组类型的arena呢? 一个slot交换场所原则上来说应该是可以的，但实际情况却不是如此，多个参与者使用同一个交换场所时，会存在严重伸缩性问题。既然单个交换场所存在问题，那么我们就安排多个，也就是数组arena。通过数组arena来安排不同的线程使用不同的slot来降低竞争问题，并且可以保证最终一定会成对交换数据。但是<strong>Exchanger不是一来就会生成arena数组来降低竞争，只有当产生竞争是才会生成arena数组</strong>。</p><ul><li><strong>那么怎么将Node与当前线程绑定呢？</strong></li></ul><p>Participant，Participant 的作用就是为每个线程保留唯一的一个Node节点，它继承ThreadLocal，同时在Node节点中记录在arena中的下标index。</p><h3 id="构造函数" tabindex="-1">构造函数 <a class="header-anchor" href="#构造函数" aria-label="Permalink to &quot;构造函数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* Creates a new Exchanger.</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>public Exchanger() {</span></span>
<span class="line"><span>    participant = new Participant();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>初始化participant对象。</p><h3 id="核心方法-exchange-v-x" tabindex="-1">核心方法 - exchange(V x) <a class="header-anchor" href="#核心方法-exchange-v-x" aria-label="Permalink to &quot;核心方法 - exchange(V x)&quot;">​</a></h3><p>等待另一个线程到达此交换点(除非当前线程被中断)，然后将给定的对象传送给该线程，并接收该线程的对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V exchange(V x) throws InterruptedException {</span></span>
<span class="line"><span>    Object v;</span></span>
<span class="line"><span>    // 当参数为null时需要将item设置为空的对象</span></span>
<span class="line"><span>    Object item = (x == null) ? NULL_ITEM : x; // translate null args</span></span>
<span class="line"><span>    // 注意到这里的这个表达式是整个方法的核心</span></span>
<span class="line"><span>    if ((arena != null ||</span></span>
<span class="line"><span>            (v = slotExchange(item, false, 0 L)) == null) &amp;&amp;</span></span>
<span class="line"><span>        ((Thread.interrupted() || // disambiguates null return</span></span>
<span class="line"><span>            (v = arenaExchange(item, false, 0 L)) == null)))</span></span>
<span class="line"><span>        throw new InterruptedException();</span></span>
<span class="line"><span>    return (v == NULL_ITEM) ? null : (V) v;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法比较好理解：arena为数组槽，如果为null，则执行slotExchange()方法，否则判断线程是否中断，如果中断值抛出InterruptedException异常，没有中断则执行arenaExchange()方法。整套逻辑就是：如果slotExchange(Object item, boolean timed, long ns)方法执行失败了就执行arenaExchange(Object item, boolean timed, long ns)方法，最后返回结果V。</p><p>NULL_ITEM 为一个空节点，其实就是一个Object对象而已，slotExchange()为单个slot交换。</p><h3 id="slotexchange-object-item-boolean-timed-long-ns" tabindex="-1">slotExchange(Object item, boolean timed, long ns) <a class="header-anchor" href="#slotexchange-object-item-boolean-timed-long-ns" aria-label="Permalink to &quot;slotExchange(Object item, boolean timed, long ns)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final Object slotExchange(Object item, boolean timed, long ns) {</span></span>
<span class="line"><span>    // 获取当前线程node对象</span></span>
<span class="line"><span>    Node p = participant.get();</span></span>
<span class="line"><span>    // 当前线程</span></span>
<span class="line"><span>    Thread t = Thread.currentThread();</span></span>
<span class="line"><span>    // 若果线程被中断，就直接返回null</span></span>
<span class="line"><span>    if (t.isInterrupted()) // preserve interrupt status so caller can recheck</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>	// 自旋</span></span>
<span class="line"><span>    for (Node q;;) {</span></span>
<span class="line"><span>        // 将slot值赋给q</span></span>
<span class="line"><span>        if ((q = slot) != null) {</span></span>
<span class="line"><span>             // slot 不为null，即表示已有线程已经把需要交换的数据设置在slot中了</span></span>
<span class="line"><span>			// 通过CAS将slot设置成null</span></span>
<span class="line"><span>            if (U.compareAndSwapObject(this, SLOT, q, null)) {</span></span>
<span class="line"><span>                // CAS操作成功后，将slot中的item赋值给对象v，以便返回。</span></span>
<span class="line"><span>                // 这里也是就读取之前线程要交换的数据</span></span>
<span class="line"><span>                Object v = q.item;</span></span>
<span class="line"><span>                // 将当前线程需要交给的数据设置在q中的match</span></span>
<span class="line"><span>                q.match = item;</span></span>
<span class="line"><span>                 // 获取被挂起的线程</span></span>
<span class="line"><span>                Thread w = q.parked;</span></span>
<span class="line"><span>                if (w != null)</span></span>
<span class="line"><span>                    // 如果线程不为null，唤醒它</span></span>
<span class="line"><span>                    U.unpark(w);</span></span>
<span class="line"><span>                // 返回其他线程给的V</span></span>
<span class="line"><span>                return v;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // create arena on contention, but continue until slot null</span></span>
<span class="line"><span>            // CAS 操作失败，表示有其它线程竞争，在此线程之前将数据已取走</span></span>
<span class="line"><span>            // NCPU:CPU的核数</span></span>
<span class="line"><span>            // bound == 0 表示arena数组未初始化过，CAS操作bound将其增加SEQ</span></span>
<span class="line"><span>            if (NCPU &gt; 1 &amp;&amp; bound == 0 &amp;&amp;</span></span>
<span class="line"><span>                U.compareAndSwapInt(this, BOUND, 0, SEQ))</span></span>
<span class="line"><span>                // 初始化arena数组</span></span>
<span class="line"><span>                arena = new Node[(FULL + 2) &lt;&lt; ASHIFT];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 上面分析过，只有当arena不为空才会执行slotExchange方法的</span></span>
<span class="line"><span>		// 所以表示刚好已有其它线程加入进来将arena初始化</span></span>
<span class="line"><span>        else if (arena != null)</span></span>
<span class="line"><span>            // 这里就需要去执行arenaExchange</span></span>
<span class="line"><span>            return null; // caller must reroute to arenaExchange</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            // 这里表示当前线程是以第一个线程进来交换数据</span></span>
<span class="line"><span>            // 或者表示之前的数据交换已进行完毕，这里可以看作是第一个线程</span></span>
<span class="line"><span>            // 将需要交换的数据先存放在当前线程变量p中</span></span>
<span class="line"><span>            p.item = item;</span></span>
<span class="line"><span>            // 将需要交换的数据通过CAS设置到交换区slot</span></span>
<span class="line"><span>            if (U.compareAndSwapObject(this, SLOT, null, p))</span></span>
<span class="line"><span>                // 交换成功后跳出自旋</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            // CAS操作失败，表示有其它线程刚好先于当前线程将数据设置到交换区slot</span></span>
<span class="line"><span>            // 将当前线程变量中的item设置为null，然后自旋获取其它线程存放在交换区slot的数据</span></span>
<span class="line"><span>            p.item = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // await release</span></span>
<span class="line"><span>    // 执行到这里表示当前线程已将需要的交换的数据放置于交换区slot中了，</span></span>
<span class="line"><span>    // 等待其它线程交换数据然后唤醒当前线程</span></span>
<span class="line"><span>    int h = p.hash;</span></span>
<span class="line"><span>    long end = timed ? System.nanoTime() + ns : 0 L;</span></span>
<span class="line"><span>    // 自旋次数</span></span>
<span class="line"><span>    int spins = (NCPU &gt; 1) ? SPINS : 1;</span></span>
<span class="line"><span>    Object v;</span></span>
<span class="line"><span>    // 自旋等待直到p.match不为null，也就是说等待其它线程将需要交换的数据放置于交换区slot</span></span>
<span class="line"><span>    while ((v = p.match) == null) {</span></span>
<span class="line"><span>        // 下面的逻辑主要是自旋等待，直到spins递减到0为止</span></span>
<span class="line"><span>        if (spins &gt; 0) {</span></span>
<span class="line"><span>            h ^= h &lt;&lt; 1;</span></span>
<span class="line"><span>            h ^= h &gt;&gt;&gt; 3;</span></span>
<span class="line"><span>            h ^= h &lt;&lt; 10;</span></span>
<span class="line"><span>            if (h == 0)</span></span>
<span class="line"><span>                h = SPINS | (int) t.getId();</span></span>
<span class="line"><span>            else if (h &lt; 0 &amp;&amp; (--spins &amp; ((SPINS &gt;&gt;&gt; 1) - 1)) == 0)</span></span>
<span class="line"><span>                Thread.yield();</span></span>
<span class="line"><span>        } else if (slot != p)</span></span>
<span class="line"><span>            spins = SPINS;</span></span>
<span class="line"><span>        // 此处表示未设置超时或者时间未超时</span></span>
<span class="line"><span>        else if (!t.isInterrupted() &amp;&amp; arena == null &amp;&amp;</span></span>
<span class="line"><span>            (!timed || (ns = end - System.nanoTime()) &gt; 0 L)) {</span></span>
<span class="line"><span>            // 设置线程t被当前对象阻塞</span></span>
<span class="line"><span>            U.putObject(t, BLOCKER, this);</span></span>
<span class="line"><span>            // 给p挂机线程的值赋值</span></span>
<span class="line"><span>            p.parked = t;</span></span>
<span class="line"><span>            if (slot == p)</span></span>
<span class="line"><span>                // 如果slot还没有被置为null，也就表示暂未有线程过来交换数据，需要将当前线程挂起</span></span>
<span class="line"><span>                U.park(false, ns);</span></span>
<span class="line"><span>            // 线程被唤醒，将被挂起的线程设置为null</span></span>
<span class="line"><span>            p.parked = null;</span></span>
<span class="line"><span>            // 设置线程t未被任何对象阻塞</span></span>
<span class="line"><span>            U.putObject(t, BLOCKER, null);</span></span>
<span class="line"><span>        // 不是以上条件时(可能是arena已不为null或者超时)    </span></span>
<span class="line"><span>        } else if (U.compareAndSwapObject(this, SLOT, p, null)) {</span></span>
<span class="line"><span>             // arena不为null则v为null,其它为超时则v为超市对象TIMED_OUT，并且跳出循环</span></span>
<span class="line"><span>            v = timed &amp;&amp; ns &lt;= 0 L &amp;&amp; !t.isInterrupted() ? TIMED_OUT : null;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 取走match值，并将p中的match置为null</span></span>
<span class="line"><span>    U.putOrderedObject(p, MATCH, null);</span></span>
<span class="line"><span>    // 设置item为null</span></span>
<span class="line"><span>    p.item = null;</span></span>
<span class="line"><span>    p.hash = h;</span></span>
<span class="line"><span>    // 返回交换值</span></span>
<span class="line"><span>    return v;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>程序首先通过participant获取当前线程节点Node。检测是否中断，如果中断return null，等待后续抛出InterruptedException异常。</p><ul><li>如果slot不为null，则进行slot消除，成功直接返回数据V，否则失败，则创建arena消除数组。</li><li>如果slot为null，但arena不为null，则返回null，进入arenaExchange逻辑。</li><li>如果slot为null，且arena也为null，则尝试占领该slot，失败重试，成功则跳出循环进入spin+block(自旋+阻塞)模式。</li></ul><p>在自旋+阻塞模式中，首先取得结束时间和自旋次数。如果match(做releasing操作的线程传递的项)为null，其首先尝试spins+随机次自旋(改自旋使用当前节点中的hash，并改变之)和退让。当自旋数为0后，假如slot发生了改变(slot != p)则重置自旋数并重试。否则假如：当前未中断&amp;arena为null&amp;(当前不是限时版本或者限时版本+当前时间未结束)：阻塞或者限时阻塞。假如：当前中断或者arena不为null或者当前为限时版本+时间已经结束：不限时版本：置v为null；限时版本：如果时间结束以及未中断则TIMED_OUT；否则给出null(原因是探测到arena非空或者当前线程中断)。</p><p>match不为空时跳出循环。</p><h3 id="arenaexchange-object-item-boolean-timed-long-ns" tabindex="-1">arenaExchange(Object item, boolean timed, long ns) <a class="header-anchor" href="#arenaexchange-object-item-boolean-timed-long-ns" aria-label="Permalink to &quot;arenaExchange(Object item, boolean timed, long ns)&quot;">​</a></h3><p>此方法被执行时表示多个线程进入交换区交换数据，arena数组已被初始化，此方法中的一些处理方式和slotExchange比较类似，它是通过遍历arena数组找到需要交换的数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// timed 为true表示设置了超时时间，ns为&gt;0的值，反之没有设置超时时间</span></span>
<span class="line"><span>private final Object arenaExchange(Object item, boolean timed, long ns) {</span></span>
<span class="line"><span>    Node[] a = arena;</span></span>
<span class="line"><span>    // 获取当前线程中的存放的node</span></span>
<span class="line"><span>    Node p = participant.get();</span></span>
<span class="line"><span>    //index初始值0</span></span>
<span class="line"><span>    for (int i = p.index;;) { // access slot at i</span></span>
<span class="line"><span>        // 遍历，如果在数组中找到数据则直接交换并唤醒线程，如未找到则将需要交换给其它线程的数据放置于数组中</span></span>
<span class="line"><span>        int b, m, c;</span></span>
<span class="line"><span>        long j; // j is raw array offset</span></span>
<span class="line"><span>        // 其实这里就是向右遍历数组，只是用到了元素在内存偏移的偏移量</span></span>
<span class="line"><span>        // q实际为arena数组偏移(i + 1) *  128个地址位上的node</span></span>
<span class="line"><span>        Node q = (Node) U.getObjectVolatile(a, j = (i &lt;&lt; ASHIFT) + ABASE);</span></span>
<span class="line"><span>        // 如果q不为null，并且CAS操作成功，将下标j的元素置为null</span></span>
<span class="line"><span>        if (q != null &amp;&amp; U.compareAndSwapObject(a, j, q, null)) {</span></span>
<span class="line"><span>            // 表示当前线程已发现有交换的数据，然后获取数据，唤醒等待的线程</span></span>
<span class="line"><span>            Object v = q.item; // release</span></span>
<span class="line"><span>            q.match = item;</span></span>
<span class="line"><span>            Thread w = q.parked;</span></span>
<span class="line"><span>            if (w != null)</span></span>
<span class="line"><span>                U.unpark(w);</span></span>
<span class="line"><span>            return v;</span></span>
<span class="line"><span>        // q 为null 并且 i 未超过数组边界    </span></span>
<span class="line"><span>        } else if (i &lt;= (m = (b = bound) &amp; MMASK) &amp;&amp; q == null) {</span></span>
<span class="line"><span>             // 将需要给其它线程的item赋予给p中的item</span></span>
<span class="line"><span>            p.item = item; // offer</span></span>
<span class="line"><span>            if (U.compareAndSwapObject(a, j, null, p)) {</span></span>
<span class="line"><span>                // 交换成功</span></span>
<span class="line"><span>                long end = (timed &amp;&amp; m == 0) ? System.nanoTime() + ns : 0 L;</span></span>
<span class="line"><span>                Thread t = Thread.currentThread(); // wait</span></span>
<span class="line"><span>                // 自旋直到有其它线程进入，遍历到该元素并与其交换，同时当前线程被唤醒</span></span>
<span class="line"><span>                for (int h = p.hash, spins = SPINS;;) {</span></span>
<span class="line"><span>                    Object v = p.match;</span></span>
<span class="line"><span>                    if (v != null) {</span></span>
<span class="line"><span>                        // 其它线程设置的需要交换的数据match不为null</span></span>
<span class="line"><span>                        // 将match设置null,item设置为null</span></span>
<span class="line"><span>                        U.putOrderedObject(p, MATCH, null);</span></span>
<span class="line"><span>                        p.item = null; // clear for next use</span></span>
<span class="line"><span>                        p.hash = h;</span></span>
<span class="line"><span>                        return v;</span></span>
<span class="line"><span>                    } else if (spins &gt; 0) {</span></span>
<span class="line"><span>                        h ^= h &lt;&lt; 1;</span></span>
<span class="line"><span>                        h ^= h &gt;&gt;&gt; 3;</span></span>
<span class="line"><span>                        h ^= h &lt;&lt; 10; // xorshift</span></span>
<span class="line"><span>                        if (h == 0) // initialize hash</span></span>
<span class="line"><span>                            h = SPINS | (int) t.getId();</span></span>
<span class="line"><span>                        else if (h &lt; 0 &amp;&amp; // approx 50% true</span></span>
<span class="line"><span>                            (--spins &amp; ((SPINS &gt;&gt;&gt; 1) - 1)) == 0)</span></span>
<span class="line"><span>                            Thread.yield(); // two yields per wait</span></span>
<span class="line"><span>                    } else if (U.getObjectVolatile(a, j) != p)</span></span>
<span class="line"><span>                        // 和slotExchange方法中的类似，arena数组中的数据已被CAS设置</span></span>
<span class="line"><span>                       // match值还未设置，让其再自旋等待match被设置</span></span>
<span class="line"><span>                        spins = SPINS; // releaser hasn&#39;t set match yet</span></span>
<span class="line"><span>                    else if (!t.isInterrupted() &amp;&amp; m == 0 &amp;&amp;</span></span>
<span class="line"><span>                        (!timed ||</span></span>
<span class="line"><span>                            (ns = end - System.nanoTime()) &gt; 0 L)) {</span></span>
<span class="line"><span>                        // 设置线程t被当前对象阻塞</span></span>
<span class="line"><span>                        U.putObject(t, BLOCKER, this); // emulate LockSupport</span></span>
<span class="line"><span>                         // 线程t赋值</span></span>
<span class="line"><span>                        p.parked = t; // minimize window</span></span>
<span class="line"><span>                        if (U.getObjectVolatile(a, j) == p)</span></span>
<span class="line"><span>                            // 数组中对象还相等，表示线程还未被唤醒，唤醒线程</span></span>
<span class="line"><span>                            U.park(false, ns);</span></span>
<span class="line"><span>                        p.parked = null;</span></span>
<span class="line"><span>                         // 设置线程t未被任何对象阻塞</span></span>
<span class="line"><span>                        U.putObject(t, BLOCKER, null);</span></span>
<span class="line"><span>                    } else if (U.getObjectVolatile(a, j) == p &amp;&amp;</span></span>
<span class="line"><span>                        U.compareAndSwapObject(a, j, p, null)) {</span></span>
<span class="line"><span>                        // 这里给bound增加加一个SEQ</span></span>
<span class="line"><span>                        if (m != 0) // try to shrink</span></span>
<span class="line"><span>                            U.compareAndSwapInt(this, BOUND, b, b + SEQ - 1);</span></span>
<span class="line"><span>                        p.item = null;</span></span>
<span class="line"><span>                        p.hash = h;</span></span>
<span class="line"><span>                        i = p.index &gt;&gt;&gt;= 1; // descend</span></span>
<span class="line"><span>                        if (Thread.interrupted())</span></span>
<span class="line"><span>                            return null;</span></span>
<span class="line"><span>                        if (timed &amp;&amp; m == 0 &amp;&amp; ns &lt;= 0 L)</span></span>
<span class="line"><span>                            return TIMED_OUT;</span></span>
<span class="line"><span>                        break; // expired; restart</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else</span></span>
<span class="line"><span>                // 交换失败，表示有其它线程更改了arena数组中下标i的元素</span></span>
<span class="line"><span>                p.item = null; // clear offer</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            // 此时表示下标不在bound &amp; MMASK或q不为null但CAS操作失败</span></span>
<span class="line"><span>           // 需要更新bound变化后的值</span></span>
<span class="line"><span>            if (p.bound != b) { // stale; reset</span></span>
<span class="line"><span>                p.bound = b;</span></span>
<span class="line"><span>                p.collides = 0;</span></span>
<span class="line"><span>                // 反向遍历</span></span>
<span class="line"><span>                i = (i != m || m == 0) ? m : m - 1;</span></span>
<span class="line"><span>            } else if ((c = p.collides) &lt; m || m == FULL ||</span></span>
<span class="line"><span>                !U.compareAndSwapInt(this, BOUND, b, b + SEQ + 1)) {</span></span>
<span class="line"><span>                 // 记录CAS失败的次数</span></span>
<span class="line"><span>                p.collides = c + 1;</span></span>
<span class="line"><span>                // 循环遍历</span></span>
<span class="line"><span>                i = (i == 0) ? m : i - 1; // cyclically traverse</span></span>
<span class="line"><span>            } else</span></span>
<span class="line"><span>                // 此时表示bound值增加了SEQ+1</span></span>
<span class="line"><span>                i = m + 1; // grow</span></span>
<span class="line"><span>            // 设置下标</span></span>
<span class="line"><span>            p.index = i;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先通过participant取得当前节点Node，然后根据当前节点Node的index去取arena中相对应的节点node。</p><ul><li><strong>前面提到过arena可以确保不同的slot在arena中是不会相冲突的，那么是怎么保证的呢？</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>arena = new Node[(FULL + 2) &lt;&lt; ASHIFT];</span></span>
<span class="line"><span>// 这个arena到底有多大呢? 我们先看FULL 和ASHIFT的定义：</span></span>
<span class="line"><span>static final int FULL = (NCPU &gt;= (MMASK &lt;&lt; 1)) ? MMASK : NCPU &gt;&gt;&gt; 1;</span></span>
<span class="line"><span>private static final int ASHIFT = 7;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static final int NCPU = Runtime.getRuntime().availableProcessors();</span></span>
<span class="line"><span>private static final int MMASK = 0xff;        // 255</span></span>
<span class="line"><span>// 假如我的机器NCPU = 8 ，则得到的是768大小的arena数组。然后通过以下代码取得在arena中的节点：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Node q = (Node)U.getObjectVolatile(a, j = (i &lt;&lt; ASHIFT) + ABASE);</span></span>
<span class="line"><span>// 它仍然是通过右移ASHIFT位来取得Node的，ABASE定义如下：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Class&lt;?&gt; ak = Node[].class;</span></span>
<span class="line"><span>ABASE = U.arrayBaseOffset(ak) + (1 &lt;&lt; ASHIFT);</span></span>
<span class="line"><span>// U.arrayBaseOffset获取对象头长度，数组元素的大小可以通过unsafe.arrayIndexScale(T[].class) 方法获取到。这也就是说要访问类型为T的第N个元素的话，你的偏移量offset应该是arrayOffset+N*arrayScale。也就是说BASE = arrayOffset+ 128 。</span></span></code></pre></div><ul><li><strong>用@sun.misc.Contended来规避伪共享？</strong></li></ul><p><strong>伪共享说明</strong>：假设一个类的两个相互独立的属性a和b在内存地址上是连续的(比如FIFO队列的头尾指针)，那么它们通常会被加载到相同的cpu cache line里面。并发情况下，如果一个线程修改了a，会导致整个cache line失效(包括b)，这时另一个线程来读b，就需要从内存里再次加载了，这种多线程频繁修改ab的情况下，虽然a和b看似独立，但它们会互相干扰，非常影响性能。</p><p>我们再看Node节点的定义, 在Java 8 中我们是可以利用sun.misc.Contended来规避伪共享的。所以说通过 &lt;&lt; ASHIFT方式加上sun.misc.Contended，所以使得任意两个可用Node不会再同一个缓存行中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@sun.misc.Contended static final class Node{</span></span>
<span class="line"><span>....</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再次回到arenaExchange()。取得arena中的node节点后，如果定位的节点q 不为空，且CAS操作成功，则交换数据，返回交换的数据，唤醒等待的线程。</p><ul><li>如果q等于null且下标在bound &amp; MMASK范围之内，则尝试占领该位置，如果成功，则采用自旋 + 阻塞的方式进行等待交换数据。</li><li>如果下标不在bound &amp; MMASK范围之内获取由于q不为null但是竞争失败的时候：消除p。加入bound 不等于当前节点的bond(b != p.bound)，则更新p.bound = b，collides = 0 ，i = m或者m - 1。如果冲突的次数不到m 获取m 已经为最大值或者修改当前bound的值失败，则通过增加一次collides以及循环递减下标i的值；否则更新当前bound的值成功：我们令i为m+1即为此时最大的下标。最后更新当前index的值。</li></ul><h3 id="更深入理解" tabindex="-1">更深入理解 <a class="header-anchor" href="#更深入理解" aria-label="Permalink to &quot;更深入理解&quot;">​</a></h3><ul><li><strong>SynchronousQueue对比？</strong></li></ul><p>Exchanger是一种线程间安全交换数据的机制。可以和之前分析过的SynchronousQueue对比一下：线程A通过SynchronousQueue将数据a交给线程B；线程A通过Exchanger和线程B交换数据，线程A把数据a交给线程B，同时线程B把数据b交给线程A。可见，SynchronousQueue是交给一个数据，Exchanger是交换两个数据。</p><ul><li><p><strong>不同JDK实现有何差别？</strong></p><ul><li>在JDK5中Exchanger被设计成一个容量为1的容器，存放一个等待线程，直到有另外线程到来就会发生数据交换，然后清空容器，等到下一个到来的线程。</li><li>从JDK6开始，Exchanger用了类似ConcurrentMap的分段思想，提供了多个slot，增加了并发执行时的吞吐量。</li></ul></li></ul><p>JDK1.6实现可以参考 <a href="https://www.iteye.com/blog/brokendreams-2253956" target="_blank" rel="noreferrer">这里在新窗口打开</a></p><h3 id="exchanger示例" tabindex="-1">Exchanger示例 <a class="header-anchor" href="#exchanger示例" aria-label="Permalink to &quot;Exchanger示例&quot;">​</a></h3><p>来一个非常经典的并发问题：你有相同的数据buffer，一个或多个数据生产者，和一个或多个数据消费者。只是Exchange类只能同步2个线程，所以你只能在你的生产者和消费者问题中只有一个生产者和一个消费者时使用这个类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>    static class Producer extends Thread {</span></span>
<span class="line"><span>        private Exchanger&lt;Integer&gt; exchanger;</span></span>
<span class="line"><span>        private static int data = 0;</span></span>
<span class="line"><span>        Producer(String name, Exchanger&lt;Integer&gt; exchanger) {</span></span>
<span class="line"><span>            super(&quot;Producer-&quot; + name);</span></span>
<span class="line"><span>            this.exchanger = exchanger;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>            for (int i=1; i&lt;5; i++) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    TimeUnit.SECONDS.sleep(1);</span></span>
<span class="line"><span>                    data = i;</span></span>
<span class="line"><span>                    System.out.println(getName()+&quot; 交换前:&quot; + data);</span></span>
<span class="line"><span>                    data = exchanger.exchange(data);</span></span>
<span class="line"><span>                    System.out.println(getName()+&quot; 交换后:&quot; + data);</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static class Consumer extends Thread {</span></span>
<span class="line"><span>        private Exchanger&lt;Integer&gt; exchanger;</span></span>
<span class="line"><span>        private static int data = 0;</span></span>
<span class="line"><span>        Consumer(String name, Exchanger&lt;Integer&gt; exchanger) {</span></span>
<span class="line"><span>            super(&quot;Consumer-&quot; + name);</span></span>
<span class="line"><span>            this.exchanger = exchanger;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>            while (true) {</span></span>
<span class="line"><span>                data = 0;</span></span>
<span class="line"><span>                System.out.println(getName()+&quot; 交换前:&quot; + data);</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    TimeUnit.SECONDS.sleep(1);</span></span>
<span class="line"><span>                    data = exchanger.exchange(data);</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                System.out.println(getName()+&quot; 交换后:&quot; + data);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        Exchanger&lt;Integer&gt; exchanger = new Exchanger&lt;Integer&gt;();</span></span>
<span class="line"><span>        new Producer(&quot;&quot;, exchanger).start();</span></span>
<span class="line"><span>        new Consumer(&quot;&quot;, exchanger).start();</span></span>
<span class="line"><span>        TimeUnit.SECONDS.sleep(7);</span></span>
<span class="line"><span>        System.exit(-1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，其结果可能如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Consumer- 交换前:0</span></span>
<span class="line"><span>Producer- 交换前:1</span></span>
<span class="line"><span>Consumer- 交换后:1</span></span>
<span class="line"><span>Consumer- 交换前:0</span></span>
<span class="line"><span>Producer- 交换后:0</span></span>
<span class="line"><span>Producer- 交换前:2</span></span>
<span class="line"><span>Producer- 交换后:0</span></span>
<span class="line"><span>Consumer- 交换后:2</span></span>
<span class="line"><span>Consumer- 交换前:0</span></span>
<span class="line"><span>Producer- 交换前:3</span></span>
<span class="line"><span>Producer- 交换后:0</span></span>
<span class="line"><span>Consumer- 交换后:3</span></span>
<span class="line"><span>Consumer- 交换前:0</span></span>
<span class="line"><span>Producer- 交换前:4</span></span>
<span class="line"><span>Producer- 交换后:0</span></span>
<span class="line"><span>Consumer- 交换后:4</span></span>
<span class="line"><span>Consumer- 交换前:0</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://cloud.tencent.com/developer/article/1529492" target="_blank" rel="noreferrer">https://cloud.tencent.com/developer/article/1529492</a></li><li><a href="https://coderbee.net/index.php/concurrent/20140424/897" target="_blank" rel="noreferrer">https://coderbee.net/index.php/concurrent/20140424/897</a></li><li><a href="https://www.cnblogs.com/wanly3643/p/3939552.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/wanly3643/p/3939552.html</a></li><li><a href="https://www.iteye.com/blog/brokendreams-2253956" target="_blank" rel="noreferrer">https://www.iteye.com/blog/brokendreams-2253956</a></li><li><a href="https://blog.csdn.net/u014634338/article/details/78385521" target="_blank" rel="noreferrer">https://blog.csdn.net/u014634338/article/details/78385521</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,63)]))}const g=a(l,[["render",i]]);export{u as __pageData,g as default};
