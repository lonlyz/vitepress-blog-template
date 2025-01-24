import{_ as s,c as a,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/io/io-inputstream-1.png",d=JSON.parse('{"title":"Java IO - 源码: InputStream","description":"","frontmatter":{},"headers":[],"relativePath":"java/io/java-io-basic-code-inputstream.md","filePath":"java/io/java-io-basic-code-inputstream.md","lastUpdated":1737706346000}'),i={name:"java/io/java-io-basic-code-inputstream.md"};function t(c,n,r,o,u,f){return l(),a("div",null,n[0]||(n[0]=[p('<h1 id="java-io-源码-inputstream" tabindex="-1">Java IO - 源码: InputStream <a class="header-anchor" href="#java-io-源码-inputstream" aria-label="Permalink to &quot;Java IO - 源码: InputStream&quot;">​</a></h1><blockquote><p>本文主要从<strong>JDK 11 源码</strong>角度分析InputStream。 @pdai</p></blockquote><h2 id="inputstream-类实现关系" tabindex="-1">InputStream 类实现关系 <a class="header-anchor" href="#inputstream-类实现关系" aria-label="Permalink to &quot;InputStream 类实现关系&quot;">​</a></h2><blockquote><p>InputStream是输入字节流，具体的实现类层次结构如下：</p></blockquote><p><img src="'+e+`" alt="error.图片加载失败"></p><h2 id="inputstream-抽象类" tabindex="-1">InputStream 抽象类 <a class="header-anchor" href="#inputstream-抽象类" aria-label="Permalink to &quot;InputStream 抽象类&quot;">​</a></h2><p>InputStream 类重要方法设计如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 读取下一个字节，如果没有则返回-1</span></span>
<span class="line"><span>public abstract int read() </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将读取到的数据放在 byte 数组中，该方法实际上调用read(byte b[], int off, int len)方法</span></span>
<span class="line"><span>public int read(byte b[]) </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 从第 off 位置读取&lt;b&gt;最多(实际可能小于)&lt;/b&gt; len 长度字节的数据放到 byte 数组中，流是以 -1 来判断是否读取结束的; 此方法会一直阻止，直到输入数据可用、检测到stream结尾或引发异常为止。</span></span>
<span class="line"><span>public int read(byte b[], int off, int len) </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// JDK9新增：读取 InputStream 中的所有剩余字节，调用readNBytes(Integer.MAX_VALUE)方法</span></span>
<span class="line"><span>public byte[] readAllBytes()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// JDK11更新：读取 InputStream 中的剩余字节的指定上限大小的字节内容；此方法会一直阻塞，直到读取了请求的字节数、检测到流结束或引发异常为止。此方法不会关闭输入流。</span></span>
<span class="line"><span>public byte[] readNBytes(int len)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// JDK9新增：从输入流读取请求的字节数并保存在byte数组中； 此方法会一直阻塞，直到读取了请求的字节数、检测到流结束或引发异常为止。此方法不会关闭输入流。</span></span>
<span class="line"><span>public int readNBytes(byte[] b, int off, int len)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 跳过指定个数的字节不读取</span></span>
<span class="line"><span>public long skip(long n) </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 返回可读的字节数量</span></span>
<span class="line"><span>public int available() </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 读取完，关闭流，释放资源</span></span>
<span class="line"><span>public void close() </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 标记读取位置，下次还可以从这里开始读取，使用前要看当前流是否支持，可以使用 markSupport() 方法判断</span></span>
<span class="line"><span>public synchronized void mark(int readlimit) </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 重置读取位置为上次 mark 标记的位置</span></span>
<span class="line"><span>public synchronized void reset() </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 判断当前流是否支持标记流，和上面两个方法配套使用</span></span>
<span class="line"><span>public boolean markSupported() </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// JDK9新增：读取 InputStream 中的全部字节并写入到指定的 OutputStream 中</span></span>
<span class="line"><span>public long transferTo(OutputStream out)</span></span></code></pre></div><h2 id="源码实现" tabindex="-1">源码实现 <a class="header-anchor" href="#源码实现" aria-label="Permalink to &quot;源码实现&quot;">​</a></h2><blockquote><p>梳理部分InputStream及其实现类的源码分析。</p></blockquote><h3 id="inputstream" tabindex="-1">InputStream <a class="header-anchor" href="#inputstream" aria-label="Permalink to &quot;InputStream&quot;">​</a></h3><p>InputStream抽象类源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class InputStream implements Closeable {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 当使用skip方法时，最大的buffer size大小</span></span>
<span class="line"><span>    private static final int MAX_SKIP_BUFFER_SIZE = 2048;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 默认的buffer size</span></span>
<span class="line"><span>    private static final int DEFAULT_BUFFER_SIZE = 8192;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // JDK11中增加了一个nullInputStream，即空模式实现，以便可以直接调用而不用判空（可以看如下的补充说明）</span></span>
<span class="line"><span>    public static InputStream nullInputStream() {</span></span>
<span class="line"><span>        return new InputStream() {</span></span>
<span class="line"><span>            private volatile boolean closed;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            private void ensureOpen() throws IOException {</span></span>
<span class="line"><span>                if (closed) {</span></span>
<span class="line"><span>                    throw new IOException(&quot;Stream closed&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public int available () throws IOException {</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>                return 0;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public int read() throws IOException {</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>                return -1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public int read(byte[] b, int off, int len) throws IOException {</span></span>
<span class="line"><span>                Objects.checkFromIndexSize(off, len, b.length);</span></span>
<span class="line"><span>                if (len == 0) {</span></span>
<span class="line"><span>                    return 0;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>                return -1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public byte[] readAllBytes() throws IOException {</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>                return new byte[0];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public int readNBytes(byte[] b, int off, int len)</span></span>
<span class="line"><span>                throws IOException {</span></span>
<span class="line"><span>                Objects.checkFromIndexSize(off, len, b.length);</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>                return 0;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public byte[] readNBytes(int len) throws IOException {</span></span>
<span class="line"><span>                if (len &lt; 0) {</span></span>
<span class="line"><span>                    throw new IllegalArgumentException(&quot;len &lt; 0&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>                return new byte[0];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public long skip(long n) throws IOException {</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>                return 0L;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public long transferTo(OutputStream out) throws IOException {</span></span>
<span class="line"><span>                Objects.requireNonNull(out);</span></span>
<span class="line"><span>                ensureOpen();</span></span>
<span class="line"><span>                return 0L;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void close() throws IOException {</span></span>
<span class="line"><span>                closed = true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 读取下一个字节的数据，如果没有则返回-1</span></span>
<span class="line"><span>    public abstract int read() throws IOException;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将读取到的数据放在 byte 数组中，该方法实际上调用read(byte b[], int off, int len)方法</span></span>
<span class="line"><span>    public int read(byte b[]) throws IOException {</span></span>
<span class="line"><span>        return read(b, 0, b.length);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从第 off 位置读取&lt;b&gt;最多(实际可能小于)&lt;/b&gt; len 长度字节的数据放到 byte 数组中，流是以 -1 来判断是否读取结束的; 此方法会一直阻止，直到输入数据可用、检测到stream结尾或引发异常为止。</span></span>
<span class="line"><span>    public int read(byte b[], int off, int len) throws IOException {</span></span>
<span class="line"><span>        // 检查边界</span></span>
<span class="line"><span>        Objects.checkFromIndexSize(off, len, b.length);</span></span>
<span class="line"><span>        if (len == 0) {</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 读取下一个字节</span></span>
<span class="line"><span>        int c = read();</span></span>
<span class="line"><span>        if (c == -1) { // 读到stream末尾，则返回读取的字节数量为-1</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        b[off] = (byte)c;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // i用来记录取了多少个字节</span></span>
<span class="line"><span>        int i = 1;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 循环读取</span></span>
<span class="line"><span>            for (; i &lt; len ; i++) {</span></span>
<span class="line"><span>                c = read();</span></span>
<span class="line"><span>                if (c == -1) {// 读到stream末尾，则break</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                b[off + i] = (byte)c;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (IOException ee) {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 返回读取到的字节个数</span></span>
<span class="line"><span>        return i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 分配的最大数组大小。</span></span>
<span class="line"><span>    // 由于一些VM在数组中保留一些头字，所以尝试分配较大的阵列可能会导致OutOfMemoryError（请求的阵列大小超过VM限制）</span></span>
<span class="line"><span>    private static final int MAX_BUFFER_SIZE = Integer.MAX_VALUE - 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // JDK9新增：读取 InputStream 中的所有剩余字节，调用readNBytes(Integer.MAX_VALUE)方法</span></span>
<span class="line"><span>    public byte[] readAllBytes() throws IOException {</span></span>
<span class="line"><span>        return readNBytes(Integer.MAX_VALUE);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // JDK11更新：读取 InputStream 中的剩余字节的指定上限大小的字节内容；此方法会一直阻塞，直到读取了请求的字节数、检测到流结束或引发异常为止。此方法不会关闭输入流。</span></span>
<span class="line"><span>    public byte[] readNBytes(int len) throws IOException {</span></span>
<span class="line"><span>        // 边界检查</span></span>
<span class="line"><span>        if (len &lt; 0) {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;len &lt; 0&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;byte[]&gt; bufs = null; // 缓存每次读取到的内容放到bufs，最后组装成result</span></span>
<span class="line"><span>        byte[] result = null; // 最后读取到的内容</span></span>
<span class="line"><span>        int total = 0;</span></span>
<span class="line"><span>        int remaining = len; // 剩余字节长度</span></span>
<span class="line"><span>        int n;</span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            byte[] buf = new byte[Math.min(remaining, DEFAULT_BUFFER_SIZE)];</span></span>
<span class="line"><span>            int nread = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 读取到结束为止，读取大小n可能大于或小于缓冲区大小</span></span>
<span class="line"><span>            while ((n = read(buf, nread,</span></span>
<span class="line"><span>                    Math.min(buf.length - nread, remaining))) &gt; 0) {</span></span>
<span class="line"><span>                nread += n; </span></span>
<span class="line"><span>                remaining -= n;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (nread &gt; 0) {</span></span>
<span class="line"><span>                if (MAX_BUFFER_SIZE - total &lt; nread) {</span></span>
<span class="line"><span>                    throw new OutOfMemoryError(&quot;Required array size too large&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                total += nread;</span></span>
<span class="line"><span>                if (result == null) {</span></span>
<span class="line"><span>                    result = buf;</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    if (bufs == null) {</span></span>
<span class="line"><span>                        bufs = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>                        bufs.add(result);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    bufs.add(buf);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 如果读不到内容（返回-1）或者没有剩余的字节，则跳出循环</span></span>
<span class="line"><span>        } while (n &gt;= 0 &amp;&amp; remaining &gt; 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (bufs == null) {</span></span>
<span class="line"><span>            if (result == null) {</span></span>
<span class="line"><span>                return new byte[0];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return result.length == total ?</span></span>
<span class="line"><span>                result : Arrays.copyOf(result, total);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 组装最后的result</span></span>
<span class="line"><span>        result = new byte[total];</span></span>
<span class="line"><span>        int offset = 0;</span></span>
<span class="line"><span>        remaining = total;</span></span>
<span class="line"><span>        for (byte[] b : bufs) {</span></span>
<span class="line"><span>            int count = Math.min(b.length, remaining);</span></span>
<span class="line"><span>            System.arraycopy(b, 0, result, offset, count);</span></span>
<span class="line"><span>            offset += count;</span></span>
<span class="line"><span>            remaining -= count;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // JDK9新增：从输入流读取请求的字节数并保存在byte数组中； 此方法会一直阻塞，直到读取了请求的字节数、检测到流结束或引发异常为止。此方法不会关闭输入流。</span></span>
<span class="line"><span>    public int readNBytes(byte[] b, int off, int len) throws IOException {</span></span>
<span class="line"><span>        Objects.checkFromIndexSize(off, len, b.length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int n = 0;</span></span>
<span class="line"><span>        while (n &lt; len) {</span></span>
<span class="line"><span>            int count = read(b, off + n, len - n);</span></span>
<span class="line"><span>            if (count &lt; 0)</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            n += count;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 跳过指定个数的字节不读取</span></span>
<span class="line"><span>    public long skip(long n) throws IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long remaining = n;</span></span>
<span class="line"><span>        int nr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (n &lt;= 0) {</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int size = (int)Math.min(MAX_SKIP_BUFFER_SIZE, remaining);</span></span>
<span class="line"><span>        byte[] skipBuffer = new byte[size];</span></span>
<span class="line"><span>        while (remaining &gt; 0) {</span></span>
<span class="line"><span>            nr = read(skipBuffer, 0, (int)Math.min(size, remaining));</span></span>
<span class="line"><span>            if (nr &lt; 0) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            remaining -= nr;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return n - remaining;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 返回可读的字节数量</span></span>
<span class="line"><span>    public int available() throws IOException {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 读取完，关闭流，释放资源</span></span>
<span class="line"><span>    public void close() throws IOException {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 标记读取位置，下次还可以从这里开始读取，使用前要看当前流是否支持，可以使用 markSupport() 方法判断</span></span>
<span class="line"><span>    public synchronized void mark(int readlimit) {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 重置读取位置为上次 mark 标记的位置</span></span>
<span class="line"><span>    public synchronized void reset() throws IOException {</span></span>
<span class="line"><span>        throw new IOException(&quot;mark/reset not supported&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 判断当前流是否支持标记流，和上面两个方法配套使用。默认是false，由子类方法重写</span></span>
<span class="line"><span>    public boolean markSupported() {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // JDK9新增：读取 InputStream 中的全部字节并写入到指定的 OutputStream 中</span></span>
<span class="line"><span>    public long transferTo(OutputStream out) throws IOException {</span></span>
<span class="line"><span>        Objects.requireNonNull(out, &quot;out&quot;);</span></span>
<span class="line"><span>        long transferred = 0;</span></span>
<span class="line"><span>        byte[] buffer = new byte[DEFAULT_BUFFER_SIZE];</span></span>
<span class="line"><span>        int read;</span></span>
<span class="line"><span>        while ((read = this.read(buffer, 0, DEFAULT_BUFFER_SIZE)) &gt;= 0) {</span></span>
<span class="line"><span>            out.write(buffer, 0, read);</span></span>
<span class="line"><span>            transferred += read;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return transferred;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><blockquote><p>总结下JDK9的更新点</p></blockquote><p>类 java.io.InputStream 中增加了新的方法来读取和复制 InputStream 中包含的数据。</p><ul><li><code>readAllBytes</code>：读取 InputStream 中的所有剩余字节。</li><li><code>readNBytes</code>： 从 InputStream 中读取指定数量的字节到数组中。</li><li><code>transferTo</code>：读取 InputStream 中的全部字节并写入到指定的 OutputStream 中 。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestInputStream {</span></span>
<span class="line"><span>    private InputStream inputStream;</span></span>
<span class="line"><span>    private static final String CONTENT = &quot;Hello World&quot;;</span></span>
<span class="line"><span>    @Before</span></span>
<span class="line"><span>    public void setUp() throws Exception {</span></span>
<span class="line"><span>        this.inputStream =</span></span>
<span class="line"><span>            TestInputStream.class.getResourceAsStream(&quot;/input.txt&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testReadAllBytes() throws Exception {</span></span>
<span class="line"><span>        final String content = new String(this.inputStream.readAllBytes());</span></span>
<span class="line"><span>        assertEquals(CONTENT, content);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testReadNBytes() throws Exception {</span></span>
<span class="line"><span>        final byte[] data = new byte[5];</span></span>
<span class="line"><span>        this.inputStream.readNBytes(data, 0, 5);</span></span>
<span class="line"><span>        assertEquals(&quot;Hello&quot;, new String(data));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testTransferTo() throws Exception {</span></span>
<span class="line"><span>        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();</span></span>
<span class="line"><span>        this.inputStream.transferTo(outputStream);</span></span>
<span class="line"><span>        assertEquals(CONTENT, outputStream.toString());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong><code>read(byte[], int, int)</code> 和 <code>readNBytes(byte[], int, int)</code>看似是实现的相同功能，为何会设计readNBytes方法呢</strong>？</li></ul><p>这个问题可以参看<a href="https://stackoverflow.com/questions/53754387/java-read-vs-readnbytes-of-the-inputstream-instance" target="_blank" rel="noreferrer">这里在新窗口打开</a></p><ol><li>read(byte[], int, int)是尝试读到最多len个bytes，但是<strong>读取到的内容长度可能是小于len</strong>的。</li><li>readNBytes(byte[], int, int) 会一直（while循环）查找直到stream尾为止</li></ol><p>举个例子：如果文本内容是<code>12345&lt;end&gt;</code>, read(s,0,10)是允许返回<code>123</code>的, 而readNbytes(s,0,10)会一直（while循环）查找直到stream尾为止，并返回<code>12345</code>.</p><blockquote><p>补充下JDK11为什么会增加nullInputStream方法的设计？即空对象模式</p></blockquote><ul><li><strong>空对象模式</strong></li></ul><p>举个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyParser implements Parser {</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>然后便<strong>可以始终可以这么调用，而不用再判断空了</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ParserFactory.getParser().findAction(someInput).doSomething();</span></span></code></pre></div><h3 id="filterinputstream" tabindex="-1">FilterInputStream <a class="header-anchor" href="#filterinputstream" aria-label="Permalink to &quot;FilterInputStream&quot;">​</a></h3><p>FilterInputStream 源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FilterInputStream extends InputStream {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 被装饰的inputStream</span></span>
<span class="line"><span>    protected volatile InputStream in;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 构造函数，注入被装饰的inputStream</span></span>
<span class="line"><span>    protected FilterInputStream(InputStream in) {</span></span>
<span class="line"><span>        this.in = in;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 本质是调用被装饰的inputStream的方法</span></span>
<span class="line"><span>    public int read() throws IOException {</span></span>
<span class="line"><span>        return in.read();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public int read(byte b[]) throws IOException {</span></span>
<span class="line"><span>        return read(b, 0, b.length);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>    public int read(byte b[], int off, int len) throws IOException {</span></span>
<span class="line"><span>        return in.read(b, off, len);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>    public long skip(long n) throws IOException {</span></span>
<span class="line"><span>        return in.skip(n);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public int available() throws IOException {</span></span>
<span class="line"><span>        return in.available();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void close() throws IOException {</span></span>
<span class="line"><span>        in.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public synchronized void mark(int readlimit) {</span></span>
<span class="line"><span>        in.mark(readlimit);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>    public synchronized void reset() throws IOException {</span></span>
<span class="line"><span>        in.reset();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public boolean markSupported() {</span></span>
<span class="line"><span>        return in.markSupported();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>为什么被装饰的inputStream是volatile类型的</strong>？</p><p>请参看： <a href="https://pdai.tech/md/java/thread/java-thread-x-key-volatile.html" target="_blank" rel="noreferrer">关键字: volatile详解</a></p><h3 id="bytearrayinputstream" tabindex="-1">ByteArrayInputStream <a class="header-anchor" href="#bytearrayinputstream" aria-label="Permalink to &quot;ByteArrayInputStream&quot;">​</a></h3><p>ByteArrayInputStream源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ByteArrayInputStream extends InputStream {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 内部保存的byte 数组</span></span>
<span class="line"><span>    protected byte buf[];</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 读取下一个字节的数组下标，byte[pos]就是read获取的下个字节</span></span>
<span class="line"><span>    protected int pos;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // mark的数组下标位置</span></span>
<span class="line"><span>    protected int mark = 0;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 保存的有效byte的个数</span></span>
<span class="line"><span>    protected int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 构造方法</span></span>
<span class="line"><span>    public ByteArrayInputStream(byte buf[]) {</span></span>
<span class="line"><span>        this.buf = buf;              </span></span>
<span class="line"><span>        this.pos = 0;</span></span>
<span class="line"><span>        this.count = buf.length;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 构造方法，带offset的</span></span>
<span class="line"><span>     public ByteArrayInputStream(byte buf[], int offset, int length) {                </span></span>
<span class="line"><span>        this.buf = buf;</span></span>
<span class="line"><span>        this.pos = offset;</span></span>
<span class="line"><span>        this.count = Math.min(offset + length, buf.length);</span></span>
<span class="line"><span>        this.mark = offset;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 从流中读取下一个字节，没有读取到返回 -1</span></span>
<span class="line"><span>    public synchronized int read() {</span></span>
<span class="line"><span>        return (pos &lt; count) ? (buf[pos++] &amp; 0xff) : -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 从第 off 位置读取&lt;b&gt;最多(实际可能小于)&lt;/b&gt; len 长度字节的数据放到 byte 数组中，流是以 -1 来判断是否读取结束的</span></span>
<span class="line"><span>    public synchronized int read(byte b[], int off, int len) {</span></span>
<span class="line"><span>        // 边界检查</span></span>
<span class="line"><span>        if (b == null) {</span></span>
<span class="line"><span>            throw new NullPointerException();</span></span>
<span class="line"><span>        } else if (off &lt; 0 || len &lt; 0 || len &gt; b.length - off) {</span></span>
<span class="line"><span>            throw new IndexOutOfBoundsException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (pos &gt;= count) {</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int avail = count - pos;</span></span>
<span class="line"><span>        if (len &gt; avail) {</span></span>
<span class="line"><span>            len = avail;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (len &lt;= 0) {</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 从buf拷贝到byte 数组b中</span></span>
<span class="line"><span>        System.arraycopy(buf, pos, b, off, len);</span></span>
<span class="line"><span>        pos += len;</span></span>
<span class="line"><span>        return len;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 跳过指定个数的字节不读取</span></span>
<span class="line"><span>    public synchronized long skip(long n) {</span></span>
<span class="line"><span>        long k = count - pos;</span></span>
<span class="line"><span>        if (n &lt; k) {</span></span>
<span class="line"><span>            k = n &lt; 0 ? 0 : n;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pos += k;</span></span>
<span class="line"><span>        return k;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 还有稍稍byte在buffer中未读取，即总的count 减去 当前byte位置</span></span>
<span class="line"><span>    public synchronized int available() {</span></span>
<span class="line"><span>        return count - pos;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 支持mark所以返回true</span></span>
<span class="line"><span>    public boolean markSupported() { </span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 在流中当前位置mark, readAheadLimit参数未使用    </span></span>
<span class="line"><span>    public void mark(int readAheadLimit) {            </span></span>
<span class="line"><span>        mark = pos;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 重置流，即回到mark的位置</span></span>
<span class="line"><span>    public synchronized void reset() {</span></span>
<span class="line"><span>        pos = mark;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 关闭ByteArrayInputStream不会产生任何动作</span></span>
<span class="line"><span>    public void close() throws IOException { </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="bufferedinputstream" tabindex="-1">BufferedInputStream <a class="header-anchor" href="#bufferedinputstream" aria-label="Permalink to &quot;BufferedInputStream&quot;">​</a></h3><p>BufferedInputStream源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BufferedInputStream extends FilterInputStream {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 默认的buffer大小</span></span>
<span class="line"><span>    private static int DEFAULT_BUFFER_SIZE = 8192;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 分配的最大数组大小。</span></span>
<span class="line"><span>    // 由于一些VM在数组中保留一些头字，所以尝试分配较大的阵列可能会导致OutOfMemoryError（请求的阵列大小超过VM限制）</span></span>
<span class="line"><span>    private static int MAX_BUFFER_SIZE = Integer.MAX_VALUE - 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 内部保存在byte 数组中</span></span>
<span class="line"><span>    protected volatile byte buf[];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 关闭流的方法可能是异步的，所以使用原子AtomicReferenceFieldUpdater提供CAS无锁方式（可以解决CAS的ABA问题）来保证</span></span>
<span class="line"><span>    private static final AtomicReferenceFieldUpdater&lt;BufferedInputStream, byte[]&gt; bufUpdater =</span></span>
<span class="line"><span>        AtomicReferenceFieldUpdater.newUpdater(BufferedInputStream.class,  byte[].class, &quot;buf&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 有效byte的大小</span></span>
<span class="line"><span>    protected int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 当前位置</span></span>
<span class="line"><span>    protected int pos;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 最后一次，调用mark方法，标记的位置</span></span>
<span class="line"><span>    protected int markpos = -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 该变量惟一入口就是mark(int readLimit)，好比调用方法mark(1024)，那么后面读取的数据若是</span></span>
<span class="line"><span>     * 超过了1024字节，那么这次mark就为无效标记，子类能够选择抛弃该mark标记，从头开始。不过具体实现</span></span>
<span class="line"><span>     * 跟具体的子类有关，在BufferedInputStream中，会抛弃mark标记，从新将markpos赋值为-1</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected int marklimit;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取被装饰的stream</span></span>
<span class="line"><span>    private InputStream getInIfOpen() throws IOException {</span></span>
<span class="line"><span>        InputStream input = in;</span></span>
<span class="line"><span>        if (input == null)</span></span>
<span class="line"><span>            throw new IOException(&quot;Stream closed&quot;);</span></span>
<span class="line"><span>        return input;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取实际内部的buffer数组</span></span>
<span class="line"><span>    private byte[] getBufIfOpen() throws IOException {</span></span>
<span class="line"><span>        byte[] buffer = buf;</span></span>
<span class="line"><span>        if (buffer == null)</span></span>
<span class="line"><span>            throw new IOException(&quot;Stream closed&quot;);</span></span>
<span class="line"><span>        return buffer;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 构造函数，buffer是8kb</span></span>
<span class="line"><span>    public BufferedInputStream(InputStream in) {</span></span>
<span class="line"><span>        this(in, DEFAULT_BUFFER_SIZE);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 构造函数，指定buffer大小</span></span>
<span class="line"><span>    public BufferedInputStream(InputStream in, int size) {</span></span>
<span class="line"><span>        super(in);</span></span>
<span class="line"><span>        if (size &lt;= 0) {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;Buffer size &lt;= 0&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        buf = new byte[size];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 用更多的数据填充缓冲区,考虑到shuffling和其他处理标记的技巧，</span></span>
<span class="line"><span>     * 假设它是由同步方法调用的。该方法还假设所有数据已经被读入，因此pos &gt;count。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void fill() throws IOException {</span></span>
<span class="line"><span>    	// 得到内部缓冲区buffer</span></span>
<span class="line"><span>        byte[] buffer = getBufIfOpen();</span></span>
<span class="line"><span>        // 没有mark的情况下， pos为0</span></span>
<span class="line"><span>        if (markpos &lt; 0)</span></span>
<span class="line"><span>            pos = 0;            /* no mark: throw away the buffer */</span></span>
<span class="line"><span>        // pos &gt;= buffer.length  buffer已经被读取完了 </span></span>
<span class="line"><span>        else if (pos &gt;= buffer.length)  /* no room left in buffer */</span></span>
<span class="line"><span>        	// markpos &gt; 0  有标记，标记处在缓存中间</span></span>
<span class="line"><span>            if (markpos &gt; 0) {  /* can throw away early part of the buffer */</span></span>
<span class="line"><span>            	// 把buffer中，markpos到pos的部分移动到0-sz处，pos设置为sz，markpos为0</span></span>
<span class="line"><span>                int sz = pos - markpos;</span></span>
<span class="line"><span>                System.arraycopy(buffer, markpos, buffer, 0, sz);</span></span>
<span class="line"><span>                pos = sz;</span></span>
<span class="line"><span>                markpos = 0;</span></span>
<span class="line"><span>                // markpos已经为0了，marklimit比buffer.length小，再读取buffer已经没有地方了</span></span>
<span class="line"><span>            } else if (buffer.length &gt;= marklimit) {</span></span>
<span class="line"><span>            	// 清空缓存，清空标记，markpos为-1，pos为0</span></span>
<span class="line"><span>                markpos = -1;   /* buffer got too big, invalidate mark */</span></span>
<span class="line"><span>                pos = 0;        /* drop buffer contents */</span></span>
<span class="line"><span>                // markpos已经为0了，marklimit比buffer.length大，而buffer.length已经最大了，不能扩容</span></span>
<span class="line"><span>            } else if (buffer.length &gt;= MAX_BUFFER_SIZE) {</span></span>
<span class="line"><span>                throw new OutOfMemoryError(&quot;Required array size too large&quot;);</span></span>
<span class="line"><span>               // markpos已经为0了，marklimit比buffer.length大</span></span>
<span class="line"><span>            } else {            /* grow buffer */</span></span>
<span class="line"><span>            	// 建立一个长度为min(2*pos,marklimit,MAX_BUFFER_SIZE),的缓存数组，然后把原来0-pos移动到新数组的0-pos处</span></span>
<span class="line"><span>                int nsz = (pos &lt;= MAX_BUFFER_SIZE - pos) ?</span></span>
<span class="line"><span>                        pos * 2 : MAX_BUFFER_SIZE;</span></span>
<span class="line"><span>                if (nsz &gt; marklimit)</span></span>
<span class="line"><span>                    nsz = marklimit;</span></span>
<span class="line"><span>                byte nbuf[] = new byte[nsz];</span></span>
<span class="line"><span>                System.arraycopy(buffer, 0, nbuf, 0, pos);</span></span>
<span class="line"><span>                // 用bufUpdater替换buffer</span></span>
<span class="line"><span>                if (!bufUpdater.compareAndSet(this, buffer, nbuf)) {</span></span>
<span class="line"><span>                    // Can&#39;t replace buf if there was an async close.</span></span>
<span class="line"><span>                    // Note: This would need to be changed if fill()</span></span>
<span class="line"><span>                    // is ever made accessible to multiple threads.</span></span>
<span class="line"><span>                    // But for now, the only way CAS can fail is via close.</span></span>
<span class="line"><span>                    // assert buf == null;</span></span>
<span class="line"><span>                    throw new IOException(&quot;Stream closed&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                buffer = nbuf;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        // 当前读取上限count为pos</span></span>
<span class="line"><span>        count = pos;</span></span>
<span class="line"><span>        // 从内部的输入流，读取pos到buffer.length部分，读取的字节数加到count</span></span>
<span class="line"><span>        int n = getInIfOpen().read(buffer, pos, buffer.length - pos);</span></span>
<span class="line"><span>        if (n &gt; 0)</span></span>
<span class="line"><span>            count = n + pos;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 读取byte</span></span>
<span class="line"><span>    public synchronized int read() throws IOException {</span></span>
<span class="line"><span>        // 说明当前buf[]数组大小不够了，须要fill()</span></span>
<span class="line"><span>        if (pos &gt;= count) {</span></span>
<span class="line"><span>            fill();</span></span>
<span class="line"><span>            // 说明没有读取到任何数据</span></span>
<span class="line"><span>            if (pos &gt;= count)</span></span>
<span class="line"><span>                return -1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return getBufIfOpen()[pos++] &amp; 0xff;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Read characters into a portion of an array, reading from the underlying</span></span>
<span class="line"><span>     * stream at most once if necessary.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int read1(byte[] b, int off, int len) throws IOException {</span></span>
<span class="line"><span>        int avail = count - pos;</span></span>
<span class="line"><span>        if (avail &lt;= 0) {</span></span>
<span class="line"><span>            // 当写入指定数组b的长度大小超过BufferedInputStream中核心缓存数组buf[]的大小而且 markpos &lt; 0，那么就直接从数据流中读取数据给b数组，而不经过buf[]缓存数组，避免buf[]数组急剧增大</span></span>
<span class="line"><span>            if (len &gt;= getBufIfOpen().length &amp;&amp; markpos &lt; 0) {</span></span>
<span class="line"><span>                return getInIfOpen().read(b, off, len);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            fill();</span></span>
<span class="line"><span>            avail = count - pos;</span></span>
<span class="line"><span>            if (avail &lt;= 0) return -1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int cnt = (avail &lt; len) ? avail : len;</span></span>
<span class="line"><span>        System.arraycopy(getBufIfOpen(), pos, b, off, cnt);</span></span>
<span class="line"><span>        pos += cnt;</span></span>
<span class="line"><span>        return cnt;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 读取到byte数组b中</span></span>
<span class="line"><span>    public synchronized int read(byte b[], int off, int len)</span></span>
<span class="line"><span>        throws IOException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        getBufIfOpen(); // Check for closed stream</span></span>
<span class="line"><span>        if ((off | len | (off + len) | (b.length - (off + len))) &lt; 0) {</span></span>
<span class="line"><span>            throw new IndexOutOfBoundsException();</span></span>
<span class="line"><span>        } else if (len == 0) {</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int n = 0;</span></span>
<span class="line"><span>        for (;;) {</span></span>
<span class="line"><span>            int nread = read1(b, off + n, len - n);</span></span>
<span class="line"><span>            if (nread &lt;= 0)</span></span>
<span class="line"><span>                return (n == 0) ? nread : n;</span></span>
<span class="line"><span>            n += nread;</span></span>
<span class="line"><span>            if (n &gt;= len)</span></span>
<span class="line"><span>                return n;</span></span>
<span class="line"><span>            // if not closed but no bytes available, return</span></span>
<span class="line"><span>            InputStream input = in;</span></span>
<span class="line"><span>            if (input != null &amp;&amp; input.available() &lt;= 0)</span></span>
<span class="line"><span>                return n;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 跳过n个</span></span>
<span class="line"><span>    public synchronized long skip(long n) throws IOException {</span></span>
<span class="line"><span>        getBufIfOpen(); // Check for closed stream</span></span>
<span class="line"><span>        if (n &lt;= 0) {</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        long avail = count - pos;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (avail &lt;= 0) {</span></span>
<span class="line"><span>            // If no mark position set then don&#39;t keep in buffer</span></span>
<span class="line"><span>            if (markpos &lt;0)</span></span>
<span class="line"><span>                return getInIfOpen().skip(n);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Fill in buffer to save bytes for reset</span></span>
<span class="line"><span>            fill();</span></span>
<span class="line"><span>            avail = count - pos;</span></span>
<span class="line"><span>            if (avail &lt;= 0)</span></span>
<span class="line"><span>                return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long skipped = (avail &lt; n) ? avail : n;</span></span>
<span class="line"><span>        pos += skipped;</span></span>
<span class="line"><span>        return skipped;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // buf[]数组剩余字节数+输入流中剩余字节数</span></span>
<span class="line"><span>    public synchronized int available() throws IOException {</span></span>
<span class="line"><span>        int n = count - pos;</span></span>
<span class="line"><span>        int avail = getInIfOpen().available();</span></span>
<span class="line"><span>        return n &gt; (Integer.MAX_VALUE - avail)</span></span>
<span class="line"><span>                    ? Integer.MAX_VALUE</span></span>
<span class="line"><span>                    : n + avail;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 标记位置，marklimit只有在这里才可以被赋值，readlimit表示mark()方法执行后，最多可以从流中读取的数据</span></span>
<span class="line"><span>    // 若是超过该字节大小，那么在fill()的时候，就会认为此mark()标记无效，从新将 markpos = -1，pos = 0</span></span>
<span class="line"><span>    public synchronized void mark(int readlimit) {</span></span>
<span class="line"><span>        marklimit = readlimit;</span></span>
<span class="line"><span>        markpos = pos;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 重置位置</span></span>
<span class="line"><span>    public synchronized void reset() throws IOException {</span></span>
<span class="line"><span>        getBufIfOpen(); // 如果已经close, 则直接报错</span></span>
<span class="line"><span>        if (markpos &lt; 0)</span></span>
<span class="line"><span>            throw new IOException(&quot;Resetting to invalid mark&quot;);</span></span>
<span class="line"><span>        pos = markpos;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 支持mark, 所以返回true</span></span>
<span class="line"><span>    public boolean markSupported() {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 通过AtomicReferenceFieldUpdater的CAS无锁方式close</span></span>
<span class="line"><span>    public void close() throws IOException {</span></span>
<span class="line"><span>        byte[] buffer;</span></span>
<span class="line"><span>        while ( (buffer = buf) != null) {</span></span>
<span class="line"><span>            if (bufUpdater.compareAndSet(this, buffer, null)) {</span></span>
<span class="line"><span>                InputStream input = in;</span></span>
<span class="line"><span>                in = null;</span></span>
<span class="line"><span>                if (input != null)</span></span>
<span class="line"><span>                    input.close();</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // Else retry in case a new buf was CASed in fill()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AtomicReferenceFieldUpdater具体可以参考：<a href="https://pdai.tech/md/java/thread/java-thread-x-juc-AtomicInteger.html" target="_blank" rel="noreferrer">JUC原子类: CAS, Unsafe和原子类详解</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>JDK 11 源码</li><li><a href="https://www.cnblogs.com/winterfells/p/8745297.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/winterfells/p/8745297.html</a></li><li><a href="https://www.cnblogs.com/AdaiCoffee/p/11369699.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/AdaiCoffee/p/11369699.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,42)]))}const m=s(i,[["render",t]]);export{d as __pageData,m as default};
