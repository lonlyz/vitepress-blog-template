import{_ as n,c as s,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/pics/1bea398f-17a7-4f67-a90b-9e2d243eaa9a.png",i="/vitepress-blog-template/images/pics/80804f52-8815-4096-b506-48eef3eed5c6.png",t="/vitepress-blog-template/images/pics/952e06bd-5a65-4cab-82e4-dd1536462f38.png",c="/vitepress-blog-template/images/pics/b5bdcbe2-b958-4aef-9151-6ad963cb28b4.png",r="/vitepress-blog-template/images/pics/67bf5487-c45d-49b6-b9c0-a058d8c68902.png",o="/vitepress-blog-template/images/pics/4d930e22-f493-49ae-8dff-ea21cd6895dc.png",v=JSON.parse('{"title":"Java NIO - 基础详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/io/java-io-nio.md","filePath":"java/io/java-io-nio.md","lastUpdated":1737706346000}'),h={name:"java/io/java-io-nio.md"};function d(u,a,b,g,f,m){return p(),s("div",null,a[0]||(a[0]=[e('<h1 id="java-nio-基础详解" tabindex="-1">Java NIO - 基础详解 <a class="header-anchor" href="#java-nio-基础详解" aria-label="Permalink to &quot;Java NIO - 基础详解&quot;">​</a></h1><blockquote><p>新的输入/输出 (NIO) 库是在 JDK 1.4 中引入的，弥补了原来的 I/O 的不足，提供了高速的、面向块的 I/O。@pdai</p></blockquote><p>Standard IO是对字节流的读写，在进行IO之前，首先创建一个流对象，流对象进行读写操作都是按字节 ，一个字节一个字节的来读或写。而NIO把IO抽象成块，类似磁盘的读写，每次IO操作的单位都是一个块，块被读入内存之后就是一个byte[]，NIO一次可以读或写多个字节。</p><h2 id="流与块" tabindex="-1">流与块 <a class="header-anchor" href="#流与块" aria-label="Permalink to &quot;流与块&quot;">​</a></h2><p>I/O 与 NIO 最重要的区别是数据打包和传输的方式，I/O 以流的方式处理数据，而 NIO 以块的方式处理数据。</p><p>面向流的 I/O 一次处理一个字节数据: 一个输入流产生一个字节数据，一个输出流消费一个字节数据。为流式数据创建过滤器非常容易，链接几个过滤器，以便每个过滤器只负责复杂处理机制的一部分。不利的一面是，面向流的 I/O 通常相当慢。</p><p>面向块的 I/O 一次处理一个数据块，按块处理数据比按流处理数据要快得多。但是面向块的 I/O 缺少一些面向流的 I/O 所具有的优雅性和简单性。</p><p>I/O 包和 NIO 已经很好地集成了，java.io.* 已经以 NIO 为基础重新实现了，所以现在它可以利用 NIO 的一些特性。例如，java.io.* 包中的一些类包含以块的形式读写数据的方法，这使得即使在面向流的系统中，处理速度也会更快。</p><h2 id="通道与缓冲区" tabindex="-1">通道与缓冲区 <a class="header-anchor" href="#通道与缓冲区" aria-label="Permalink to &quot;通道与缓冲区&quot;">​</a></h2><h3 id="_1-通道" tabindex="-1">1. 通道 <a class="header-anchor" href="#_1-通道" aria-label="Permalink to &quot;1\\. 通道&quot;">​</a></h3><p>通道 Channel 是对原 I/O 包中的流的模拟，可以通过它读取和写入数据。</p><p>通道与流的不同之处在于，流只能在一个方向上移动(一个流必须是 InputStream 或者 OutputStream 的子类)，而通道是双向的，可以用于读、写或者同时用于读写。</p><p>通道包括以下类型:</p><ul><li>FileChannel: 从文件中读写数据；</li><li>DatagramChannel: 通过 UDP 读写网络中数据；</li><li>SocketChannel: 通过 TCP 读写网络中数据；</li><li>ServerSocketChannel: 可以监听新进来的 TCP 连接，对每一个新进来的连接都会创建一个 SocketChannel。</li></ul><h3 id="_2-缓冲区" tabindex="-1">2. 缓冲区 <a class="header-anchor" href="#_2-缓冲区" aria-label="Permalink to &quot;2\\. 缓冲区&quot;">​</a></h3><p>发送给一个通道的所有数据都必须首先放到缓冲区中，同样地，从通道中读取的任何数据都要先读到缓冲区中。也就是说，不会直接对通道进行读写数据，而是要先经过缓冲区。</p><p>缓冲区实质上是一个数组，但它不仅仅是一个数组。缓冲区提供了对数据的结构化访问，而且还可以跟踪系统的读/写进程。</p><p>缓冲区包括以下类型:</p><ul><li>ByteBuffer</li><li>CharBuffer</li><li>ShortBuffer</li><li>IntBuffer</li><li>LongBuffer</li><li>FloatBuffer</li><li>DoubleBuffer</li></ul><h2 id="缓冲区状态变量" tabindex="-1">缓冲区状态变量 <a class="header-anchor" href="#缓冲区状态变量" aria-label="Permalink to &quot;缓冲区状态变量&quot;">​</a></h2><ul><li>capacity: 最大容量；</li><li>position: 当前已经读写的字节数；</li><li>limit: 还可以读写的字节数。</li></ul><p>状态变量的改变过程举例:</p><p>① 新建一个大小为 8 个字节的缓冲区，此时 position 为 0，而 limit = capacity = 8。capacity 变量不会改变，下面的讨论会忽略它。</p><p><img src="'+l+'" alt="image"></p><p>② 从输入通道中读取 5 个字节数据写入缓冲区中，此时 position 移动设置为 5，limit 保持不变。</p><p><img src="'+i+'" alt="image"></p><p>③ 在将缓冲区的数据写到输出通道之前，需要先调用 flip() 方法，这个方法将 limit 设置为当前 position，并将 position 设置为 0。</p><p><img src="'+t+'" alt="image"></p><p>④ 从缓冲区中取 4 个字节到输出缓冲中，此时 position 设为 4。</p><p><img src="'+c+'" alt="image"></p><p>⑤ 最后需要调用 clear() 方法来清空缓冲区，此时 position 和 limit 都被设置为最初位置。</p><p><img src="'+r+`" alt="image"></p><h2 id="文件-nio-实例" tabindex="-1">文件 NIO 实例 <a class="header-anchor" href="#文件-nio-实例" aria-label="Permalink to &quot;文件 NIO 实例&quot;">​</a></h2><p>以下展示了使用 NIO 快速复制文件的实例:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void fastCopy(String src, String dist) throws IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 获得源文件的输入字节流 */</span></span>
<span class="line"><span>    FileInputStream fin = new FileInputStream(src);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 获取输入字节流的文件通道 */</span></span>
<span class="line"><span>    FileChannel fcin = fin.getChannel();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 获取目标文件的输出字节流 */</span></span>
<span class="line"><span>    FileOutputStream fout = new FileOutputStream(dist);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 获取输出字节流的通道 */</span></span>
<span class="line"><span>    FileChannel fcout = fout.getChannel();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 为缓冲区分配 1024 个字节 */</span></span>
<span class="line"><span>    ByteBuffer buffer = ByteBuffer.allocateDirect(1024);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (true) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* 从输入通道中读取数据到缓冲区中 */</span></span>
<span class="line"><span>        int r = fcin.read(buffer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* read() 返回 -1 表示 EOF */</span></span>
<span class="line"><span>        if (r == -1) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* 切换读写 */</span></span>
<span class="line"><span>        buffer.flip();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* 把缓冲区的内容写入输出文件中 */</span></span>
<span class="line"><span>        fcout.write(buffer);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* 清空缓冲区 */</span></span>
<span class="line"><span>        buffer.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="选择器" tabindex="-1">选择器 <a class="header-anchor" href="#选择器" aria-label="Permalink to &quot;选择器&quot;">​</a></h2><p>NIO 常常被叫做非阻塞 IO，主要是因为 NIO 在网络通信中的非阻塞特性被广泛使用。</p><p>NIO 实现了 IO 多路复用中的 Reactor 模型，一个线程 Thread 使用一个选择器 Selector 通过轮询的方式去监听多个通道 Channel 上的事件，从而让一个线程就可以处理多个事件。</p><p>通过配置监听的通道 Channel 为非阻塞，那么当 Channel 上的 IO 事件还未到达时，就不会进入阻塞状态一直等待，而是继续轮询其它 Channel，找到 IO 事件已经到达的 Channel 执行。</p><p>因为创建和切换线程的开销很大，因此使用一个线程来处理多个事件而不是一个线程处理一个事件具有更好的性能。</p><p>应该注意的是，只有套接字 Channel 才能配置为非阻塞，而 FileChannel 不能，为 FileChannel 配置非阻塞也没有意义。</p><p><img src="`+o+`" alt="image"></p><h3 id="_1-创建选择器" tabindex="-1">1. 创建选择器 <a class="header-anchor" href="#_1-创建选择器" aria-label="Permalink to &quot;1\\. 创建选择器&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Selector selector = Selector.open();</span></span></code></pre></div><h3 id="_2-将通道注册到选择器上" tabindex="-1">2. 将通道注册到选择器上 <a class="header-anchor" href="#_2-将通道注册到选择器上" aria-label="Permalink to &quot;2\\. 将通道注册到选择器上&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ServerSocketChannel ssChannel = ServerSocketChannel.open();</span></span>
<span class="line"><span>ssChannel.configureBlocking(false);</span></span>
<span class="line"><span>ssChannel.register(selector, SelectionKey.OP_ACCEPT);</span></span></code></pre></div><p>通道必须配置为非阻塞模式，否则使用选择器就没有任何意义了，因为如果通道在某个事件上被阻塞，那么服务器就不能响应其它事件，必须等待这个事件处理完毕才能去处理其它事件，显然这和选择器的作用背道而驰。</p><p>在将通道注册到选择器上时，还需要指定要注册的具体事件，主要有以下几类:</p><ul><li>SelectionKey.OP_CONNECT</li><li>SelectionKey.OP_ACCEPT</li><li>SelectionKey.OP_READ</li><li>SelectionKey.OP_WRITE</li></ul><p>它们在 SelectionKey 的定义如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static final int OP_READ = 1 &lt;&lt; 0;</span></span>
<span class="line"><span>public static final int OP_WRITE = 1 &lt;&lt; 2;</span></span>
<span class="line"><span>public static final int OP_CONNECT = 1 &lt;&lt; 3;</span></span>
<span class="line"><span>public static final int OP_ACCEPT = 1 &lt;&lt; 4;</span></span></code></pre></div><p>可以看出每个事件可以被当成一个位域，从而组成事件集整数。例如:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int interestSet = SelectionKey.OP_READ | SelectionKey.OP_WRITE;</span></span></code></pre></div><h3 id="_3-监听事件" tabindex="-1">3. 监听事件 <a class="header-anchor" href="#_3-监听事件" aria-label="Permalink to &quot;3\\. 监听事件&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int num = selector.select();</span></span></code></pre></div><p>使用 select() 来监听到达的事件，它会一直阻塞直到有至少一个事件到达。</p><h3 id="_4-获取到达的事件" tabindex="-1">4. 获取到达的事件 <a class="header-anchor" href="#_4-获取到达的事件" aria-label="Permalink to &quot;4\\. 获取到达的事件&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Set&lt;SelectionKey&gt; keys = selector.selectedKeys();</span></span>
<span class="line"><span>Iterator&lt;SelectionKey&gt; keyIterator = keys.iterator();</span></span>
<span class="line"><span>while (keyIterator.hasNext()) {</span></span>
<span class="line"><span>    SelectionKey key = keyIterator.next();</span></span>
<span class="line"><span>    if (key.isAcceptable()) {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    } else if (key.isReadable()) {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    keyIterator.remove();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_5-事件循环" tabindex="-1">5. 事件循环 <a class="header-anchor" href="#_5-事件循环" aria-label="Permalink to &quot;5\\. 事件循环&quot;">​</a></h3><p>因为一次 select() 调用不能处理完所有的事件，并且服务器端有可能需要一直监听事件，因此服务器端处理事件的代码一般会放在一个死循环内。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>while (true) {</span></span>
<span class="line"><span>    int num = selector.select();</span></span>
<span class="line"><span>    Set&lt;SelectionKey&gt; keys = selector.selectedKeys();</span></span>
<span class="line"><span>    Iterator&lt;SelectionKey&gt; keyIterator = keys.iterator();</span></span>
<span class="line"><span>    while (keyIterator.hasNext()) {</span></span>
<span class="line"><span>        SelectionKey key = keyIterator.next();</span></span>
<span class="line"><span>        if (key.isAcceptable()) {</span></span>
<span class="line"><span>            // ...</span></span>
<span class="line"><span>        } else if (key.isReadable()) {</span></span>
<span class="line"><span>            // ...</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        keyIterator.remove();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="套接字-nio-实例" tabindex="-1">套接字 NIO 实例 <a class="header-anchor" href="#套接字-nio-实例" aria-label="Permalink to &quot;套接字 NIO 实例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class NIOServer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Selector selector = Selector.open();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ServerSocketChannel ssChannel = ServerSocketChannel.open();</span></span>
<span class="line"><span>        ssChannel.configureBlocking(false);</span></span>
<span class="line"><span>        ssChannel.register(selector, SelectionKey.OP_ACCEPT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ServerSocket serverSocket = ssChannel.socket();</span></span>
<span class="line"><span>        InetSocketAddress address = new InetSocketAddress(&quot;127.0.0.1&quot;, 8888);</span></span>
<span class="line"><span>        serverSocket.bind(address);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            selector.select();</span></span>
<span class="line"><span>            Set&lt;SelectionKey&gt; keys = selector.selectedKeys();</span></span>
<span class="line"><span>            Iterator&lt;SelectionKey&gt; keyIterator = keys.iterator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            while (keyIterator.hasNext()) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                SelectionKey key = keyIterator.next();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (key.isAcceptable()) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    ServerSocketChannel ssChannel1 = (ServerSocketChannel) key.channel();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    // 服务器会为每个新连接创建一个 SocketChannel</span></span>
<span class="line"><span>                    SocketChannel sChannel = ssChannel1.accept();</span></span>
<span class="line"><span>                    sChannel.configureBlocking(false);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    // 这个新连接主要用于从客户端读取数据</span></span>
<span class="line"><span>                    sChannel.register(selector, SelectionKey.OP_READ);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                } else if (key.isReadable()) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    SocketChannel sChannel = (SocketChannel) key.channel();</span></span>
<span class="line"><span>                    System.out.println(readDataFromSocketChannel(sChannel));</span></span>
<span class="line"><span>                    sChannel.close();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                keyIterator.remove();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static String readDataFromSocketChannel(SocketChannel sChannel) throws IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ByteBuffer buffer = ByteBuffer.allocate(1024);</span></span>
<span class="line"><span>        StringBuilder data = new StringBuilder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            buffer.clear();</span></span>
<span class="line"><span>            int n = sChannel.read(buffer);</span></span>
<span class="line"><span>            if (n == -1) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            buffer.flip();</span></span>
<span class="line"><span>            int limit = buffer.limit();</span></span>
<span class="line"><span>            char[] dst = new char[limit];</span></span>
<span class="line"><span>            for (int i = 0; i &lt; limit; i++) {</span></span>
<span class="line"><span>                dst[i] = (char) buffer.get(i);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            data.append(dst);</span></span>
<span class="line"><span>            buffer.clear();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return data.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class NIOClient {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws IOException {</span></span>
<span class="line"><span>        Socket socket = new Socket(&quot;127.0.0.1&quot;, 8888);</span></span>
<span class="line"><span>        OutputStream out = socket.getOutputStream();</span></span>
<span class="line"><span>        String s = &quot;hello world&quot;;</span></span>
<span class="line"><span>        out.write(s.getBytes());</span></span>
<span class="line"><span>        out.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="内存映射文件" tabindex="-1">内存映射文件 <a class="header-anchor" href="#内存映射文件" aria-label="Permalink to &quot;内存映射文件&quot;">​</a></h2><p>内存映射文件 I/O 是一种读和写文件数据的方法，它可以比常规的基于流或者基于通道的 I/O 快得多。</p><p>向内存映射文件写入可能是危险的，只是改变数组的单个元素这样的简单操作，就可能会直接修改磁盘上的文件。修改数据与将数据保存到磁盘是没有分开的。</p><p>下面代码行将文件的前 1024 个字节映射到内存中，map() 方法返回一个 MappedByteBuffer，它是 ByteBuffer 的子类。因此，可以像使用其他任何 ByteBuffer 一样使用新映射的缓冲区，操作系统会在需要时负责执行映射。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MappedByteBuffer mbb = fc.map(FileChannel.MapMode.READ_WRITE, 0, 1024);</span></span></code></pre></div><h2 id="对比" tabindex="-1">对比 <a class="header-anchor" href="#对比" aria-label="Permalink to &quot;对比&quot;">​</a></h2><p>NIO 与普通 I/O 的区别主要有以下两点:</p><ul><li>NIO 是非阻塞的</li><li>NIO 面向块，I/O 面向流</li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="http://tutorials.jenkov.com/java-nio/index.html" target="_blank" rel="noreferrer">Java NIO Tutorial在新窗口打开</a></li><li><a href="https://tech.meituan.com/nio.html" target="_blank" rel="noreferrer">Java NIO 浅析在新窗口打开</a></li><li><a href="https://www.ibm.com/developerworks/cn/education/java/j-nio/j-nio.html" target="_blank" rel="noreferrer">IBM: NIO 入门在新窗口打开</a></li><li>Eckel B, 埃克尔, 昊鹏, 等. Java 编程思想 [M]. 机械工业出版社, 2002.</li><li><a href="https://www.ibm.com/developerworks/cn/education/java/j-nio/j-nio.html" target="_blank" rel="noreferrer">IBM: NIO 入门在新窗口打开</a></li><li><a href="https://www.ibm.com/developerworks/cn/java/j-lo-javaio/index.html" target="_blank" rel="noreferrer">IBM: 深入分析 Java I/O 的工作机制在新窗口打开</a></li><li><a href="https://www.ibm.com/developerworks/cn/java/j-lo-chinesecoding/index.htm" target="_blank" rel="noreferrer">IBM: 深入分析 Java 中的中文编码问题在新窗口打开</a></li><li><a href="https://www.ibm.com/developerworks/cn/java/j-lo-serial/index.html" target="_blank" rel="noreferrer">IBM: Java 序列化的高级认识在新窗口打开</a></li><li><a href="http://blog.csdn.net/shimiso/article/details/24990499" target="_blank" rel="noreferrer">NIO 与传统 IO 的区别在新窗口打开</a></li><li><a href="http://stg-tud.github.io/sedc/Lecture/ws13-14/5.3-Decorator.html#mode=document" target="_blank" rel="noreferrer">Decorator Design Pattern在新窗口打开</a></li><li><a href="http://labojava.blogspot.com/2012/12/socket-multicast.html" target="_blank" rel="noreferrer">Socket Multicast在新窗口打开</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,75)]))}const I=n(h,[["render",d]]);export{v as __pageData,I as default};
