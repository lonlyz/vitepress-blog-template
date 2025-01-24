import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/io/java-io-bio-1.png",i="/vitepress-blog-template/images/io/java-io-bio-2.png",t="/vitepress-blog-template/images/io/java-io-bio-3.png",c="/vitepress-blog-template/images/io/java-io-bio-4.png",o="/vitepress-blog-template/images/io/java-io-bio-5.png",r="/vitepress-blog-template/images/io/java-io-bio-6.png",b=JSON.parse('{"title":"Java IO - BIO 详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/io/java-io-bio.md","filePath":"java/io/java-io-bio.md","lastUpdated":1737706346000}'),u={name:"java/io/java-io-bio.md"};function h(g,n,d,m,k,S){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="java-io-bio-详解" tabindex="-1">Java IO - BIO 详解 <a class="header-anchor" href="#java-io-bio-详解" aria-label="Permalink to &quot;Java IO - BIO 详解&quot;">​</a></h1><blockquote><p>BIO就是: blocking IO。最容易理解、最容易实现的IO工作方式，应用程序向操作系统请求网络IO操作，这时应用程序会一直等待；另一方面，操作系统收到请求后，也会等待，直到网络上有数据传到监听端口；操作系统在收集数据后，会把数据发送给应用程序；最后应用程序受到数据，并解除等待状态。@pdai</p></blockquote><h2 id="几个重要概念" tabindex="-1">几个重要概念 <a class="header-anchor" href="#几个重要概念" aria-label="Permalink to &quot;几个重要概念&quot;">​</a></h2><ul><li><code>阻塞IO</code> 和 <code>非阻塞IO</code></li></ul><p>这两个概念是<code>程序级别</code>的。主要描述的是程序请求操作系统IO操作后，如果IO资源没有准备好，那么程序该如何处理的问题: 前者等待；后者继续执行(并且使用线程一直轮询，直到有IO资源准备好了)</p><ul><li><code>同步IO</code> 和 <code>非同步IO</code></li></ul><p>这两个概念是<code>操作系统级别</code>的。主要描述的是操作系统在收到程序请求IO操作后，如果IO资源没有准备好，该如何响应程序的问题: 前者不响应，直到IO资源准备好以后；后者返回一个标记(好让程序和自己知道以后的数据往哪里通知)，当IO资源准备好以后，再用事件机制返回给程序。</p><h2 id="传统的bio通信方式简介" tabindex="-1">传统的BIO通信方式简介 <a class="header-anchor" href="#传统的bio通信方式简介" aria-label="Permalink to &quot;传统的BIO通信方式简介&quot;">​</a></h2><p>以前大多数网络通信方式都是阻塞模式的，即:</p><ul><li><p>客户端向服务器端发出请求后，客户端会一直等待(不会再做其他事情)，直到服务器端返回结果或者网络出现问题。</p></li><li><p>服务器端同样的，当在处理某个客户端A发来的请求时，另一个客户端B发来的请求会等待，直到服务器端的这个处理线程完成上一个处理。</p></li></ul><p><img src="'+l+'" alt="error.图片加载失败"></p><h3 id="传统的bio的问题" tabindex="-1">传统的BIO的问题 <a class="header-anchor" href="#传统的bio的问题" aria-label="Permalink to &quot;传统的BIO的问题&quot;">​</a></h3><ul><li><p>同一时间，服务器只能接受来自于客户端A的请求信息；虽然客户端A和客户端B的请求是同时进行的，但客户端B发送的请求信息只能等到服务器接受完A的请求数据后，才能被接受。</p></li><li><p>由于服务器一次只能处理一个客户端请求，当处理完成并返回后(或者异常时)，才能进行第二次请求的处理。很显然，这样的处理方式在高并发的情况下，是不能采用的。</p></li></ul><h3 id="多线程方式-伪异步方式" tabindex="-1">多线程方式 - 伪异步方式 <a class="header-anchor" href="#多线程方式-伪异步方式" aria-label="Permalink to &quot;多线程方式 - 伪异步方式&quot;">​</a></h3><p>上面说的情况是服务器只有一个线程的情况，那么读者会直接提出我们可以使用多线程技术来解决这个问题:</p><ul><li><p>当服务器收到客户端X的请求后，(读取到所有请求数据后)将这个请求送入一个独立线程进行处理，然后主线程继续接受客户端Y的请求。</p></li><li><p>客户端一侧，也可以使用一个子线程和服务器端进行通信。这样客户端主线程的其他工作就不受影响了，当服务器端有响应信息的时候再由这个子线程通过 监听模式/观察模式(等其他设计模式)通知主线程。</p></li></ul><p>如下图所示:</p><p><img src="'+i+`" alt="error.图片加载失败"></p><p>但是使用线程来解决这个问题实际上是有局限性的:</p><ul><li><p>虽然在服务器端，请求的处理交给了一个独立线程进行，但是操作系统通知accept()的方式还是单个的。也就是，实际上是服务器接收到数据报文后的“业务处理过程”可以多线程，但是数据报文的接受还是需要一个一个的来(下文的示例代码和debug过程我们可以明确看到这一点)</p></li><li><p>在linux系统中，可以创建的线程是有限的。我们可以通过cat /proc/sys/kernel/threads-max 命令查看可以创建的最大线程数。当然这个值是可以更改的，但是线程越多，CPU切换所需的时间也就越长，用来处理真正业务的需求也就越少。</p></li><li><p>创建一个线程是有较大的资源消耗的。JVM创建一个线程的时候，即使这个线程不做任何的工作，JVM都会分配一个堆栈空间。这个空间的大小默认为128K，您可以通过-Xss参数进行调整。当然您还可以使用ThreadPoolExecutor线程池来缓解线程的创建问题，但是又会造成BlockingQueue积压任务的持续增加，同样消耗了大量资源。</p></li><li><p>另外，如果您的应用程序大量使用长连接的话，线程是不会关闭的。这样系统资源的消耗更容易失控。 那么，如果你真想单纯使用线程解决阻塞的问题，那么您自己都可以算出来您一个服务器节点可以一次接受多大的并发了。看来，单纯使用线程解决这个问题不是最好的办法。</p></li></ul><h2 id="bio通信方式深入分析" tabindex="-1">BIO通信方式深入分析 <a class="header-anchor" href="#bio通信方式深入分析" aria-label="Permalink to &quot;BIO通信方式深入分析&quot;">​</a></h2><p>BIO的问题关键不在于是否使用了多线程(包括线程池)处理这次请求，而在于accept()、read()的操作点都是被阻塞。要测试这个问题，也很简单。我们模拟了20个客户端(用20根线程模拟)，利用JAVA的同步计数器CountDownLatch，保证这20个客户都初始化完成后然后同时向服务器发送请求，然后我们来观察一下Server这边接受信息的情况。</p><h3 id="模拟20个客户端并发请求-服务器端使用单线程" tabindex="-1">模拟20个客户端并发请求，服务器端使用单线程: <a class="header-anchor" href="#模拟20个客户端并发请求-服务器端使用单线程" aria-label="Permalink to &quot;模拟20个客户端并发请求，服务器端使用单线程:&quot;">​</a></h3><p>客户端代码(SocketClientDaemon)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package testBSocket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.concurrent.CountDownLatch;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SocketClientDaemon {</span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        Integer clientNumber = 20;</span></span>
<span class="line"><span>        CountDownLatch countDownLatch = new CountDownLatch(clientNumber);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //分别开始启动这20个客户端</span></span>
<span class="line"><span>        for(int index = 0 ; index &lt; clientNumber ; index++ , countDownLatch.countDown()) {</span></span>
<span class="line"><span>            SocketClientRequestThread client = new SocketClientRequestThread(countDownLatch, index);</span></span>
<span class="line"><span>            new Thread(client).start();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //这个wait不涉及到具体的实验逻辑，只是为了保证守护线程在启动所有线程后，进入等待状态</span></span>
<span class="line"><span>        synchronized (SocketClientDaemon.class) {</span></span>
<span class="line"><span>            SocketClientDaemon.class.wait();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>客户端代码(SocketClientRequestThread模拟请求)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package testBSocket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.io.InputStream;</span></span>
<span class="line"><span>import java.io.OutputStream;</span></span>
<span class="line"><span>import java.net.Socket;</span></span>
<span class="line"><span>import java.util.concurrent.CountDownLatch;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.commons.logging.Log;</span></span>
<span class="line"><span>import org.apache.commons.logging.LogFactory;</span></span>
<span class="line"><span>import org.apache.log4j.BasicConfigurator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 一个SocketClientRequestThread线程模拟一个客户端请求。</span></span>
<span class="line"><span> * @author yinwenjie</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class SocketClientRequestThread implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        BasicConfigurator.configure();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 日志</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final Log LOGGER = LogFactory.getLog(SocketClientRequestThread.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private CountDownLatch countDownLatch;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 这个线层的编号</span></span>
<span class="line"><span>     * @param countDownLatch</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private Integer clientIndex;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * countDownLatch是java提供的同步计数器。</span></span>
<span class="line"><span>     * 当计数器数值减为0时，所有受其影响而等待的线程将会被激活。这样保证模拟并发请求的真实性</span></span>
<span class="line"><span>     * @param countDownLatch</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public SocketClientRequestThread(CountDownLatch countDownLatch , Integer clientIndex) {</span></span>
<span class="line"><span>        this.countDownLatch = countDownLatch;</span></span>
<span class="line"><span>        this.clientIndex = clientIndex;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        Socket socket = null;</span></span>
<span class="line"><span>        OutputStream clientRequest = null;</span></span>
<span class="line"><span>        InputStream clientResponse = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            socket = new Socket(&quot;localhost&quot;,83);</span></span>
<span class="line"><span>            clientRequest = socket.getOutputStream();</span></span>
<span class="line"><span>            clientResponse = socket.getInputStream();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //等待，直到SocketClientDaemon完成所有线程的启动，然后所有线程一起发送请求</span></span>
<span class="line"><span>            this.countDownLatch.await();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //发送请求信息</span></span>
<span class="line"><span>            clientRequest.write((&quot;这是第&quot; + this.clientIndex + &quot; 个客户端的请求。&quot;).getBytes());</span></span>
<span class="line"><span>            clientRequest.flush();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //在这里等待，直到服务器返回信息</span></span>
<span class="line"><span>            SocketClientRequestThread.LOGGER.info(&quot;第&quot; + this.clientIndex + &quot;个客户端的请求发送完成，等待服务器返回信息&quot;);</span></span>
<span class="line"><span>            int maxLen = 1024;</span></span>
<span class="line"><span>            byte[] contextBytes = new byte[maxLen];</span></span>
<span class="line"><span>            int realLen;</span></span>
<span class="line"><span>            String message = &quot;&quot;;</span></span>
<span class="line"><span>            //程序执行到这里，会一直等待服务器返回信息(注意，前提是in和out都不能close，如果close了就收不到服务器的反馈了)</span></span>
<span class="line"><span>            while((realLen = clientResponse.read(contextBytes, 0, maxLen)) != -1) {</span></span>
<span class="line"><span>                message += new String(contextBytes , 0 , realLen);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            SocketClientRequestThread.LOGGER.info(&quot;接收到来自服务器的信息:&quot; + message);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            SocketClientRequestThread.LOGGER.error(e.getMessage(), e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                if(clientRequest != null) {</span></span>
<span class="line"><span>                    clientRequest.close();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if(clientResponse != null) {</span></span>
<span class="line"><span>                    clientResponse.close();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                SocketClientRequestThread.LOGGER.error(e.getMessage(), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>服务器端(SocketServer1)单个线程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package testBSocket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.InputStream;</span></span>
<span class="line"><span>import java.io.OutputStream;</span></span>
<span class="line"><span>import java.net.ServerSocket;</span></span>
<span class="line"><span>import java.net.Socket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.commons.logging.Log;</span></span>
<span class="line"><span>import org.apache.commons.logging.LogFactory;</span></span>
<span class="line"><span>import org.apache.log4j.BasicConfigurator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SocketServer1 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        BasicConfigurator.configure();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 日志</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final Log LOGGER = LogFactory.getLog(SocketServer1.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception{</span></span>
<span class="line"><span>        ServerSocket serverSocket = new ServerSocket(83);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            while(true) {</span></span>
<span class="line"><span>                Socket socket = serverSocket.accept();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                //下面我们收取信息</span></span>
<span class="line"><span>                InputStream in = socket.getInputStream();</span></span>
<span class="line"><span>                OutputStream out = socket.getOutputStream();</span></span>
<span class="line"><span>                Integer sourcePort = socket.getPort();</span></span>
<span class="line"><span>                int maxLen = 2048;</span></span>
<span class="line"><span>                byte[] contextBytes = new byte[maxLen];</span></span>
<span class="line"><span>                //这里也会被阻塞，直到有数据准备好</span></span>
<span class="line"><span>                int realLen = in.read(contextBytes, 0, maxLen);</span></span>
<span class="line"><span>                //读取信息</span></span>
<span class="line"><span>                String message = new String(contextBytes , 0 , realLen);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                //下面打印信息</span></span>
<span class="line"><span>                SocketServer1.LOGGER.info(&quot;服务器收到来自于端口: &quot; + sourcePort + &quot;的信息: &quot; + message);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                //下面开始发送信息</span></span>
<span class="line"><span>                out.write(&quot;回发响应信息！&quot;.getBytes());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                //关闭</span></span>
<span class="line"><span>                out.close();</span></span>
<span class="line"><span>                in.close();</span></span>
<span class="line"><span>                socket.close();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch(Exception e) {</span></span>
<span class="line"><span>            SocketServer1.LOGGER.error(e.getMessage(), e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if(serverSocket != null) {</span></span>
<span class="line"><span>                serverSocket.close();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="多线程来优化服务器端" tabindex="-1">多线程来优化服务器端 <a class="header-anchor" href="#多线程来优化服务器端" aria-label="Permalink to &quot;多线程来优化服务器端&quot;">​</a></h3><p>客户端代码和上文一样，最主要是更改服务器端的代码:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package testBSocket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.io.InputStream;</span></span>
<span class="line"><span>import java.io.OutputStream;</span></span>
<span class="line"><span>import java.net.ServerSocket;</span></span>
<span class="line"><span>import java.net.Socket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.commons.logging.Log;</span></span>
<span class="line"><span>import org.apache.commons.logging.LogFactory;</span></span>
<span class="line"><span>import org.apache.log4j.BasicConfigurator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SocketServer2 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        BasicConfigurator.configure();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final Log LOGGER = LogFactory.getLog(SocketServer2.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception{</span></span>
<span class="line"><span>        ServerSocket serverSocket = new ServerSocket(83);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            while(true) {</span></span>
<span class="line"><span>                Socket socket = serverSocket.accept();</span></span>
<span class="line"><span>                //当然业务处理过程可以交给一个线程(这里可以使用线程池),并且线程的创建是很耗资源的。</span></span>
<span class="line"><span>                //最终改变不了.accept()只能一个一个接受socket的情况,并且被阻塞的情况</span></span>
<span class="line"><span>                SocketServerThread socketServerThread = new SocketServerThread(socket);</span></span>
<span class="line"><span>                new Thread(socketServerThread).start();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch(Exception e) {</span></span>
<span class="line"><span>            SocketServer2.LOGGER.error(e.getMessage(), e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if(serverSocket != null) {</span></span>
<span class="line"><span>                serverSocket.close();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 当然，接收到客户端的socket后，业务的处理过程可以交给一个线程来做。</span></span>
<span class="line"><span> * 但还是改变不了socket被一个一个的做accept()的情况。</span></span>
<span class="line"><span> * @author yinwenjie</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>class SocketServerThread implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 日志</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final Log LOGGER = LogFactory.getLog(SocketServerThread.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Socket socket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public SocketServerThread (Socket socket) {</span></span>
<span class="line"><span>        this.socket = socket;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        InputStream in = null;</span></span>
<span class="line"><span>        OutputStream out = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //下面我们收取信息</span></span>
<span class="line"><span>            in = socket.getInputStream();</span></span>
<span class="line"><span>            out = socket.getOutputStream();</span></span>
<span class="line"><span>            Integer sourcePort = socket.getPort();</span></span>
<span class="line"><span>            int maxLen = 1024;</span></span>
<span class="line"><span>            byte[] contextBytes = new byte[maxLen];</span></span>
<span class="line"><span>            //使用线程，同样无法解决read方法的阻塞问题，</span></span>
<span class="line"><span>            //也就是说read方法处同样会被阻塞，直到操作系统有数据准备好</span></span>
<span class="line"><span>            int realLen = in.read(contextBytes, 0, maxLen);</span></span>
<span class="line"><span>            //读取信息</span></span>
<span class="line"><span>            String message = new String(contextBytes , 0 , realLen);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //下面打印信息</span></span>
<span class="line"><span>            SocketServerThread.LOGGER.info(&quot;服务器收到来自于端口: &quot; + sourcePort + &quot;的信息: &quot; + message);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //下面开始发送信息</span></span>
<span class="line"><span>            out.write(&quot;回发响应信息！&quot;.getBytes());</span></span>
<span class="line"><span>        } catch(Exception e) {</span></span>
<span class="line"><span>            SocketServerThread.LOGGER.error(e.getMessage(), e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            //试图关闭</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                if(in != null) {</span></span>
<span class="line"><span>                    in.close();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if(out != null) {</span></span>
<span class="line"><span>                    out.close();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if(this.socket != null) {</span></span>
<span class="line"><span>                    this.socket.close();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                SocketServerThread.LOGGER.error(e.getMessage(), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="看看服务器端的执行效果" tabindex="-1">看看服务器端的执行效果 <a class="header-anchor" href="#看看服务器端的执行效果" aria-label="Permalink to &quot;看看服务器端的执行效果&quot;">​</a></h3><p>我们主要看一看服务器使用多线程处理时的情况:</p><p><img src="`+t+'" alt="error.图片加载失败"></p><h3 id="问题根源" tabindex="-1">问题根源 <a class="header-anchor" href="#问题根源" aria-label="Permalink to &quot;问题根源&quot;">​</a></h3><p>那么重点的问题并不是“是否使用了多线程”，而是为什么accept()、read()方法会被阻塞。即: 异步IO模式 就是为了解决这样的并发性存在的。但是为了说清楚异步IO模式，在介绍IO模式的时候，我们就要首先了解清楚，什么是 阻塞式同步、非阻塞式同步、多路复用同步模式。</p><p>API文档中对于 serverSocket.accept() 方法的使用描述:</p><blockquote><p>Listens for a connection to be made to this socket and accepts it. The method blocks until a connection is made.</p></blockquote><p>serverSocket.accept()会被阻塞? 这里涉及到阻塞式同步IO的工作原理:</p><ul><li>服务器线程发起一个accept动作，询问操作系统 是否有新的socket套接字信息从端口X发送过来。</li></ul><p><img src="'+c+'" alt="error.图片加载失败"></p><ul><li>注意，是询问操作系统。也就是说socket套接字的IO模式支持是基于操作系统的，那么自然同步IO/异步IO的支持就是需要操作系统级别的了。如下图:</li></ul><p><img src="'+o+'" alt="error.图片加载失败"></p><p><img src="'+r+'" alt="error.图片加载失败"></p><p>如果操作系统没有发现有套接字从指定的端口X来，那么操作系统就会等待。这样serverSocket.accept()方法就会一直等待。这就是为什么accept()方法为什么会阻塞: 它内部的实现是使用的操作系统级别的同步IO。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要来源于: 银文杰，笔名“说好不能打脸”，<a href="https://blog.csdn.net/yinwenjie" target="_blank" rel="noreferrer">博客地址在新窗口打开</a>。他的书《高性能服务系统构建与实战》。</li><li><a href="https://blog.csdn.net/yinwenjie/article/details/48274255" target="_blank" rel="noreferrer">https://blog.csdn.net/yinwenjie/article/details/48274255</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',49)]))}const q=s(u,[["render",h]]);export{b as __pageData,q as default};
