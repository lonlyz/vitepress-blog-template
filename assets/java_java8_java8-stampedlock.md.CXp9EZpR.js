import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/java/java-stampedlock-1.png",m=JSON.parse('{"title":"Java 8 - StampedLock","description":"","frontmatter":{},"headers":[],"relativePath":"java/java8/java8-stampedlock.md","filePath":"java/java8/java8-stampedlock.md","lastUpdated":1737706346000}'),t={name:"java/java8/java8-stampedlock.md"};function i(c,a,o,r,d,k){return e(),s("div",null,a[0]||(a[0]=[p(`<h1 id="java-8-stampedlock" tabindex="-1">Java 8 - StampedLock <a class="header-anchor" href="#java-8-stampedlock" aria-label="Permalink to &quot;Java 8 - StampedLock&quot;">​</a></h1><blockquote><p>本文将从synchronized、Lock到Java8新增的StampedLock进行对比分析，相信StampedLock不会让大家失望。@pdai</p></blockquote><h2 id="synchronized" tabindex="-1">synchronized <a class="header-anchor" href="#synchronized" aria-label="Permalink to &quot;synchronized&quot;">​</a></h2><p>在java5之前，实现同步主要是使用synchronized。它是Java语言的关键字，当它用来修饰一个方法或者一个代码块的时候，能够保证在同一时刻最多只有一个线程执行该段代码。</p><p>有四种不同的同步块:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>实例方法</span></span>
<span class="line"><span>静态方法</span></span>
<span class="line"><span>实例方法中的同步块</span></span>
<span class="line"><span>静态方法中的同步块</span></span></code></pre></div><p>大家对此应该不陌生，所以不多讲了，以下是代码示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>synchronized(this)</span></span>
<span class="line"><span>// do operation</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>小结: 在多线程并发编程中Synchronized一直是元老级角色，很多人都会称呼它为重量级锁，但是随着Java SE1.6对Synchronized进行了各种优化之后，性能上也有所提升。</p><h2 id="lock" tabindex="-1">Lock <a class="header-anchor" href="#lock" aria-label="Permalink to &quot;Lock&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rwlock.writeLock().lock();</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>	// do operation</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span>	rwlock.writeLock().unlock();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>它是Java 5在java.util.concurrent.locks新增的一个API。</p><p>Lock是一个接口，核心方法是lock()，unlock()，tryLock()，实现类有ReentrantLock, ReentrantReadWriteLock.ReadLock, ReentrantReadWriteLock.WriteLock；</p><p>ReentrantReadWriteLock, ReentrantLock 和synchronized锁都有相同的内存语义。</p><p>与synchronized不同的是，Lock完全用Java写成，在java这个层面是无关JVM实现的。Lock提供更灵活的锁机制，很多synchronized 没有提供的许多特性，比如锁投票，定时锁等候和中断锁等候，但因为lock是通过代码实现的，要保证锁定一定会被释放，就必须将unLock()放到finally{}中</p><p>下面是Lock的一个代码示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Point {</span></span>
<span class="line"><span>   private double x, y;</span></span>
<span class="line"><span>   private final StampedLock sl = new StampedLock();</span></span>
<span class="line"><span>   void move(double deltaX, double deltaY) { // an exclusively locked method</span></span>
<span class="line"><span>     long stamp = sl.writeLock();</span></span>
<span class="line"><span>     try {</span></span>
<span class="line"><span>       x += deltaX;</span></span>
<span class="line"><span>       y += deltaY;</span></span>
<span class="line"><span>     } finally {</span></span>
<span class="line"><span>       sl.unlockWrite(stamp);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>  	//下面看看乐观读锁案例</span></span>
<span class="line"><span>   double distanceFromOrigin() { // A read-only method</span></span>
<span class="line"><span>     long stamp = sl.tryOptimisticRead(); //获得一个乐观读锁</span></span>
<span class="line"><span>     double currentX = x, currentY = y; //将两个字段读入本地局部变量</span></span>
<span class="line"><span>     if (!sl.validate(stamp)) { //检查发出乐观读锁后同时是否有其他写锁发生? </span></span>
<span class="line"><span>        stamp = sl.readLock(); //如果没有，我们再次获得一个读悲观锁</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          currentX = x; // 将两个字段读入本地局部变量</span></span>
<span class="line"><span>          currentY = y; // 将两个字段读入本地局部变量</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>           sl.unlockRead(stamp);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     return Math.sqrt(currentX * currentX + currentY * currentY);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>	//下面是悲观读锁案例</span></span>
<span class="line"><span>   void moveIfAtOrigin(double newX, double newY) { // upgrade</span></span>
<span class="line"><span>     // Could instead start with optimistic, not read mode</span></span>
<span class="line"><span>     long stamp = sl.readLock();</span></span>
<span class="line"><span>     try {</span></span>
<span class="line"><span>       while (x == 0.0 &amp;&amp; y == 0.0) { //循环，检查当前状态是否符合</span></span>
<span class="line"><span>         long ws = sl.tryConvertToWriteLock(stamp); //将读锁转为写锁</span></span>
<span class="line"><span>         if (ws != 0L) { //这是确认转为写锁是否成功</span></span>
<span class="line"><span>           stamp = ws; //如果成功 替换票据</span></span>
<span class="line"><span>           x = newX; //进行状态改变</span></span>
<span class="line"><span>           y = newY; //进行状态改变</span></span>
<span class="line"><span>           break;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         else { //如果不能成功转换为写锁</span></span>
<span class="line"><span>           sl.unlockRead(stamp); //我们显式释放读锁</span></span>
<span class="line"><span>           stamp = sl.writeLock(); //显式直接进行写锁 然后再通过循环再试</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>     } finally {</span></span>
<span class="line"><span>       sl.unlock(stamp); //释放读锁或写锁</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>小结: 比synchronized更灵活、更具可伸缩性的锁定机制，但不管怎么说还是synchronized代码要更容易书写些</p><h2 id="stampedlock" tabindex="-1">StampedLock <a class="header-anchor" href="#stampedlock" aria-label="Permalink to &quot;StampedLock&quot;">​</a></h2><p>它是java8在java.util.concurrent.locks新增的一个API。</p><p>ReentrantReadWriteLock 在沒有任何读写锁时，才可以取得写入锁，这可用于实现了悲观读取(Pessimistic Reading)，即如果执行中进行读取时，经常可能有另一执行要写入的需求，为了保持同步，ReentrantReadWriteLock 的读取锁定就可派上用场。</p><p>然而，如果读取执行情况很多，写入很少的情况下，使用 ReentrantReadWriteLock 可能会使写入线程遭遇饥饿(Starvation)问题，也就是写入线程迟迟无法竞争到锁定而一直处于等待状态。</p><p>StampedLock控制锁有三种模式(写，读，乐观读)，一个StampedLock状态是由版本和模式两个部分组成，锁获取方法返回一个数字作为票据stamp，它用相应的锁状态表示并控制访问，数字0表示没有写锁被授权访问。在读锁上分为悲观锁和乐观锁。</p><p>所谓的乐观读模式，也就是若读的操作很多，写的操作很少的情况下，你可以乐观地认为，写入与读取同时发生几率很少，因此不悲观地使用完全的读取锁定，程序可以查看读取资料之后，是否遭到写入执行的变更，再采取后续的措施(重新读取变更信息，或者抛出异常) ，这一个小小改进，可大幅度提高程序的吞吐量！！</p><p>下面是java doc提供的StampedLock一个例子</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Point {</span></span>
<span class="line"><span>   private double x, y;</span></span>
<span class="line"><span>   private final StampedLock sl = new StampedLock();</span></span>
<span class="line"><span>   void move(double deltaX, double deltaY) { // an exclusively locked method</span></span>
<span class="line"><span>     long stamp = sl.writeLock();</span></span>
<span class="line"><span>     try {</span></span>
<span class="line"><span>       x += deltaX;</span></span>
<span class="line"><span>       y += deltaY;</span></span>
<span class="line"><span>     } finally {</span></span>
<span class="line"><span>       sl.unlockWrite(stamp);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>  //下面看看乐观读锁案例</span></span>
<span class="line"><span>   double distanceFromOrigin() { // A read-only method</span></span>
<span class="line"><span>     long stamp = sl.tryOptimisticRead(); //获得一个乐观读锁</span></span>
<span class="line"><span>     double currentX = x, currentY = y; //将两个字段读入本地局部变量</span></span>
<span class="line"><span>     if (!sl.validate(stamp)) { //检查发出乐观读锁后同时是否有其他写锁发生? </span></span>
<span class="line"><span>        stamp = sl.readLock(); //如果没有，我们再次获得一个读悲观锁</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          currentX = x; // 将两个字段读入本地局部变量</span></span>
<span class="line"><span>          currentY = y; // 将两个字段读入本地局部变量</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>           sl.unlockRead(stamp);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     return Math.sqrt(currentX * currentX + currentY * currentY);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>	//下面是悲观读锁案例</span></span>
<span class="line"><span>   void moveIfAtOrigin(double newX, double newY) { // upgrade</span></span>
<span class="line"><span>     // Could instead start with optimistic, not read mode</span></span>
<span class="line"><span>     long stamp = sl.readLock();</span></span>
<span class="line"><span>     try {</span></span>
<span class="line"><span>       while (x == 0.0 &amp;&amp; y == 0.0) { //循环，检查当前状态是否符合</span></span>
<span class="line"><span>         long ws = sl.tryConvertToWriteLock(stamp); //将读锁转为写锁</span></span>
<span class="line"><span>         if (ws != 0L) { //这是确认转为写锁是否成功</span></span>
<span class="line"><span>           stamp = ws; //如果成功 替换票据</span></span>
<span class="line"><span>           x = newX; //进行状态改变</span></span>
<span class="line"><span>           y = newY; //进行状态改变</span></span>
<span class="line"><span>           break;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         else { //如果不能成功转换为写锁</span></span>
<span class="line"><span>           sl.unlockRead(stamp); //我们显式释放读锁</span></span>
<span class="line"><span>           stamp = sl.writeLock(); //显式直接进行写锁 然后再通过循环再试</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>     } finally {</span></span>
<span class="line"><span>       sl.unlock(stamp); //释放读锁或写锁</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>小结:</p><p>StampedLock要比ReentrantReadWriteLock更加廉价，也就是消耗比较小。</p><h2 id="stampedlock与readwritelock性能对比" tabindex="-1">StampedLock与ReadWriteLock性能对比 <a class="header-anchor" href="#stampedlock与readwritelock性能对比" aria-label="Permalink to &quot;StampedLock与ReadWriteLock性能对比&quot;">​</a></h2><p>是和ReadWritLock相比，在一个线程情况下，是读速度其4倍左右，写是1倍。</p><p>下图是六个线程情况下，读性能是其几十倍，写性能也是近10倍左右:</p><p><img src="`+l+'" alt="error.图片加载失败"></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><ul><li>synchronized是在JVM层面上实现的，不但可以通过一些监控工具监控synchronized的锁定，而且在代码执行时出现异常，JVM会自动释放锁定；</li><li>ReentrantLock、ReentrantReadWriteLock,、StampedLock都是对象层面的锁定，要保证锁定一定会被释放，就必须将unLock()放到finally{}中；</li><li>StampedLock 对吞吐量有巨大的改进，特别是在读线程越来越多的场景下；</li><li>StampedLock有一个复杂的API，对于加锁操作，很容易误用其他方法;</li><li>当只有少量竞争者的时候，synchronized是一个很好的通用的锁实现;</li><li>当线程增长能够预估，ReentrantLock是一个很好的通用的锁实现;</li></ul><p>StampedLock 可以说是Lock的一个很好的补充，吞吐量以及性能上的提升足以打动很多人了，但并不是说要替代之前Lock的东西，毕竟他还是有些应用场景的，起码API比StampedLock容易入手。</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><p><a href="https://wizardforcel.gitbooks.io/java8-tutorials/content/Java%208%20%E5%B9%B6%E5%8F%91%E6%95%99%E7%A8%8B%20Threads%20%E5%92%8C%20Executors.html" target="_blank" rel="noreferrer">https://wizardforcel.gitbooks.io/java8-tutorials/content/Java 8 并发教程 Threads 和 Executors.html</a></p></li><li><p><a href="https://wizardforcel.gitbooks.io/java8-new-features/content/10.html" target="_blank" rel="noreferrer">https://wizardforcel.gitbooks.io/java8-new-features/content/10.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',38)]))}const u=n(t,[["render",i]]);export{m as __pageData,u as default};
