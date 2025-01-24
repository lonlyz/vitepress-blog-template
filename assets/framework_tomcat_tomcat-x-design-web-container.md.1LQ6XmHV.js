import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/tomcat/tomcat-x-design-7.png",t="/vitepress-blog-template/images/tomcat/tomcat-x-design-6.png",i="/vitepress-blog-template/images/tomcat/tomcat-x-design-1.png",c="/vitepress-blog-template/images/tomcat/tomcat-x-design-5.png",r="/vitepress-blog-template/images/tomcat/tomcat-x-design-4.png",o="/vitepress-blog-template/images/tomcat/tomcat-x-design-2.png",u="/vitepress-blog-template/images/tomcat/tomcat-x-design-8.png",d="/vitepress-blog-template/images/tomcat/tomcat-x-design-3.png",f=JSON.parse('{"title":"Tomcat - 如何设计一个简单的web容器","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-design-web-container.md","filePath":"framework/tomcat/tomcat-x-design-web-container.md","lastUpdated":1737706346000}'),h={name:"framework/tomcat/tomcat-x-design-web-container.md"};function g(v,s,b,m,S,q){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="tomcat-如何设计一个简单的web容器" tabindex="-1">Tomcat - 如何设计一个简单的web容器 <a class="header-anchor" href="#tomcat-如何设计一个简单的web容器" aria-label="Permalink to &quot;Tomcat - 如何设计一个简单的web容器&quot;">​</a></h1><blockquote><p>在学习Tomcat前，很多人先入为主的对它的认知是巨复杂的；所以第一步，在学习它之前，要打破这种观念，我们通过学习如何设计一个最基本的web容器来看它需要考虑什么；进而在真正学习Tomcat时，多把重点放在它的顶层设计上，而不是某一块代码上, 思路永远比具体实现重要的多。@pdai</p></blockquote><h2 id="写在前面" tabindex="-1">写在前面 <a class="header-anchor" href="#写在前面" aria-label="Permalink to &quot;写在前面&quot;">​</a></h2><p>我们在学习一项技术时，需要学习是它的知识体系，而不是碎片化的知识点。在构建知识体系时，我们往往需要先全局的看完一个教程或者一本书，这是构建的基础。这里我推荐大家看两本书：</p><p><img src="'+l+'" alt="error.图片加载失败"></p><p>特别是第一本：经典的《How Tomcat Works》的中文版，它从0基础逐步构建出Tomcat，适合新手；本节中很多内容源自这本书。</p><p>本系列在本之后，将转为直接分析Tomcat框架。</p><h2 id="基础认知-如何实现服务器和客户端-浏览器-的交互" tabindex="-1">基础认知：如何实现服务器和客户端（浏览器）的交互 <a class="header-anchor" href="#基础认知-如何实现服务器和客户端-浏览器-的交互" aria-label="Permalink to &quot;基础认知：如何实现服务器和客户端（浏览器）的交互&quot;">​</a></h2><blockquote><p>客户端和服务器端之间的交互式通过Socket来实现的，它属于应用层的协议。</p></blockquote><h3 id="http协议" tabindex="-1">HTTP协议 <a class="header-anchor" href="#http协议" aria-label="Permalink to &quot;HTTP协议&quot;">​</a></h3><p>http协议相关的内容可以参看这里：<a href="https://pdai.tech/md/develop/protocol/dev-protocol-http.html" target="_blank" rel="noreferrer">网络协议 - HTTP 协议详解</a></p><h3 id="socket" tabindex="-1">Socket <a class="header-anchor" href="#socket" aria-label="Permalink to &quot;Socket&quot;">​</a></h3><p>Socket是网络连接的一个端点。套接字使得一个应用可以从网络中读取和写入数据。放在两 个不同计算机上的两个应用可以通过连接发送和接受字节流。为了从你的应用发送一条信息到另 一个应用，你需要知道另一个应用的 IP 地址和套接字端口。在 Java 里边，套接字指的是<code>java.net.Socket</code>类。</p><p>要创建一个套接字，你可以使用 Socket 类众多构造方法中的一个。其中一个接收主机名称 和端口号:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Socket (java.lang.String host, int port)</span></span></code></pre></div><p>在这里主机是指远程机器名称或者 IP 地址，端口是指远程应用的端口号。例如，要连接 yahoo.com 的 80 端口，你需要构造以下的 Socket 对象:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>new Socket (&quot;yahoo.com&quot;, 80);</span></span></code></pre></div><p>一旦你成功创建了一个 Socket 类的实例，你可以使用它来发送和接受字节流。要发送字节 流，你首先必须调用Socket类的getOutputStream方法来获取一个<code>java.io.OutputStream</code>对象。 要 发 送 文 本 到 一 个 远 程 应 用 ， 你 经 常 要 从 返 回 的 OutputStream 对 象 中 构 造 一 个 <code>java.io.PrintWriter</code> 对象。要从连接的另一端接受字节流，你可以调用 Socket 类的 getInputStream 方法用来返回一个 <code>java.io.InputStream</code> 对象。</p><p><img src="'+t+'" alt="error.图片加载失败"></p><h3 id="seversocket" tabindex="-1">SeverSocket <a class="header-anchor" href="#seversocket" aria-label="Permalink to &quot;SeverSocket&quot;">​</a></h3><p>Socket 类代表一个<strong>客户端套接字</strong>，即任何时候你想连接到一个远程服务器应用的时候你构造的套接字，现在，假如你想实施一个服务器应用，例如一个 HTTP 服务器或者 FTP 服务器，你需要一种不同的做法。这是因为你的服务器必须随时待命，因为它不知道一个客户端应用什么时候会尝试去连接它。为了让你的应用能随时待命，你需要使用 <code>java.net.ServerSocket</code> 类。这是 <strong>服务器套接字</strong>的实现。</p><p><code>ServerSocket</code> 和 <code>Socket</code> 不同，服务器套接字的角色是等待来自客户端的连接请求。<strong>一旦服务器套接字获得一个连接请求，它创建一个 Socket 实例来与客户端进行通信</strong>。</p><p>要创建一个服务器套接字，你需要使用 ServerSocket 类提供的四个构造方法中的一个。你 需要指定 IP 地址和服务器套接字将要进行监听的端口号。通常，IP 地址将会是 127.0.0.1，也 就是说，服务器套接字将会监听本地机器。服务器套接字正在监听的 IP 地址被称为是绑定地址。 服务器套接字的另一个重要的属性是 backlog，这是服务器套接字开始拒绝传入的请求之前，传 入的连接请求的最大队列长度。</p><p>其中一个 ServerSocket 类的构造方法如下所示:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ServerSocket(int port, int backLog, InetAddress bindingAddress);</span></span></code></pre></div><h2 id="一个简单web容器的设计和实现-对静态资源" tabindex="-1">一个简单web容器的设计和实现：对静态资源 <a class="header-anchor" href="#一个简单web容器的设计和实现-对静态资源" aria-label="Permalink to &quot;一个简单web容器的设计和实现：对静态资源&quot;">​</a></h2><blockquote><p>准备，这个例子来源于《How Tomcat Works》, 可以从这里下载源码</p></blockquote><p>注意：当你跑如下程序时，可能会由于浏览器新版本不再支持的HTTP 0.9协议，而造成浏览器页面没有返回信息。</p><h3 id="组件设计" tabindex="-1">组件设计 <a class="header-anchor" href="#组件设计" aria-label="Permalink to &quot;组件设计&quot;">​</a></h3><p>根据上述的基础，我们可以看到，我们只需要提供三个最基本的类，分别是：</p><ul><li><strong>Request</strong> - 表示请求，这里表示浏览器发起的HTTP请求</li><li><strong>HttpServer</strong> - 表示处理请求的服务器，同时这里使用我们上面铺垫的ServerSocket</li><li><strong>Reponse</strong> - 表示处理请求后的响应， 这里表示服务器对HTTP请求的响应结果</li></ul><p><img src="'+i+`" alt="error.图片加载失败"></p><h3 id="组件实现" tabindex="-1">组件实现 <a class="header-anchor" href="#组件实现" aria-label="Permalink to &quot;组件实现&quot;">​</a></h3><p>从上图中我们可以看到，组织这几个类的入口在Server的启动方法中，即main方法中, 所以我们透过main方法从Server类进行分析：</p><ul><li>Server是如何启动的？</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HttpServer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 存放静态资源的位置</span></span>
<span class="line"><span>  public static final String WEB_ROOT =</span></span>
<span class="line"><span>    System.getProperty(&quot;user.dir&quot;) + File.separator  + &quot;webroot&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 关闭Server的请求</span></span>
<span class="line"><span>  private static final String SHUTDOWN_COMMAND = &quot;/SHUTDOWN&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 是否关闭Server</span></span>
<span class="line"><span>  private boolean shutdown = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 主入口</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    HttpServer server = new HttpServer();</span></span>
<span class="line"><span>    server.await();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void await() {</span></span>
<span class="line"><span>    // 启动ServerSocket</span></span>
<span class="line"><span>    ServerSocket serverSocket = null;</span></span>
<span class="line"><span>    int port = 8080;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      serverSocket =  new ServerSocket(port, 1, InetAddress.getByName(&quot;127.0.0.1&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (IOException e) {</span></span>
<span class="line"><span>      e.printStackTrace();</span></span>
<span class="line"><span>      System.exit(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 循环等待一个Request请求</span></span>
<span class="line"><span>    while (!shutdown) {</span></span>
<span class="line"><span>      Socket socket = null;</span></span>
<span class="line"><span>      InputStream input = null;</span></span>
<span class="line"><span>      OutputStream output = null;</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        // 创建socket</span></span>
<span class="line"><span>        socket = serverSocket.accept();</span></span>
<span class="line"><span>        input = socket.getInputStream();</span></span>
<span class="line"><span>        output = socket.getOutputStream();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 封装input至request, 并处理请求</span></span>
<span class="line"><span>        Request request = new Request(input);</span></span>
<span class="line"><span>        request.parse();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 封装output至response</span></span>
<span class="line"><span>        Response response = new Response(output);</span></span>
<span class="line"><span>        response.setRequest(request);</span></span>
<span class="line"><span>        response.sendStaticResource();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 关闭socket</span></span>
<span class="line"><span>        socket.close();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 如果接受的是关闭请求，则设置关闭监听request的标志</span></span>
<span class="line"><span>        shutdown = request.getUri().equals(SHUTDOWN_COMMAND);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>        continue;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Request请求是如何封装和处理的？</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Request {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private InputStream input;</span></span>
<span class="line"><span>  private String uri;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 初始化Request</span></span>
<span class="line"><span>  public Request(InputStream input) {</span></span>
<span class="line"><span>    this.input = input;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 处理request的方法</span></span>
<span class="line"><span>  public void parse() {</span></span>
<span class="line"><span>    // 从socket中读取字符</span></span>
<span class="line"><span>    StringBuffer request = new StringBuffer(2048);</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    byte[] buffer = new byte[2048];</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      i = input.read(buffer);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (IOException e) {</span></span>
<span class="line"><span>      e.printStackTrace();</span></span>
<span class="line"><span>      i = -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int j=0; j&lt;i; j++) {</span></span>
<span class="line"><span>      request.append((char) buffer[j]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    System.out.print(request.toString());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获得两个空格之间的内容, 这里将是HttpServer.WEB_ROOT中静态文件的文件名称</span></span>
<span class="line"><span>    uri = parseUri(request.toString());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private String parseUri(String requestString) {</span></span>
<span class="line"><span>    int index1, index2;</span></span>
<span class="line"><span>    index1 = requestString.indexOf(&#39; &#39;);</span></span>
<span class="line"><span>    if (index1 != -1) {</span></span>
<span class="line"><span>      index2 = requestString.indexOf(&#39; &#39;, index1 + 1);</span></span>
<span class="line"><span>      if (index2 &gt; index1)</span></span>
<span class="line"><span>        return requestString.substring(index1 + 1, index2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getUri() {</span></span>
<span class="line"><span>    return uri;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Response中响应了什么？</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Response {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private static final int BUFFER_SIZE = 1024;</span></span>
<span class="line"><span>  Request request;</span></span>
<span class="line"><span>  OutputStream output;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Response(OutputStream output) {</span></span>
<span class="line"><span>    this.output = output;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // response中封装了request，以便获取request中的请求参数</span></span>
<span class="line"><span>  public void setRequest(Request request) {</span></span>
<span class="line"><span>    this.request = request;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void sendStaticResource() throws IOException {</span></span>
<span class="line"><span>    byte[] bytes = new byte[BUFFER_SIZE];</span></span>
<span class="line"><span>    FileInputStream fis = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      // 读取文件内容</span></span>
<span class="line"><span>      File file = new File(HttpServer.WEB_ROOT, request.getUri());</span></span>
<span class="line"><span>      if (file.exists()) {</span></span>
<span class="line"><span>        fis = new FileInputStream(file);</span></span>
<span class="line"><span>        int ch = fis.read(bytes, 0, BUFFER_SIZE);</span></span>
<span class="line"><span>        while (ch!=-1) {</span></span>
<span class="line"><span>          output.write(bytes, 0, ch);</span></span>
<span class="line"><span>          ch = fis.read(bytes, 0, BUFFER_SIZE);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>        // 文件不存在时，输出404信息</span></span>
<span class="line"><span>        String errorMessage = &quot;HTTP/1.1 404 File Not Found\\r\\n&quot; +</span></span>
<span class="line"><span>          &quot;Content-Type: text/html\\r\\n&quot; +</span></span>
<span class="line"><span>          &quot;Content-Length: 23\\r\\n&quot; +</span></span>
<span class="line"><span>          &quot;\\r\\n&quot; +</span></span>
<span class="line"><span>          &quot;&lt;h1&gt;File Not Found&lt;/h1&gt;&quot;;</span></span>
<span class="line"><span>        output.write(errorMessage.getBytes());</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (Exception e) {</span></span>
<span class="line"><span>      // thrown if cannot instantiate a File object</span></span>
<span class="line"><span>      System.out.println(e.toString() );</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    finally {</span></span>
<span class="line"><span>      if (fis!=null)</span></span>
<span class="line"><span>        fis.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>启动输出</li></ul><p>当我们run上面HttpServer中的main方法之后，我们就可以打开浏览器<a href="http://localhost:8080" target="_blank" rel="noreferrer">http://localhost:8080</a>, 后面添加参数看返回webroot目录中静态文件的内容了(比如这里我加了hello.txt文件到webroot下，并访问<a href="http://localhost:8080/hello.txt" target="_blank" rel="noreferrer">http://localhost:8080/hello.txt</a>)。</p><p><img src="`+c+'" alt="error.图片加载失败"></p><p><img src="'+r+'" alt="error.图片加载失败"></p><h2 id="一个简单web容器的设计和实现-对servelet" tabindex="-1">一个简单web容器的设计和实现：对Servelet <a class="header-anchor" href="#一个简单web容器的设计和实现-对servelet" aria-label="Permalink to &quot;一个简单web容器的设计和实现：对Servelet&quot;">​</a></h2><p>上面这个例子是不是很简单？是否打破了对一个简单http服务器的认知，减少了对它的恐惧。</p><p>但是上述的例子中只处理了静态资源，我们如果要处理Servlet呢？</p><h3 id="组件设计-1" tabindex="-1">组件设计 <a class="header-anchor" href="#组件设计-1" aria-label="Permalink to &quot;组件设计&quot;">​</a></h3><p>不难发现，我们只需要在HttpServer只需要请求的处理委托给ServletProcessor, 让它接受请求，并处理Response即可。</p><p><img src="'+o+`" alt="error.图片加载失败"></p><h3 id="组件实现-1" tabindex="-1">组件实现 <a class="header-anchor" href="#组件实现-1" aria-label="Permalink to &quot;组件实现&quot;">​</a></h3><ul><li>在HttpServer中</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void await() {</span></span>
<span class="line"><span>    //....</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // create Response object</span></span>
<span class="line"><span>        Response response = new Response(output);</span></span>
<span class="line"><span>        response.setRequest(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 不再有response自己处理</span></span>
<span class="line"><span>        //response.sendStaticResource();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 而是如果以/servlet/开头，则委托ServletProcessor处理</span></span>
<span class="line"><span>        if (request.getUri().startsWith(&quot;/servlet/&quot;)) {</span></span>
<span class="line"><span>          ServletProcessor1 processor = new ServletProcessor1();</span></span>
<span class="line"><span>          processor.process(request, response);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          // 原有的静态资源处理</span></span>
<span class="line"><span>          StaticResourceProcessor processor = new StaticResourceProcessor();</span></span>
<span class="line"><span>          processor.process(request, response);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ....</span></span>
<span class="line"><span>  }</span></span></code></pre></div><ul><li>ServletProcessor 如何处理的？</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ServletProcessor1 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void process(Request request, Response response) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取servlet名字</span></span>
<span class="line"><span>    String uri = request.getUri();</span></span>
<span class="line"><span>    String servletName = uri.substring(uri.lastIndexOf(&quot;/&quot;) + 1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 初始化URLClassLoader</span></span>
<span class="line"><span>    URLClassLoader loader = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      // create a URLClassLoader</span></span>
<span class="line"><span>      URL[] urls = new URL[1];</span></span>
<span class="line"><span>      URLStreamHandler streamHandler = null;</span></span>
<span class="line"><span>      File classPath = new File(Constants.WEB_ROOT);</span></span>
<span class="line"><span>      // the forming of repository is taken from the createClassLoader method in</span></span>
<span class="line"><span>      // org.apache.catalina.startup.ClassLoaderFactory</span></span>
<span class="line"><span>      String repository = (new URL(&quot;file&quot;, null, classPath.getCanonicalPath() + File.separator)).toString() ;</span></span>
<span class="line"><span>      // the code for forming the URL is taken from the addRepository method in</span></span>
<span class="line"><span>      // org.apache.catalina.loader.StandardClassLoader class.</span></span>
<span class="line"><span>      urls[0] = new URL(null, repository, streamHandler);</span></span>
<span class="line"><span>      loader = new URLClassLoader(urls);</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>      System.out.println(e.toString() );</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 用classLoader加载上面的servlet</span></span>
<span class="line"><span>    Class myClass = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      myClass = loader.loadClass(servletName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>      System.out.println(e.toString());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将加载到的class转成Servlet，并调用service方法处理</span></span>
<span class="line"><span>    Servlet servlet = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      servlet = (Servlet) myClass.newInstance();</span></span>
<span class="line"><span>      servlet.service((ServletRequest) request, (ServletResponse) response);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>      System.out.println(e.toString());</span></span>
<span class="line"><span>    } catch (Throwable e) {</span></span>
<span class="line"><span>      System.out.println(e.toString());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Repsonse</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class PrimitiveServlet implements Servlet {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void init(ServletConfig config) throws ServletException {</span></span>
<span class="line"><span>    System.out.println(&quot;init&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void service(ServletRequest request, ServletResponse response)</span></span>
<span class="line"><span>    throws ServletException, IOException {</span></span>
<span class="line"><span>    System.out.println(&quot;from service&quot;);</span></span>
<span class="line"><span>    PrintWriter out = response.getWriter();</span></span>
<span class="line"><span>    out.println(&quot;Hello. Roses are red.&quot;);</span></span>
<span class="line"><span>    out.print(&quot;Violets are blue.&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void destroy() {</span></span>
<span class="line"><span>    System.out.println(&quot;destroy&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getServletInfo() {</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public ServletConfig getServletConfig() {</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>访问 URL</li></ul><p><img src="`+u+`" alt="error.图片加载失败"></p><h3 id="利用外观模式改造" tabindex="-1">利用外观模式改造 <a class="header-anchor" href="#利用外观模式改造" aria-label="Permalink to &quot;利用外观模式改造&quot;">​</a></h3><p>上述代码存在一个问题，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 将加载到的class转成Servlet，并调用service方法处理</span></span>
<span class="line"><span>    Servlet servlet = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      servlet = (Servlet) myClass.newInstance();</span></span>
<span class="line"><span>      servlet.service((ServletRequest) request, (ServletResponse) response);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>      System.out.println(e.toString());</span></span>
<span class="line"><span>    } catch (Throwable e) {</span></span>
<span class="line"><span>      System.out.println(e.toString());</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>这里直接处理将request和response传给servlet处理是不安全的，因为request可以向下转型为Request类，从而ServeletRequest便具备了访问Request中方法的能力。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Request implements ServletRequest {</span></span>
<span class="line"><span>  // 一些public方法</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class Response implements ServletResponse {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>解决的方法便是通过外观模式进行改造：</p><p><img src="`+d+`" alt="error.图片加载失败"></p><ul><li>RequestFacade为例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RequestFacade implements ServletRequest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private ServletRequest request = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public RequestFacade(Request request) {</span></span>
<span class="line"><span>    this.request = request;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  /* implementation of the ServletRequest*/</span></span>
<span class="line"><span>  public Object getAttribute(String attribute) {</span></span>
<span class="line"><span>    return request.getAttribute(attribute);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Enumeration getAttributeNames() {</span></span>
<span class="line"><span>    return request.getAttributeNames();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getRealPath(String path) {</span></span>
<span class="line"><span>    return request.getRealPath(path);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span></code></pre></div><ul><li>Process中由传入外观类</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Servlet servlet = null;</span></span>
<span class="line"><span>RequestFacade requestFacade = new RequestFacade(request); // 转换成外观类</span></span>
<span class="line"><span>ResponseFacade responseFacade = new ResponseFacade(response);// 转换成外观类</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  servlet = (Servlet) myClass.newInstance();</span></span>
<span class="line"><span>  servlet.service((ServletRequest) requestFacade, (ServletResponse) responseFacade);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch (Exception e) {</span></span>
<span class="line"><span>  System.out.println(e.toString());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch (Throwable e) {</span></span>
<span class="line"><span>  System.out.println(e.toString());</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>当我们看到这么一个简单的web容器实现之后，我们便不再觉得Tomcat高高在上；这将为我们继续分析Tomcat中核心源码提供基础。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,73)]))}const R=n(h,[["render",g]]);export{f as __pageData,R as default};
