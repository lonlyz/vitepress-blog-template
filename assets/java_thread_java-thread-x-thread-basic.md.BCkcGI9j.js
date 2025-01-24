import{_ as n}from"./chunks/ace830df-9919-48ca-91b5-60b193f593d2.BTcRlR7V.js";import{_ as s,c as p,ai as e,o as i}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"Java 并发 - 线程基础","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-thread-basic.md","filePath":"java/thread/java-thread-x-thread-basic.md","lastUpdated":1737706346000}'),l={name:"java/thread/java-thread-x-thread-basic.md"};function t(c,a,o,r,d,h){return i(),p("div",null,a[0]||(a[0]=[e('<h1 id="java-并发-线程基础" tabindex="-1">Java 并发 - 线程基础 <a class="header-anchor" href="#java-并发-线程基础" aria-label="Permalink to &quot;Java 并发 - 线程基础&quot;">​</a></h1><blockquote><p>本文主要概要性的介绍线程的基础，为后面的章节深入介绍Java并发的知识提供基础。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解线程基础。@pdai</p><ul><li>线程有哪几种状态? 分别说明从一种状态到另一种状态转变有哪些方式?</li><li>通常线程有哪几种使用方式?</li><li>基础线程机制有哪些?</li><li>线程的中断方式有哪些?</li><li>线程的互斥同步方式有哪些? 如何比较和选择?</li><li>线程之间有哪些协作方式?</li></ul><h2 id="线程状态转换" tabindex="-1">线程状态转换 <a class="header-anchor" href="#线程状态转换" aria-label="Permalink to &quot;线程状态转换&quot;">​</a></h2><p><img src="'+n+`" alt="image"></p><h3 id="新建-new" tabindex="-1">新建(New) <a class="header-anchor" href="#新建-new" aria-label="Permalink to &quot;新建(New)&quot;">​</a></h3><p>创建后尚未启动。</p><h3 id="可运行-runnable" tabindex="-1">可运行(Runnable) <a class="header-anchor" href="#可运行-runnable" aria-label="Permalink to &quot;可运行(Runnable)&quot;">​</a></h3><p>可能正在运行，也可能正在等待 CPU 时间片。</p><p>包含了操作系统线程状态中的 Running 和 Ready。</p><h3 id="阻塞-blocking" tabindex="-1">阻塞(Blocking) <a class="header-anchor" href="#阻塞-blocking" aria-label="Permalink to &quot;阻塞(Blocking)&quot;">​</a></h3><p>等待获取一个排它锁，如果其线程释放了锁就会结束此状态。</p><h3 id="无限期等待-waiting" tabindex="-1">无限期等待(Waiting) <a class="header-anchor" href="#无限期等待-waiting" aria-label="Permalink to &quot;无限期等待(Waiting)&quot;">​</a></h3><p>等待其它线程显式地唤醒，否则不会被分配 CPU 时间片。</p><table tabindex="0"><thead><tr><th>进入方法</th><th>退出方法</th></tr></thead><tbody><tr><td>没有设置 Timeout 参数的 Object.wait() 方法</td><td>Object.notify() / Object.notifyAll()</td></tr><tr><td>没有设置 Timeout 参数的 Thread.join() 方法</td><td>被调用的线程执行完毕</td></tr><tr><td>LockSupport.park() 方法</td><td>-</td></tr></tbody></table><h3 id="限期等待-timed-waiting" tabindex="-1">限期等待(Timed Waiting) <a class="header-anchor" href="#限期等待-timed-waiting" aria-label="Permalink to &quot;限期等待(Timed Waiting)&quot;">​</a></h3><p>无需等待其它线程显式地唤醒，在一定时间之后会被系统自动唤醒。</p><p>调用 Thread.sleep() 方法使线程进入限期等待状态时，常常用“使一个线程睡眠”进行描述。</p><p>调用 Object.wait() 方法使线程进入限期等待或者无限期等待时，常常用“挂起一个线程”进行描述。</p><p>睡眠和挂起是用来描述行为，而阻塞和等待用来描述状态。</p><p>阻塞和等待的区别在于，阻塞是被动的，它是在等待获取一个排它锁。而等待是主动的，通过调用 Thread.sleep() 和 Object.wait() 等方法进入。</p><table tabindex="0"><thead><tr><th>进入方法</th><th>退出方法</th></tr></thead><tbody><tr><td>Thread.sleep() 方法</td><td>时间结束</td></tr><tr><td>设置了 Timeout 参数的 Object.wait() 方法</td><td>时间结束 / Object.notify() / Object.notifyAll()</td></tr><tr><td>设置了 Timeout 参数的 Thread.join() 方法</td><td>时间结束 / 被调用的线程执行完毕</td></tr><tr><td>LockSupport.parkNanos() 方法</td><td>-</td></tr><tr><td>LockSupport.parkUntil() 方法</td><td>-</td></tr></tbody></table><h3 id="死亡-terminated" tabindex="-1">死亡(Terminated) <a class="header-anchor" href="#死亡-terminated" aria-label="Permalink to &quot;死亡(Terminated)&quot;">​</a></h3><p>可以是线程结束任务之后自己结束，或者产生了异常而结束。</p><h2 id="线程使用方式" tabindex="-1">线程使用方式 <a class="header-anchor" href="#线程使用方式" aria-label="Permalink to &quot;线程使用方式&quot;">​</a></h2><p>有三种使用线程的方法:</p><ul><li>实现 Runnable 接口；</li><li>实现 Callable 接口；</li><li>继承 Thread 类。</li></ul><p>实现 Runnable 和 Callable 接口的类只能当做一个可以在线程中运行的任务，不是真正意义上的线程，因此最后还需要通过 Thread 来调用。可以说任务是通过线程驱动从而执行的。</p><h3 id="实现-runnable-接口" tabindex="-1">实现 Runnable 接口 <a class="header-anchor" href="#实现-runnable-接口" aria-label="Permalink to &quot;实现 Runnable 接口&quot;">​</a></h3><p>需要实现 run() 方法。</p><p>通过 Thread 调用 start() 方法来启动线程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyRunnable implements Runnable {</span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    MyRunnable instance = new MyRunnable();</span></span>
<span class="line"><span>    Thread thread = new Thread(instance);</span></span>
<span class="line"><span>    thread.start();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="实现-callable-接口" tabindex="-1">实现 Callable 接口 <a class="header-anchor" href="#实现-callable-接口" aria-label="Permalink to &quot;实现 Callable 接口&quot;">​</a></h3><p>与 Runnable 相比，Callable 可以有返回值，返回值通过 FutureTask 进行封装。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyCallable implements Callable&lt;Integer&gt; {</span></span>
<span class="line"><span>    public Integer call() {</span></span>
<span class="line"><span>        return 123;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws ExecutionException, InterruptedException {</span></span>
<span class="line"><span>    MyCallable mc = new MyCallable();</span></span>
<span class="line"><span>    FutureTask&lt;Integer&gt; ft = new FutureTask&lt;&gt;(mc);</span></span>
<span class="line"><span>    Thread thread = new Thread(ft);</span></span>
<span class="line"><span>    thread.start();</span></span>
<span class="line"><span>    System.out.println(ft.get());</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="继承-thread-类" tabindex="-1">继承 Thread 类 <a class="header-anchor" href="#继承-thread-类" aria-label="Permalink to &quot;继承 Thread 类&quot;">​</a></h3><p>同样也是需要实现 run() 方法，因为 Thread 类也实现了 Runable 接口。</p><p>当调用 start() 方法启动一个线程时，虚拟机会将该线程放入就绪队列中等待被调度，当一个线程被调度时会执行该线程的 run() 方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyThread extends Thread {</span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    MyThread mt = new MyThread();</span></span>
<span class="line"><span>    mt.start();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="实现接口-vs-继承-thread" tabindex="-1">实现接口 VS 继承 Thread <a class="header-anchor" href="#实现接口-vs-继承-thread" aria-label="Permalink to &quot;实现接口 VS 继承 Thread&quot;">​</a></h3><p>实现接口会更好一些，因为:</p><ul><li>Java 不支持多重继承，因此继承了 Thread 类就无法继承其它类，但是可以实现多个接口；</li><li>类可能只要求可执行就行，继承整个 Thread 类开销过大。</li></ul><h2 id="基础线程机制" tabindex="-1">基础线程机制 <a class="header-anchor" href="#基础线程机制" aria-label="Permalink to &quot;基础线程机制&quot;">​</a></h2><h3 id="executor" tabindex="-1">Executor <a class="header-anchor" href="#executor" aria-label="Permalink to &quot;Executor&quot;">​</a></h3><p>Executor 管理多个异步任务的执行，而无需程序员显式地管理线程的生命周期。这里的异步是指多个任务的执行互不干扰，不需要进行同步操作。</p><p>主要有三种 Executor:</p><ul><li>CachedThreadPool: 一个任务创建一个线程；</li><li>FixedThreadPool: 所有任务只能使用固定大小的线程；</li><li>SingleThreadExecutor: 相当于大小为 1 的 FixedThreadPool。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 5; i++) {</span></span>
<span class="line"><span>        executorService.execute(new MyRunnable());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    executorService.shutdown();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="daemon" tabindex="-1">Daemon <a class="header-anchor" href="#daemon" aria-label="Permalink to &quot;Daemon&quot;">​</a></h3><p>守护线程是程序运行时在后台提供服务的线程，不属于程序中不可或缺的部分。</p><p>当所有非守护线程结束时，程序也就终止，同时会杀死所有守护线程。</p><p>main() 属于非守护线程。</p><p>使用 setDaemon() 方法将一个线程设置为守护线程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    Thread thread = new Thread(new MyRunnable());</span></span>
<span class="line"><span>    thread.setDaemon(true);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="sleep" tabindex="-1">sleep() <a class="header-anchor" href="#sleep" aria-label="Permalink to &quot;sleep()&quot;">​</a></h3><p>Thread.sleep(millisec) 方法会休眠当前正在执行的线程，millisec 单位为毫秒。</p><p>sleep() 可能会抛出 InterruptedException，因为异常不能跨线程传播回 main() 中，因此必须在本地进行处理。线程中抛出的其它异常也同样需要在本地进行处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void run() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        Thread.sleep(3000);</span></span>
<span class="line"><span>    } catch (InterruptedException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="yield" tabindex="-1">yield() <a class="header-anchor" href="#yield" aria-label="Permalink to &quot;yield()&quot;">​</a></h3><p>对静态方法 Thread.yield() 的调用声明了当前线程已经完成了生命周期中最重要的部分，可以切换给其它线程来执行。该方法只是对线程调度器的一个建议，而且也只是建议具有相同优先级的其它线程可以运行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void run() {</span></span>
<span class="line"><span>    Thread.yield();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="线程中断" tabindex="-1">线程中断 <a class="header-anchor" href="#线程中断" aria-label="Permalink to &quot;线程中断&quot;">​</a></h2><p>一个线程执行完毕之后会自动结束，如果在运行过程中发生异常也会提前结束。</p><h3 id="interruptedexception" tabindex="-1">InterruptedException <a class="header-anchor" href="#interruptedexception" aria-label="Permalink to &quot;InterruptedException&quot;">​</a></h3><p>通过调用一个线程的 interrupt() 来中断该线程，如果该线程处于阻塞、限期等待或者无限期等待状态，那么就会抛出 InterruptedException，从而提前结束该线程。但是不能中断 I/O 阻塞和 synchronized 锁阻塞。</p><p>对于以下代码，在 main() 中启动一个线程之后再中断它，由于线程中调用了 Thread.sleep() 方法，因此会抛出一个 InterruptedException，从而提前结束线程，不执行之后的语句。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class InterruptExample {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static class MyThread1 extends Thread {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                Thread.sleep(2000);</span></span>
<span class="line"><span>                System.out.println(&quot;Thread run&quot;);</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    Thread thread1 = new MyThread1();</span></span>
<span class="line"><span>    thread1.start();</span></span>
<span class="line"><span>    thread1.interrupt();</span></span>
<span class="line"><span>    System.out.println(&quot;Main run&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Main run</span></span>
<span class="line"><span>java.lang.InterruptedException: sleep interrupted</span></span>
<span class="line"><span>    at java.lang.Thread.sleep(Native Method)</span></span>
<span class="line"><span>    at InterruptExample.lambda$main$0(InterruptExample.java:5)</span></span>
<span class="line"><span>    at InterruptExample$$Lambda$1/713338599.run(Unknown Source)</span></span>
<span class="line"><span>    at java.lang.Thread.run(Thread.java:745)</span></span></code></pre></div><h3 id="interrupted" tabindex="-1">interrupted() <a class="header-anchor" href="#interrupted" aria-label="Permalink to &quot;interrupted()&quot;">​</a></h3><p>如果一个线程的 run() 方法执行一个无限循环，并且没有执行 sleep() 等会抛出 InterruptedException 的操作，那么调用线程的 interrupt() 方法就无法使线程提前结束。</p><p>但是调用 interrupt() 方法会设置线程的中断标记，此时调用 interrupted() 方法会返回 true。因此可以在循环体中使用 interrupted() 方法来判断线程是否处于中断状态，从而提前结束线程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class InterruptExample {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static class MyThread2 extends Thread {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>            while (!interrupted()) {</span></span>
<span class="line"><span>                // ..</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            System.out.println(&quot;Thread end&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    Thread thread2 = new MyThread2();</span></span>
<span class="line"><span>    thread2.start();</span></span>
<span class="line"><span>    thread2.interrupt();</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Thread end</span></span></code></pre></div><h3 id="executor-的中断操作" tabindex="-1">Executor 的中断操作 <a class="header-anchor" href="#executor-的中断操作" aria-label="Permalink to &quot;Executor 的中断操作&quot;">​</a></h3><p>调用 Executor 的 shutdown() 方法会等待线程都执行完毕之后再关闭，但是如果调用的是 shutdownNow() 方法，则相当于调用每个线程的 interrupt() 方法。</p><p>以下使用 Lambda 创建线程，相当于创建了一个匿名内部线程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    executorService.execute(() -&gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(2000);</span></span>
<span class="line"><span>            System.out.println(&quot;Thread run&quot;);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    executorService.shutdownNow();</span></span>
<span class="line"><span>    System.out.println(&quot;Main run&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Main run</span></span>
<span class="line"><span>java.lang.InterruptedException: sleep interrupted</span></span>
<span class="line"><span>    at java.lang.Thread.sleep(Native Method)</span></span>
<span class="line"><span>    at ExecutorInterruptExample.lambda$main$0(ExecutorInterruptExample.java:9)</span></span>
<span class="line"><span>    at ExecutorInterruptExample$$Lambda$1/1160460865.run(Unknown Source)</span></span>
<span class="line"><span>    at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)</span></span>
<span class="line"><span>    at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)</span></span>
<span class="line"><span>    at java.lang.Thread.run(Thread.java:745)</span></span></code></pre></div><p>如果只想中断 Executor 中的一个线程，可以通过使用 submit() 方法来提交一个线程，它会返回一个 Future&lt;?&gt; 对象，通过调用该对象的 cancel(true) 方法就可以中断线程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Future&lt;?&gt; future = executorService.submit(() -&gt; {</span></span>
<span class="line"><span>    // ..</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>future.cancel(true);</span></span></code></pre></div><h2 id="线程互斥同步" tabindex="-1">线程互斥同步 <a class="header-anchor" href="#线程互斥同步" aria-label="Permalink to &quot;线程互斥同步&quot;">​</a></h2><p>Java 提供了两种锁机制来控制多个线程对共享资源的互斥访问，第一个是 JVM 实现的 synchronized，而另一个是 JDK 实现的 ReentrantLock。</p><h3 id="synchronized" tabindex="-1">synchronized <a class="header-anchor" href="#synchronized" aria-label="Permalink to &quot;synchronized&quot;">​</a></h3><p><strong>1. 同步一个代码块</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void func() {</span></span>
<span class="line"><span>    synchronized (this) {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>它只作用于同一个对象，如果调用两个对象上的同步代码块，就不会进行同步。</p><p>对于以下代码，使用 ExecutorService 执行了两个线程，由于调用的是同一个对象的同步代码块，因此这两个线程会进行同步，当一个线程进入同步语句块时，另一个线程就必须等待。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SynchronizedExample {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void func1() {</span></span>
<span class="line"><span>        synchronized (this) {</span></span>
<span class="line"><span>            for (int i = 0; i &lt; 10; i++) {</span></span>
<span class="line"><span>                System.out.print(i + &quot; &quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    SynchronizedExample e1 = new SynchronizedExample();</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    executorService.execute(() -&gt; e1.func1());</span></span>
<span class="line"><span>    executorService.execute(() -&gt; e1.func1());</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9</span></span></code></pre></div><p>对于以下代码，两个线程调用了不同对象的同步代码块，因此这两个线程就不需要同步。从输出结果可以看出，两个线程交叉执行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    SynchronizedExample e1 = new SynchronizedExample();</span></span>
<span class="line"><span>    SynchronizedExample e2 = new SynchronizedExample();</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    executorService.execute(() -&gt; e1.func1());</span></span>
<span class="line"><span>    executorService.execute(() -&gt; e2.func1());</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0 0 1 1 2 2 3 3 4 4 5 5 6 6 7 7 8 8 9 9</span></span></code></pre></div><p><strong>2. 同步一个方法</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public synchronized void func () {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>它和同步代码块一样，作用于同一个对象。</p><p><strong>3. 同步一个类</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void func() {</span></span>
<span class="line"><span>    synchronized (SynchronizedExample.class) {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>作用于整个类，也就是说两个线程调用同一个类的不同对象上的这种同步语句，也会进行同步。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SynchronizedExample {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void func2() {</span></span>
<span class="line"><span>        synchronized (SynchronizedExample.class) {</span></span>
<span class="line"><span>            for (int i = 0; i &lt; 10; i++) {</span></span>
<span class="line"><span>                System.out.print(i + &quot; &quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    SynchronizedExample e1 = new SynchronizedExample();</span></span>
<span class="line"><span>    SynchronizedExample e2 = new SynchronizedExample();</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    executorService.execute(() -&gt; e1.func2());</span></span>
<span class="line"><span>    executorService.execute(() -&gt; e2.func2());</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9</span></span></code></pre></div><p><strong>4. 同步一个静态方法</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public synchronized static void fun() {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>作用于整个类。</p><h3 id="reentrantlock" tabindex="-1">ReentrantLock <a class="header-anchor" href="#reentrantlock" aria-label="Permalink to &quot;ReentrantLock&quot;">​</a></h3><p>ReentrantLock 是 java.util.concurrent(J.U.C)包中的锁。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LockExample {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Lock lock = new ReentrantLock();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void func() {</span></span>
<span class="line"><span>        lock.lock();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            for (int i = 0; i &lt; 10; i++) {</span></span>
<span class="line"><span>                System.out.print(i + &quot; &quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            lock.unlock(); // 确保释放锁，从而避免发生死锁。</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    LockExample lockExample = new LockExample();</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    executorService.execute(() -&gt; lockExample.func());</span></span>
<span class="line"><span>    executorService.execute(() -&gt; lockExample.func());</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9</span></span></code></pre></div><h3 id="比较" tabindex="-1">比较 <a class="header-anchor" href="#比较" aria-label="Permalink to &quot;比较&quot;">​</a></h3><p><strong>1. 锁的实现</strong></p><p>synchronized 是 JVM 实现的，而 ReentrantLock 是 JDK 实现的。</p><p><strong>2. 性能</strong></p><p>新版本 Java 对 synchronized 进行了很多优化，例如自旋锁等，synchronized 与 ReentrantLock 大致相同。</p><p><strong>3. 等待可中断</strong></p><p>当持有锁的线程长期不释放锁的时候，正在等待的线程可以选择放弃等待，改为处理其他事情。</p><p>ReentrantLock 可中断，而 synchronized 不行。</p><p><strong>4. 公平锁</strong></p><p>公平锁是指多个线程在等待同一个锁时，必须按照申请锁的时间顺序来依次获得锁。</p><p>synchronized 中的锁是非公平的，ReentrantLock 默认情况下也是非公平的，但是也可以是公平的。</p><p><strong>5. 锁绑定多个条件</strong></p><p>一个 ReentrantLock 可以同时绑定多个 Condition 对象。</p><h3 id="使用选择" tabindex="-1">使用选择 <a class="header-anchor" href="#使用选择" aria-label="Permalink to &quot;使用选择&quot;">​</a></h3><p>除非需要使用 ReentrantLock 的高级功能，否则优先使用 synchronized。这是因为 synchronized 是 JVM 实现的一种锁机制，JVM 原生地支持它，而 ReentrantLock 不是所有的 JDK 版本都支持。并且使用 synchronized 不用担心没有释放锁而导致死锁问题，因为 JVM 会确保锁的释放。</p><h2 id="线程之间的协作" tabindex="-1">线程之间的协作 <a class="header-anchor" href="#线程之间的协作" aria-label="Permalink to &quot;线程之间的协作&quot;">​</a></h2><p>当多个线程可以一起工作去解决某个问题时，如果某些部分必须在其它部分之前完成，那么就需要对线程进行协调。</p><h3 id="join" tabindex="-1">join() <a class="header-anchor" href="#join" aria-label="Permalink to &quot;join()&quot;">​</a></h3><p>在线程中调用另一个线程的 join() 方法，会将当前线程挂起，而不是忙等待，直到目标线程结束。</p><p>对于以下代码，虽然 b 线程先启动，但是因为在 b 线程中调用了 a 线程的 join() 方法，b 线程会等待 a 线程结束才继续执行，因此最后能够保证 a 线程的输出先于 b 线程的输出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class JoinExample {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private class A extends Thread {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>            System.out.println(&quot;A&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private class B extends Thread {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        private A a;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        B(A a) {</span></span>
<span class="line"><span>            this.a = a;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                a.join();</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            System.out.println(&quot;B&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void test() {</span></span>
<span class="line"><span>        A a = new A();</span></span>
<span class="line"><span>        B b = new B(a);</span></span>
<span class="line"><span>        b.start();</span></span>
<span class="line"><span>        a.start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    JoinExample example = new JoinExample();</span></span>
<span class="line"><span>    example.test();</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>A</span></span>
<span class="line"><span>B</span></span></code></pre></div><h3 id="wait-notify-notifyall" tabindex="-1">wait() notify() notifyAll() <a class="header-anchor" href="#wait-notify-notifyall" aria-label="Permalink to &quot;wait() notify() notifyAll()&quot;">​</a></h3><p>调用 wait() 使得线程等待某个条件满足，线程在等待时会被挂起，当其他线程的运行使得这个条件满足时，其它线程会调用 notify() 或者 notifyAll() 来唤醒挂起的线程。</p><p>它们都属于 Object 的一部分，而不属于 Thread。</p><p>只能用在同步方法或者同步控制块中使用，否则会在运行时抛出 IllegalMonitorStateExeception。</p><p>使用 wait() 挂起期间，线程会释放锁。这是因为，如果没有释放锁，那么其它线程就无法进入对象的同步方法或者同步控制块中，那么就无法执行 notify() 或者 notifyAll() 来唤醒挂起的线程，造成死锁。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class WaitNotifyExample {</span></span>
<span class="line"><span>    public synchronized void before() {</span></span>
<span class="line"><span>        System.out.println(&quot;before&quot;);</span></span>
<span class="line"><span>        notifyAll();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public synchronized void after() {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            wait();</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.println(&quot;after&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    WaitNotifyExample example = new WaitNotifyExample();</span></span>
<span class="line"><span>    executorService.execute(() -&gt; example.after());</span></span>
<span class="line"><span>    executorService.execute(() -&gt; example.before());</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>before</span></span>
<span class="line"><span>after</span></span></code></pre></div><p><strong>wait() 和 sleep() 的区别</strong></p><ul><li>wait() 是 Object 的方法，而 sleep() 是 Thread 的静态方法；</li><li>wait() 会释放锁，sleep() 不会。</li></ul><h3 id="await-signal-signalall" tabindex="-1">await() signal() signalAll() <a class="header-anchor" href="#await-signal-signalall" aria-label="Permalink to &quot;await() signal() signalAll()&quot;">​</a></h3><p>java.util.concurrent 类库中提供了 Condition 类来实现线程之间的协调，可以在 Condition 上调用 await() 方法使线程等待，其它线程调用 signal() 或 signalAll() 方法唤醒等待的线程。相比于 wait() 这种等待方式，await() 可以指定等待的条件，因此更加灵活。</p><p>使用 Lock 来获取一个 Condition 对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AwaitSignalExample {</span></span>
<span class="line"><span>    private Lock lock = new ReentrantLock();</span></span>
<span class="line"><span>    private Condition condition = lock.newCondition();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void before() {</span></span>
<span class="line"><span>        lock.lock();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            System.out.println(&quot;before&quot;);</span></span>
<span class="line"><span>            condition.signalAll();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            lock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void after() {</span></span>
<span class="line"><span>        lock.lock();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            condition.await();</span></span>
<span class="line"><span>            System.out.println(&quot;after&quot;);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            lock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    AwaitSignalExample example = new AwaitSignalExample();</span></span>
<span class="line"><span>    executorService.execute(() -&gt; example.after());</span></span>
<span class="line"><span>    executorService.execute(() -&gt; example.before());</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>before</span></span>
<span class="line"><span>after</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,158)]))}const v=s(l,[["render",t]]);export{g as __pageData,v as default};
