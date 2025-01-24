import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/io/io-outputstream-1.png",h=JSON.parse('{"title":"Java IO - 源码: OutputStream","description":"","frontmatter":{},"headers":[],"relativePath":"java/io/java-io-basic-code-outputstream.md","filePath":"java/io/java-io-basic-code-outputstream.md","lastUpdated":1737706346000}'),i={name:"java/io/java-io-basic-code-outputstream.md"};function t(c,n,o,r,u,b){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="java-io-源码-outputstream" tabindex="-1">Java IO - 源码: OutputStream <a class="header-anchor" href="#java-io-源码-outputstream" aria-label="Permalink to &quot;Java IO - 源码: OutputStream&quot;">​</a></h1><blockquote><p>本文主要从JDK 11源码角度分析 OutputStream。 @pdai</p></blockquote><h2 id="outputstream-类实现关系" tabindex="-1">OutputStream 类实现关系 <a class="header-anchor" href="#outputstream-类实现关系" aria-label="Permalink to &quot;OutputStream 类实现关系&quot;">​</a></h2><blockquote><p>OutputStream是输出字节流，具体的实现类层次结构如下：</p></blockquote><p><img src="'+l+`" alt="error.图片加载失败"></p><h2 id="outputstream-抽象类" tabindex="-1">OutputStream 抽象类 <a class="header-anchor" href="#outputstream-抽象类" aria-label="Permalink to &quot;OutputStream 抽象类&quot;">​</a></h2><p>OutputStream 类重要方法设计如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 写入一个字节，可以看到这里的参数是一个 int 类型，对应上面的读方法，int 类型的 32 位，只有低 8 位才写入，高 24 位将舍弃。</span></span>
<span class="line"><span>public abstract void write(int b)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将数组中的所有字节写入，实际调用的是write(byte b[], int off, int len)方法。</span></span>
<span class="line"><span>public void write(byte b[])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将 byte 数组从 off 位置开始，len 长度的字节写入</span></span>
<span class="line"><span>public void write(byte b[], int off, int len)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 强制刷新，将缓冲中的数据写入; 默认是空实现，供子类覆盖</span></span>
<span class="line"><span>public void flush()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 关闭输出流，流被关闭后就不能再输出数据了; 默认是空实现，供子类覆盖</span></span>
<span class="line"><span>public void close()</span></span></code></pre></div><h2 id="源码实现" tabindex="-1">源码实现 <a class="header-anchor" href="#源码实现" aria-label="Permalink to &quot;源码实现&quot;">​</a></h2><blockquote><p>梳理部分OutputStream及其实现类的源码分析。</p></blockquote><h3 id="outputstream" tabindex="-1">OutputStream <a class="header-anchor" href="#outputstream" aria-label="Permalink to &quot;OutputStream&quot;">​</a></h3><p>OutputStream抽象类源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class OutputStream implements Closeable, Flushable {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // JDK11中增加了一个nullOutputStream，即空模式实现，以便可以直接调用而不用判空（可以看如下的补充说明）</span></span>
<span class="line"><span>    public static OutputStream nullOutputStream() {</span></span>
<span class="line"><span>        return new OutputStream() {</span></span>
<span class="line"><span>            private volatile boolean closed;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            private void ensureOpen() throws IOException {</span></span>
<span class="line"><span>                if (closed) {</span></span>
<span class="line"><span>                    throw new IOException(&quot;Stream closed&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void write(int b) throws IOException {</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void write(byte b[], int off, int len) throws IOException {</span></span>
<span class="line"><span>                Objects.checkFromIndexSize(off, len, b.length);</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void close() {</span></span>
<span class="line"><span>                closed = true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 写入一个字节，可以看到这里的参数是一个 int 类型，对应上面的读方法，int 类型的 32 位，只有低 8 位才写入，高 24 位将舍弃。</span></span>
<span class="line"><span>    public abstract void write(int b) throws IOException;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将数组中的所有字节写入，实际调用的是write(byte b[], int off, int len)方法</span></span>
<span class="line"><span>    public void write(byte b[]) throws IOException {</span></span>
<span class="line"><span>        write(b, 0, b.length);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将 byte 数组从 off 位置开始，len 长度的字节写入</span></span>
<span class="line"><span>    public void write(byte b[], int off, int len) throws IOException {</span></span>
<span class="line"><span>        // 检查边界合理性</span></span>
<span class="line"><span>        Objects.checkFromIndexSize(off, len, b.length);</span></span>
<span class="line"><span>        // len == 0 的情况已经在如下的for循环中隐式处理了</span></span>
<span class="line"><span>        for (int i = 0 ; i &lt; len ; i++) {</span></span>
<span class="line"><span>            write(b[off + i]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 强制刷新，将缓冲中的数据写入; 默认是空实现，供子类覆盖</span></span>
<span class="line"><span>    public void flush() throws IOException {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 关闭输出流，流被关闭后就不能再输出数据了; 默认是空实现，供子类覆盖</span></span>
<span class="line"><span>    public void close() throws IOException {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>补充下JDK11为什么会增加nullOutputStream方法的设计？即空对象模式</p></blockquote><ul><li><strong>空对象模式</strong></li></ul><p>举个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyParser implements Parser {</span></span>
<span class="line"><span>  private static Action NO_ACTION = new Action() {</span></span>
<span class="line"><span>    public void doSomething() { /* do nothing */ }</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Action findAction(String userInput) {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>    if ( /* we can&#39;t find any actions */ ) {</span></span>
<span class="line"><span>      return NO_ACTION;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后便<strong>可以始终可以这么调用，而不用再判断空了</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ParserFactory.getParser().findAction(someInput).doSomething();</span></span></code></pre></div><h3 id="filteroutputstream" tabindex="-1">FilterOutputStream <a class="header-anchor" href="#filteroutputstream" aria-label="Permalink to &quot;FilterOutputStream&quot;">​</a></h3><p>FilterOutputStream 源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FilterOutputStream extends OutputStream {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 被装饰的实际outputStream</span></span>
<span class="line"><span>    protected OutputStream out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 当前stream是否已经被close</span></span>
<span class="line"><span>    private volatile boolean closed;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // close stream时加锁，防止其它线程同时close</span></span>
<span class="line"><span>    private final Object closeLock = new Object();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 初始化构造函数，传入被装饰的实际outputStream</span></span>
<span class="line"><span>    public FilterOutputStream(OutputStream out) {</span></span>
<span class="line"><span>        this.out = out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 写入数据，本质调用被装饰outputStream的方法</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void write(int b) throws IOException {</span></span>
<span class="line"><span>        out.write(b);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将数组中的所有字节写入</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void write(byte b[]) throws IOException {</span></span>
<span class="line"><span>        write(b, 0, b.length);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 一个个写入</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void write(byte b[], int off, int len) throws IOException {</span></span>
<span class="line"><span>        if ((off | len | (b.length - (len + off)) | (off + len)) &lt; 0)</span></span>
<span class="line"><span>            throw new IndexOutOfBoundsException();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0 ; i &lt; len ; i++) {</span></span>
<span class="line"><span>            write(b[off + i]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     // 强制刷新，将缓冲中的数据写入; 本质调用被装饰outputStream的方法</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void flush() throws IOException {</span></span>
<span class="line"><span>        out.flush();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 关闭Stream</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void close() throws IOException {</span></span>
<span class="line"><span>        // 如果已经close, 直接退出</span></span>
<span class="line"><span>        if (closed) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 加锁处理，如果已经有线程正在closing则退出；</span></span>
<span class="line"><span>        synchronized (closeLock) {</span></span>
<span class="line"><span>            if (closed) {</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            closed = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // close前调用flush</span></span>
<span class="line"><span>        Throwable flushException = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            flush();</span></span>
<span class="line"><span>        } catch (Throwable e) {</span></span>
<span class="line"><span>            flushException = e;</span></span>
<span class="line"><span>            throw e;</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if (flushException == null) {</span></span>
<span class="line"><span>                out.close();</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    out.close();</span></span>
<span class="line"><span>                } catch (Throwable closeException) {</span></span>
<span class="line"><span>                   // evaluate possible precedence of flushException over closeException</span></span>
<span class="line"><span>                   if ((flushException instanceof ThreadDeath) &amp;&amp;</span></span>
<span class="line"><span>                       !(closeException instanceof ThreadDeath)) {</span></span>
<span class="line"><span>                       flushException.addSuppressed(closeException);</span></span>
<span class="line"><span>                       throw (ThreadDeath) flushException;</span></span>
<span class="line"><span>                   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    if (flushException != closeException) {</span></span>
<span class="line"><span>                        closeException.addSuppressed(flushException);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    throw closeException;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>@pdai: 对比下JDK8中，close方法是没有加锁处理的。这种情况下你可以看JDK8源码中，直接利用java7的try with resources方式，优雅的调用flush方法后对out进行关闭。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void close() throws IOException {</span></span>
<span class="line"><span>    try (OutputStream ostream = out) {</span></span>
<span class="line"><span>        flush();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="bytearrayoutputstream" tabindex="-1">ByteArrayOutputStream <a class="header-anchor" href="#bytearrayoutputstream" aria-label="Permalink to &quot;ByteArrayOutputStream&quot;">​</a></h3><p>ByteArrayOutputStream 源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ByteArrayOutputStream extends OutputStream {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 实际的byte数组</span></span>
<span class="line"><span>    protected byte buf[];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 数组中实际有效的byte的个数</span></span>
<span class="line"><span>    protected int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 初始化默认构造，初始化byte数组大小为32</span></span>
<span class="line"><span>    public ByteArrayOutputStream() {</span></span>
<span class="line"><span>        this(32);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 初始化byte的大小</span></span>
<span class="line"><span>    public ByteArrayOutputStream(int size) {</span></span>
<span class="line"><span>        if (size &lt; 0) {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;Negative initial size: &quot;</span></span>
<span class="line"><span>                                               + size);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        buf = new byte[size];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 扩容，确保它至少可以容纳由最小容量参数指定的元素数</span></span>
<span class="line"><span>    private void ensureCapacity(int minCapacity) {</span></span>
<span class="line"><span>        // overflow-conscious code</span></span>
<span class="line"><span>        if (minCapacity - buf.length &gt; 0)</span></span>
<span class="line"><span>            grow(minCapacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 分配的最大数组大小。</span></span>
<span class="line"><span>    // 由于一些VM在数组中保留一些头字，所以尝试分配较大的阵列可能会导致OutOfMemoryError（请求的阵列大小超过VM限制）</span></span>
<span class="line"><span>    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 扩容的实质方法，确保它至少可以容纳由最小容量参数指定的元素数</span></span>
<span class="line"><span>    private void grow(int minCapacity) {</span></span>
<span class="line"><span>        // overflow-conscious code</span></span>
<span class="line"><span>        int oldCapacity = buf.length;</span></span>
<span class="line"><span>        int newCapacity = oldCapacity &lt;&lt; 1;</span></span>
<span class="line"><span>        if (newCapacity - minCapacity &lt; 0)</span></span>
<span class="line"><span>            newCapacity = minCapacity;</span></span>
<span class="line"><span>        if (newCapacity - MAX_ARRAY_SIZE &gt; 0)</span></span>
<span class="line"><span>            newCapacity = hugeCapacity(minCapacity);</span></span>
<span class="line"><span>        buf = Arrays.copyOf(buf, newCapacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static int hugeCapacity(int minCapacity) {</span></span>
<span class="line"><span>        if (minCapacity &lt; 0) // overflow</span></span>
<span class="line"><span>            throw new OutOfMemoryError();</span></span>
<span class="line"><span>        return (minCapacity &gt; MAX_ARRAY_SIZE) ?</span></span>
<span class="line"><span>            Integer.MAX_VALUE :</span></span>
<span class="line"><span>            MAX_ARRAY_SIZE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 写入，写入前确保byte数据长度</span></span>
<span class="line"><span>    public synchronized void write(int b) {</span></span>
<span class="line"><span>        ensureCapacity(count + 1);</span></span>
<span class="line"><span>        buf[count] = (byte) b;</span></span>
<span class="line"><span>        count += 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public synchronized void write(byte b[], int off, int len) {</span></span>
<span class="line"><span>        Objects.checkFromIndexSize(off, len, b.length);</span></span>
<span class="line"><span>        ensureCapacity(count + len);</span></span>
<span class="line"><span>        System.arraycopy(b, off, buf, count, len);</span></span>
<span class="line"><span>        count += len;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void writeBytes(byte b[]) {</span></span>
<span class="line"><span>        write(b, 0, b.length);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public synchronized void writeTo(OutputStream out) throws IOException {</span></span>
<span class="line"><span>        out.write(buf, 0, count);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 重置，显然将实际有效的byte数量置为0</span></span>
<span class="line"><span>    public synchronized void reset() {</span></span>
<span class="line"><span>        count = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public synchronized byte[] toByteArray() {</span></span>
<span class="line"><span>        return Arrays.copyOf(buf, count);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 长度，即count</span></span>
<span class="line"><span>    public synchronized int size() {</span></span>
<span class="line"><span>        return count;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 转成string</span></span>
<span class="line"><span>    public synchronized String toString() {</span></span>
<span class="line"><span>        return new String(buf, 0, count);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 转成string，指定的字符集</span></span>
<span class="line"><span>    public synchronized String toString(String charsetName)</span></span>
<span class="line"><span>        throws UnsupportedEncodingException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return new String(buf, 0, count, charsetName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public synchronized String toString(Charset charset) {</span></span>
<span class="line"><span>        return new String(buf, 0, count, charset);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 弃用</span></span>
<span class="line"><span>    @Deprecated</span></span>
<span class="line"><span>    public synchronized String toString(int hibyte) {</span></span>
<span class="line"><span>        return new String(buf, hibyte, 0, count);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 对byte 数组而言，close没啥实质意义，所以空实现</span></span>
<span class="line"><span>    public void close() throws IOException {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="bufferedoutputstream" tabindex="-1">BufferedOutputStream <a class="header-anchor" href="#bufferedoutputstream" aria-label="Permalink to &quot;BufferedOutputStream&quot;">​</a></h3><p>BufferedOutputStream 源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BufferedOutputStream extends FilterOutputStream {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Buffered outputStream底层也是byte数组</span></span>
<span class="line"><span>    protected byte buf[];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 大小，buf[0]到buf[count-1]是实际存储的bytes</span></span>
<span class="line"><span>    protected int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 构造函数，被装饰的outputStream，以及默认buf大小是8192</span></span>
<span class="line"><span>    public BufferedOutputStream(OutputStream out) {</span></span>
<span class="line"><span>        this(out, 8192);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public BufferedOutputStream(OutputStream out, int size) {</span></span>
<span class="line"><span>        super(out);</span></span>
<span class="line"><span>        if (size &lt;= 0) {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;Buffer size &lt;= 0&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        buf = new byte[size];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /** Flush the internal buffer */</span></span>
<span class="line"><span>    // 内部的flush方法，将buffer中的有效bytes(count是有效的bytes大小)通过被装饰的outputStream写入</span></span>
<span class="line"><span>    private void flushBuffer() throws IOException {</span></span>
<span class="line"><span>        if (count &gt; 0) {</span></span>
<span class="line"><span>            out.write(buf, 0, count);</span></span>
<span class="line"><span>            count = 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 写入byte</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public synchronized void write(int b) throws IOException {</span></span>
<span class="line"><span>        // 当buffer满了以后，flush buffer</span></span>
<span class="line"><span>        if (count &gt;= buf.length) {</span></span>
<span class="line"><span>            flushBuffer();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        buf[count++] = (byte)b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将 byte 数组从 off 位置开始，len 长度的字节写入</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public synchronized void write(byte b[], int off, int len) throws IOException {</span></span>
<span class="line"><span>        if (len &gt;= buf.length) {</span></span>
<span class="line"><span>            // 如果请求长度已经超过输出缓冲区的大小，直接刷新输出缓冲区，然后直接写入数据。</span></span>
<span class="line"><span>            flushBuffer();</span></span>
<span class="line"><span>            out.write(b, off, len);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (len &gt; buf.length - count) {</span></span>
<span class="line"><span>            flushBuffer();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.arraycopy(b, off, buf, count, len);</span></span>
<span class="line"><span>        count += len;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // flush方法，需要先将buffer中写入，最后在调用被装饰outputStream的flush方法</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public synchronized void flush() throws IOException {</span></span>
<span class="line"><span>        flushBuffer();</span></span>
<span class="line"><span>        out.flush();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>JDK 11</li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,33)]))}const f=s(i,[["render",t]]);export{h as __pageData,f as default};
