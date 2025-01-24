import{_ as a,c as s,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"Java N(A)IO - 框架: Netty","description":"","frontmatter":{},"headers":[],"relativePath":"java/io/java-io-nio-netty.md","filePath":"java/io/java-io-nio-netty.md","lastUpdated":1737706346000}'),l={name:"java/io/java-io-nio-netty.md"};function t(i,n,r,c,o,d){return p(),s("div",null,n[0]||(n[0]=[e(`<h1 id="java-n-a-io-框架-netty" tabindex="-1">Java N(A)IO - 框架: Netty <a class="header-anchor" href="#java-n-a-io-框架-netty" aria-label="Permalink to &quot;Java N(A)IO - 框架: Netty&quot;">​</a></h1><blockquote><p>Netty是一个高性能、异步事件驱动的NIO框架，提供了对TCP、UDP和文件传输的支持。作为当前最流行的NIO框架，Netty在互联网领域、大数据分布式计算领域、游戏行业、通信行业等获得了广泛的应用，一些业界著名的开源组件也基于Netty构建，比如RPC框架、zookeeper等。@pdai</p></blockquote><h2 id="nio框架" tabindex="-1">NIO框架 <a class="header-anchor" href="#nio框架" aria-label="Permalink to &quot;NIO框架&quot;">​</a></h2><p>目前流行的NIO框架非常的多。在论坛上、互联网上大家讨论和使用最多的有以下几种:</p><ul><li>原生JAVA NIO框架:</li></ul><p>JAVA NIO通信框架基于多路复用IO原理，我们将详细讲解它的工作原理。</p><ul><li>APACHE MINA 2:</li></ul><p>是一个网络应用程序框架，用来帮助用户简单地开发高性能和高可扩展性的网络应用程序。它提供了一个通过Java NIO在不同的传输例如TCP/IP和UDP/IP上抽象的事件驱动的异步API。</p><ul><li>NETTY 4/5:</li></ul><p>Netty是由JBOSS提供的一个java开源框架。Netty提供异步的、事件驱动的网络应用程序框架和工具，用以快速开发高性能、高可靠性的网络服务器和客户端程序。我们将讲解NETTY 4 的工作原理。另外说一句: MINA和NETTY的主要作者是同一人Trustin Lee。</p><ul><li>Grizzly:</li></ul><p>Grizzly是一种应用程序框架，专门解决编写成千上万用户访问服务器时候产生的各种问题。使用JAVA NIO作为基础，并隐藏其编程的复杂性。</p><h2 id="比较好的基于nio的开源框架-netty" tabindex="-1">比较好的基于NIO的开源框架(Netty) <a class="header-anchor" href="#比较好的基于nio的开源框架-netty" aria-label="Permalink to &quot;比较好的基于NIO的开源框架(Netty)&quot;">​</a></h2><h3 id="优点" tabindex="-1">优点 <a class="header-anchor" href="#优点" aria-label="Permalink to &quot;优点&quot;">​</a></h3><ul><li>api简单，开发门槛低</li><li>功能强大，内置了多种编码、解码功能</li><li>与其它业界主流的NIO框架对比，netty的综合性能最优</li><li>社区活跃，使用广泛，经历过很多商业应用项目的考验</li><li>定制能力强，可以对框架进行灵活的扩展</li></ul><h3 id="例子" tabindex="-1">例子 <a class="header-anchor" href="#例子" aria-label="Permalink to &quot;例子&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>     &lt;groupId&gt;org.jboss.netty&lt;/groupId&gt;</span></span>
<span class="line"><span>     &lt;artifactId&gt;netty&lt;/artifactId&gt;</span></span>
<span class="line"><span>     &lt;version&gt;3.2.5.Final&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li>服务端。接收客户端请求并将内容打印出来，同时发送一个消息收到回执。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class NettyServer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static int HEADER_LENGTH = 4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void bind(int port) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ServerBootstrap b = new ServerBootstrap(new NioServerSocketChannelFactory(Executors.newCachedThreadPool(),</span></span>
<span class="line"><span>                                                                                  Executors.newCachedThreadPool()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 构造对应的pipeline</span></span>
<span class="line"><span>        b.setPipelineFactory(new ChannelPipelineFactory() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            public ChannelPipeline getPipeline() throws Exception {</span></span>
<span class="line"><span>                ChannelPipeline pipelines = Channels.pipeline();</span></span>
<span class="line"><span>                pipelines.addLast(MessageHandler.class.getName(), new MessageHandler());</span></span>
<span class="line"><span>                return pipelines;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        // 监听端口号</span></span>
<span class="line"><span>        b.bind(new InetSocketAddress(port));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 处理消息</span></span>
<span class="line"><span>    static class MessageHandler extends SimpleChannelHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public void messageReceived(ChannelHandlerContext ctx, MessageEvent e) throws Exception {</span></span>
<span class="line"><span>            // 接收客户端请求</span></span>
<span class="line"><span>            ChannelBuffer buffer = (ChannelBuffer) e.getMessage();</span></span>
<span class="line"><span>            String message = new String(buffer.readBytes(buffer.readableBytes()).array(), &quot;UTF-8&quot;);</span></span>
<span class="line"><span>            System.out.println(&quot;&lt;服务端&gt;收到内容=&quot; + message);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 给客户端发送回执</span></span>
<span class="line"><span>            byte[] body = &quot;服务端已收到&quot;.getBytes();</span></span>
<span class="line"><span>            byte[] header = ByteBuffer.allocate(HEADER_LENGTH).order(ByteOrder.BIG_ENDIAN).putInt(body.length).array();</span></span>
<span class="line"><span>            Channels.write(ctx.getChannel(), ChannelBuffers.wrappedBuffer(header, body));</span></span>
<span class="line"><span>            System.out.println(&quot;&lt;服务端&gt;发送回执,time=&quot; + System.currentTimeMillis());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            new NettyServer().bind(1088);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>客户端。向服务端发送一个请求，然后打印服务端响应的内容。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class NettyClient {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final ByteBuffer readHeader  = ByteBuffer.allocate(4).order(ByteOrder.BIG_ENDIAN);</span></span>
<span class="line"><span>    private final ByteBuffer writeHeader = ByteBuffer.allocate(4).order(ByteOrder.BIG_ENDIAN);</span></span>
<span class="line"><span>    private SocketChannel    channel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void sendMessage(byte[] body) throws Exception {</span></span>
<span class="line"><span>        // 创建客户端通道</span></span>
<span class="line"><span>        channel = SocketChannel.open();</span></span>
<span class="line"><span>        channel.socket().setSoTimeout(60000);</span></span>
<span class="line"><span>        channel.connect(new InetSocketAddress(AddressUtils.getHostIp(), 1088));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 客户端发请求</span></span>
<span class="line"><span>        writeWithHeader(channel, body);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 接收服务端响应的信息</span></span>
<span class="line"><span>        readHeader.clear();</span></span>
<span class="line"><span>        read(channel, readHeader);</span></span>
<span class="line"><span>        int bodyLen = readHeader.getInt(0);</span></span>
<span class="line"><span>        ByteBuffer bodyBuf = ByteBuffer.allocate(bodyLen).order(ByteOrder.BIG_ENDIAN);</span></span>
<span class="line"><span>        read(channel, bodyBuf);</span></span>
<span class="line"><span>        System.out.println(&quot;&lt;客户端&gt;收到响应内容: &quot; + new String(bodyBuf.array(), &quot;UTF-8&quot;) + &quot;,长度:&quot; + bodyLen);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void writeWithHeader(SocketChannel channel, byte[] body) throws IOException {</span></span>
<span class="line"><span>        writeHeader.clear();</span></span>
<span class="line"><span>        writeHeader.putInt(body.length);</span></span>
<span class="line"><span>        writeHeader.flip();</span></span>
<span class="line"><span>        // channel.write(writeHeader);</span></span>
<span class="line"><span>        channel.write(ByteBuffer.wrap(body));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void read(SocketChannel channel, ByteBuffer buffer) throws IOException {</span></span>
<span class="line"><span>        while (buffer.hasRemaining()) {</span></span>
<span class="line"><span>            int r = channel.read(buffer);</span></span>
<span class="line"><span>            if (r == -1) {</span></span>
<span class="line"><span>                throw new IOException(&quot;end of stream when reading header&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        String body = &quot;客户发的测试请求！&quot;;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            new NettyClient().sendMessage(body.getBytes());</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://blog.csdn.net/yinwenjie/article/details/48829419" target="_blank" rel="noreferrer">https://blog.csdn.net/yinwenjie/article/details/48829419</a></li><li><a href="https://blog.csdn.net/yinwenjie/article/details/48969853" target="_blank" rel="noreferrer">https://blog.csdn.net/yinwenjie/article/details/48969853</a></li><li><a href="https://mp.weixin.qq.com/s/RPTETiULRAkOS-ZTd6xM2A" target="_blank" rel="noreferrer">Netty入门简介在新窗口打开</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,24)]))}const y=a(l,[["render",t]]);export{u as __pageData,y as default};
