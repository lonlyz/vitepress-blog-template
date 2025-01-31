import{_ as s,a,b as e,c as p}from"./chunks/java-io-reactor-4.BpOZ_xa8.js";import{_ as l,c as t,ai as c,o as i}from"./chunks/framework.BrYByd3F.js";const o="/vitepress-blog-template/images/io/java-io-nio-1.png",r="/vitepress-blog-template/images/io/java-io-nio-2.png",h="/vitepress-blog-template/images/io/java-io-nio-3.png",d="/vitepress-blog-template/images/io/java-io-nio-4.png",u="/vitepress-blog-template/images/io/java-io-nio-5.png",S="/vitepress-blog-template/images/io/java-io-nio-6.png",I=JSON.parse('{"title":"Java NIO - IO多路复用详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/io/java-io-nio-select-epoll.md","filePath":"java/io/java-io-nio-select-epoll.md","lastUpdated":1737706346000}'),k={name:"java/io/java-io-nio-select-epoll.md"};function y(v,n,g,m,C,f){return i(),t("div",null,n[0]||(n[0]=[c('<h1 id="java-nio-io多路复用详解" tabindex="-1">Java NIO - IO多路复用详解 <a class="header-anchor" href="#java-nio-io多路复用详解" aria-label="Permalink to &quot;Java NIO - IO多路复用详解&quot;">​</a></h1><blockquote><p>本文主要对IO多路复用，Ractor模型以及Java NIO对其的支持。@pdai</p></blockquote><h2 id="现实场景" tabindex="-1">现实场景 <a class="header-anchor" href="#现实场景" aria-label="Permalink to &quot;现实场景&quot;">​</a></h2><p>我们试想一下这样的现实场景:</p><p>一个餐厅同时有100位客人到店，当然到店后第一件要做的事情就是点菜。但是问题来了，餐厅老板为了节约人力成本目前只有一位大堂服务员拿着唯一的一本菜单等待客人进行服务。</p><ul><li><p>那么最笨(但是最简单)的方法是(方法A)，无论有多少客人等待点餐，服务员都把仅有的一份菜单递给其中一位客人，然后站在客人身旁等待这个客人完成点菜过程。在记录客人点菜内容后，把点菜记录交给后堂厨师。然后是第二位客人。。。。然后是第三位客人。很明显，只有脑袋被门夹过的老板，才会这样设置服务流程。因为随后的80位客人，再等待超时后就会离店(还会给差评)。</p></li><li><p>于是还有一种办法(方法B)，老板马上新雇佣99名服务员，同时印制99本新的菜单。每一名服务员手持一本菜单负责一位客人(关键不只在于服务员，还在于菜单。因为没有菜单客人也无法点菜)。在客人点完菜后，记录点菜内容交给后堂厨师(当然为了更高效，后堂厨师最好也有100名)。这样每一位客人享受的就是VIP服务咯，当然客人不会走，但是人力成本可是一个大头哦(亏死你)。</p></li><li><p>另外一种办法(方法C)，就是改进点菜的方式，当客人到店后，自己申请一本菜单。想好自己要点的才后，就呼叫服务员。服务员站在自己身边后记录客人的菜单内容。将菜单递给厨师的过程也要进行改进，并不是每一份菜单记录好以后，都要交给后堂厨师。服务员可以记录号多份菜单后，同时交给厨师就行了。那么这种方式，对于老板来说人力成本是最低的；对于客人来说，虽然不再享受VIP服务并且要进行一定的等待，但是这些都是可接受的；对于服务员来说，基本上她的时间都没有浪费，基本上被老板压杆了最后一滴油水。</p></li></ul><p>如果您是老板，您会采用哪种方式呢?</p><p>到店情况: 并发量。到店情况不理想时，一个服务员一本菜单，当然是足够了。所以不同的老板在不同的场合下，将会灵活选择服务员和菜单的配置。</p><ul><li>客人: 客户端请求</li><li>点餐内容: 客户端发送的实际数据</li><li>老板: 操作系统</li><li>人力成本: 系统资源</li><li>菜单: 文件状态描述符。操作系统对于一个进程能够同时持有的文件状态描述符的个数是有限制的，在linux系统中$ulimit -n查看这个限制值，当然也是可以(并且应该)进行内核参数调整的。</li><li>服务员: 操作系统内核用于IO操作的线程(内核线程)</li><li>厨师: 应用程序线程(当然厨房就是应用程序进程咯)</li><li>餐单传递方式: 包括了阻塞式和非阻塞式两种。 <ul><li>方法A: 阻塞式/非阻塞式 同步IO</li><li>方法B: 使用线程进行处理的 阻塞式/非阻塞式 同步IO</li><li>方法C: 阻塞式/非阻塞式 多路复用IO</li></ul></li></ul><h2 id="典型的多路复用io实现" tabindex="-1">典型的多路复用IO实现 <a class="header-anchor" href="#典型的多路复用io实现" aria-label="Permalink to &quot;典型的多路复用IO实现&quot;">​</a></h2><p>目前流程的多路复用IO实现主要包括四种: <code>select</code>、<code>poll</code>、<code>epoll</code>、<code>kqueue</code>。下表是他们的一些重要特性的比较:</p><table tabindex="0"><thead><tr><th>IO模型</th><th>相对性能</th><th>关键思路</th><th>操作系统</th><th>JAVA支持情况</th></tr></thead><tbody><tr><td>select</td><td>较高</td><td>Reactor</td><td>windows/Linux</td><td>支持,Reactor模式(反应器设计模式)。Linux操作系统的 kernels 2.4内核版本之前，默认使用select；而目前windows下对同步IO的支持，都是select模型</td></tr><tr><td>poll</td><td>较高</td><td>Reactor</td><td>Linux</td><td>Linux下的JAVA NIO框架，Linux kernels 2.6内核版本之前使用poll进行支持。也是使用的Reactor模式</td></tr><tr><td>epoll</td><td>高</td><td>Reactor/Proactor</td><td>Linux</td><td>Linux kernels 2.6内核版本及以后使用epoll进行支持；Linux kernels 2.6内核版本之前使用poll进行支持；另外一定注意，由于Linux下没有Windows下的IOCP技术提供真正的 异步IO 支持，所以Linux下使用epoll模拟异步IO</td></tr><tr><td>kqueue</td><td>高</td><td>Proactor</td><td>Linux</td><td>目前JAVA的版本不支持</td></tr></tbody></table><p>多路复用IO技术最适用的是“高并发”场景，所谓高并发是指1毫秒内至少同时有上千个连接请求准备好。其他情况下多路复用IO技术发挥不出来它的优势。另一方面，使用JAVA NIO进行功能实现，相对于传统的Socket套接字实现要复杂一些，所以实际应用中，需要根据自己的业务需求进行技术选择。</p><h2 id="reactor模型和proactor模型" tabindex="-1">Reactor模型和Proactor模型 <a class="header-anchor" href="#reactor模型和proactor模型" aria-label="Permalink to &quot;Reactor模型和Proactor模型&quot;">​</a></h2><h3 id="传统io模型" tabindex="-1">传统IO模型 <a class="header-anchor" href="#传统io模型" aria-label="Permalink to &quot;传统IO模型&quot;">​</a></h3><p>对于传统IO模型，其主要是一个Server对接N个客户端，在客户端连接之后，为每个客户端都分配一个执行线程。如下图是该模型的一个演示：</p><p><img src="'+s+'" alt="error.图片加载失败"></p><p>从图中可以看出，传统IO的特点在于：</p><ul><li>每个客户端连接到达之后，服务端会分配一个线程给该客户端，该线程会处理包括读取数据，解码，业务计算，编码，以及发送数据整个过程；</li><li>同一时刻，服务端的吞吐量与服务器所提供的线程数量是呈线性关系的。</li></ul><p>这种设计模式在客户端连接不多，并发量不大的情况下是可以运行得很好的，但是在海量并发的情况下，这种模式就显得力不从心了。这种模式主要存在的问题有如下几点：</p><ul><li>服务器的并发量对服务端能够创建的线程数有很大的依赖关系，但是服务器线程却是不能无限增长的；</li><li>服务端每个线程不仅要进行IO读写操作，而且还需要进行业务计算；</li><li>服务端在获取客户端连接，读取数据，以及写入数据的过程都是阻塞类型的，在网络状况不好的情况下，这将极大的降低服务器每个线程的利用率，从而降低服务器吞吐量。</li></ul><h3 id="reactor事件驱动模型" tabindex="-1">Reactor事件驱动模型 <a class="header-anchor" href="#reactor事件驱动模型" aria-label="Permalink to &quot;Reactor事件驱动模型&quot;">​</a></h3><p>在传统IO模型中，由于线程在等待连接以及进行IO操作时都会阻塞当前线程，这部分损耗是非常大的。因而jdk 1.4中就提供了一套非阻塞IO的API。该API本质上是以事件驱动来处理网络事件的，而Reactor是基于该API提出的一套IO模型。如下是Reactor事件驱动模型的示意图：</p><p><img src="'+a+'" alt="error.图片加载失败"></p><p>从图中可以看出，在Reactor模型中，主要有四个角色：客户端连接，Reactor，Acceptor和Handler。这里Acceptor会不断地接收客户端的连接，然后将接收到的连接交由Reactor进行分发，最后有具体的Handler进行处理。改进后的Reactor模型相对于传统的IO模型主要有如下优点：</p><ul><li>从模型上来讲，如果仅仅还是只使用一个线程池来处理客户端连接的网络读写，以及业务计算，那么Reactor模型与传统IO模型在效率上并没有什么提升。但是Reactor模型是以事件进行驱动的，其能够将接收客户端连接，+ 网络读和网络写，以及业务计算进行拆分，从而极大的提升处理效率；</li><li>Reactor模型是异步非阻塞模型，工作线程在没有网络事件时可以处理其他的任务，而不用像传统IO那样必须阻塞等待。</li></ul><h3 id="reactor模型-业务处理与io分离" tabindex="-1">Reactor模型----业务处理与IO分离 <a class="header-anchor" href="#reactor模型-业务处理与io分离" aria-label="Permalink to &quot;Reactor模型----业务处理与IO分离&quot;">​</a></h3><p>在上面的Reactor模型中，由于网络读写和业务操作都在同一个线程中，在高并发情况下，这里的系统瓶颈主要在两方面：</p><ul><li>高频率的网络读写事件处理；</li><li>大量的业务操作处理；</li></ul><p>基于上述两个问题，这里在单线程Reactor模型的基础上提出了使用线程池的方式处理业务操作的模型。如下是该模型的示意图：</p><p><img src="'+e+'" alt="error.图片加载失败"></p><p>从图中可以看出，在多线程进行业务操作的模型下，该模式主要具有如下特点：</p><ul><li>使用一个线程进行客户端连接的接收以及网络读写事件的处理；</li><li>在接收到客户端连接之后，将该连接交由线程池进行数据的编解码以及业务计算。</li></ul><p>这种模式相较于前面的模式性能有了很大的提升，主要在于在进行网络读写的同时，也进行了业务计算，从而大大提升了系统的吞吐量。但是这种模式也有其不足，主要在于：</p><ul><li>网络读写是一个比较消耗CPU的操作，在高并发的情况下，将会有大量的客户端数据需要进行网络读写，此时一个线程将不足以处理这么多请求。</li></ul><h3 id="reactor模型-并发读写" tabindex="-1">Reactor模型----并发读写 <a class="header-anchor" href="#reactor模型-并发读写" aria-label="Permalink to &quot;Reactor模型----并发读写&quot;">​</a></h3><p>对于使用线程池处理业务操作的模型，由于网络读写在高并发情况下会成为系统的一个瓶颈，因而针对该模型这里提出了一种改进后的模型，即使用线程池进行网络读写，而仅仅只使用一个线程专门接收客户端连接。如下是该模型的示意图：</p><p><img src="'+p+`" alt="error.图片加载失败"></p><p>可以看到，改进后的Reactor模型将Reactor拆分为了mainReactor和subReactor。这里mainReactor主要进行客户端连接的处理，处理完成之后将该连接交由subReactor以处理客户端的网络读写。这里的subReactor则是使用一个线程池来支撑的，其读写能力将会随着线程数的增多而大大增加。对于业务操作，这里也是使用一个线程池，而每个业务请求都只需要进行编解码和业务计算。通过这种方式，服务器的性能将会大大提升，在可见情况下，其基本上可以支持百万连接。</p><h3 id="reactor模型示例" tabindex="-1">Reactor模型示例 <a class="header-anchor" href="#reactor模型示例" aria-label="Permalink to &quot;Reactor模型示例&quot;">​</a></h3><p>对于上述Reactor模型，服务端主要有三个角色：Reactor，Acceptor和Handler。这里基于Doug Lea的文档对其进行了实现，如下是Reactor的实现代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Reactor implements Runnable {</span></span>
<span class="line"><span>  private final Selector selector;</span></span>
<span class="line"><span>  private final ServerSocketChannel serverSocket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Reactor(int port) throws IOException {</span></span>
<span class="line"><span>    serverSocket = ServerSocketChannel.open();  // 创建服务端的ServerSocketChannel</span></span>
<span class="line"><span>    serverSocket.configureBlocking(false);  // 设置为非阻塞模式</span></span>
<span class="line"><span>    selector = Selector.open();  // 创建一个Selector多路复用器</span></span>
<span class="line"><span>    SelectionKey key = serverSocket.register(selector, SelectionKey.OP_ACCEPT);</span></span>
<span class="line"><span>    serverSocket.bind(new InetSocketAddress(port));  // 绑定服务端端口</span></span>
<span class="line"><span>    key.attach(new Acceptor(serverSocket));  // 为服务端Channel绑定一个Acceptor</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void run() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      while (!Thread.interrupted()) {</span></span>
<span class="line"><span>        selector.select();  // 服务端使用一个线程不断等待客户端的连接到达</span></span>
<span class="line"><span>        Set&lt;SelectionKey&gt; keys = selector.selectedKeys();</span></span>
<span class="line"><span>        Iterator&lt;SelectionKey&gt; iterator = keys.iterator();</span></span>
<span class="line"><span>        while (iterator.hasNext()) {</span></span>
<span class="line"><span>          dispatch(iterator.next());  // 监听到客户端连接事件后将其分发给Acceptor</span></span>
<span class="line"><span>          iterator.remove();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        selector.selectNow();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>      e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void dispatch(SelectionKey key) throws IOException {</span></span>
<span class="line"><span>    // 这里的attachement也即前面为服务端Channel绑定的Acceptor，调用其run()方法进行</span></span>
<span class="line"><span>    // 客户端连接的获取，并且进行分发</span></span>
<span class="line"><span>    Runnable attachment = (Runnable) key.attachment();</span></span>
<span class="line"><span>    attachment.run();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里Reactor首先开启了一个ServerSocketChannel，然后将其绑定到指定的端口，并且注册到了一个多路复用器上。接着在一个线程中，其会在多路复用器上等待客户端连接。当有客户端连接到达后，Reactor就会将其派发给一个Acceptor，由该Acceptor专门进行客户端连接的获取。下面我们继续看一下Acceptor的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Acceptor implements Runnable {</span></span>
<span class="line"><span>  private final ExecutorService executor = Executors.newFixedThreadPool(20);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private final ServerSocketChannel serverSocket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Acceptor(ServerSocketChannel serverSocket) {</span></span>
<span class="line"><span>    this.serverSocket = serverSocket;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void run() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      SocketChannel channel = serverSocket.accept();  // 获取客户端连接</span></span>
<span class="line"><span>      if (null != channel) {</span></span>
<span class="line"><span>        executor.execute(new Handler(channel));  // 将客户端连接交由线程池处理</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>      e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里可以看到，在Acceptor获取到客户端连接之后，其就将其交由线程池进行网络读写了，而这里的主线程只是不断监听客户端连接事件。下面我们看看Handler的具体逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Handler implements Runnable {</span></span>
<span class="line"><span>  private volatile static Selector selector;</span></span>
<span class="line"><span>  private final SocketChannel channel;</span></span>
<span class="line"><span>  private SelectionKey key;</span></span>
<span class="line"><span>  private volatile ByteBuffer input = ByteBuffer.allocate(1024);</span></span>
<span class="line"><span>  private volatile ByteBuffer output = ByteBuffer.allocate(1024);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Handler(SocketChannel channel) throws IOException {</span></span>
<span class="line"><span>    this.channel = channel;</span></span>
<span class="line"><span>    channel.configureBlocking(false);  // 设置客户端连接为非阻塞模式</span></span>
<span class="line"><span>    selector = Selector.open();  // 为客户端创建一个新的多路复用器</span></span>
<span class="line"><span>    key = channel.register(selector, SelectionKey.OP_READ);  // 注册客户端Channel的读事件</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void run() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      while (selector.isOpen() &amp;&amp; channel.isOpen()) {</span></span>
<span class="line"><span>        Set&lt;SelectionKey&gt; keys = select();  // 等待客户端事件发生</span></span>
<span class="line"><span>        Iterator&lt;SelectionKey&gt; iterator = keys.iterator();</span></span>
<span class="line"><span>        while (iterator.hasNext()) {</span></span>
<span class="line"><span>          SelectionKey key = iterator.next();</span></span>
<span class="line"><span>          iterator.remove();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          // 如果当前是读事件，则读取数据</span></span>
<span class="line"><span>          if (key.isReadable()) {</span></span>
<span class="line"><span>            read(key);</span></span>
<span class="line"><span>          } else if (key.isWritable()) {</span></span>
<span class="line"><span>           // 如果当前是写事件，则写入数据</span></span>
<span class="line"><span>            write(key);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>      e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 这里处理的主要目的是处理Jdk的一个bug，该bug会导致Selector被意外触发，但是实际上没有任何事件到达，</span></span>
<span class="line"><span>  // 此时的处理方式是新建一个Selector，然后重新将当前Channel注册到该Selector上</span></span>
<span class="line"><span>  private Set&lt;SelectionKey&gt; select() throws IOException {</span></span>
<span class="line"><span>    selector.select();</span></span>
<span class="line"><span>    Set&lt;SelectionKey&gt; keys = selector.selectedKeys();</span></span>
<span class="line"><span>    if (keys.isEmpty()) {</span></span>
<span class="line"><span>      int interestOps = key.interestOps();</span></span>
<span class="line"><span>      selector = Selector.open();</span></span>
<span class="line"><span>      key = channel.register(selector, interestOps);</span></span>
<span class="line"><span>      return select();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return keys;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 读取客户端发送的数据</span></span>
<span class="line"><span>  private void read(SelectionKey key) throws IOException {</span></span>
<span class="line"><span>    channel.read(input);</span></span>
<span class="line"><span>    if (input.position() == 0) {</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    input.flip();</span></span>
<span class="line"><span>    process();  // 对读取的数据进行业务处理</span></span>
<span class="line"><span>    input.clear();</span></span>
<span class="line"><span>    key.interestOps(SelectionKey.OP_WRITE);  // 读取完成后监听写入事件</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void write(SelectionKey key) throws IOException {</span></span>
<span class="line"><span>    output.flip();</span></span>
<span class="line"><span>    if (channel.isOpen()) {</span></span>
<span class="line"><span>      channel.write(output);  // 当有写入事件时，将业务处理的结果写入到客户端Channel中</span></span>
<span class="line"><span>      key.channel();</span></span>
<span class="line"><span>      channel.close();</span></span>
<span class="line"><span>      output.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>  // 进行业务处理，并且获取处理结果。本质上，基于Reactor模型，如果这里成为处理瓶颈，</span></span>
<span class="line"><span>  // 则直接将其处理过程放入线程池即可，并且使用一个Future获取处理结果，最后写入客户端Channel</span></span>
<span class="line"><span>  private void process() {</span></span>
<span class="line"><span>    byte[] bytes = new byte[input.remaining()];</span></span>
<span class="line"><span>    input.get(bytes);</span></span>
<span class="line"><span>    String message = new String(bytes, CharsetUtil.UTF_8);</span></span>
<span class="line"><span>    System.out.println(&quot;receive message from client: \\n&quot; + message);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    output.put(&quot;hello client&quot;.getBytes());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Handler中，主要进行的就是为每一个客户端Channel创建一个Selector，并且监听该Channel的网络读写事件。当有事件到达时，进行数据的读写，而业务操作这交由具体的业务线程池处理。</p><h2 id="java对多路复用io的支持" tabindex="-1">JAVA对多路复用IO的支持 <a class="header-anchor" href="#java对多路复用io的支持" aria-label="Permalink to &quot;JAVA对多路复用IO的支持&quot;">​</a></h2><p><img src="`+o+'" alt="error.图片加载失败"></p><h3 id="重要概念-channel" tabindex="-1">重要概念: Channel <a class="header-anchor" href="#重要概念-channel" aria-label="Permalink to &quot;重要概念: Channel&quot;">​</a></h3><p>通道，被建立的一个应用程序和操作系统交互事件、传递内容的渠道(注意是连接到操作系统)。一个通道会有一个专属的文件状态描述符。那么既然是和操作系统进行内容的传递，那么说明应用程序可以通过通道读取数据，也可以通过通道向操作系统写数据。</p><p>JDK API中的Channel的描述是:</p><blockquote><p>A channel represents an open connection to an entity such as a hardware device, a file, a network socket, or a program component that is capable of performing one or more distinct I/O operations, for example reading or writing.</p></blockquote><blockquote><p>A channel is either open or closed. A channel is open upon creation, and once closed it remains closed. Once a channel is closed, any attempt to invoke an I/O operation upon it will cause a ClosedChannelException to be thrown. Whether or not a channel is open may be tested by invoking its isOpen method.</p></blockquote><p>JAVA NIO 框架中，自有的Channel通道包括:</p><p><img src="'+r+'" alt="error.图片加载失败"></p><p>所有被Selector(选择器)注册的通道，只能是继承了SelectableChannel类的子类。如上图所示</p><ul><li><p>ServerSocketChannel: 应用服务器程序的监听通道。只有通过这个通道，应用程序才能向操作系统注册支持“多路复用IO”的端口监听。同时支持UDP协议和TCP协议。</p></li><li><p>ScoketChannel: TCP Socket套接字的监听通道，一个Socket套接字对应了一个客户端IP: 端口 到 服务器IP: 端口的通信连接。</p></li><li><p>DatagramChannel: UDP 数据报文的监听通道。</p></li></ul><h3 id="重要概念-buffer" tabindex="-1">重要概念: Buffer <a class="header-anchor" href="#重要概念-buffer" aria-label="Permalink to &quot;重要概念: Buffer&quot;">​</a></h3><p>数据缓存区: 在JAVA NIO 框架中，为了保证每个通道的数据读写速度JAVA NIO 框架为每一种需要支持数据读写的通道集成了Buffer的支持。</p><p>这句话怎么理解呢? 例如ServerSocketChannel通道它只支持对OP_ACCEPT事件的监听，所以它是不能直接进行网络数据内容的读写的。所以ServerSocketChannel是没有集成Buffer的。</p><p>Buffer有两种工作模式: 写模式和读模式。在读模式下，应用程序只能从Buffer中读取数据，不能进行写操作。但是在写模式下，应用程序是可以进行读操作的，这就表示可能会出现脏读的情况。所以一旦您决定要从Buffer中读取数据，一定要将Buffer的状态改为读模式。</p><p>如下图:</p><p><img src="'+h+`" alt="error.图片加载失败"></p><ul><li>position: 缓存区目前这在操作的数据块位置</li><li>limit: 缓存区最大可以进行操作的位置。缓存区的读写状态正式由这个属性控制的。</li><li>capacity: 缓存区的最大容量。这个容量是在缓存区创建时进行指定的。由于高并发时通道数量往往会很庞大，所以每一个缓存区的容量最好不要过大。</li></ul><p>在下文JAVA NIO框架的代码实例中，我们将进行Buffer缓存区操作的演示。</p><h3 id="重要概念-selector" tabindex="-1">重要概念: Selector <a class="header-anchor" href="#重要概念-selector" aria-label="Permalink to &quot;重要概念: Selector&quot;">​</a></h3><p>Selector的英文含义是“选择器”，不过根据我们详细介绍的Selector的岗位职责，您可以把它称之为“轮询代理器”、“事件订阅器”、“channel容器管理机”都行。</p><ul><li>事件订阅和Channel管理</li></ul><p>应用程序将向Selector对象注册需要它关注的Channel，以及具体的某一个Channel会对哪些IO事件感兴趣。Selector中也会维护一个“已经注册的Channel”的容器。以下代码来自WindowsSelectorImpl实现类中，对已经注册的Channel的管理容器:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Initial capacity of the poll array</span></span>
<span class="line"><span>private final int INIT_CAP = 8;</span></span>
<span class="line"><span>// Maximum number of sockets for select().</span></span>
<span class="line"><span>// Should be INIT_CAP times a power of 2</span></span>
<span class="line"><span>private final static int MAX_SELECTABLE_FDS = 1024;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// The list of SelectableChannels serviced by this Selector. Every mod</span></span>
<span class="line"><span>// MAX_SELECTABLE_FDS entry is bogus, to align this array with the poll</span></span>
<span class="line"><span>// array,  where the corresponding entry is occupied by the wakeupSocket</span></span>
<span class="line"><span>private SelectionKeyImpl[] channelArray = new SelectionKeyImpl[INIT_CAP];</span></span></code></pre></div><ul><li>轮询代理</li></ul><p>应用层不再通过阻塞模式或者非阻塞模式直接询问操作系统“事件有没有发生”，而是由Selector代其询问。</p><ul><li>实现不同操作系统的支持</li></ul><p>之前已经提到过，多路复用IO技术 是需要操作系统进行支持的，其特点就是操作系统可以同时扫描同一个端口上不同网络连接的事件。所以作为上层的JVM，必须要为 不同操作系统的多路复用IO实现 编写不同的代码。同样我使用的测试环境是Windows，它对应的实现类是sun.nio.ch.WindowsSelectorImpl:</p><p><img src="`+d+'" alt="error.图片加载失败"></p><h3 id="java-nio-框架简要设计分析" tabindex="-1">JAVA NIO 框架简要设计分析 <a class="header-anchor" href="#java-nio-框架简要设计分析" aria-label="Permalink to &quot;JAVA NIO 框架简要设计分析&quot;">​</a></h3><p>通过上文的描述，我们知道了多路复用IO技术是操作系统的内核实现。在不同的操作系统，甚至同一系列操作系统的版本中所实现的多路复用IO技术都是不一样的。那么作为跨平台的JAVA JVM来说如何适应多种多样的多路复用IO技术实现呢? 面向对象的威力就显现出来了: 无论使用哪种实现方式，他们都会有“选择器”、“通道”、“缓存”这几个操作要素，那么可以为不同的多路复用IO技术创建一个统一的抽象组，并且为不同的操作系统进行具体的实现。JAVA NIO中对各种多路复用IO的支持，主要的基础是java.nio.channels.spi.SelectorProvider抽象类，其中的几个主要抽象方法包括:</p><ul><li><p>public abstract DatagramChannel openDatagramChannel(): 创建和这个操作系统匹配的UDP 通道实现。</p></li><li><p>public abstract AbstractSelector openSelector(): 创建和这个操作系统匹配的NIO选择器，就像上文所述，不同的操作系统，不同的版本所默认支持的NIO模型是不一样的。</p></li><li><p>public abstract ServerSocketChannel openServerSocketChannel(): 创建和这个NIO模型匹配的服务器端通道。</p></li><li><p>public abstract SocketChannel openSocketChannel(): 创建和这个NIO模型匹配的TCP Socket套接字通道(用来反映客户端的TCP连接)</p></li></ul><p>由于JAVA NIO框架的整个设计是很大的，所以我们只能还原一部分我们关心的问题。这里我们以JAVA NIO框架中对于不同多路复用IO技术的选择器 进行实例化创建的方式作为例子，以点窥豹观全局:</p><p><img src="'+u+`" alt="error.图片加载失败"></p><p>很明显，不同的SelectorProvider实现对应了不同的 选择器。由具体的SelectorProvider实现进行创建。另外说明一下，实际上netty底层也是通过这个设计获得具体使用的NIO模型，我们后文讲解Netty时，会讲到这个问题。以下代码是Netty 4.0中NioServerSocketChannel进行实例化时的核心代码片段:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static ServerSocketChannel newSocket(SelectorProvider provider) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        /**</span></span>
<span class="line"><span>            *  Use the {@link SelectorProvider} to open {@link SocketChannel} and so remove condition in</span></span>
<span class="line"><span>            *  {@link SelectorProvider#provider()} which is called by each ServerSocketChannel.open() otherwise.</span></span>
<span class="line"><span>            *</span></span>
<span class="line"><span>            *  See &lt;a href=&quot;See https://github.com/netty/netty/issues/2308&quot;&gt;#2308&lt;/a&gt;.</span></span>
<span class="line"><span>            */</span></span>
<span class="line"><span>        return provider.openServerSocketChannel();</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        throw new ChannelException(</span></span>
<span class="line"><span>                &quot;Failed to open a server socket.&quot;, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="java实例" tabindex="-1">JAVA实例 <a class="header-anchor" href="#java实例" aria-label="Permalink to &quot;JAVA实例&quot;">​</a></h3><p>下面，我们使用JAVA NIO框架，实现一个支持多路复用IO的服务器端(实际上客户端是否使用多路复用IO技术，对整个系统架构的性能提升相关性不大):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package testNSocket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.net.InetSocketAddress;</span></span>
<span class="line"><span>import java.net.ServerSocket;</span></span>
<span class="line"><span>import java.net.URLDecoder;</span></span>
<span class="line"><span>import java.net.URLEncoder;</span></span>
<span class="line"><span>import java.nio.ByteBuffer;</span></span>
<span class="line"><span>import java.nio.channels.SelectableChannel;</span></span>
<span class="line"><span>import java.nio.channels.SelectionKey;</span></span>
<span class="line"><span>import java.nio.channels.Selector;</span></span>
<span class="line"><span>import java.nio.channels.ServerSocketChannel;</span></span>
<span class="line"><span>import java.nio.channels.SocketChannel;</span></span>
<span class="line"><span>import java.util.Iterator;</span></span>
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
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        ServerSocketChannel serverChannel = ServerSocketChannel.open();</span></span>
<span class="line"><span>        serverChannel.configureBlocking(false);</span></span>
<span class="line"><span>        ServerSocket serverSocket = serverChannel.socket();</span></span>
<span class="line"><span>        serverSocket.setReuseAddress(true);</span></span>
<span class="line"><span>        serverSocket.bind(new InetSocketAddress(83));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Selector selector = Selector.open();</span></span>
<span class="line"><span>        //注意、服务器通道只能注册SelectionKey.OP_ACCEPT事件</span></span>
<span class="line"><span>        serverChannel.register(selector, SelectionKey.OP_ACCEPT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            while(true) {</span></span>
<span class="line"><span>                //如果条件成立，说明本次询问selector，并没有获取到任何准备好的、感兴趣的事件</span></span>
<span class="line"><span>                //java程序对多路复用IO的支持也包括了阻塞模式 和非阻塞模式两种。</span></span>
<span class="line"><span>                if(selector.select(100) == 0) {</span></span>
<span class="line"><span>                    //================================================</span></span>
<span class="line"><span>                    //      这里视业务情况，可以做一些然并卵的事情</span></span>
<span class="line"><span>                    //================================================</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                //这里就是本次询问操作系统，所获取到的“所关心的事件”的事件类型(每一个通道都是独立的)</span></span>
<span class="line"><span>                Iterator&lt;SelectionKey&gt; selecionKeys = selector.selectedKeys().iterator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                while(selecionKeys.hasNext()) {</span></span>
<span class="line"><span>                    SelectionKey readyKey = selecionKeys.next();</span></span>
<span class="line"><span>                    //这个已经处理的readyKey一定要移除。如果不移除，就会一直存在在selector.selectedKeys集合中</span></span>
<span class="line"><span>                    //待到下一次selector.select() &gt; 0时，这个readyKey又会被处理一次</span></span>
<span class="line"><span>                    selecionKeys.remove();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    SelectableChannel selectableChannel = readyKey.channel();</span></span>
<span class="line"><span>                    if(readyKey.isValid() &amp;&amp; readyKey.isAcceptable()) {</span></span>
<span class="line"><span>                        SocketServer1.LOGGER.info(&quot;======channel通道已经准备好=======&quot;);</span></span>
<span class="line"><span>                        /*</span></span>
<span class="line"><span>                         * 当server socket channel通道已经准备好，就可以从server socket channel中获取socketchannel了</span></span>
<span class="line"><span>                         * 拿到socket channel后，要做的事情就是马上到selector注册这个socket channel感兴趣的事情。</span></span>
<span class="line"><span>                         * 否则无法监听到这个socket channel到达的数据</span></span>
<span class="line"><span>                         * */</span></span>
<span class="line"><span>                        ServerSocketChannel serverSocketChannel = (ServerSocketChannel)selectableChannel;</span></span>
<span class="line"><span>                        SocketChannel socketChannel = serverSocketChannel.accept();</span></span>
<span class="line"><span>                        registerSocketChannel(socketChannel , selector);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    } else if(readyKey.isValid() &amp;&amp; readyKey.isConnectable()) {</span></span>
<span class="line"><span>                        SocketServer1.LOGGER.info(&quot;======socket channel 建立连接=======&quot;);</span></span>
<span class="line"><span>                    } else if(readyKey.isValid() &amp;&amp; readyKey.isReadable()) {</span></span>
<span class="line"><span>                        SocketServer1.LOGGER.info(&quot;======socket channel 数据准备完成，可以去读==读取=======&quot;);</span></span>
<span class="line"><span>                        readSocketChannel(readyKey);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch(Exception e) {</span></span>
<span class="line"><span>            SocketServer1.LOGGER.error(e.getMessage() , e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            serverSocket.close();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 在server socket channel接收到/准备好 一个新的 TCP连接后。</span></span>
<span class="line"><span>     * 就会向程序返回一个新的socketChannel。&lt;br&gt;</span></span>
<span class="line"><span>     * 但是这个新的socket channel并没有在selector“选择器/代理器”中注册，</span></span>
<span class="line"><span>     * 所以程序还没法通过selector通知这个socket channel的事件。</span></span>
<span class="line"><span>     * 于是我们拿到新的socket channel后，要做的第一个事情就是到selector“选择器/代理器”中注册这个</span></span>
<span class="line"><span>     * socket channel感兴趣的事件</span></span>
<span class="line"><span>     * @param socketChannel 新的socket channel</span></span>
<span class="line"><span>     * @param selector selector“选择器/代理器”</span></span>
<span class="line"><span>     * @throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static void registerSocketChannel(SocketChannel socketChannel , Selector selector) throws Exception {</span></span>
<span class="line"><span>        socketChannel.configureBlocking(false);</span></span>
<span class="line"><span>        //socket通道可以且只可以注册三种事件SelectionKey.OP_READ | SelectionKey.OP_WRITE | SelectionKey.OP_CONNECT</span></span>
<span class="line"><span>        socketChannel.register(selector, SelectionKey.OP_READ , ByteBuffer.allocate(2048));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 这个方法用于读取从客户端传来的信息。</span></span>
<span class="line"><span>     * 并且观察从客户端过来的socket channel在经过多次传输后，是否完成传输。</span></span>
<span class="line"><span>     * 如果传输完成，则返回一个true的标记。</span></span>
<span class="line"><span>     * @param socketChannel</span></span>
<span class="line"><span>     * @throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static void readSocketChannel(SelectionKey readyKey) throws Exception {</span></span>
<span class="line"><span>        SocketChannel clientSocketChannel = (SocketChannel)readyKey.channel();</span></span>
<span class="line"><span>        //获取客户端使用的端口</span></span>
<span class="line"><span>        InetSocketAddress sourceSocketAddress = (InetSocketAddress)clientSocketChannel.getRemoteAddress();</span></span>
<span class="line"><span>        Integer resoucePort = sourceSocketAddress.getPort();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //拿到这个socket channel使用的缓存区，准备读取数据</span></span>
<span class="line"><span>        //在后文，将详细讲解缓存区的用法概念，实际上重要的就是三个元素capacity,position和limit。</span></span>
<span class="line"><span>        ByteBuffer contextBytes = (ByteBuffer)readyKey.attachment();</span></span>
<span class="line"><span>        //将通道的数据写入到缓存区，注意是写入到缓存区。</span></span>
<span class="line"><span>        //由于之前设置了ByteBuffer的大小为2048 byte，所以可以存在写入不完的情况</span></span>
<span class="line"><span>        //没关系，我们后面来调整代码。这里我们暂时理解为一次接受可以完成</span></span>
<span class="line"><span>        int realLen = -1;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            realLen = clientSocketChannel.read(contextBytes);</span></span>
<span class="line"><span>        } catch(Exception e) {</span></span>
<span class="line"><span>            //这里抛出了异常，一般就是客户端因为某种原因终止了。所以关闭channel就行了</span></span>
<span class="line"><span>            SocketServer1.LOGGER.error(e.getMessage());</span></span>
<span class="line"><span>            clientSocketChannel.close();</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //如果缓存区中没有任何数据(但实际上这个不太可能，否则就不会触发OP_READ事件了)</span></span>
<span class="line"><span>        if(realLen == -1) {</span></span>
<span class="line"><span>            SocketServer1.LOGGER.warn(&quot;====缓存区没有数据? ====&quot;);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //将缓存区从写状态切换为读状态(实际上这个方法是读写模式互切换)。</span></span>
<span class="line"><span>        //这是java nio框架中的这个socket channel的写请求将全部等待。</span></span>
<span class="line"><span>        contextBytes.flip();</span></span>
<span class="line"><span>        //注意中文乱码的问题，我个人喜好是使用URLDecoder/URLEncoder，进行解编码。</span></span>
<span class="line"><span>        //当然java nio框架本身也提供编解码方式，看个人咯</span></span>
<span class="line"><span>        byte[] messageBytes = contextBytes.array();</span></span>
<span class="line"><span>        String messageEncode = new String(messageBytes , &quot;UTF-8&quot;);</span></span>
<span class="line"><span>        String message = URLDecoder.decode(messageEncode, &quot;UTF-8&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //如果收到了“over”关键字，才会清空buffer，并回发数据；</span></span>
<span class="line"><span>        //否则不清空缓存，还要还原buffer的“写状态”</span></span>
<span class="line"><span>        if(message.indexOf(&quot;over&quot;) != -1) {</span></span>
<span class="line"><span>            //清空已经读取的缓存，并从新切换为写状态(这里要注意clear()和capacity()两个方法的区别)</span></span>
<span class="line"><span>            contextBytes.clear();</span></span>
<span class="line"><span>            SocketServer1.LOGGER.info(&quot;端口:&quot; + resoucePort + &quot;客户端发来的信息======message : &quot; + message);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //======================================================</span></span>
<span class="line"><span>            //          当然接受完成后，可以在这里正式处理业务了        </span></span>
<span class="line"><span>            //======================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //回发数据，并关闭channel</span></span>
<span class="line"><span>            ByteBuffer sendBuffer = ByteBuffer.wrap(URLEncoder.encode(&quot;回发处理结果&quot;, &quot;UTF-8&quot;).getBytes());</span></span>
<span class="line"><span>            clientSocketChannel.write(sendBuffer);</span></span>
<span class="line"><span>            clientSocketChannel.close();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            SocketServer1.LOGGER.info(&quot;端口:&quot; + resoucePort + &quot;客户端信息还未接受完，继续接受======message : &quot; + message);</span></span>
<span class="line"><span>            //这是，limit和capacity的值一致，position的位置是realLen的位置</span></span>
<span class="line"><span>            contextBytes.position(realLen);</span></span>
<span class="line"><span>            contextBytes.limit(contextBytes.capacity());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码中的注释是比较清楚的，但是还是要对几个关键点进行一下讲解:</p><ul><li>serverChannel.register(Selector sel, int ops, Object att): 实际上register(Selector sel, int ops, Object att)方法是ServerSocketChannel类的父类AbstractSelectableChannel提供的一个方法，表示只要继承了AbstractSelectableChannel类的子类都可以注册到选择器中。通过观察整个AbstractSelectableChannel继承关系，下图中的这些类可以被注册到选择器中:</li></ul><p><img src="`+S+`" alt="error.图片加载失败"></p><ul><li>SelectionKey.OP_ACCEPT: 不同的Channel对象可以注册的“我关心的事件”是不一样的。例如ServerSocketChannel除了能够被允许关注OP_ACCEPT事件外，不允许再关心其他事件了(否则运行时会抛出异常)。以下梳理了常使用的AbstractSelectableChannel子类可以注册的事件列表:</li></ul><table tabindex="0"><thead><tr><th>通道类</th><th>通道作用</th><th>可关注的事件</th></tr></thead><tbody><tr><td>ServerSocketChannel</td><td>服务器端通道</td><td>SelectionKey.OP_ACCEPT</td></tr><tr><td>DatagramChannel</td><td>UDP协议通道</td><td>SelectionKey.OP_READ、SelectionKey.OP_WRITE</td></tr><tr><td>SocketChannel</td><td>TCP协议通道</td><td>SelectionKey.OP_READ、SelectionKey.OP_WRITE、SelectionKey.OP_CONNECT</td></tr></tbody></table><p>实际上通过每一个AbstractSelectableChannel子类所实现的public final int validOps()方法，就可以查看这个通道“可以关心的IO事件”。</p><p>selector.selectedKeys().iterator(): 当选择器Selector收到操作系统的IO操作事件后，它的selectedKeys将在下一次轮询操作中，收到这些事件的关键描述字(不同的channel，就算关键字一样，也会存储成两个对象)。但是每一个“事件关键字”被处理后都必须移除，否则下一次轮询时，这个事件会被重复处理。</p><blockquote><p>Returns this selector’s selected-key set. Keys may be removed from, but not directly added to, the selected-key set. Any attempt to add an object to the key set will cause an UnsupportedOperationException to be thrown. The selected-key set is not thread-safe.</p></blockquote><h3 id="java实例改进" tabindex="-1">JAVA实例改进 <a class="header-anchor" href="#java实例改进" aria-label="Permalink to &quot;JAVA实例改进&quot;">​</a></h3><p>上面的代码中，我们为了讲解selector的使用，在缓存使用上就进行了简化。实际的应用中，为了节约内存资源，我们一般不会为一个通道分配那么多的缓存空间。下面的代码我们主要对其中的缓存操作进行了优化:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package testNSocket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.net.InetSocketAddress;</span></span>
<span class="line"><span>import java.net.ServerSocket;</span></span>
<span class="line"><span>import java.net.URLDecoder;</span></span>
<span class="line"><span>import java.net.URLEncoder;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.nio.ByteBuffer;</span></span>
<span class="line"><span>import java.nio.channels.SelectableChannel;</span></span>
<span class="line"><span>import java.nio.channels.SelectionKey;</span></span>
<span class="line"><span>import java.nio.channels.Selector;</span></span>
<span class="line"><span>import java.nio.channels.ServerSocketChannel;</span></span>
<span class="line"><span>import java.nio.channels.SocketChannel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Iterator;</span></span>
<span class="line"><span>import java.util.concurrent.ConcurrentHashMap;</span></span>
<span class="line"><span>import java.util.concurrent.ConcurrentMap;</span></span>
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
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 日志</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final Log LOGGER = LogFactory.getLog(SocketServer2.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 改进的java nio server的代码中，由于buffer的大小设置的比较小。</span></span>
<span class="line"><span>     * 我们不再把一个client通过socket channel多次传给服务器的信息保存在beff中了(因为根本存不下)&lt;br&gt;</span></span>
<span class="line"><span>     * 我们使用socketchanel的hashcode作为key(当然您也可以自己确定一个id)，信息的stringbuffer作为value，存储到服务器端的一个内存区域MESSAGEHASHCONTEXT。</span></span>
<span class="line"><span>     * </span></span>
<span class="line"><span>     * 如果您不清楚ConcurrentHashMap的作用和工作原理，请自行百度/Google</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final ConcurrentMap&lt;Integer, StringBuffer&gt; MESSAGEHASHCONTEXT = new ConcurrentHashMap&lt;Integer , StringBuffer&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        ServerSocketChannel serverChannel = ServerSocketChannel.open();</span></span>
<span class="line"><span>        serverChannel.configureBlocking(false);</span></span>
<span class="line"><span>        ServerSocket serverSocket = serverChannel.socket();</span></span>
<span class="line"><span>        serverSocket.setReuseAddress(true);</span></span>
<span class="line"><span>        serverSocket.bind(new InetSocketAddress(83));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Selector selector = Selector.open();</span></span>
<span class="line"><span>        //注意、服务器通道只能注册SelectionKey.OP_ACCEPT事件</span></span>
<span class="line"><span>        serverChannel.register(selector, SelectionKey.OP_ACCEPT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            while(true) {</span></span>
<span class="line"><span>                //如果条件成立，说明本次询问selector，并没有获取到任何准备好的、感兴趣的事件</span></span>
<span class="line"><span>                //java程序对多路复用IO的支持也包括了阻塞模式 和非阻塞模式两种。</span></span>
<span class="line"><span>                if(selector.select(100) == 0) {</span></span>
<span class="line"><span>                    //================================================</span></span>
<span class="line"><span>                    //      这里视业务情况，可以做一些然并卵的事情</span></span>
<span class="line"><span>                    //================================================</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                //这里就是本次询问操作系统，所获取到的“所关心的事件”的事件类型(每一个通道都是独立的)</span></span>
<span class="line"><span>                Iterator&lt;SelectionKey&gt; selecionKeys = selector.selectedKeys().iterator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                while(selecionKeys.hasNext()) {</span></span>
<span class="line"><span>                    SelectionKey readyKey = selecionKeys.next();</span></span>
<span class="line"><span>                    //这个已经处理的readyKey一定要移除。如果不移除，就会一直存在在selector.selectedKeys集合中</span></span>
<span class="line"><span>                    //待到下一次selector.select() &gt; 0时，这个readyKey又会被处理一次</span></span>
<span class="line"><span>                    selecionKeys.remove();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    SelectableChannel selectableChannel = readyKey.channel();</span></span>
<span class="line"><span>                    if(readyKey.isValid() &amp;&amp; readyKey.isAcceptable()) {</span></span>
<span class="line"><span>                        SocketServer2.LOGGER.info(&quot;======channel通道已经准备好=======&quot;);</span></span>
<span class="line"><span>                        /*</span></span>
<span class="line"><span>                         * 当server socket channel通道已经准备好，就可以从server socket channel中获取socketchannel了</span></span>
<span class="line"><span>                         * 拿到socket channel后，要做的事情就是马上到selector注册这个socket channel感兴趣的事情。</span></span>
<span class="line"><span>                         * 否则无法监听到这个socket channel到达的数据</span></span>
<span class="line"><span>                         * */</span></span>
<span class="line"><span>                        ServerSocketChannel serverSocketChannel = (ServerSocketChannel)selectableChannel;</span></span>
<span class="line"><span>                        SocketChannel socketChannel = serverSocketChannel.accept();</span></span>
<span class="line"><span>                        registerSocketChannel(socketChannel , selector);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    } else if(readyKey.isValid() &amp;&amp; readyKey.isConnectable()) {</span></span>
<span class="line"><span>                        SocketServer2.LOGGER.info(&quot;======socket channel 建立连接=======&quot;);</span></span>
<span class="line"><span>                    } else if(readyKey.isValid() &amp;&amp; readyKey.isReadable()) {</span></span>
<span class="line"><span>                        SocketServer2.LOGGER.info(&quot;======socket channel 数据准备完成，可以去读==读取=======&quot;);</span></span>
<span class="line"><span>                        readSocketChannel(readyKey);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch(Exception e) {</span></span>
<span class="line"><span>            SocketServer2.LOGGER.error(e.getMessage() , e);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            serverSocket.close();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 在server socket channel接收到/准备好 一个新的 TCP连接后。</span></span>
<span class="line"><span>     * 就会向程序返回一个新的socketChannel。&lt;br&gt;</span></span>
<span class="line"><span>     * 但是这个新的socket channel并没有在selector“选择器/代理器”中注册，</span></span>
<span class="line"><span>     * 所以程序还没法通过selector通知这个socket channel的事件。</span></span>
<span class="line"><span>     * 于是我们拿到新的socket channel后，要做的第一个事情就是到selector“选择器/代理器”中注册这个</span></span>
<span class="line"><span>     * socket channel感兴趣的事件</span></span>
<span class="line"><span>     * @param socketChannel 新的socket channel</span></span>
<span class="line"><span>     * @param selector selector“选择器/代理器”</span></span>
<span class="line"><span>     * @throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static void registerSocketChannel(SocketChannel socketChannel , Selector selector) throws Exception {</span></span>
<span class="line"><span>        socketChannel.configureBlocking(false);</span></span>
<span class="line"><span>        //socket通道可以且只可以注册三种事件SelectionKey.OP_READ | SelectionKey.OP_WRITE | SelectionKey.OP_CONNECT</span></span>
<span class="line"><span>        //最后一个参数视为 为这个socketchanne分配的缓存区</span></span>
<span class="line"><span>        socketChannel.register(selector, SelectionKey.OP_READ , ByteBuffer.allocate(50));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 这个方法用于读取从客户端传来的信息。</span></span>
<span class="line"><span>     * 并且观察从客户端过来的socket channel在经过多次传输后，是否完成传输。</span></span>
<span class="line"><span>     * 如果传输完成，则返回一个true的标记。</span></span>
<span class="line"><span>     * @param socketChannel</span></span>
<span class="line"><span>     * @throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static void readSocketChannel(SelectionKey readyKey) throws Exception {</span></span>
<span class="line"><span>        SocketChannel clientSocketChannel = (SocketChannel)readyKey.channel();</span></span>
<span class="line"><span>        //获取客户端使用的端口</span></span>
<span class="line"><span>        InetSocketAddress sourceSocketAddress = (InetSocketAddress)clientSocketChannel.getRemoteAddress();</span></span>
<span class="line"><span>        Integer resoucePort = sourceSocketAddress.getPort();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //拿到这个socket channel使用的缓存区，准备读取数据</span></span>
<span class="line"><span>        //在后文，将详细讲解缓存区的用法概念，实际上重要的就是三个元素capacity,position和limit。</span></span>
<span class="line"><span>        ByteBuffer contextBytes = (ByteBuffer)readyKey.attachment();</span></span>
<span class="line"><span>        //将通道的数据写入到缓存区，注意是写入到缓存区。</span></span>
<span class="line"><span>        //这次，为了演示buff的使用方式，我们故意缩小了buff的容量大小到50byte，</span></span>
<span class="line"><span>        //以便演示channel对buff的多次读写操作</span></span>
<span class="line"><span>        int realLen = 0;</span></span>
<span class="line"><span>        StringBuffer message = new StringBuffer();</span></span>
<span class="line"><span>        //这句话的意思是，将目前通道中的数据写入到缓存区</span></span>
<span class="line"><span>        //最大可写入的数据量就是buff的容量</span></span>
<span class="line"><span>        while((realLen = clientSocketChannel.read(contextBytes)) != 0) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //一定要把buffer切换成“读”模式，否则由于limit = capacity</span></span>
<span class="line"><span>            //在read没有写满的情况下，就会导致多读</span></span>
<span class="line"><span>            contextBytes.flip();</span></span>
<span class="line"><span>            int position = contextBytes.position();</span></span>
<span class="line"><span>            int capacity = contextBytes.capacity();</span></span>
<span class="line"><span>            byte[] messageBytes = new byte[capacity];</span></span>
<span class="line"><span>            contextBytes.get(messageBytes, position, realLen);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //这种方式也是可以读取数据的，而且不用关心position的位置。</span></span>
<span class="line"><span>            //因为是目前contextBytes所有的数据全部转出为一个byte数组。</span></span>
<span class="line"><span>            //使用这种方式时，一定要自己控制好读取的最终位置(realLen很重要)</span></span>
<span class="line"><span>            //byte[] messageBytes = contextBytes.array();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //注意中文乱码的问题，我个人喜好是使用URLDecoder/URLEncoder，进行解编码。</span></span>
<span class="line"><span>            //当然java nio框架本身也提供编解码方式，看个人咯</span></span>
<span class="line"><span>            String messageEncode = new String(messageBytes , 0 , realLen , &quot;UTF-8&quot;);</span></span>
<span class="line"><span>            message.append(messageEncode);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //再切换成“写”模式，直接情况缓存的方式，最快捷</span></span>
<span class="line"><span>            contextBytes.clear();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //如果发现本次接收的信息中有over关键字，说明信息接收完了</span></span>
<span class="line"><span>        if(URLDecoder.decode(message.toString(), &quot;UTF-8&quot;).indexOf(&quot;over&quot;) != -1) {</span></span>
<span class="line"><span>            //则从messageHashContext中，取出之前已经收到的信息，组合成完整的信息</span></span>
<span class="line"><span>            Integer channelUUID = clientSocketChannel.hashCode();</span></span>
<span class="line"><span>            SocketServer2.LOGGER.info(&quot;端口:&quot; + resoucePort + &quot;客户端发来的信息======message : &quot; + message);</span></span>
<span class="line"><span>            StringBuffer completeMessage;</span></span>
<span class="line"><span>            //清空MESSAGEHASHCONTEXT中的历史记录</span></span>
<span class="line"><span>            StringBuffer historyMessage = MESSAGEHASHCONTEXT.remove(channelUUID);</span></span>
<span class="line"><span>            if(historyMessage == null) {</span></span>
<span class="line"><span>                completeMessage = message;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                completeMessage = historyMessage.append(message);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            SocketServer2.LOGGER.info(&quot;端口:&quot; + resoucePort + &quot;客户端发来的完整信息======completeMessage : &quot; + URLDecoder.decode(completeMessage.toString(), &quot;UTF-8&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //======================================================</span></span>
<span class="line"><span>            //          当然接受完成后，可以在这里正式处理业务了        </span></span>
<span class="line"><span>            //======================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //回发数据，并关闭channel</span></span>
<span class="line"><span>            ByteBuffer sendBuffer = ByteBuffer.wrap(URLEncoder.encode(&quot;回发处理结果&quot;, &quot;UTF-8&quot;).getBytes());</span></span>
<span class="line"><span>            clientSocketChannel.write(sendBuffer);</span></span>
<span class="line"><span>            clientSocketChannel.close();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            //如果没有发现有“over”关键字，说明还没有接受完，则将本次接受到的信息存入messageHashContext</span></span>
<span class="line"><span>            SocketServer2.LOGGER.info(&quot;端口:&quot; + resoucePort + &quot;客户端信息还未接受完，继续接受======message : &quot; + URLDecoder.decode(message.toString(), &quot;UTF-8&quot;));</span></span>
<span class="line"><span>            //每一个channel对象都是独立的，所以可以使用对象的hash值，作为唯一标示</span></span>
<span class="line"><span>            Integer channelUUID = clientSocketChannel.hashCode();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //然后获取这个channel下以前已经达到的message信息</span></span>
<span class="line"><span>            StringBuffer historyMessage = MESSAGEHASHCONTEXT.get(channelUUID);</span></span>
<span class="line"><span>            if(historyMessage == null) {</span></span>
<span class="line"><span>                historyMessage = new StringBuffer();</span></span>
<span class="line"><span>                MESSAGEHASHCONTEXT.put(channelUUID, historyMessage.append(message));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上代码应该没有过多需要讲解的了。当然，您还是可以加入线程池技术，进行具体的业务处理。注意，一定是线程池，因为这样可以保证线程规模的可控性。</p><h2 id="多路复用io的优缺点" tabindex="-1">多路复用IO的优缺点 <a class="header-anchor" href="#多路复用io的优缺点" aria-label="Permalink to &quot;多路复用IO的优缺点&quot;">​</a></h2><ul><li><p>不用再使用多线程来进行IO处理了(包括操作系统内核IO管理模块和应用程序进程而言)。当然实际业务的处理中，应用程序进程还是可以引入线程池技术的</p></li><li><p>同一个端口可以处理多种协议，例如，使用ServerSocketChannel测测的服务器端口监听，既可以处理TCP协议又可以处理UDP协议。</p></li><li><p>操作系统级别的优化: 多路复用IO技术可以是操作系统级别在一个端口上能够同时接受多个客户端的IO事件。同时具有之前我们讲到的阻塞式同步IO和非阻塞式同步IO的所有特点。Selector的一部分作用更相当于“轮询代理器”。</p></li><li><p>都是同步IO: 目前我们介绍的 阻塞式IO、非阻塞式IO甚至包括多路复用IO，这些都是基于操作系统级别对“同步IO”的实现。我们一直在说“同步IO”，一直都没有详细说，什么叫做“同步IO”。实际上一句话就可以说清楚: 只有上层(包括上层的某种代理机制)系统询问我是否有某个事件发生了，否则我不会主动告诉上层系统事件发生了:</p></li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要来源于: 银文杰，笔名“说好不能打脸”，<a href="https://blog.csdn.net/yinwenjie" target="_blank" rel="noreferrer">博客地址在新窗口打开</a>。他的书《高性能服务系统构建与实战》。</li><li><a href="https://blog.csdn.net/yinwenjie/article/details/48522403" target="_blank" rel="noreferrer">https://blog.csdn.net/yinwenjie/article/details/48522403</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,103)]))}const A=l(k,[["render",y]]);export{I as __pageData,A as default};
