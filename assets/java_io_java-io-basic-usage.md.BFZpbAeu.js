import{_ as s,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/pics/ClienteServidorSockets1521731145260.jpg",b=JSON.parse('{"title":"Java IO - 常见类使用","description":"","frontmatter":{},"headers":[],"relativePath":"java/io/java-io-basic-usage.md","filePath":"java/io/java-io-basic-usage.md","lastUpdated":1737706346000}'),i={name:"java/io/java-io-basic-usage.md"};function t(r,a,c,o,d,u){return p(),n("div",null,a[0]||(a[0]=[e(`<h1 id="java-io-常见类使用" tabindex="-1">Java IO - 常见类使用 <a class="header-anchor" href="#java-io-常见类使用" aria-label="Permalink to &quot;Java IO - 常见类使用&quot;">​</a></h1><blockquote><p>本文主要介绍Java IO常见类的使用，包括：磁盘操作，字节操作，字符操作，对象操作和网络操作。 @pdai</p></blockquote><h2 id="io常见类的使用" tabindex="-1">IO常见类的使用 <a class="header-anchor" href="#io常见类的使用" aria-label="Permalink to &quot;IO常见类的使用&quot;">​</a></h2><p>Java 的 I/O 大概可以分成以下几类:</p><ul><li>磁盘操作: File</li><li>字节操作: InputStream 和 OutputStream</li><li>字符操作: Reader 和 Writer</li><li>对象操作: Serializable</li><li>网络操作: Socket</li></ul><h3 id="file相关" tabindex="-1">File相关 <a class="header-anchor" href="#file相关" aria-label="Permalink to &quot;File相关&quot;">​</a></h3><p>File 类可以用于表示文件和目录的信息，但是它不表示文件的内容。</p><p>递归地列出一个目录下所有文件:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void listAllFiles(File dir) {</span></span>
<span class="line"><span>    if (dir == null || !dir.exists()) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (dir.isFile()) {</span></span>
<span class="line"><span>        System.out.println(dir.getName());</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (File file : dir.listFiles()) {</span></span>
<span class="line"><span>        listAllFiles(file);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="字节流相关" tabindex="-1">字节流相关 <a class="header-anchor" href="#字节流相关" aria-label="Permalink to &quot;字节流相关&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void copyFile(String src, String dist) throws IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    FileInputStream in = new FileInputStream(src);</span></span>
<span class="line"><span>    FileOutputStream out = new FileOutputStream(dist);</span></span>
<span class="line"><span>    byte[] buffer = new byte[20 * 1024];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // read() 最多读取 buffer.length 个字节</span></span>
<span class="line"><span>    // 返回的是实际读取的个数</span></span>
<span class="line"><span>    // 返回 -1 的时候表示读到 eof，即文件尾</span></span>
<span class="line"><span>    while (in.read(buffer, 0, buffer.length) != -1) {</span></span>
<span class="line"><span>        out.write(buffer);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    in.close();</span></span>
<span class="line"><span>    out.close();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="实现逐行输出文本文件的内容" tabindex="-1">实现逐行输出文本文件的内容 <a class="header-anchor" href="#实现逐行输出文本文件的内容" aria-label="Permalink to &quot;实现逐行输出文本文件的内容&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void readFileContent(String filePath) throws IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    FileReader fileReader = new FileReader(filePath);</span></span>
<span class="line"><span>    BufferedReader bufferedReader = new BufferedReader(fileReader);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String line;</span></span>
<span class="line"><span>    while ((line = bufferedReader.readLine()) != null) {</span></span>
<span class="line"><span>        System.out.println(line);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 装饰者模式使得 BufferedReader 组合了一个 Reader 对象</span></span>
<span class="line"><span>    // 在调用 BufferedReader 的 close() 方法时会去调用 Reader 的 close() 方法</span></span>
<span class="line"><span>    // 因此只要一个 close() 调用即可</span></span>
<span class="line"><span>    bufferedReader.close();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="序列化-serializable-transient" tabindex="-1">序列化 &amp; Serializable &amp; transient <a class="header-anchor" href="#序列化-serializable-transient" aria-label="Permalink to &quot;序列化 &amp; Serializable &amp; transient&quot;">​</a></h3><p>序列化就是将一个对象转换成字节序列，方便存储和传输。</p><ul><li>序列化: ObjectOutputStream.writeObject()</li><li>反序列化: ObjectInputStream.readObject()</li></ul><p>不会对静态变量进行序列化，因为序列化只是保存对象的状态，静态变量属于类的状态。</p><p><strong>Serializable</strong></p><p>序列化的类需要实现 Serializable 接口，它只是一个标准，没有任何方法需要实现，但是如果不去实现它的话而进行序列化，会抛出异常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws IOException, ClassNotFoundException {</span></span>
<span class="line"><span>    A a1 = new A(123, &quot;abc&quot;);</span></span>
<span class="line"><span>    String objectFile = &quot;file/a1&quot;;</span></span>
<span class="line"><span>    ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream(objectFile));</span></span>
<span class="line"><span>    objectOutputStream.writeObject(a1);</span></span>
<span class="line"><span>    objectOutputStream.close();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(objectFile));</span></span>
<span class="line"><span>    A a2 = (A) objectInputStream.readObject();</span></span>
<span class="line"><span>    objectInputStream.close();</span></span>
<span class="line"><span>    System.out.println(a2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static class A implements Serializable {</span></span>
<span class="line"><span>    private int x;</span></span>
<span class="line"><span>    private String y;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    A(int x, String y) {</span></span>
<span class="line"><span>        this.x = x;</span></span>
<span class="line"><span>        this.y = y;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return &quot;x = &quot; + x + &quot;  &quot; + &quot;y = &quot; + y;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>transient</strong></p><p>transient 关键字可以使一些属性不会被序列化。</p><p>ArrayList 中存储数据的数组 elementData 是用 transient 修饰的，因为这个数组是动态扩展的，并不是所有的空间都被使用，因此就不需要所有的内容都被序列化。通过重写序列化和反序列化方法，使得可以只序列化数组中有内容的那部分数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private transient Object[] elementData;</span></span></code></pre></div><h3 id="java-中的网络支持" tabindex="-1">Java 中的网络支持: <a class="header-anchor" href="#java-中的网络支持" aria-label="Permalink to &quot;Java 中的网络支持:&quot;">​</a></h3><ul><li>InetAddress: 用于表示网络上的硬件资源，即 IP 地址；</li><li>URL: 统一资源定位符；</li><li>Sockets: 使用 TCP 协议实现网络通信；</li><li>Datagram: 使用 UDP 协议实现网络通信。</li></ul><h4 id="inetaddress" tabindex="-1">InetAddress <a class="header-anchor" href="#inetaddress" aria-label="Permalink to &quot;InetAddress&quot;">​</a></h4><p>没有公有的构造函数，只能通过静态方法来创建实例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>InetAddress.getByName(String host);</span></span>
<span class="line"><span>InetAddress.getByAddress(byte[] address);</span></span></code></pre></div><h4 id="url" tabindex="-1">URL <a class="header-anchor" href="#url" aria-label="Permalink to &quot;URL&quot;">​</a></h4><p>可以直接从 URL 中读取字节流数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    URL url = new URL(&quot;http://www.baidu.com&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 字节流 */</span></span>
<span class="line"><span>    InputStream is = url.openStream();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 字符流 */</span></span>
<span class="line"><span>    InputStreamReader isr = new InputStreamReader(is, &quot;utf-8&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 提供缓存功能 */</span></span>
<span class="line"><span>    BufferedReader br = new BufferedReader(isr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String line;</span></span>
<span class="line"><span>    while ((line = br.readLine()) != null) {</span></span>
<span class="line"><span>        System.out.println(line);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    br.close();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="sockets" tabindex="-1">Sockets <a class="header-anchor" href="#sockets" aria-label="Permalink to &quot;Sockets&quot;">​</a></h4><ul><li>ServerSocket: 服务器端类</li><li>Socket: 客户端类</li><li>服务器和客户端通过 InputStream 和 OutputStream 进行输入输出。</li></ul><p><img src="`+l+'" alt="image"></p><h4 id="datagram" tabindex="-1">Datagram <a class="header-anchor" href="#datagram" aria-label="Permalink to &quot;Datagram&quot;">​</a></h4><ul><li>DatagramSocket: 通信类</li><li>DatagramPacket: 数据包类</li></ul><h2 id="常见问题" tabindex="-1">常见问题 <a class="header-anchor" href="#常见问题" aria-label="Permalink to &quot;常见问题&quot;">​</a></h2><ul><li>Java 字节读取流的read方法返回int的原因</li></ul><p><a href="https://blog.csdn.net/congwiny/article/details/18922847" target="_blank" rel="noreferrer">https://blog.csdn.net/congwiny/article/details/18922847</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',42)]))}const m=s(i,[["render",t]]);export{b as __pageData,m as default};
