import{_ as s}from"./chunks/java-thread-x-juc-phaser-1.Xx5quirm.js";import{_ as n,c as p,ai as e,o as i}from"./chunks/framework.BrYByd3F.js";const v=JSON.parse('{"title":"JUC工具类: Phaser详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-tool-phaser.md","filePath":"java/thread/java-thread-x-juc-tool-phaser.md","lastUpdated":1737706346000}'),l={name:"java/thread/java-thread-x-juc-tool-phaser.md"};function t(r,a,c,o,h,d){return i(),p("div",null,a[0]||(a[0]=[e('<h1 id="juc工具类-phaser详解" tabindex="-1">JUC工具类: Phaser详解 <a class="header-anchor" href="#juc工具类-phaser详解" aria-label="Permalink to &quot;JUC工具类: Phaser详解&quot;">​</a></h1><blockquote><p>Phaser是JDK 7新增的一个同步辅助类，它可以实现CyclicBarrier和CountDownLatch类似的功能，而且它支持对任务的动态调整，并支持分层结构来达到更高的吞吐量。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解phaser工具" tabindex="-1">带着BAT大厂的面试问题去理解Phaser工具 <a class="header-anchor" href="#带着bat大厂的面试问题去理解phaser工具" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解Phaser工具&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解Phaser工具。@pdai</p><ul><li>Phaser主要用来解决什么问题?</li><li>Phaser与CyclicBarrier和CountDownLatch的区别是什么?</li><li>如果用CountDownLatch来实现Phaser的功能应该怎么实现?</li><li>Phaser运行机制是什么样的?</li><li>给一个Phaser使用的示例?</li></ul><h2 id="phaser运行机制" tabindex="-1">Phaser运行机制 <a class="header-anchor" href="#phaser运行机制" aria-label="Permalink to &quot;Phaser运行机制&quot;">​</a></h2><p><img src="'+s+`" alt="error.图片加载失败"></p><ul><li><strong>Registration(注册)</strong></li></ul><p>跟其他barrier不同，在phaser上注册的parties会随着时间的变化而变化。任务可以随时注册(使用方法register,bulkRegister注册，或者由构造器确定初始parties)，并且在任何抵达点可以随意地撤销注册(方法arriveAndDeregister)。就像大多数基本的同步结构一样，注册和撤销只影响内部count；不会创建更深的内部记录，所以任务不能查询他们是否已经注册。(不过，可以通过继承来实现类似的记录)</p><ul><li><strong>Synchronization(同步机制)</strong></li></ul><p>和CyclicBarrier一样，Phaser也可以重复await。方法arriveAndAwaitAdvance的效果类似CyclicBarrier.await。phaser的每一代都有一个相关的phase number，初始值为0，当所有注册的任务都到达phaser时phase+1，到达最大值(Integer.MAX_VALUE)之后清零。使用phase number可以独立控制 到达phaser 和 等待其他线程 的动作，通过下面两种类型的方法:</p><blockquote><ul><li><p><strong>Arrival(到达机制)</strong> arrive和arriveAndDeregister方法记录到达状态。这些方法不会阻塞，但是会返回一个相关的arrival phase number；也就是说，phase number用来确定到达状态。当所有任务都到达给定phase时，可以执行一个可选的函数，这个函数通过重写onAdvance方法实现，通常可以用来控制终止状态。重写此方法类似于为CyclicBarrier提供一个barrierAction，但比它更灵活。</p></li><li><p><strong>Waiting(等待机制)</strong> awaitAdvance方法需要一个表示arrival phase number的参数，并且在phaser前进到与给定phase不同的phase时返回。和CyclicBarrier不同，即使等待线程已经被中断，awaitAdvance方法也会一直等待。中断状态和超时时间同样可用，但是当任务等待中断或超时后未改变phaser的状态时会遭遇异常。如果有必要，在方法forceTermination之后可以执行这些异常的相关的handler进行恢复操作，Phaser也可能被ForkJoinPool中的任务使用，这样在其他任务阻塞等待一个phase时可以保证足够的并行度来执行任务。</p></li></ul></blockquote><ul><li><strong>Termination(终止机制)</strong> :</li></ul><p>可以用isTerminated方法检查phaser的终止状态。在终止时，所有同步方法立刻返回一个负值。在终止时尝试注册也没有效果。当调用onAdvance返回true时Termination被触发。当deregistration操作使已注册的parties变为0时，onAdvance的默认实现就会返回true。也可以重写onAdvance方法来定义终止动作。forceTermination方法也可以释放等待线程并且允许它们终止。</p><ul><li><strong>Tiering(分层结构)</strong> :</li></ul><p>Phaser支持分层结构(树状构造)来减少竞争。注册了大量parties的Phaser可能会因为同步竞争消耗很高的成本， 因此可以设置一些子Phaser来共享一个通用的parent。这样的话即使每个操作消耗了更多的开销，但是会提高整体吞吐量。 在一个分层结构的phaser里，子节点phaser的注册和取消注册都通过父节点管理。子节点phaser通过构造或方法register、bulkRegister进行首次注册时，在其父节点上注册。子节点phaser通过调用arriveAndDeregister进行最后一次取消注册时，也在其父节点上取消注册。</p><ul><li><strong>Monitoring(状态监控)</strong> :</li></ul><p>由于同步方法可能只被已注册的parties调用，所以phaser的当前状态也可能被任何调用者监控。在任何时候，可以通过getRegisteredParties获取parties数，其中getArrivedParties方法返回已经到达当前phase的parties数。当剩余的parties(通过方法getUnarrivedParties获取)到达时，phase进入下一代。这些方法返回的值可能只表示短暂的状态，所以一般来说在同步结构里并没有啥卵用。</p><h2 id="phaser源码详解" tabindex="-1">Phaser源码详解 <a class="header-anchor" href="#phaser源码详解" aria-label="Permalink to &quot;Phaser源码详解&quot;">​</a></h2><h3 id="核心参数" tabindex="-1">核心参数 <a class="header-anchor" href="#核心参数" aria-label="Permalink to &quot;核心参数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private volatile long state;</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * The parent of this phaser, or null if none</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private final Phaser parent;</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * The root of phaser tree. Equals this if not in a tree.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private final Phaser root;</span></span>
<span class="line"><span>//等待线程的栈顶元素，根据phase取模定义为一个奇数header和一个偶数header</span></span>
<span class="line"><span>private final AtomicReference&lt;QNode&gt; evenQ;</span></span>
<span class="line"><span>private final AtomicReference&lt;QNode&gt; oddQ;</span></span></code></pre></div><p>state状态说明:</p><p>Phaser使用一个long型state值来标识内部状态:</p><ul><li>低0-15位表示未到达parties数；</li><li>中16-31位表示等待的parties数；</li><li>中32-62位表示phase当前代；</li><li>高63位表示当前phaser的终止状态。</li></ul><p>注意: 子Phaser的phase在没有被真正使用之前，允许滞后于它的root节点。这里在后面源码分析的reconcileState方法里会讲解。 Qnode是Phaser定义的内部等待队列，用于在阻塞时记录等待线程及相关信息。实现了ForkJoinPool的一个内部接口ManagedBlocker，上面已经说过，Phaser也可能被ForkJoinPool中的任务使用，这样在其他任务阻塞等待一个phase时可以保证足够的并行度来执行任务(通过内部实现方法isReleasable和block)。</p><h3 id="函数列表" tabindex="-1">函数列表 <a class="header-anchor" href="#函数列表" aria-label="Permalink to &quot;函数列表&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//构造方法</span></span>
<span class="line"><span>public Phaser() {</span></span>
<span class="line"><span>    this(null, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public Phaser(int parties) {</span></span>
<span class="line"><span>    this(null, parties);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public Phaser(Phaser parent) {</span></span>
<span class="line"><span>    this(parent, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public Phaser(Phaser parent, int parties)</span></span>
<span class="line"><span>//注册一个新的party</span></span>
<span class="line"><span>public int register()</span></span>
<span class="line"><span>//批量注册</span></span>
<span class="line"><span>public int bulkRegister(int parties)</span></span>
<span class="line"><span>//使当前线程到达phaser，不等待其他任务到达。返回arrival phase number</span></span>
<span class="line"><span>public int arrive() </span></span>
<span class="line"><span>//使当前线程到达phaser并撤销注册，返回arrival phase number</span></span>
<span class="line"><span>public int arriveAndDeregister()</span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * 使当前线程到达phaser并等待其他任务到达，等价于awaitAdvance(arrive())。</span></span>
<span class="line"><span> * 如果需要等待中断或超时，可以使用awaitAdvance方法完成一个类似的构造。</span></span>
<span class="line"><span> * 如果需要在到达后取消注册，可以使用awaitAdvance(arriveAndDeregister())。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public int arriveAndAwaitAdvance()</span></span>
<span class="line"><span>//等待给定phase数，返回下一个 arrival phase number</span></span>
<span class="line"><span>public int awaitAdvance(int phase)</span></span>
<span class="line"><span>//阻塞等待，直到phase前进到下一代，返回下一代的phase number</span></span>
<span class="line"><span>public int awaitAdvance(int phase) </span></span>
<span class="line"><span>//响应中断版awaitAdvance</span></span>
<span class="line"><span>public int awaitAdvanceInterruptibly(int phase) throws InterruptedException</span></span>
<span class="line"><span>public int awaitAdvanceInterruptibly(int phase, long timeout, TimeUnit unit)</span></span>
<span class="line"><span>    throws InterruptedException, TimeoutException</span></span>
<span class="line"><span>//使当前phaser进入终止状态，已注册的parties不受影响，如果是分层结构，则终止所有phaser</span></span>
<span class="line"><span>public void forceTermination()</span></span></code></pre></div><h3 id="方法-register" tabindex="-1">方法 - register() <a class="header-anchor" href="#方法-register" aria-label="Permalink to &quot;方法 - register()&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//注册一个新的party</span></span>
<span class="line"><span>public int register() {</span></span>
<span class="line"><span>    return doRegister(1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>private int doRegister(int registrations) {</span></span>
<span class="line"><span>    // adjustment to state</span></span>
<span class="line"><span>    long adjust = ((long)registrations &lt;&lt; PARTIES_SHIFT) | registrations;</span></span>
<span class="line"><span>    final Phaser parent = this.parent;</span></span>
<span class="line"><span>    int phase;</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        long s = (parent == null) ? state : reconcileState();</span></span>
<span class="line"><span>        int counts = (int)s;</span></span>
<span class="line"><span>        int parties = counts &gt;&gt;&gt; PARTIES_SHIFT;//获取已注册parties数</span></span>
<span class="line"><span>        int unarrived = counts &amp; UNARRIVED_MASK;//未到达数</span></span>
<span class="line"><span>        if (registrations &gt; MAX_PARTIES - parties)</span></span>
<span class="line"><span>            throw new IllegalStateException(badRegister(s));</span></span>
<span class="line"><span>        phase = (int)(s &gt;&gt;&gt; PHASE_SHIFT);//获取当前代</span></span>
<span class="line"><span>        if (phase &lt; 0)</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        if (counts != EMPTY) {                  // not 1st registration</span></span>
<span class="line"><span>            if (parent == null || reconcileState() == s) {</span></span>
<span class="line"><span>                if (unarrived == 0)             // wait out advance</span></span>
<span class="line"><span>                    root.internalAwaitAdvance(phase, null);//等待其他任务到达</span></span>
<span class="line"><span>                else if (UNSAFE.compareAndSwapLong(this, stateOffset,</span></span>
<span class="line"><span>                                                   s, s + adjust))//更新注册的parties数</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (parent == null) {              // 1st root registration</span></span>
<span class="line"><span>            long next = ((long)phase &lt;&lt; PHASE_SHIFT) | adjust;</span></span>
<span class="line"><span>            if (UNSAFE.compareAndSwapLong(this, stateOffset, s, next))//更新phase</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            //分层结构，子phaser首次注册用父节点管理</span></span>
<span class="line"><span>            synchronized (this) {               // 1st sub registration</span></span>
<span class="line"><span>                if (state == s) {               // recheck under lock</span></span>
<span class="line"><span>                    phase = parent.doRegister(1);//分层结构，使用父节点注册</span></span>
<span class="line"><span>                    if (phase &lt; 0)</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                    // finish registration whenever parent registration</span></span>
<span class="line"><span>                    // succeeded, even when racing with termination,</span></span>
<span class="line"><span>                    // since these are part of the same &quot;transaction&quot;.</span></span>
<span class="line"><span>                    //由于在同一个事务里，即使phaser已终止，也会完成注册</span></span>
<span class="line"><span>                    while (!UNSAFE.compareAndSwapLong</span></span>
<span class="line"><span>                           (this, stateOffset, s,</span></span>
<span class="line"><span>                            ((long)phase &lt;&lt; PHASE_SHIFT) | adjust)) {//更新phase</span></span>
<span class="line"><span>                        s = state;</span></span>
<span class="line"><span>                        phase = (int)(root.state &gt;&gt;&gt; PHASE_SHIFT);</span></span>
<span class="line"><span>                        // assert (int)s == EMPTY;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return phase;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: register方法为phaser添加一个新的party，如果onAdvance正在运行，那么这个方法会等待它运行结束再返回结果。如果当前phaser有父节点，并且当前phaser上没有已注册的party，那么就会交给父节点注册。</p><p>register和bulkRegister都由doRegister实现，大概流程如下:</p><ul><li>如果当前操作不是首次注册，那么直接在当前phaser上更新注册parties数</li><li>如果是首次注册，并且当前phaser没有父节点，说明是root节点注册，直接更新phase</li><li>如果当前操作是首次注册，并且当前phaser由父节点，则注册操作交由父节点，并更新当前phaser的phase</li><li>上面说过，子Phaser的phase在没有被真正使用之前，允许滞后于它的root节点。非首次注册时，如果Phaser有父节点，则调用reconcileState()方法解决root节点的phase延迟传递问题， 源码如下:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private long reconcileState() {</span></span>
<span class="line"><span>    final Phaser root = this.root;</span></span>
<span class="line"><span>    long s = state;</span></span>
<span class="line"><span>    if (root != this) {</span></span>
<span class="line"><span>        int phase, p;</span></span>
<span class="line"><span>        // CAS to root phase with current parties, tripping unarrived</span></span>
<span class="line"><span>        while ((phase = (int)(root.state &gt;&gt;&gt; PHASE_SHIFT)) !=</span></span>
<span class="line"><span>               (int)(s &gt;&gt;&gt; PHASE_SHIFT) &amp;&amp;</span></span>
<span class="line"><span>               !UNSAFE.compareAndSwapLong</span></span>
<span class="line"><span>               (this, stateOffset, s,</span></span>
<span class="line"><span>                s = (((long)phase &lt;&lt; PHASE_SHIFT) |</span></span>
<span class="line"><span>                     ((phase &lt; 0) ? (s &amp; COUNTS_MASK) :</span></span>
<span class="line"><span>                      (((p = (int)s &gt;&gt;&gt; PARTIES_SHIFT) == 0) ? EMPTY :</span></span>
<span class="line"><span>                       ((s &amp; PARTIES_MASK) | p))))))</span></span>
<span class="line"><span>            s = state;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return s;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当root节点的phase已经advance到下一代，但是子节点phaser还没有，这种情况下它们必须通过更新未到达parties数 完成它们自己的advance操作(如果parties为0，重置为EMPTY状态)。</p><p>回到register方法的第一步，如果当前未到达数为0，说明上一代phase正在进行到达操作，此时调用internalAwaitAdvance()方法等待其他任务完成到达操作，源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//阻塞等待phase到下一代</span></span>
<span class="line"><span>private int internalAwaitAdvance(int phase, QNode node) {</span></span>
<span class="line"><span>    // assert root == this;</span></span>
<span class="line"><span>    releaseWaiters(phase-1);          // ensure old queue clean</span></span>
<span class="line"><span>    boolean queued = false;           // true when node is enqueued</span></span>
<span class="line"><span>    int lastUnarrived = 0;            // to increase spins upon change</span></span>
<span class="line"><span>    int spins = SPINS_PER_ARRIVAL;</span></span>
<span class="line"><span>    long s;</span></span>
<span class="line"><span>    int p;</span></span>
<span class="line"><span>    while ((p = (int)((s = state) &gt;&gt;&gt; PHASE_SHIFT)) == phase) {</span></span>
<span class="line"><span>        if (node == null) {           // spinning in noninterruptible mode</span></span>
<span class="line"><span>            int unarrived = (int)s &amp; UNARRIVED_MASK;//未到达数</span></span>
<span class="line"><span>            if (unarrived != lastUnarrived &amp;&amp;</span></span>
<span class="line"><span>                (lastUnarrived = unarrived) &lt; NCPU)</span></span>
<span class="line"><span>                spins += SPINS_PER_ARRIVAL;</span></span>
<span class="line"><span>            boolean interrupted = Thread.interrupted();</span></span>
<span class="line"><span>            if (interrupted || --spins &lt; 0) { // need node to record intr</span></span>
<span class="line"><span>                //使用node记录中断状态</span></span>
<span class="line"><span>                node = new QNode(this, phase, false, false, 0L);</span></span>
<span class="line"><span>                node.wasInterrupted = interrupted;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (node.isReleasable()) // done or aborted</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        else if (!queued) {           // push onto queue</span></span>
<span class="line"><span>            AtomicReference&lt;QNode&gt; head = (phase &amp; 1) == 0 ? evenQ : oddQ;</span></span>
<span class="line"><span>            QNode q = node.next = head.get();</span></span>
<span class="line"><span>            if ((q == null || q.phase == phase) &amp;&amp;</span></span>
<span class="line"><span>                (int)(state &gt;&gt;&gt; PHASE_SHIFT) == phase) // avoid stale enq</span></span>
<span class="line"><span>                queued = head.compareAndSet(q, node);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ForkJoinPool.managedBlock(node);//阻塞给定node</span></span>
<span class="line"><span>            } catch (InterruptedException ie) {</span></span>
<span class="line"><span>                node.wasInterrupted = true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (node != null) {</span></span>
<span class="line"><span>        if (node.thread != null)</span></span>
<span class="line"><span>            node.thread = null;       // avoid need for unpark()</span></span>
<span class="line"><span>        if (node.wasInterrupted &amp;&amp; !node.interruptible)</span></span>
<span class="line"><span>            Thread.currentThread().interrupt();</span></span>
<span class="line"><span>        if (p == phase &amp;&amp; (p = (int)(state &gt;&gt;&gt; PHASE_SHIFT)) == phase)</span></span>
<span class="line"><span>            return abortWait(phase); // possibly clean up on abort</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    releaseWaiters(phase);</span></span>
<span class="line"><span>    return p;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>简单介绍下第二个参数node，如果不为空，则说明等待线程需要追踪中断状态或超时状态。以doRegister中的调用为例，不考虑线程争用，internalAwaitAdvance大概流程如下:</p><ul><li>首先调用releaseWaiters唤醒上一代所有等待线程，确保旧队列中没有遗留的等待线程。</li><li>循环SPINS_PER_ARRIVAL指定的次数或者当前线程被中断，创建node记录等待线程及相关信息。</li><li>继续循环调用ForkJoinPool.managedBlock运行被阻塞的任务</li><li>继续循环，阻塞任务运行成功被释放，跳出循环</li><li>最后唤醒当前phase的线程</li></ul><h3 id="方法-arrive" tabindex="-1">方法 - arrive() <a class="header-anchor" href="#方法-arrive" aria-label="Permalink to &quot;方法 - arrive()&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//使当前线程到达phaser，不等待其他任务到达。返回arrival phase number</span></span>
<span class="line"><span>public int arrive() {</span></span>
<span class="line"><span>    return doArrive(ONE_ARRIVAL);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int doArrive(int adjust) {</span></span>
<span class="line"><span>    final Phaser root = this.root;</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        long s = (root == this) ? state : reconcileState();</span></span>
<span class="line"><span>        int phase = (int)(s &gt;&gt;&gt; PHASE_SHIFT);</span></span>
<span class="line"><span>        if (phase &lt; 0)</span></span>
<span class="line"><span>            return phase;</span></span>
<span class="line"><span>        int counts = (int)s;</span></span>
<span class="line"><span>        //获取未到达数</span></span>
<span class="line"><span>        int unarrived = (counts == EMPTY) ? 0 : (counts &amp; UNARRIVED_MASK);</span></span>
<span class="line"><span>        if (unarrived &lt;= 0)</span></span>
<span class="line"><span>            throw new IllegalStateException(badArrive(s));</span></span>
<span class="line"><span>        if (UNSAFE.compareAndSwapLong(this, stateOffset, s, s-=adjust)) {//更新state</span></span>
<span class="line"><span>            if (unarrived == 1) {//当前为最后一个未到达的任务</span></span>
<span class="line"><span>                long n = s &amp; PARTIES_MASK;  // base of next state</span></span>
<span class="line"><span>                int nextUnarrived = (int)n &gt;&gt;&gt; PARTIES_SHIFT;</span></span>
<span class="line"><span>                if (root == this) {</span></span>
<span class="line"><span>                    if (onAdvance(phase, nextUnarrived))//检查是否需要终止phaser</span></span>
<span class="line"><span>                        n |= TERMINATION_BIT;</span></span>
<span class="line"><span>                    else if (nextUnarrived == 0)</span></span>
<span class="line"><span>                        n |= EMPTY;</span></span>
<span class="line"><span>                    else</span></span>
<span class="line"><span>                        n |= nextUnarrived;</span></span>
<span class="line"><span>                    int nextPhase = (phase + 1) &amp; MAX_PHASE;</span></span>
<span class="line"><span>                    n |= (long)nextPhase &lt;&lt; PHASE_SHIFT;</span></span>
<span class="line"><span>                    UNSAFE.compareAndSwapLong(this, stateOffset, s, n);</span></span>
<span class="line"><span>                    releaseWaiters(phase);//释放等待phase的线程</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                //分层结构，使用父节点管理arrive</span></span>
<span class="line"><span>                else if (nextUnarrived == 0) { //propagate deregistration</span></span>
<span class="line"><span>                    phase = parent.doArrive(ONE_DEREGISTER);</span></span>
<span class="line"><span>                    UNSAFE.compareAndSwapLong(this, stateOffset,</span></span>
<span class="line"><span>                                              s, s | EMPTY);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                    phase = parent.doArrive(ONE_ARRIVAL);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return phase;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: arrive方法手动调整到达数，使当前线程到达phaser。arrive和arriveAndDeregister都调用了doArrive实现，大概流程如下:</p><ul><li>首先更新state(state - adjust)；</li><li>如果当前不是最后一个未到达的任务，直接返回phase</li><li>如果当前是最后一个未到达的任务: <ul><li>如果当前是root节点，判断是否需要终止phaser，CAS更新phase，最后释放等待的线程；</li><li>如果是分层结构，并且已经没有下一代未到达的parties，则交由父节点处理doArrive逻辑，然后更新state为EMPTY。</li></ul></li></ul><h3 id="方法-arriveandawaitadvance" tabindex="-1">方法 - arriveAndAwaitAdvance() <a class="header-anchor" href="#方法-arriveandawaitadvance" aria-label="Permalink to &quot;方法 - arriveAndAwaitAdvance()&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int arriveAndAwaitAdvance() {</span></span>
<span class="line"><span>    // Specialization of doArrive+awaitAdvance eliminating some reads/paths</span></span>
<span class="line"><span>    final Phaser root = this.root;</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        long s = (root == this) ? state : reconcileState();</span></span>
<span class="line"><span>        int phase = (int)(s &gt;&gt;&gt; PHASE_SHIFT);</span></span>
<span class="line"><span>        if (phase &lt; 0)</span></span>
<span class="line"><span>            return phase;</span></span>
<span class="line"><span>        int counts = (int)s;</span></span>
<span class="line"><span>        int unarrived = (counts == EMPTY) ? 0 : (counts &amp; UNARRIVED_MASK);//获取未到达数</span></span>
<span class="line"><span>        if (unarrived &lt;= 0)</span></span>
<span class="line"><span>            throw new IllegalStateException(badArrive(s));</span></span>
<span class="line"><span>        if (UNSAFE.compareAndSwapLong(this, stateOffset, s,</span></span>
<span class="line"><span>                                      s -= ONE_ARRIVAL)) {//更新state</span></span>
<span class="line"><span>            if (unarrived &gt; 1)</span></span>
<span class="line"><span>                return root.internalAwaitAdvance(phase, null);//阻塞等待其他任务</span></span>
<span class="line"><span>            if (root != this)</span></span>
<span class="line"><span>                return parent.arriveAndAwaitAdvance();//子Phaser交给父节点处理</span></span>
<span class="line"><span>            long n = s &amp; PARTIES_MASK;  // base of next state</span></span>
<span class="line"><span>            int nextUnarrived = (int)n &gt;&gt;&gt; PARTIES_SHIFT;</span></span>
<span class="line"><span>            if (onAdvance(phase, nextUnarrived))//全部到达，检查是否可销毁</span></span>
<span class="line"><span>                n |= TERMINATION_BIT;</span></span>
<span class="line"><span>            else if (nextUnarrived == 0)</span></span>
<span class="line"><span>                n |= EMPTY;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                n |= nextUnarrived;</span></span>
<span class="line"><span>            int nextPhase = (phase + 1) &amp; MAX_PHASE;//计算下一代phase</span></span>
<span class="line"><span>            n |= (long)nextPhase &lt;&lt; PHASE_SHIFT;</span></span>
<span class="line"><span>            if (!UNSAFE.compareAndSwapLong(this, stateOffset, s, n))//更新state</span></span>
<span class="line"><span>                return (int)(state &gt;&gt;&gt; PHASE_SHIFT); // terminated</span></span>
<span class="line"><span>            releaseWaiters(phase);//释放等待phase的线程</span></span>
<span class="line"><span>            return nextPhase;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 使当前线程到达phaser并等待其他任务到达，等价于awaitAdvance(arrive())。如果需要等待中断或超时，可以使用awaitAdvance方法完成一个类似的构造。如果需要在到达后取消注册，可以使用awaitAdvance(arriveAndDeregister())。效果类似于CyclicBarrier.await。大概流程如下:</p><ul><li>更新state(state - 1)；</li><li>如果未到达数大于1，调用internalAwaitAdvance阻塞等待其他任务到达，返回当前phase</li><li>如果为分层结构，则交由父节点处理arriveAndAwaitAdvance逻辑</li><li>如果未到达数&lt;=1，判断phaser终止状态，CAS更新phase到下一代，最后释放等待当前phase的线程，并返回下一代phase。</li></ul><h3 id="方法-awaitadvance-int-phase" tabindex="-1">方法 - awaitAdvance(int phase) <a class="header-anchor" href="#方法-awaitadvance-int-phase" aria-label="Permalink to &quot;方法 - awaitAdvance(int phase)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int awaitAdvance(int phase) {</span></span>
<span class="line"><span>    final Phaser root = this.root;</span></span>
<span class="line"><span>    long s = (root == this) ? state : reconcileState();</span></span>
<span class="line"><span>    int p = (int)(s &gt;&gt;&gt; PHASE_SHIFT);</span></span>
<span class="line"><span>    if (phase &lt; 0)</span></span>
<span class="line"><span>        return phase;</span></span>
<span class="line"><span>    if (p == phase)</span></span>
<span class="line"><span>        return root.internalAwaitAdvance(phase, null);</span></span>
<span class="line"><span>    return p;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//响应中断版awaitAdvance</span></span>
<span class="line"><span>public int awaitAdvanceInterruptibly(int phase)</span></span>
<span class="line"><span>    throws InterruptedException {</span></span>
<span class="line"><span>    final Phaser root = this.root;</span></span>
<span class="line"><span>    long s = (root == this) ? state : reconcileState();</span></span>
<span class="line"><span>    int p = (int)(s &gt;&gt;&gt; PHASE_SHIFT);</span></span>
<span class="line"><span>    if (phase &lt; 0)</span></span>
<span class="line"><span>        return phase;</span></span>
<span class="line"><span>    if (p == phase) {</span></span>
<span class="line"><span>        QNode node = new QNode(this, phase, true, false, 0L);</span></span>
<span class="line"><span>        p = root.internalAwaitAdvance(phase, node);</span></span>
<span class="line"><span>        if (node.wasInterrupted)</span></span>
<span class="line"><span>            throw new InterruptedException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return p;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: awaitAdvance用于阻塞等待线程到达，直到phase前进到下一代，返回下一代的phase number。方法很简单，不多赘述。awaitAdvanceInterruptibly方法是响应中断版的awaitAdvance，不同之处在于，调用阻塞时会记录线程的中断状态。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>本文主要参考自泰迪的bagwell的<a href="https://www.jianshu.com/p/e5794645ca8d%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E8%BF%9B%E8%A1%8C%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.jianshu.com/p/e5794645ca8d，在此基础上进行了增改。</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,53)]))}const A=n(l,[["render",t]]);export{v as __pageData,A as default};
