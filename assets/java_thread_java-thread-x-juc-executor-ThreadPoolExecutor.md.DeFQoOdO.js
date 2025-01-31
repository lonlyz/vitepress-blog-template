import{_ as a,a as s}from"./chunks/java-thread-x-executors-3.DV5aeYRR.js";import{_ as e,c as p,ai as l,o as i}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/thread/java-thread-x-executors-2.png",b=JSON.parse('{"title":"JUC线程池: ThreadPoolExecutor详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-executor-ThreadPoolExecutor.md","filePath":"java/thread/java-thread-x-juc-executor-ThreadPoolExecutor.md","lastUpdated":1737706346000}'),c={name:"java/thread/java-thread-x-juc-executor-ThreadPoolExecutor.md"};function o(r,n,u,d,h,m){return i(),p("div",null,n[0]||(n[0]=[l(`<h1 id="juc线程池-threadpoolexecutor详解" tabindex="-1">JUC线程池: ThreadPoolExecutor详解 <a class="header-anchor" href="#juc线程池-threadpoolexecutor详解" aria-label="Permalink to &quot;JUC线程池: ThreadPoolExecutor详解&quot;">​</a></h1><blockquote><p>本文主要对ThreadPoolExecutor详解。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>为什么要有线程池?</li><li>Java是实现和管理线程池有哪些方式? 请简单举例如何使用。</li><li>为什么很多公司不允许使用Executors去创建线程池? 那么推荐怎么使用呢?</li><li>ThreadPoolExecutor有哪些核心的配置参数? 请简要说明</li><li>ThreadPoolExecutor可以创建哪是哪三种线程池呢?</li><li>当队列满了并且worker的数量达到maxSize的时候，会怎么样?</li><li>说说ThreadPoolExecutor有哪些RejectedExecutionHandler策略? 默认是什么策略?</li><li>简要说下线程池的任务执行机制? execute –&gt; addWorker –&gt;runworker (getTask)</li><li>线程池中任务是如何提交的?</li><li>线程池中任务是如何关闭的?</li><li>在配置线程池的时候需要考虑哪些配置因素?</li><li>如何监控线程池的状态?</li></ul><h2 id="为什么要有线程池" tabindex="-1">为什么要有线程池 <a class="header-anchor" href="#为什么要有线程池" aria-label="Permalink to &quot;为什么要有线程池&quot;">​</a></h2><p>线程池能够对线程进行统一分配，调优和监控:</p><ul><li>降低资源消耗(线程无限制地创建，然后使用完毕后销毁)</li><li>提高响应速度(无须创建线程)</li><li>提高线程的可管理性</li></ul><h2 id="threadpoolexecutor例子" tabindex="-1">ThreadPoolExecutor例子 <a class="header-anchor" href="#threadpoolexecutor例子" aria-label="Permalink to &quot;ThreadPoolExecutor例子&quot;">​</a></h2><p>Java是如何实现和管理线程池的?</p><p>从JDK 5开始，把工作单元与执行机制分离开来，工作单元包括Runnable和Callable，而执行机制由Executor框架提供。</p><ul><li>WorkerThread</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class WorkerThread implements Runnable {</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    private String command;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    public WorkerThread(String s){</span></span>
<span class="line"><span>        this.command=s;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName()+&quot; Start. Command = &quot;+command);</span></span>
<span class="line"><span>        processCommand();</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName()+&quot; End.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    private void processCommand() {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(5000);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String toString(){</span></span>
<span class="line"><span>        return this.command;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>SimpleThreadPool</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.ExecutorService;</span></span>
<span class="line"><span>import java.util.concurrent.Executors;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public class SimpleThreadPool {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ExecutorService executor = Executors.newFixedThreadPool(5);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 10; i++) {</span></span>
<span class="line"><span>            Runnable worker = new WorkerThread(&quot;&quot; + i);</span></span>
<span class="line"><span>            executor.execute(worker);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        executor.shutdown(); // This will make the executor accept no new threads and finish all existing threads in the queue</span></span>
<span class="line"><span>        while (!executor.isTerminated()) { // Wait until all threads are finish,and also you can use &quot;executor.awaitTermination();&quot; to wait</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.println(&quot;Finished all threads&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>程序中我们创建了固定大小为五个工作线程的线程池。然后分配给线程池十个工作，因为线程池大小为五，它将启动五个工作线程先处理五个工作，其他的工作则处于等待状态，一旦有工作完成，空闲下来工作线程就会捡取等待队列里的其他工作进行执行。</p><p>这里是以上程序的输出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pool-1-thread-2 Start. Command = 1</span></span>
<span class="line"><span>pool-1-thread-4 Start. Command = 3</span></span>
<span class="line"><span>pool-1-thread-1 Start. Command = 0</span></span>
<span class="line"><span>pool-1-thread-3 Start. Command = 2</span></span>
<span class="line"><span>pool-1-thread-5 Start. Command = 4</span></span>
<span class="line"><span>pool-1-thread-4 End.</span></span>
<span class="line"><span>pool-1-thread-5 End.</span></span>
<span class="line"><span>pool-1-thread-1 End.</span></span>
<span class="line"><span>pool-1-thread-3 End.</span></span>
<span class="line"><span>pool-1-thread-3 Start. Command = 8</span></span>
<span class="line"><span>pool-1-thread-2 End.</span></span>
<span class="line"><span>pool-1-thread-2 Start. Command = 9</span></span>
<span class="line"><span>pool-1-thread-1 Start. Command = 7</span></span>
<span class="line"><span>pool-1-thread-5 Start. Command = 6</span></span>
<span class="line"><span>pool-1-thread-4 Start. Command = 5</span></span>
<span class="line"><span>pool-1-thread-2 End.</span></span>
<span class="line"><span>pool-1-thread-4 End.</span></span>
<span class="line"><span>pool-1-thread-3 End.</span></span>
<span class="line"><span>pool-1-thread-5 End.</span></span>
<span class="line"><span>pool-1-thread-1 End.</span></span>
<span class="line"><span>Finished all threads</span></span></code></pre></div><p>输出表明线程池中至始至终只有五个名为 &quot;pool-1-thread-1&quot; 到 &quot;pool-1-thread-5&quot; 的五个线程，这五个线程不随着工作的完成而消亡，会一直存在，并负责执行分配给线程池的任务，直到线程池消亡。</p><p>Executors 类提供了使用了 ThreadPoolExecutor 的简单的 ExecutorService 实现，但是 ThreadPoolExecutor 提供的功能远不止于此。我们可以在创建 ThreadPoolExecutor 实例时指定活动线程的数量，我们也可以限制线程池的大小并且创建我们自己的 RejectedExecutionHandler 实现来处理不能适应工作队列的工作。</p><p>这里是我们自定义的 RejectedExecutionHandler 接口的实现。</p><ul><li>RejectedExecutionHandlerImpl.java</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.RejectedExecutionHandler;</span></span>
<span class="line"><span>import java.util.concurrent.ThreadPoolExecutor;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public class RejectedExecutionHandlerImpl implements RejectedExecutionHandler {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {</span></span>
<span class="line"><span>        System.out.println(r.toString() + &quot; is rejected&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ThreadPoolExecutor 提供了一些方法，我们可以使用这些方法来查询 executor 的当前状态，线程池大小，活动线程数量以及任务数量。因此我是用来一个监控线程在特定的时间间隔内打印 executor 信息。</p><ul><li>MyMonitorThread.java</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.ThreadPoolExecutor;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public class MyMonitorThread implements Runnable</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    private ThreadPoolExecutor executor;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    private int seconds;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    private boolean run=true;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public MyMonitorThread(ThreadPoolExecutor executor, int delay)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this.executor = executor;</span></span>
<span class="line"><span>        this.seconds=delay;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    public void shutdown(){</span></span>
<span class="line"><span>        this.run=false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void run()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        while(run){</span></span>
<span class="line"><span>                System.out.println(</span></span>
<span class="line"><span>                    String.format(&quot;[monitor] [%d/%d] Active: %d, Completed: %d, Task: %d, isShutdown: %s, isTerminated: %s&quot;,</span></span>
<span class="line"><span>                        this.executor.getPoolSize(),</span></span>
<span class="line"><span>                        this.executor.getCorePoolSize(),</span></span>
<span class="line"><span>                        this.executor.getActiveCount(),</span></span>
<span class="line"><span>                        this.executor.getCompletedTaskCount(),</span></span>
<span class="line"><span>                        this.executor.getTaskCount(),</span></span>
<span class="line"><span>                        this.executor.isShutdown(),</span></span>
<span class="line"><span>                        this.executor.isTerminated()));</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    Thread.sleep(seconds*1000);</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>             </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里是使用 ThreadPoolExecutor 的线程池实现例子。</p><ul><li>WorkerPool.java</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.ArrayBlockingQueue;</span></span>
<span class="line"><span>import java.util.concurrent.Executors;</span></span>
<span class="line"><span>import java.util.concurrent.ThreadFactory;</span></span>
<span class="line"><span>import java.util.concurrent.ThreadPoolExecutor;</span></span>
<span class="line"><span>import java.util.concurrent.TimeUnit;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public class WorkerPool {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public static void main(String args[]) throws InterruptedException{</span></span>
<span class="line"><span>        //RejectedExecutionHandler implementation</span></span>
<span class="line"><span>        RejectedExecutionHandlerImpl rejectionHandler = new RejectedExecutionHandlerImpl();</span></span>
<span class="line"><span>        //Get the ThreadFactory implementation to use</span></span>
<span class="line"><span>        ThreadFactory threadFactory = Executors.defaultThreadFactory();</span></span>
<span class="line"><span>        //creating the ThreadPoolExecutor</span></span>
<span class="line"><span>        ThreadPoolExecutor executorPool = new ThreadPoolExecutor(2, 4, 10, TimeUnit.SECONDS, new ArrayBlockingQueue&lt;Runnable&gt;(2), threadFactory, rejectionHandler);</span></span>
<span class="line"><span>        //start the monitoring thread</span></span>
<span class="line"><span>        MyMonitorThread monitor = new MyMonitorThread(executorPool, 3);</span></span>
<span class="line"><span>        Thread monitorThread = new Thread(monitor);</span></span>
<span class="line"><span>        monitorThread.start();</span></span>
<span class="line"><span>        //submit work to the thread pool</span></span>
<span class="line"><span>        for(int i=0; i&lt;10; i++){</span></span>
<span class="line"><span>            executorPool.execute(new WorkerThread(&quot;cmd&quot;+i));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>        Thread.sleep(30000);</span></span>
<span class="line"><span>        //shut down the pool</span></span>
<span class="line"><span>        executorPool.shutdown();</span></span>
<span class="line"><span>        //shut down the monitor thread</span></span>
<span class="line"><span>        Thread.sleep(5000);</span></span>
<span class="line"><span>        monitor.shutdown();</span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意在初始化 ThreadPoolExecutor 时，我们保持初始池大小为 2，最大池大小为 4 而工作队列大小为 2。因此如果已经有四个正在执行的任务而此时分配来更多任务的话，工作队列将仅仅保留他们(新任务)中的两个，其他的将会被 RejectedExecutionHandlerImpl 处理。</p><p>上面程序的输出可以证实以上观点。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pool-1-thread-1 Start. Command = cmd0</span></span>
<span class="line"><span>pool-1-thread-4 Start. Command = cmd5</span></span>
<span class="line"><span>cmd6 is rejected</span></span>
<span class="line"><span>pool-1-thread-3 Start. Command = cmd4</span></span>
<span class="line"><span>pool-1-thread-2 Start. Command = cmd1</span></span>
<span class="line"><span>cmd7 is rejected</span></span>
<span class="line"><span>cmd8 is rejected</span></span>
<span class="line"><span>cmd9 is rejected</span></span>
<span class="line"><span>[monitor] [0/2] Active: 4, Completed: 0, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>[monitor] [4/2] Active: 4, Completed: 0, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>pool-1-thread-4 End.</span></span>
<span class="line"><span>pool-1-thread-1 End.</span></span>
<span class="line"><span>pool-1-thread-2 End.</span></span>
<span class="line"><span>pool-1-thread-3 End.</span></span>
<span class="line"><span>pool-1-thread-1 Start. Command = cmd3</span></span>
<span class="line"><span>pool-1-thread-4 Start. Command = cmd2</span></span>
<span class="line"><span>[monitor] [4/2] Active: 2, Completed: 4, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>[monitor] [4/2] Active: 2, Completed: 4, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>pool-1-thread-1 End.</span></span>
<span class="line"><span>pool-1-thread-4 End.</span></span>
<span class="line"><span>[monitor] [4/2] Active: 0, Completed: 6, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>[monitor] [2/2] Active: 0, Completed: 6, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>[monitor] [2/2] Active: 0, Completed: 6, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>[monitor] [2/2] Active: 0, Completed: 6, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>[monitor] [2/2] Active: 0, Completed: 6, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>[monitor] [2/2] Active: 0, Completed: 6, Task: 6, isShutdown: false, isTerminated: false</span></span>
<span class="line"><span>[monitor] [0/2] Active: 0, Completed: 6, Task: 6, isShutdown: true, isTerminated: true</span></span>
<span class="line"><span>[monitor] [0/2] Active: 0, Completed: 6, Task: 6, isShutdown: true, isTerminated: true</span></span></code></pre></div><p>注意 executor 的活动任务、完成任务以及所有完成任务，这些数量上的变化。我们可以调用 shutdown() 方法来结束所有提交的任务并终止线程池。</p><h2 id="threadpoolexecutor使用详解" tabindex="-1">ThreadPoolExecutor使用详解 <a class="header-anchor" href="#threadpoolexecutor使用详解" aria-label="Permalink to &quot;ThreadPoolExecutor使用详解&quot;">​</a></h2><p>其实java线程池的实现原理很简单，说白了就是一个线程集合workerSet和一个阻塞队列workQueue。当用户向线程池提交一个任务(也就是线程)时，线程池会先将任务放入workQueue中。workerSet中的线程会不断的从workQueue中获取线程然后执行。当workQueue中没有任务的时候，worker就会阻塞，直到队列中有任务了就取出来继续执行。</p><p><img src="`+a+`" alt="error.图片加载失败"></p><h3 id="execute原理" tabindex="-1">Execute原理 <a class="header-anchor" href="#execute原理" aria-label="Permalink to &quot;Execute原理&quot;">​</a></h3><p>当一个任务提交至线程池之后:</p><ol><li>线程池首先当前运行的线程数量是否少于corePoolSize。如果是，则创建一个新的工作线程来执行任务。如果都在执行任务，则进入2.</li><li>判断BlockingQueue是否已经满了，倘若还没有满，则将线程放入BlockingQueue。否则进入3.</li><li>如果创建一个新的工作线程将使当前运行的线程数量超过maximumPoolSize，则交给RejectedExecutionHandler来处理任务。</li></ol><p>当ThreadPoolExecutor创建新线程时，通过CAS来更新线程池的状态ctl.</p><h3 id="参数" tabindex="-1">参数 <a class="header-anchor" href="#参数" aria-label="Permalink to &quot;参数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ThreadPoolExecutor(int corePoolSize,</span></span>
<span class="line"><span>                              int maximumPoolSize,</span></span>
<span class="line"><span>                              long keepAliveTime,</span></span>
<span class="line"><span>                              TimeUnit unit,</span></span>
<span class="line"><span>                              BlockingQueue&lt;Runnable&gt; workQueue,</span></span>
<span class="line"><span>                              RejectedExecutionHandler handler)</span></span></code></pre></div><ul><li><p><code>corePoolSize</code> 线程池中的核心线程数，当提交一个任务时，线程池创建一个新线程执行任务，直到当前线程数等于corePoolSize, 即使有其他空闲线程能够执行新来的任务, 也会继续创建线程；如果当前线程数为corePoolSize，继续提交的任务被保存到阻塞队列中，等待被执行；如果执行了线程池的prestartAllCoreThreads()方法，线程池会提前创建并启动所有核心线程。</p></li><li><p><code>workQueue</code> 用来保存等待被执行的任务的阻塞队列. 在JDK中提供了如下阻塞队列: 具体可以参考<a href="https://pdai.tech/md/java/thread/java-thread-x-juc-collection-BlockingQueue.html" target="_blank" rel="noreferrer">JUC 集合: BlockQueue详解</a></p><ul><li><code>ArrayBlockingQueue</code>: 基于数组结构的有界阻塞队列，按FIFO排序任务；</li><li><code>LinkedBlockingQueue</code>: 基于链表结构的阻塞队列，按FIFO排序任务，吞吐量通常要高于ArrayBlockingQueue；</li><li><code>SynchronousQueue</code>: 一个不存储元素的阻塞队列，每个插入操作必须等到另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量通常要高于LinkedBlockingQueue；</li><li><code>PriorityBlockingQueue</code>: 具有优先级的无界阻塞队列；</li></ul></li></ul><p><code>LinkedBlockingQueue</code>比<code>ArrayBlockingQueue</code>在插入删除节点性能方面更优，但是二者在<code>put()</code>, <code>take()</code>任务的时均需要加锁，<code>SynchronousQueue</code>使用无锁算法，根据节点的状态判断执行，而不需要用到锁，其核心是<code>Transfer.transfer()</code>.</p><ul><li><p><code>maximumPoolSize</code> 线程池中允许的最大线程数。如果当前阻塞队列满了，且继续提交任务，则创建新的线程执行任务，前提是当前线程数小于maximumPoolSize；当阻塞队列是无界队列, 则maximumPoolSize则不起作用, 因为无法提交至核心线程池的线程会一直持续地放入workQueue.</p></li><li><p><code>keepAliveTime</code> 线程空闲时的存活时间，即当线程没有任务执行时，该线程继续存活的时间；默认情况下，该参数只在线程数大于corePoolSize时才有用, 超过这个时间的空闲线程将被终止；</p></li><li><p><code>unit</code> keepAliveTime的单位</p></li><li><p><code>threadFactory</code> 创建线程的工厂，通过自定义的线程工厂可以给每个新建的线程设置一个具有识别度的线程名。默认为DefaultThreadFactory</p></li><li><p><code>handler</code> 线程池的饱和策略，当阻塞队列满了，且没有空闲的工作线程，如果继续提交任务，必须采取一种策略处理该任务，线程池提供了4种策略:</p><ul><li><code>AbortPolicy</code>: 直接抛出异常，默认策略；</li><li><code>CallerRunsPolicy</code>: 用调用者所在的线程来执行任务；</li><li><code>DiscardOldestPolicy</code>: 丢弃阻塞队列中靠最前的任务，并执行当前任务；</li><li><code>DiscardPolicy</code>: 直接丢弃任务；</li></ul></li></ul><p>当然也可以根据应用场景实现RejectedExecutionHandler接口，自定义饱和策略，如记录日志或持久化存储不能处理的任务。</p><h3 id="三种类型" tabindex="-1">三种类型 <a class="header-anchor" href="#三种类型" aria-label="Permalink to &quot;三种类型&quot;">​</a></h3><h4 id="newfixedthreadpool" tabindex="-1">newFixedThreadPool <a class="header-anchor" href="#newfixedthreadpool" aria-label="Permalink to &quot;newFixedThreadPool&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static ExecutorService newFixedThreadPool(int nThreads) {</span></span>
<span class="line"><span>    return new ThreadPoolExecutor(nThreads, nThreads,</span></span>
<span class="line"><span>                                0L, TimeUnit.MILLISECONDS,</span></span>
<span class="line"><span>                                new LinkedBlockingQueue&lt;Runnable&gt;());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>线程池的线程数量达corePoolSize后，即使线程池没有可执行任务时，也不会释放线程。</p><p>FixedThreadPool的工作队列为无界队列LinkedBlockingQueue(队列容量为Integer.MAX_VALUE), 这会导致以下问题:</p><ul><li>线程池里的线程数量不超过corePoolSize,这导致了maximumPoolSize和keepAliveTime将会是个无用参数</li><li>由于使用了无界队列, 所以FixedThreadPool永远不会拒绝, 即饱和策略失效</li></ul><h4 id="newsinglethreadexecutor" tabindex="-1">newSingleThreadExecutor <a class="header-anchor" href="#newsinglethreadexecutor" aria-label="Permalink to &quot;newSingleThreadExecutor&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static ExecutorService newSingleThreadExecutor() {</span></span>
<span class="line"><span>    return new FinalizableDelegatedExecutorService</span></span>
<span class="line"><span>        (new ThreadPoolExecutor(1, 1,</span></span>
<span class="line"><span>                                0L, TimeUnit.MILLISECONDS,</span></span>
<span class="line"><span>                                new LinkedBlockingQueue&lt;Runnable&gt;()));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>初始化的线程池中只有一个线程，如果该线程异常结束，会重新创建一个新的线程继续执行任务，唯一的线程可以保证所提交任务的顺序执行.</p><p>由于使用了无界队列, 所以SingleThreadPool永远不会拒绝, 即饱和策略失效</p><h4 id="newcachedthreadpool" tabindex="-1">newCachedThreadPool <a class="header-anchor" href="#newcachedthreadpool" aria-label="Permalink to &quot;newCachedThreadPool&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static ExecutorService newCachedThreadPool() {</span></span>
<span class="line"><span>    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,</span></span>
<span class="line"><span>                                    60L, TimeUnit.SECONDS,</span></span>
<span class="line"><span>                                    new SynchronousQueue&lt;Runnable&gt;());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>线程池的线程数可达到Integer.MAX_VALUE，即2147483647，内部使用SynchronousQueue作为阻塞队列； 和newFixedThreadPool创建的线程池不同，newCachedThreadPool在没有任务执行时，当线程的空闲时间超过keepAliveTime，会自动释放线程资源，当提交新任务时，如果没有空闲线程，则创建新线程执行任务，会导致一定的系统开销； 执行过程与前两种稍微不同:</p><ul><li>主线程调用SynchronousQueue的offer()方法放入task, 倘若此时线程池中有空闲的线程尝试读取 SynchronousQueue的task, 即调用了SynchronousQueue的poll(), 那么主线程将该task交给空闲线程. 否则执行(2)</li><li>当线程池为空或者没有空闲的线程, 则创建新的线程执行任务.</li><li>执行完任务的线程倘若在60s内仍空闲, 则会被终止. 因此长时间空闲的CachedThreadPool不会持有任何线程资源.</li></ul><h3 id="关闭线程池" tabindex="-1">关闭线程池 <a class="header-anchor" href="#关闭线程池" aria-label="Permalink to &quot;关闭线程池&quot;">​</a></h3><p>遍历线程池中的所有线程，然后逐个调用线程的interrupt方法来中断线程.</p><h4 id="关闭方式-shutdown" tabindex="-1">关闭方式 - shutdown <a class="header-anchor" href="#关闭方式-shutdown" aria-label="Permalink to &quot;关闭方式 - shutdown&quot;">​</a></h4><p>将线程池里的线程状态设置成SHUTDOWN状态, 然后中断所有没有正在执行任务的线程.</p><h4 id="关闭方式-shutdownnow" tabindex="-1">关闭方式 - shutdownNow <a class="header-anchor" href="#关闭方式-shutdownnow" aria-label="Permalink to &quot;关闭方式 - shutdownNow&quot;">​</a></h4><p>将线程池里的线程状态设置成STOP状态, 然后停止所有正在执行或暂停任务的线程. 只要调用这两个关闭方法中的任意一个, isShutDown() 返回true. 当所有任务都成功关闭了, isTerminated()返回true.</p><h2 id="threadpoolexecutor源码详解" tabindex="-1">ThreadPoolExecutor源码详解 <a class="header-anchor" href="#threadpoolexecutor源码详解" aria-label="Permalink to &quot;ThreadPoolExecutor源码详解&quot;">​</a></h2><h3 id="几个关键属性" tabindex="-1">几个关键属性 <a class="header-anchor" href="#几个关键属性" aria-label="Permalink to &quot;几个关键属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//这个属性是用来存放 当前运行的worker数量以及线程池状态的</span></span>
<span class="line"><span>//int是32位的，这里把int的高3位拿来充当线程池状态的标志位,后29位拿来充当当前运行worker的数量</span></span>
<span class="line"><span>private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));</span></span>
<span class="line"><span>//存放任务的阻塞队列</span></span>
<span class="line"><span>private final BlockingQueue&lt;Runnable&gt; workQueue;</span></span>
<span class="line"><span>//worker的集合,用set来存放</span></span>
<span class="line"><span>private final HashSet&lt;Worker&gt; workers = new HashSet&lt;Worker&gt;();</span></span>
<span class="line"><span>//历史达到的worker数最大值</span></span>
<span class="line"><span>private int largestPoolSize;</span></span>
<span class="line"><span>//当队列满了并且worker的数量达到maxSize的时候,执行具体的拒绝策略</span></span>
<span class="line"><span>private volatile RejectedExecutionHandler handler;</span></span>
<span class="line"><span>//超出coreSize的worker的生存时间</span></span>
<span class="line"><span>private volatile long keepAliveTime;</span></span>
<span class="line"><span>//常驻worker的数量</span></span>
<span class="line"><span>private volatile int corePoolSize;</span></span>
<span class="line"><span>//最大worker的数量,一般当workQueue满了才会用到这个参数</span></span>
<span class="line"><span>private volatile int maximumPoolSize;</span></span></code></pre></div><h3 id="内部状态" tabindex="-1">内部状态 <a class="header-anchor" href="#内部状态" aria-label="Permalink to &quot;内部状态&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));</span></span>
<span class="line"><span>private static final int COUNT_BITS = Integer.SIZE - 3;</span></span>
<span class="line"><span>private static final int CAPACITY   = (1 &lt;&lt; COUNT_BITS) - 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// runState is stored in the high-order bits</span></span>
<span class="line"><span>private static final int RUNNING    = -1 &lt;&lt; COUNT_BITS;</span></span>
<span class="line"><span>private static final int SHUTDOWN   =  0 &lt;&lt; COUNT_BITS;</span></span>
<span class="line"><span>private static final int STOP       =  1 &lt;&lt; COUNT_BITS;</span></span>
<span class="line"><span>private static final int TIDYING    =  2 &lt;&lt; COUNT_BITS;</span></span>
<span class="line"><span>private static final int TERMINATED =  3 &lt;&lt; COUNT_BITS;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Packing and unpacking ctl</span></span>
<span class="line"><span>private static int runStateOf(int c)     { return c &amp; ~CAPACITY; }</span></span>
<span class="line"><span>private static int workerCountOf(int c)  { return c &amp; CAPACITY; }</span></span>
<span class="line"><span>private static int ctlOf(int rs, int wc) { return rs | wc; }</span></span></code></pre></div><p>其中AtomicInteger变量ctl的功能非常强大: 利用低29位表示线程池中线程数，通过高3位表示线程池的运行状态:</p><ul><li>RUNNING: -1 &lt;&lt; COUNT_BITS，即高3位为111，该状态的线程池会接收新任务，并处理阻塞队列中的任务；</li><li>SHUTDOWN: 0 &lt;&lt; COUNT_BITS，即高3位为000，该状态的线程池不会接收新任务，但会处理阻塞队列中的任务；</li><li>STOP : 1 &lt;&lt; COUNT_BITS，即高3位为001，该状态的线程不会接收新任务，也不会处理阻塞队列中的任务，而且会中断正在运行的任务；</li><li>TIDYING : 2 &lt;&lt; COUNT_BITS，即高3位为010, 所有的任务都已经终止；</li><li>TERMINATED: 3 &lt;&lt; COUNT_BITS，即高3位为011, terminated()方法已经执行完成</li></ul><p><img src="`+t+`" alt="error.图片加载失败"></p><h3 id="任务的执行" tabindex="-1">任务的执行 <a class="header-anchor" href="#任务的执行" aria-label="Permalink to &quot;任务的执行&quot;">​</a></h3><blockquote><p>execute –&gt; addWorker –&gt;runworker (getTask)</p></blockquote><p>线程池的工作线程通过Woker类实现，在ReentrantLock锁的保证下，把Woker实例插入到HashSet后，并启动Woker中的线程。 从Woker类的构造方法实现可以发现: 线程工厂在创建线程thread时，将Woker实例本身this作为参数传入，当执行start方法启动线程thread时，本质是执行了Worker的runWorker方法。 firstTask执行完成之后，通过getTask方法从阻塞队列中获取等待的任务，如果队列中没有任务，getTask方法会被阻塞并挂起，不会占用cpu资源；</p><h4 id="execute-方法" tabindex="-1">execute()方法 <a class="header-anchor" href="#execute-方法" aria-label="Permalink to &quot;execute()方法&quot;">​</a></h4><p>ThreadPoolExecutor.execute(task)实现了Executor.execute(task)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void execute(Runnable command) {</span></span>
<span class="line"><span>    if (command == null)</span></span>
<span class="line"><span>        throw new NullPointerException();</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * Proceed in 3 steps:</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 1. If fewer than corePoolSize threads are running, try to</span></span>
<span class="line"><span>     * start a new thread with the given command as its first</span></span>
<span class="line"><span>     * task.  The call to addWorker atomically checks runState and</span></span>
<span class="line"><span>     * workerCount, and so prevents false alarms that would add</span></span>
<span class="line"><span>     * threads when it shouldn&#39;t, by returning false.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 2. If a task can be successfully queued, then we still need</span></span>
<span class="line"><span>     * to double-check whether we should have added a thread</span></span>
<span class="line"><span>     * (because existing ones died since last checking) or that</span></span>
<span class="line"><span>     * the pool shut down since entry into this method. So we</span></span>
<span class="line"><span>     * recheck state and if necessary roll back the enqueuing if</span></span>
<span class="line"><span>     * stopped, or start a new thread if there are none.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 3. If we cannot queue task, then we try to add a new</span></span>
<span class="line"><span>     * thread.  If it fails, we know we are shut down or saturated</span></span>
<span class="line"><span>     * and so reject the task.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    int c = ctl.get();</span></span>
<span class="line"><span>    if (workerCountOf(c) &lt; corePoolSize) {  </span></span>
<span class="line"><span>    //workerCountOf获取线程池的当前线程数；小于corePoolSize，执行addWorker创建新线程执行command任务</span></span>
<span class="line"><span>       if (addWorker(command, true))</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        c = ctl.get();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // double check: c, recheck</span></span>
<span class="line"><span>    // 线程池处于RUNNING状态，把提交的任务成功放入阻塞队列中</span></span>
<span class="line"><span>    if (isRunning(c) &amp;&amp; workQueue.offer(command)) {</span></span>
<span class="line"><span>        int recheck = ctl.get();</span></span>
<span class="line"><span>        // recheck and if necessary 回滚到入队操作前，即倘若线程池shutdown状态，就remove(command)</span></span>
<span class="line"><span>        //如果线程池没有RUNNING，成功从阻塞队列中删除任务，执行reject方法处理任务</span></span>
<span class="line"><span>        if (! isRunning(recheck) &amp;&amp; remove(command))</span></span>
<span class="line"><span>            reject(command);</span></span>
<span class="line"><span>        //线程池处于running状态，但是没有线程，则创建线程</span></span>
<span class="line"><span>        else if (workerCountOf(recheck) == 0)</span></span>
<span class="line"><span>            addWorker(null, false);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 往线程池中创建新的线程失败，则reject任务</span></span>
<span class="line"><span>    else if (!addWorker(command, false))</span></span>
<span class="line"><span>        reject(command);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>为什么需要double check线程池的状态?</li></ul><p>在多线程环境下，线程池的状态时刻在变化，而ctl.get()是非原子操作，很有可能刚获取了线程池状态后线程池状态就改变了。判断是否将command加入workque是线程池之前的状态。倘若没有double check，万一线程池处于非running状态(在多线程环境下很有可能发生)，那么command永远不会执行。</p><h4 id="addworker方法" tabindex="-1">addWorker方法 <a class="header-anchor" href="#addworker方法" aria-label="Permalink to &quot;addWorker方法&quot;">​</a></h4><p>从方法execute的实现可以看出: addWorker主要负责创建新的线程并执行任务 线程池创建新线程执行任务时，需要 获取全局锁:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final ReentrantLock mainLock = new ReentrantLock();</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private boolean addWorker(Runnable firstTask, boolean core) {</span></span>
<span class="line"><span>    // CAS更新线程池数量</span></span>
<span class="line"><span>    retry:</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        int c = ctl.get();</span></span>
<span class="line"><span>        int rs = runStateOf(c);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Check if queue empty only if necessary.</span></span>
<span class="line"><span>        if (rs &gt;= SHUTDOWN &amp;&amp;</span></span>
<span class="line"><span>            ! (rs == SHUTDOWN &amp;&amp;</span></span>
<span class="line"><span>                firstTask == null &amp;&amp;</span></span>
<span class="line"><span>                ! workQueue.isEmpty()))</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (;;) {</span></span>
<span class="line"><span>            int wc = workerCountOf(c);</span></span>
<span class="line"><span>            if (wc &gt;= CAPACITY ||</span></span>
<span class="line"><span>                wc &gt;= (core ? corePoolSize : maximumPoolSize))</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            if (compareAndIncrementWorkerCount(c))</span></span>
<span class="line"><span>                break retry;</span></span>
<span class="line"><span>            c = ctl.get();  // Re-read ctl</span></span>
<span class="line"><span>            if (runStateOf(c) != rs)</span></span>
<span class="line"><span>                continue retry;</span></span>
<span class="line"><span>            // else CAS failed due to workerCount change; retry inner loop</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean workerStarted = false;</span></span>
<span class="line"><span>    boolean workerAdded = false;</span></span>
<span class="line"><span>    Worker w = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        w = new Worker(firstTask);</span></span>
<span class="line"><span>        final Thread t = w.thread;</span></span>
<span class="line"><span>        if (t != null) {</span></span>
<span class="line"><span>            // 线程池重入锁</span></span>
<span class="line"><span>            final ReentrantLock mainLock = this.mainLock;</span></span>
<span class="line"><span>            mainLock.lock();</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                // Recheck while holding lock.</span></span>
<span class="line"><span>                // Back out on ThreadFactory failure or if</span></span>
<span class="line"><span>                // shut down before lock acquired.</span></span>
<span class="line"><span>                int rs = runStateOf(ctl.get());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (rs &lt; SHUTDOWN ||</span></span>
<span class="line"><span>                    (rs == SHUTDOWN &amp;&amp; firstTask == null)) {</span></span>
<span class="line"><span>                    if (t.isAlive()) // precheck that t is startable</span></span>
<span class="line"><span>                        throw new IllegalThreadStateException();</span></span>
<span class="line"><span>                    workers.add(w);</span></span>
<span class="line"><span>                    int s = workers.size();</span></span>
<span class="line"><span>                    if (s &gt; largestPoolSize)</span></span>
<span class="line"><span>                        largestPoolSize = s;</span></span>
<span class="line"><span>                    workerAdded = true;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                mainLock.unlock();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (workerAdded) {</span></span>
<span class="line"><span>                t.start();  // 线程启动，执行任务(Worker.thread(firstTask).start());</span></span>
<span class="line"><span>                workerStarted = true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        if (! workerStarted)</span></span>
<span class="line"><span>            addWorkerFailed(w);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return workerStarted;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="worker类的runworker方法" tabindex="-1">Worker类的runworker方法 <a class="header-anchor" href="#worker类的runworker方法" aria-label="Permalink to &quot;Worker类的runworker方法&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> private final class Worker extends AbstractQueuedSynchronizer implements Runnable{</span></span>
<span class="line"><span>     Worker(Runnable firstTask) {</span></span>
<span class="line"><span>         setState(-1); // inhibit interrupts until runWorker</span></span>
<span class="line"><span>         this.firstTask = firstTask;</span></span>
<span class="line"><span>         this.thread = getThreadFactory().newThread(this); // 创建线程</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     /** Delegates main run loop to outer runWorker  */</span></span>
<span class="line"><span>     public void run() {</span></span>
<span class="line"><span>         runWorker(this);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     // ...</span></span>
<span class="line"><span> }</span></span></code></pre></div><ul><li>继承了AQS类，可以方便的实现工作线程的中止操作；</li><li>实现了Runnable接口，可以将自身作为一个任务在工作线程中执行；</li><li>当前提交的任务firstTask作为参数传入Worker的构造方法；</li></ul><p>一些属性还有构造方法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//运行的线程,前面addWorker方法中就是直接通过启动这个线程来启动这个worker</span></span>
<span class="line"><span>final Thread thread;</span></span>
<span class="line"><span>//当一个worker刚创建的时候,就先尝试执行这个任务</span></span>
<span class="line"><span>Runnable firstTask;</span></span>
<span class="line"><span>//记录完成任务的数量</span></span>
<span class="line"><span>volatile long completedTasks;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Worker(Runnable firstTask) {</span></span>
<span class="line"><span>    setState(-1); // inhibit interrupts until runWorker</span></span>
<span class="line"><span>    this.firstTask = firstTask;</span></span>
<span class="line"><span>    //创建一个Thread,将自己设置给他,后面这个thread启动的时候,也就是执行worker的run方法</span></span>
<span class="line"><span>    this.thread = getThreadFactory().newThread(this);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>runWorker方法是线程池的核心:</p><ul><li>线程启动之后，通过unlock方法释放锁，设置AQS的state为0，表示运行可中断；</li><li>Worker执行firstTask或从workQueue中获取任务: <ul><li>进行加锁操作，保证thread不被其他线程中断(除非线程池被中断)</li><li>检查线程池状态，倘若线程池处于中断状态，当前线程将中断。</li><li>执行beforeExecute</li><li>执行任务的run方法</li><li>执行afterExecute方法</li><li>解锁操作</li></ul></li></ul><blockquote><p>通过getTask方法从阻塞队列中获取等待的任务，如果队列中没有任务，getTask方法会被阻塞并挂起，不会占用cpu资源；</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final void runWorker(Worker w) {</span></span>
<span class="line"><span>    Thread wt = Thread.currentThread();</span></span>
<span class="line"><span>    Runnable task = w.firstTask;</span></span>
<span class="line"><span>    w.firstTask = null;</span></span>
<span class="line"><span>    w.unlock(); // allow interrupts</span></span>
<span class="line"><span>    boolean completedAbruptly = true;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 先执行firstTask，再从workerQueue中取task(getTask())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (task != null || (task = getTask()) != null) {</span></span>
<span class="line"><span>            w.lock();</span></span>
<span class="line"><span>            // If pool is stopping, ensure thread is interrupted;</span></span>
<span class="line"><span>            // if not, ensure thread is not interrupted.  This</span></span>
<span class="line"><span>            // requires a recheck in second case to deal with</span></span>
<span class="line"><span>            // shutdownNow race while clearing interrupt</span></span>
<span class="line"><span>            if ((runStateAtLeast(ctl.get(), STOP) ||</span></span>
<span class="line"><span>                    (Thread.interrupted() &amp;&amp;</span></span>
<span class="line"><span>                    runStateAtLeast(ctl.get(), STOP))) &amp;&amp;</span></span>
<span class="line"><span>                !wt.isInterrupted())</span></span>
<span class="line"><span>                wt.interrupt();</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                beforeExecute(wt, task);</span></span>
<span class="line"><span>                Throwable thrown = null;</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    task.run();</span></span>
<span class="line"><span>                } catch (RuntimeException x) {</span></span>
<span class="line"><span>                    thrown = x; throw x;</span></span>
<span class="line"><span>                } catch (Error x) {</span></span>
<span class="line"><span>                    thrown = x; throw x;</span></span>
<span class="line"><span>                } catch (Throwable x) {</span></span>
<span class="line"><span>                    thrown = x; throw new Error(x);</span></span>
<span class="line"><span>                } finally {</span></span>
<span class="line"><span>                    afterExecute(task, thrown);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                task = null;</span></span>
<span class="line"><span>                w.completedTasks++;</span></span>
<span class="line"><span>                w.unlock();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        completedAbruptly = false;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        processWorkerExit(w, completedAbruptly);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="gettask方法" tabindex="-1">getTask方法 <a class="header-anchor" href="#gettask方法" aria-label="Permalink to &quot;getTask方法&quot;">​</a></h4><p>下面来看一下getTask()方法，这里面涉及到keepAliveTime的使用，从这个方法我们可以看出线程池是怎么让超过corePoolSize的那部分worker销毁的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Runnable getTask() {</span></span>
<span class="line"><span>    boolean timedOut = false; // Did the last poll() time out?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        int c = ctl.get();</span></span>
<span class="line"><span>        int rs = runStateOf(c);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Check if queue empty only if necessary.</span></span>
<span class="line"><span>        if (rs &gt;= SHUTDOWN &amp;&amp; (rs &gt;= STOP || workQueue.isEmpty())) {</span></span>
<span class="line"><span>            decrementWorkerCount();</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int wc = workerCountOf(c);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Are workers subject to culling?</span></span>
<span class="line"><span>        boolean timed = allowCoreThreadTimeOut || wc &gt; corePoolSize;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if ((wc &gt; maximumPoolSize || (timed &amp;&amp; timedOut))</span></span>
<span class="line"><span>            &amp;&amp; (wc &gt; 1 || workQueue.isEmpty())) {</span></span>
<span class="line"><span>            if (compareAndDecrementWorkerCount(c))</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Runnable r = timed ?</span></span>
<span class="line"><span>                workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :</span></span>
<span class="line"><span>                workQueue.take();</span></span>
<span class="line"><span>            if (r != null)</span></span>
<span class="line"><span>                return r;</span></span>
<span class="line"><span>            timedOut = true;</span></span>
<span class="line"><span>        } catch (InterruptedException retry) {</span></span>
<span class="line"><span>            timedOut = false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意这里一段代码是keepAliveTime起作用的关键:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>boolean timed = allowCoreThreadTimeOut || wc &gt; corePoolSize;</span></span>
<span class="line"><span>Runnable r = timed ?</span></span>
<span class="line"><span>                workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :</span></span>
<span class="line"><span>                workQueue.take();</span></span></code></pre></div><p>allowCoreThreadTimeOut为false，线程即使空闲也不会被销毁；倘若为ture，在keepAliveTime内仍空闲则会被销毁。</p><p>如果线程允许空闲等待而不被销毁timed == false，workQueue.take任务: 如果阻塞队列为空，当前线程会被挂起等待；当队列中有任务加入时，线程被唤醒，take方法返回任务，并执行；</p><p>如果线程不允许无休止空闲timed == true, workQueue.poll任务: 如果在keepAliveTime时间内，阻塞队列还是没有任务，则返回null；</p><h3 id="任务的提交" tabindex="-1">任务的提交 <a class="header-anchor" href="#任务的提交" aria-label="Permalink to &quot;任务的提交&quot;">​</a></h3><p><img src="`+s+`" alt="error.图片加载失败"></p><ol><li>submit任务，等待线程池execute</li><li>执行FutureTask类的get方法时，会把主线程封装成WaitNode节点并保存在waiters链表中， 并阻塞等待运行结果；</li><li>FutureTask任务执行完成后，通过UNSAFE设置waiters相应的waitNode为null，并通过LockSupport类unpark方法唤醒主线程；</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test{</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ExecutorService es = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>        Future&lt;String&gt; future = es.submit(new Callable&lt;String&gt;() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public String call() throws Exception {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    TimeUnit.SECONDS.sleep(2);</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                return &quot;future result&quot;;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            String result = future.get();</span></span>
<span class="line"><span>            System.out.println(result);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在实际业务场景中，Future和Callable基本是成对出现的，Callable负责产生结果，Future负责获取结果。</p><ol><li>Callable接口类似于Runnable，只是Runnable没有返回值。</li><li>Callable任务除了返回正常结果之外，如果发生异常，该异常也会被返回，即Future可以拿到异步执行任务各种结果；</li><li>Future.get方法会导致主线程阻塞，直到Callable任务执行完成；</li></ol><h4 id="submit方法" tabindex="-1">submit方法 <a class="header-anchor" href="#submit方法" aria-label="Permalink to &quot;submit方法&quot;">​</a></h4><p>AbstractExecutorService.submit()实现了ExecutorService.submit() 可以获取执行完的返回值, 而ThreadPoolExecutor 是AbstractExecutorService.submit()的子类，所以submit方法也是ThreadPoolExecutor\`的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// submit()在ExecutorService中的定义</span></span>
<span class="line"><span>&lt;T&gt; Future&lt;T&gt; submit(Callable&lt;T&gt; task);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;T&gt; Future&lt;T&gt; submit(Runnable task, T result);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Future&lt;?&gt; submit(Runnable task);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// submit方法在AbstractExecutorService中的实现</span></span>
<span class="line"><span>public Future&lt;?&gt; submit(Runnable task) {</span></span>
<span class="line"><span>    if (task == null) throw new NullPointerException();</span></span>
<span class="line"><span>    // 通过submit方法提交的Callable任务会被封装成了一个FutureTask对象。</span></span>
<span class="line"><span>    RunnableFuture&lt;Void&gt; ftask = newTaskFor(task, null);</span></span>
<span class="line"><span>    execute(ftask);</span></span>
<span class="line"><span>    return ftask;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过submit方法提交的Callable任务会被封装成了一个FutureTask对象。通过Executor.execute方法提交FutureTask到线程池中等待被执行，最终执行的是FutureTask的run方法；</p><h4 id="futuretask对象" tabindex="-1">FutureTask对象 <a class="header-anchor" href="#futuretask对象" aria-label="Permalink to &quot;FutureTask对象&quot;">​</a></h4><p><code>public class FutureTask&lt;V&gt; implements RunnableFuture&lt;V&gt;</code> 可以将FutureTask提交至线程池中等待被执行(通过FutureTask的run方法来执行)</p><ul><li>内部状态</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* The run state of this task, initially NEW. </span></span>
<span class="line"><span>    * ...</span></span>
<span class="line"><span>    * Possible state transitions:</span></span>
<span class="line"><span>    * NEW -&gt; COMPLETING -&gt; NORMAL</span></span>
<span class="line"><span>    * NEW -&gt; COMPLETING -&gt; EXCEPTIONAL</span></span>
<span class="line"><span>    * NEW -&gt; CANCELLED</span></span>
<span class="line"><span>    * NEW -&gt; INTERRUPTING -&gt; INTERRUPTED</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>private volatile int state;</span></span>
<span class="line"><span>private static final int NEW          = 0;</span></span>
<span class="line"><span>private static final int COMPLETING   = 1;</span></span>
<span class="line"><span>private static final int NORMAL       = 2;</span></span>
<span class="line"><span>private static final int EXCEPTIONAL  = 3;</span></span>
<span class="line"><span>private static final int CANCELLED    = 4;</span></span>
<span class="line"><span>private static final int INTERRUPTING = 5;</span></span>
<span class="line"><span>private static final int INTERRUPTED  = 6;</span></span></code></pre></div><p>内部状态的修改通过sun.misc.Unsafe修改</p><ul><li>get方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V get() throws InterruptedException, ExecutionException {</span></span>
<span class="line"><span>    int s = state;</span></span>
<span class="line"><span>    if (s &lt;= COMPLETING)</span></span>
<span class="line"><span>        s = awaitDone(false, 0L);</span></span>
<span class="line"><span>    return report(s);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>内部通过awaitDone方法对主线程进行阻塞，具体实现如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int awaitDone(boolean timed, long nanos)</span></span>
<span class="line"><span>    throws InterruptedException {</span></span>
<span class="line"><span>    final long deadline = timed ? System.nanoTime() + nanos : 0L;</span></span>
<span class="line"><span>    WaitNode q = null;</span></span>
<span class="line"><span>    boolean queued = false;</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        if (Thread.interrupted()) {</span></span>
<span class="line"><span>            removeWaiter(q);</span></span>
<span class="line"><span>            throw new InterruptedException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int s = state;</span></span>
<span class="line"><span>        if (s &gt; COMPLETING) {</span></span>
<span class="line"><span>            if (q != null)</span></span>
<span class="line"><span>                q.thread = null;</span></span>
<span class="line"><span>            return s;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (s == COMPLETING) // cannot time out yet</span></span>
<span class="line"><span>            Thread.yield();</span></span>
<span class="line"><span>        else if (q == null)</span></span>
<span class="line"><span>            q = new WaitNode();</span></span>
<span class="line"><span>        else if (!queued)</span></span>
<span class="line"><span>            queued = UNSAFE.compareAndSwapObject(this, waitersOffset,q.next = waiters, q);</span></span>
<span class="line"><span>        else if (timed) {</span></span>
<span class="line"><span>            nanos = deadline - System.nanoTime();</span></span>
<span class="line"><span>            if (nanos &lt;= 0L) {</span></span>
<span class="line"><span>                removeWaiter(q);</span></span>
<span class="line"><span>                return state;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            LockSupport.parkNanos(this, nanos);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            LockSupport.park(this);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>如果主线程被中断，则抛出中断异常；</li><li>判断FutureTask当前的state，如果大于COMPLETING，说明任务已经执行完成，则直接返回；</li><li>如果当前state等于COMPLETING，说明任务已经执行完，这时主线程只需通过yield方法让出cpu资源，等待state变成NORMAL；</li><li>通过WaitNode类封装当前线程，并通过UNSAFE添加到waiters链表；</li><li>最终通过LockSupport的park或parkNanos挂起线程；</li></ol><p>run方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void run() {</span></span>
<span class="line"><span>    if (state != NEW || !UNSAFE.compareAndSwapObject(this, runnerOffset, null, Thread.currentThread()))</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        Callable&lt;V&gt; c = callable;</span></span>
<span class="line"><span>        if (c != null &amp;&amp; state == NEW) {</span></span>
<span class="line"><span>            V result;</span></span>
<span class="line"><span>            boolean ran;</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                result = c.call();</span></span>
<span class="line"><span>                ran = true;</span></span>
<span class="line"><span>            } catch (Throwable ex) {</span></span>
<span class="line"><span>                result = null;</span></span>
<span class="line"><span>                ran = false;</span></span>
<span class="line"><span>                setException(ex);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (ran)</span></span>
<span class="line"><span>                set(result);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        // runner must be non-null until state is settled to</span></span>
<span class="line"><span>        // prevent concurrent calls to run()</span></span>
<span class="line"><span>        runner = null;</span></span>
<span class="line"><span>        // state must be re-read after nulling runner to prevent</span></span>
<span class="line"><span>        // leaked interrupts</span></span>
<span class="line"><span>        int s = state;</span></span>
<span class="line"><span>        if (s &gt;= INTERRUPTING)</span></span>
<span class="line"><span>            handlePossibleCancellationInterrupt(s);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>FutureTask.run方法是在线程池中被执行的，而非主线程</p><ol><li>通过执行Callable任务的call方法；</li><li>如果call执行成功，则通过set方法保存结果；</li><li>如果call执行有异常，则通过setException保存异常；</li></ol><h3 id="任务的关闭" tabindex="-1">任务的关闭 <a class="header-anchor" href="#任务的关闭" aria-label="Permalink to &quot;任务的关闭&quot;">​</a></h3><p>shutdown方法会将线程池的状态设置为SHUTDOWN,线程池进入这个状态后,就拒绝再接受任务,然后会将剩余的任务全部执行完</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void shutdown() {</span></span>
<span class="line"><span>    final ReentrantLock mainLock = this.mainLock;</span></span>
<span class="line"><span>    mainLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        //检查是否可以关闭线程</span></span>
<span class="line"><span>        checkShutdownAccess();</span></span>
<span class="line"><span>        //设置线程池状态</span></span>
<span class="line"><span>        advanceRunState(SHUTDOWN);</span></span>
<span class="line"><span>        //尝试中断worker</span></span>
<span class="line"><span>        interruptIdleWorkers();</span></span>
<span class="line"><span>            //预留方法,留给子类实现</span></span>
<span class="line"><span>        onShutdown(); // hook for ScheduledThreadPoolExecutor</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        mainLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    tryTerminate();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void interruptIdleWorkers() {</span></span>
<span class="line"><span>    interruptIdleWorkers(false);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void interruptIdleWorkers(boolean onlyOne) {</span></span>
<span class="line"><span>    final ReentrantLock mainLock = this.mainLock;</span></span>
<span class="line"><span>    mainLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        //遍历所有的worker</span></span>
<span class="line"><span>        for (Worker w : workers) {</span></span>
<span class="line"><span>            Thread t = w.thread;</span></span>
<span class="line"><span>            //先尝试调用w.tryLock(),如果获取到锁,就说明worker是空闲的,就可以直接中断它</span></span>
<span class="line"><span>            //注意的是,worker自己本身实现了AQS同步框架,然后实现的类似锁的功能</span></span>
<span class="line"><span>            //它实现的锁是不可重入的,所以如果worker在执行任务的时候,会先进行加锁,这里tryLock()就会返回false</span></span>
<span class="line"><span>            if (!t.isInterrupted() &amp;&amp; w.tryLock()) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    t.interrupt();</span></span>
<span class="line"><span>                } catch (SecurityException ignore) {</span></span>
<span class="line"><span>                } finally {</span></span>
<span class="line"><span>                    w.unlock();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (onlyOne)</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        mainLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>shutdownNow做的比较绝，它先将线程池状态设置为STOP，然后拒绝所有提交的任务。最后中断左右正在运行中的worker,然后清空任务队列。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;Runnable&gt; shutdownNow() {</span></span>
<span class="line"><span>    List&lt;Runnable&gt; tasks;</span></span>
<span class="line"><span>    final ReentrantLock mainLock = this.mainLock;</span></span>
<span class="line"><span>    mainLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        checkShutdownAccess();</span></span>
<span class="line"><span>        //检测权限</span></span>
<span class="line"><span>        advanceRunState(STOP);</span></span>
<span class="line"><span>        //中断所有的worker</span></span>
<span class="line"><span>        interruptWorkers();</span></span>
<span class="line"><span>        //清空任务队列</span></span>
<span class="line"><span>        tasks = drainQueue();</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        mainLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    tryTerminate();</span></span>
<span class="line"><span>    return tasks;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void interruptWorkers() {</span></span>
<span class="line"><span>    final ReentrantLock mainLock = this.mainLock;</span></span>
<span class="line"><span>    mainLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        //遍历所有worker，然后调用中断方法</span></span>
<span class="line"><span>        for (Worker w : workers)</span></span>
<span class="line"><span>            w.interruptIfStarted();</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        mainLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="更深入理解" tabindex="-1">更深入理解 <a class="header-anchor" href="#更深入理解" aria-label="Permalink to &quot;更深入理解&quot;">​</a></h2><h3 id="为什么线程池不允许使用executors去创建-推荐方式是什么" tabindex="-1">为什么线程池不允许使用Executors去创建? 推荐方式是什么? <a class="header-anchor" href="#为什么线程池不允许使用executors去创建-推荐方式是什么" aria-label="Permalink to &quot;为什么线程池不允许使用Executors去创建? 推荐方式是什么?&quot;">​</a></h3><p>线程池不允许使用Executors去创建，而是通过ThreadPoolExecutor的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。 说明：Executors各个方法的弊端：</p><ul><li>newFixedThreadPool和newSingleThreadExecutor:   主要问题是堆积的请求处理队列可能会耗费非常大的内存，甚至OOM。</li><li>newCachedThreadPool和newScheduledThreadPool:   主要问题是线程数最大数是Integer.MAX_VALUE，可能会创建数量非常多的线程，甚至OOM。</li></ul><h4 id="推荐方式-1" tabindex="-1">推荐方式 1 <a class="header-anchor" href="#推荐方式-1" aria-label="Permalink to &quot;推荐方式 1&quot;">​</a></h4><p>首先引入：commons-lang3包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ScheduledExecutorService executorService = new ScheduledThreadPoolExecutor(1,</span></span>
<span class="line"><span>        new BasicThreadFactory.Builder().namingPattern(&quot;example-schedule-pool-%d&quot;).daemon(true).build());</span></span></code></pre></div><h4 id="推荐方式-2" tabindex="-1">推荐方式 2 <a class="header-anchor" href="#推荐方式-2" aria-label="Permalink to &quot;推荐方式 2&quot;">​</a></h4><p>首先引入：com.google.guava包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ThreadFactory namedThreadFactory = new ThreadFactoryBuilder().setNameFormat(&quot;demo-pool-%d&quot;).build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Common Thread Pool</span></span>
<span class="line"><span>ExecutorService pool = new ThreadPoolExecutor(5, 200, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue&lt;Runnable&gt;(1024), namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// excute</span></span>
<span class="line"><span>pool.execute(()-&gt; System.out.println(Thread.currentThread().getName()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span> //gracefully shutdown</span></span>
<span class="line"><span>pool.shutdown();</span></span></code></pre></div><h4 id="推荐方式-3" tabindex="-1">推荐方式 3 <a class="header-anchor" href="#推荐方式-3" aria-label="Permalink to &quot;推荐方式 3&quot;">​</a></h4><p>spring配置线程池方式：自定义线程工厂bean需要实现ThreadFactory，可参考该接口的其它默认实现类，使用方式直接注入bean调用execute(Runnable task)方法即可</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    &lt;bean id=&quot;userThreadPool&quot; class=&quot;org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor&quot;&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;corePoolSize&quot; value=&quot;10&quot; /&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;maxPoolSize&quot; value=&quot;100&quot; /&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;queueCapacity&quot; value=&quot;2000&quot; /&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;property name=&quot;threadFactory&quot; value= threadFactory /&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;rejectedExecutionHandler&quot;&gt;</span></span>
<span class="line"><span>            &lt;ref local=&quot;rejectedExecutionHandler&quot; /&gt;</span></span>
<span class="line"><span>        &lt;/property&gt;</span></span>
<span class="line"><span>    &lt;/bean&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //in code</span></span>
<span class="line"><span>    userThreadPool.execute(thread);</span></span></code></pre></div><h3 id="配置线程池需要考虑因素" tabindex="-1">配置线程池需要考虑因素 <a class="header-anchor" href="#配置线程池需要考虑因素" aria-label="Permalink to &quot;配置线程池需要考虑因素&quot;">​</a></h3><p>从任务的优先级，任务的执行时间长短，任务的性质(CPU密集/ IO密集)，任务的依赖关系这四个角度来分析。并且近可能地使用有界的工作队列。</p><p>性质不同的任务可用使用不同规模的线程池分开处理:</p><ul><li>CPU密集型: 尽可能少的线程，Ncpu+1</li><li>IO密集型: 尽可能多的线程, Ncpu*2，比如数据库连接池</li><li>混合型: CPU密集型的任务与IO密集型任务的执行时间差别较小，拆分为两个线程池；否则没有必要拆分。</li></ul><h3 id="监控线程池的状态" tabindex="-1">监控线程池的状态 <a class="header-anchor" href="#监控线程池的状态" aria-label="Permalink to &quot;监控线程池的状态&quot;">​</a></h3><p>可以使用ThreadPoolExecutor以下方法:</p><ul><li><code>getTaskCount()</code> Returns the approximate total number of tasks that have ever been scheduled for execution.</li><li><code>getCompletedTaskCount()</code> Returns the approximate total number of tasks that have completed execution. 返回结果少于getTaskCount()。</li><li><code>getLargestPoolSize()</code> Returns the largest number of threads that have ever simultaneously been in the pool. 返回结果小于等于maximumPoolSize</li><li><code>getPoolSize()</code> Returns the current number of threads in the pool.</li><li><code>getActiveCount()</code> Returns the approximate number of threads that are actively executing tasks.</li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>《Java并发编程艺术》</li><li><a href="https://www.jianshu.com/p/87bff5cc8d8c" target="_blank" rel="noreferrer">https://www.jianshu.com/p/87bff5cc8d8c</a></li><li><a href="https://blog.csdn.net/programmer%5C_at/article/details/79799267" target="_blank" rel="noreferrer">https://blog.csdn.net/programmer\\_at/article/details/79799267</a></li><li><a href="https://blog.csdn.net/u013332124/article/details/79587436" target="_blank" rel="noreferrer">https://blog.csdn.net/u013332124/article/details/79587436</a></li><li><a href="https://www.journaldev.com/1069/threadpoolexecutor-java-thread-pool-example-executorservice" target="_blank" rel="noreferrer">https://www.journaldev.com/1069/threadpoolexecutor-java-thread-pool-example-executorservice</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,157)]))}const T=e(c,[["render",o]]);export{b as __pageData,T as default};
