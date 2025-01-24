import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/io/java-io-copy-11.jpg",h=JSON.parse('{"title":"Java NIO - 零拷贝实现","description":"","frontmatter":{},"headers":[],"relativePath":"java/io/java-io-nio-zerocopy.md","filePath":"java/io/java-io-nio-zerocopy.md","lastUpdated":1737706346000}'),i={name:"java/io/java-io-nio-zerocopy.md"};function t(c,n,o,r,d,u){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="java-nio-零拷贝实现" tabindex="-1">Java NIO - 零拷贝实现 <a class="header-anchor" href="#java-nio-零拷贝实现" aria-label="Permalink to &quot;Java NIO - 零拷贝实现&quot;">​</a></h1><blockquote><p>这里转一篇Java NIO 零拷贝的实现文章，在此之前建议先理解什么是Linux中零拷贝，可以先看这篇文章。本文从源码着手分析了 Java NIO 对零拷贝的实现，主要包括基于内存映射（mmap）方式的 MappedByteBuffer 以及基于 sendfile 方式的 FileChannel。最后在篇末简单的阐述了一下 Netty 中的零拷贝机制，以及 RocketMQ 和 Kafka 两种消息队列在零拷贝实现方式上的区别。@pdai</p></blockquote><h2 id="java-nio零拷贝" tabindex="-1">Java NIO零拷贝 <a class="header-anchor" href="#java-nio零拷贝" aria-label="Permalink to &quot;Java NIO零拷贝&quot;">​</a></h2><p>在 Java NIO 中的<strong>通道（Channel）<strong>就相当于操作系统的</strong>内核空间</strong>（kernel space）的缓冲区，而<strong>缓冲区</strong>（Buffer）对应的相当于操作系统的<strong>用户空间</strong>（user space）中的<strong>用户缓冲区</strong>（user buffer）。</p><ul><li><strong>通道</strong>（Channel）是全双工的（双向传输），它既可能是读缓冲区（read buffer），也可能是网络缓冲区（socket buffer）。</li><li><strong>缓冲区</strong>（Buffer）分为堆内存（HeapBuffer）和堆外内存（DirectBuffer），这是通过 malloc() 分配出来的用户态内存。</li></ul><p>堆外内存（DirectBuffer）在使用后需要应用程序手动回收，而堆内存（HeapBuffer）的数据在 GC 时可能会被自动回收。因此，在使用 HeapBuffer 读写数据时，为了避免缓冲区数据因为 GC 而丢失，NIO 会先把 HeapBuffer 内部的数据拷贝到一个临时的 DirectBuffer 中的本地内存（native memory），这个拷贝涉及到 <code>sun.misc.Unsafe.copyMemory()</code> 的调用，背后的实现原理与 <code>memcpy()</code> 类似。 最后，将临时生成的 DirectBuffer 内部的数据的内存地址传给 I/O 调用函数，这样就避免了再去访问 Java 对象处理 I/O 读写。</p><h3 id="mappedbytebuffer" tabindex="-1">MappedByteBuffer <a class="header-anchor" href="#mappedbytebuffer" aria-label="Permalink to &quot;MappedByteBuffer&quot;">​</a></h3><p>MappedByteBuffer 是 NIO 基于**内存映射（mmap）**这种零拷贝方式的提供的一种实现，它继承自 ByteBuffer。FileChannel 定义了一个 map() 方法，它可以把一个文件从 position 位置开始的 size 大小的区域映射为内存映像文件。抽象方法 map() 方法在 FileChannel 中的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract MappedByteBuffer map(MapMode mode, long position, long size)</span></span>
<span class="line"><span>        throws IOException;</span></span></code></pre></div><ul><li><strong>mode</strong>：限定内存映射区域（MappedByteBuffer）对内存映像文件的访问模式，包括只可读（READ_ONLY）、可读可写（READ_WRITE）和写时拷贝（PRIVATE）三种模式。</li><li><strong>position</strong>：文件映射的起始地址，对应内存映射区域（MappedByteBuffer）的首地址。</li><li><strong>size</strong>：文件映射的字节长度，从 position 往后的字节数，对应内存映射区域（MappedByteBuffer）的大小。</li></ul><p>MappedByteBuffer 相比 ByteBuffer 新增了 fore()、load() 和 isLoad() 三个重要的方法：</p><ul><li><strong>fore()</strong>：对于处于 READ_WRITE 模式下的缓冲区，把对缓冲区内容的修改强制刷新到本地文件。</li><li><strong>load()</strong>：将缓冲区的内容载入物理内存中，并返回这个缓冲区的引用。</li><li><strong>isLoaded()</strong>：如果缓冲区的内容在物理内存中，则返回 true，否则返回 false。</li></ul><p>下面给出一个利用 MappedByteBuffer 对文件进行读写的使用示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final static String CONTENT = &quot;Zero copy implemented by MappedByteBuffer&quot;;</span></span>
<span class="line"><span>private final static String FILE_NAME = &quot;/mmap.txt&quot;;</span></span>
<span class="line"><span>private final static String CHARSET = &quot;UTF-8&quot;;</span></span></code></pre></div><ul><li><strong>写文件数据</strong>：打开文件通道 fileChannel 并提供读权限、写权限和数据清空权限，通过 fileChannel 映射到一个可写的内存缓冲区 mappedByteBuffer，将目标数据写入 mappedByteBuffer，通过 <code>force()</code> 方法把缓冲区更改的内容强制写入本地文件。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void writeToFileByMappedByteBuffer() {</span></span>
<span class="line"><span>    Path path = Paths.get(getClass().getResource(FILE_NAME).getPath());</span></span>
<span class="line"><span>    byte[] bytes = CONTENT.getBytes(Charset.forName(CHARSET));</span></span>
<span class="line"><span>    try (FileChannel fileChannel = FileChannel.open(path, StandardOpenOption.READ,</span></span>
<span class="line"><span>            StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING)) {</span></span>
<span class="line"><span>        MappedByteBuffer mappedByteBuffer = fileChannel.map(READ_WRITE, 0, bytes.length);</span></span>
<span class="line"><span>        if (mappedByteBuffer != null) {</span></span>
<span class="line"><span>            mappedByteBuffer.put(bytes);</span></span>
<span class="line"><span>            mappedByteBuffer.force();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>读文件数据</strong>：打开文件通道 fileChannel 并提供只读权限，通过 fileChannel 映射到一个只可读的内存缓冲区 mappedByteBuffer，读取 mappedByteBuffer 中的字节数组即可得到文件数据。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void readFromFileByMappedByteBuffer() {</span></span>
<span class="line"><span>    Path path = Paths.get(getClass().getResource(FILE_NAME).getPath());</span></span>
<span class="line"><span>    int length = CONTENT.getBytes(Charset.forName(CHARSET)).length;</span></span>
<span class="line"><span>    try (FileChannel fileChannel = FileChannel.open(path, StandardOpenOption.READ)) {</span></span>
<span class="line"><span>        MappedByteBuffer mappedByteBuffer = fileChannel.map(READ_ONLY, 0, length);</span></span>
<span class="line"><span>        if (mappedByteBuffer != null) {</span></span>
<span class="line"><span>            byte[] bytes = new byte[length];</span></span>
<span class="line"><span>            mappedByteBuffer.get(bytes);</span></span>
<span class="line"><span>            String content = new String(bytes, StandardCharsets.UTF_8);</span></span>
<span class="line"><span>            assertEquals(content, &quot;Zero copy implemented by MappedByteBuffer&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面介绍 <code>map()</code> 方法的<strong>底层实现原理</strong>。<code>map()</code> 方法是 <code>java.nio.channels.FileChannel</code> 的抽象方法，由子类 <code>sun.nio.ch.FileChannelImpl.java</code> 实现，下面是和内存映射相关的核心代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public MappedByteBuffer map(MapMode mode, long position, long size) throws IOException {</span></span>
<span class="line"><span>    int pagePosition = (int)(position % allocationGranularity);</span></span>
<span class="line"><span>    long mapPosition = position - pagePosition;</span></span>
<span class="line"><span>    long mapSize = size + pagePosition;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        addr = map0(imode, mapPosition, mapSize);</span></span>
<span class="line"><span>    } catch (OutOfMemoryError x) {</span></span>
<span class="line"><span>        System.gc();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(100);</span></span>
<span class="line"><span>        } catch (InterruptedException y) {</span></span>
<span class="line"><span>            Thread.currentThread().interrupt();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            addr = map0(imode, mapPosition, mapSize);</span></span>
<span class="line"><span>        } catch (OutOfMemoryError y) {</span></span>
<span class="line"><span>            throw new IOException(&quot;Map failed&quot;, y);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int isize = (int)size;</span></span>
<span class="line"><span>    Unmapper um = new Unmapper(addr, mapSize, isize, mfd);</span></span>
<span class="line"><span>    if ((!writable) || (imode == MAP_RO)) {</span></span>
<span class="line"><span>        return Util.newMappedByteBufferR(isize, addr + pagePosition, mfd, um);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        return Util.newMappedByteBuffer(isize, addr + pagePosition, mfd, um);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>map() 方法通过本地方法 map0() 为文件分配一块虚拟内存，作为它的内存映射区域，然后返回这块内存映射区域的起始地址。</p><ul><li>文件映射需要在 Java 堆中创建一个 MappedByteBuffer 的实例。如果第一次文件映射导致 OOM，则手动触发垃圾回收，休眠 100ms 后再尝试映射，如果失败则抛出异常。</li><li>通过 Util 的 newMappedByteBuffer （可读可写）方法或者 newMappedByteBufferR（仅读） 方法方法反射创建一个 DirectByteBuffer 实例，其中 DirectByteBuffer 是 MappedByteBuffer 的子类。</li></ul><p><code>map()</code> 方法返回的是内存映射区域的起始地址，通过（<strong>起始地址 + 偏移量</strong>）就可以获取指定内存的数据。这样一定程度上替代了 <code>read()</code> 或 <code>write()</code> 方法，底层直接采用 <code>sun.misc.Unsafe</code>类的 <code>getByte()</code> 和 <code>putByte()</code> 方法对数据进行读写。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private native long map0(int prot, long position, long mapSize) throws IOException;</span></span></code></pre></div><p>上面是本地方法（native method）map0 的定义，它通过 JNI（Java Native Interface）调用底层 C 的实现，这个 native 函数（Java_sun_nio_ch_FileChannelImpl_map0）的实现位于 JDK 源码包下的 <code>native/sun/nio/ch/FileChannelImpl.c</code>这个源文件里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>JNIEXPORT jlong JNICALL</span></span>
<span class="line"><span>Java_sun_nio_ch_FileChannelImpl_map0(JNIEnv *env, jobject this,</span></span>
<span class="line"><span>                                     jint prot, jlong off, jlong len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    void *mapAddress = 0;</span></span>
<span class="line"><span>    jobject fdo = (*env)-&gt;GetObjectField(env, this, chan_fd);</span></span>
<span class="line"><span>    jint fd = fdval(env, fdo);</span></span>
<span class="line"><span>    int protections = 0;</span></span>
<span class="line"><span>    int flags = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (prot == sun_nio_ch_FileChannelImpl_MAP_RO) {</span></span>
<span class="line"><span>        protections = PROT_READ;</span></span>
<span class="line"><span>        flags = MAP_SHARED;</span></span>
<span class="line"><span>    } else if (prot == sun_nio_ch_FileChannelImpl_MAP_RW) {</span></span>
<span class="line"><span>        protections = PROT_WRITE | PROT_READ;</span></span>
<span class="line"><span>        flags = MAP_SHARED;</span></span>
<span class="line"><span>    } else if (prot == sun_nio_ch_FileChannelImpl_MAP_PV) {</span></span>
<span class="line"><span>        protections =  PROT_WRITE | PROT_READ;</span></span>
<span class="line"><span>        flags = MAP_PRIVATE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mapAddress = mmap64(</span></span>
<span class="line"><span>        0,                    /* Let OS decide location */</span></span>
<span class="line"><span>        len,                  /* Number of bytes to map */</span></span>
<span class="line"><span>        protections,          /* File permissions */</span></span>
<span class="line"><span>        flags,                /* Changes are shared */</span></span>
<span class="line"><span>        fd,                   /* File descriptor of mapped file */</span></span>
<span class="line"><span>        off);                 /* Offset into file */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (mapAddress == MAP_FAILED) {</span></span>
<span class="line"><span>        if (errno == ENOMEM) {</span></span>
<span class="line"><span>            JNU_ThrowOutOfMemoryError(env, &quot;Map failed&quot;);</span></span>
<span class="line"><span>            return IOS_THROWN;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return handle(env, -1, &quot;Map failed&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ((jlong) (unsigned long) mapAddress);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出 map0() 函数最终是通过 <code>mmap64()</code> 这个函数对 Linux 底层内核发出内存映射的调用， <code>mmap64()</code> 函数的原型如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;sys/mman.h&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void *mmap64(void *addr, size_t len, int prot, int flags, int fd, off64_t offset);</span></span></code></pre></div><p>下面详细介绍一下 <code>mmap64()</code> 函数各个参数的含义以及参数可选值：</p><ul><li><code>addr</code>：文件在用户进程空间的内存映射区中的起始地址，是一个建议的参数，通常可设置为 0 或 NULL，此时由内核去决定真实的起始地址。当 + flags 为 MAP_FIXED 时，addr 就是一个必选的参数，即需要提供一个存在的地址。</li><li><code>len</code>：文件需要进行内存映射的字节长度</li><li><code>prot</code>：控制用户进程对内存映射区的访问权限 <ul><li><code>PROT_READ</code>：读权限</li><li><code>PROT_WRITE</code>：写权限</li><li><code>PROT_EXEC</code>：执行权限</li><li><code>PROT_NONE</code>：无权限</li></ul></li><li><code>flags</code>：控制内存映射区的修改是否被多个进程共享 <ul><li><code>MAP_PRIVATE</code>：对内存映射区数据的修改不会反映到真正的文件，数据修改发生时采用写时复制机制</li><li><code>MAP_SHARED</code>：对内存映射区的修改会同步到真正的文件，修改对共享此内存映射区的进程是可见的</li><li><code>MAP_FIXED</code>：不建议使用，这种模式下 addr 参数指定的必须的提供一个存在的 addr 参数</li></ul></li><li><code>fd</code>：文件描述符。每次 map 操作会导致文件的引用计数加 1，每次 unmap 操作或者结束进程会导致引用计数减 1</li><li><code>offset</code>：文件偏移量。进行映射的文件位置，从文件起始地址向后的位移量</li></ul><p>下面总结一下 MappedByteBuffer 的特点和不足之处：</p><ul><li><strong>MappedByteBuffer 使用是堆外的虚拟内存</strong>，因此分配（map）的内存大小不受 JVM 的 -Xmx 参数限制，但是也是有大小限制的。 如果当文件超出 Integer.MAX_VALUE 字节限制时，可以通过 position 参数重新 map 文件后面的内容。</li><li><strong>MappedByteBuffer 在处理大文件时性能的确很高，但也存内存占用、文件关闭不确定等问题</strong>，被其打开的文件只有在垃圾回收的才会被关闭，而且这个时间点是不确定的。</li><li>MappedByteBuffer 提供了文件映射内存的 mmap() 方法，也提供了释放映射内存的 unmap() 方法。然而 unmap() 是 FileChannelImpl 中的私有方法，无法直接显示调用。因此，<strong>用户程序需要通过 Java 反射的调用 sun.misc.Cleaner 类的 clean() 方法手动释放映射占用的内存区域</strong>。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void clean(final Object buffer) throws Exception {</span></span>
<span class="line"><span>    AccessController.doPrivileged((PrivilegedAction&lt;Void&gt;) () -&gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Method getCleanerMethod = buffer.getClass().getMethod(&quot;cleaner&quot;, new Class[0]);</span></span>
<span class="line"><span>            getCleanerMethod.setAccessible(true);</span></span>
<span class="line"><span>            Cleaner cleaner = (Cleaner) getCleanerMethod.invoke(buffer, new Object[0]);</span></span>
<span class="line"><span>            cleaner.clean();</span></span>
<span class="line"><span>        } catch(Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="directbytebuffer" tabindex="-1">DirectByteBuffer <a class="header-anchor" href="#directbytebuffer" aria-label="Permalink to &quot;DirectByteBuffer&quot;">​</a></h3><p>DirectByteBuffer 的对象引用位于 Java 内存模型的堆里面，JVM 可以对 DirectByteBuffer 的对象进行内存分配和回收管理，一般使用 DirectByteBuffer 的静态方法 allocateDirect() 创建 DirectByteBuffer 实例并分配内存。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static ByteBuffer allocateDirect(int capacity) {</span></span>
<span class="line"><span>    return new DirectByteBuffer(capacity);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>DirectByteBuffer 内部的字节缓冲区位在于堆外的（用户态）直接内存，它是通过 Unsafe 的本地方法 allocateMemory() 进行内存分配，底层调用的是操作系统的 malloc() 函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DirectByteBuffer(int cap) {</span></span>
<span class="line"><span>    super(-1, 0, cap, cap);</span></span>
<span class="line"><span>    boolean pa = VM.isDirectMemoryPageAligned();</span></span>
<span class="line"><span>    int ps = Bits.pageSize();</span></span>
<span class="line"><span>    long size = Math.max(1L, (long)cap + (pa ? ps : 0));</span></span>
<span class="line"><span>    Bits.reserveMemory(size, cap);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long base = 0;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        base = unsafe.allocateMemory(size);</span></span>
<span class="line"><span>    } catch (OutOfMemoryError x) {</span></span>
<span class="line"><span>        Bits.unreserveMemory(size, cap);</span></span>
<span class="line"><span>        throw x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    unsafe.setMemory(base, size, (byte) 0);</span></span>
<span class="line"><span>    if (pa &amp;&amp; (base % ps != 0)) {</span></span>
<span class="line"><span>        address = base + ps - (base &amp; (ps - 1));</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        address = base;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    cleaner = Cleaner.create(this, new Deallocator(base, size, cap));</span></span>
<span class="line"><span>    att = null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>除此之外，初始化 DirectByteBuffer 时还会创建一个 Deallocator 线程，并通过 Cleaner 的 freeMemory() 方法来对直接内存进行回收操作，freeMemory() 底层调用的是操作系统的 free() 函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static class Deallocator implements Runnable {</span></span>
<span class="line"><span>    private static Unsafe unsafe = Unsafe.getUnsafe();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private long address;</span></span>
<span class="line"><span>    private long size;</span></span>
<span class="line"><span>    private int capacity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Deallocator(long address, long size, int capacity) {</span></span>
<span class="line"><span>        assert (address != 0);</span></span>
<span class="line"><span>        this.address = address;</span></span>
<span class="line"><span>        this.size = size;</span></span>
<span class="line"><span>        this.capacity = capacity;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        if (address == 0) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        unsafe.freeMemory(address);</span></span>
<span class="line"><span>        address = 0;</span></span>
<span class="line"><span>        Bits.unreserveMemory(size, capacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于使用 DirectByteBuffer 分配的是系统本地的内存，不在 JVM 的管控范围之内，因此直接内存的回收和堆内存的回收不同，直接内存如果使用不当，很容易造成 OutOfMemoryError。</p><p>说了这么多，那么 DirectByteBuffer 和零拷贝有什么关系？前面有提到在 MappedByteBuffer 进行内存映射时，它的 map() 方法会通过 Util.newMappedByteBuffer() 来创建一个缓冲区实例，初始化的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static MappedByteBuffer newMappedByteBuffer(int size, long addr, FileDescriptor fd,</span></span>
<span class="line"><span>                                            Runnable unmapper) {</span></span>
<span class="line"><span>    MappedByteBuffer dbb;</span></span>
<span class="line"><span>    if (directByteBufferConstructor == null)</span></span>
<span class="line"><span>        initDBBConstructor();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        dbb = (MappedByteBuffer)directByteBufferConstructor.newInstance(</span></span>
<span class="line"><span>            new Object[] { new Integer(size), new Long(addr), fd, unmapper });</span></span>
<span class="line"><span>    } catch (InstantiationException | IllegalAccessException | InvocationTargetException e) {</span></span>
<span class="line"><span>        throw new InternalError(e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dbb;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static void initDBBRConstructor() {</span></span>
<span class="line"><span>    AccessController.doPrivileged(new PrivilegedAction&lt;Void&gt;() {</span></span>
<span class="line"><span>        public Void run() {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                Class&lt;?&gt; cl = Class.forName(&quot;java.nio.DirectByteBufferR&quot;);</span></span>
<span class="line"><span>                Constructor&lt;?&gt; ctor = cl.getDeclaredConstructor(</span></span>
<span class="line"><span>                    new Class&lt;?&gt;[] { int.class, long.class, FileDescriptor.class,</span></span>
<span class="line"><span>                                    Runnable.class });</span></span>
<span class="line"><span>                ctor.setAccessible(true);</span></span>
<span class="line"><span>                directByteBufferRConstructor = ctor;</span></span>
<span class="line"><span>            } catch (ClassNotFoundException | NoSuchMethodException |</span></span>
<span class="line"><span>                     IllegalArgumentException | ClassCastException x) {</span></span>
<span class="line"><span>                throw new InternalError(x);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }});</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>DirectByteBuffer 是 MappedByteBuffer 的具体实现类。实际上，Util.newMappedByteBuffer() 方法通过反射机制获取 DirectByteBuffer 的构造器，然后创建一个 DirectByteBuffer 的实例，对应的是一个单独用于内存映射的构造方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected DirectByteBuffer(int cap, long addr, FileDescriptor fd, Runnable unmapper) {</span></span>
<span class="line"><span>    super(-1, 0, cap, cap, fd);</span></span>
<span class="line"><span>    address = addr;</span></span>
<span class="line"><span>    cleaner = Cleaner.create(this, unmapper);</span></span>
<span class="line"><span>    att = null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因此，除了允许分配操作系统的直接内存以外，DirectByteBuffer 本身也具有文件内存映射的功能，这里不做过多说明。我们需要关注的是，DirectByteBuffer 在 MappedByteBuffer 的基础上提供了内存映像文件的随机读取 get() 和写入 write() 的操作。</p><ul><li>内存映像文件的随机读操作</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public byte get() {</span></span>
<span class="line"><span>    return ((unsafe.getByte(ix(nextGetIndex()))));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public byte get(int i) {</span></span>
<span class="line"><span>    return ((unsafe.getByte(ix(checkIndex(i)))));</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>内存映像文件的随机写操作</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ByteBuffer put(byte x) {</span></span>
<span class="line"><span>    unsafe.putByte(ix(nextPutIndex()), ((x)));</span></span>
<span class="line"><span>    return this;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public ByteBuffer put(int i, byte x) {</span></span>
<span class="line"><span>    unsafe.putByte(ix(checkIndex(i)), ((x)));</span></span>
<span class="line"><span>    return this;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>内存映像文件的随机读写都是借助 ix() 方法实现定位的， ix() 方法通过内存映射空间的内存首地址（address）和给定偏移量 i 计算出指针地址，然后由 unsafe 类的 get() 和 put() 方法和对指针指向的数据进行读取或写入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private long ix(int i) {</span></span>
<span class="line"><span>    return address + ((long)i &lt;&lt; 0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="filechannel" tabindex="-1">FileChannel <a class="header-anchor" href="#filechannel" aria-label="Permalink to &quot;FileChannel&quot;">​</a></h3><p>FileChannel 是一个用于文件读写、映射和操作的通道，同时它在并发环境下是线程安全的，基于 FileInputStream、FileOutputStream 或者 RandomAccessFile 的 getChannel() 方法可以创建并打开一个文件通道。FileChannel 定义了 transferFrom() 和 transferTo() 两个抽象方法，它通过在通道和通道之间建立连接实现数据传输的。</p><ul><li><code>transferTo()</code>：通过 FileChannel 把文件里面的源数据写入一个 WritableByteChannel 的目的通道。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract long transferTo(long position, long count, WritableByteChannel target)</span></span>
<span class="line"><span>        throws IOException;</span></span></code></pre></div><ul><li><code>transferFrom()</code>：把一个源通道 ReadableByteChannel 中的数据读取到当前 FileChannel 的文件里面。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract long transferFrom(ReadableByteChannel src, long position, long count)</span></span>
<span class="line"><span>        throws IOException;</span></span></code></pre></div><p>下面给出 FileChannel 利用 transferTo() 和 transferFrom() 方法进行数据传输的使用示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final String CONTENT = &quot;Zero copy implemented by FileChannel&quot;;</span></span>
<span class="line"><span>private static final String SOURCE_FILE = &quot;/source.txt&quot;;</span></span>
<span class="line"><span>private static final String TARGET_FILE = &quot;/target.txt&quot;;</span></span>
<span class="line"><span>private static final String CHARSET = &quot;UTF-8&quot;;</span></span></code></pre></div><p>首先在类加载根路径下创建 source.txt 和 target.txt 两个文件，对源文件 source.txt 文件写入初始化数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Before</span></span>
<span class="line"><span>public void setup() {</span></span>
<span class="line"><span>    Path source = Paths.get(getClassPath(SOURCE_FILE));</span></span>
<span class="line"><span>    byte[] bytes = CONTENT.getBytes(Charset.forName(CHARSET));</span></span>
<span class="line"><span>    try (FileChannel fromChannel = FileChannel.open(source, StandardOpenOption.READ,</span></span>
<span class="line"><span>            StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING)) {</span></span>
<span class="line"><span>        fromChannel.write(ByteBuffer.wrap(bytes));</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于 transferTo() 方法而言，目的通道 toChannel 可以是任意的单向字节写通道 WritableByteChannel；而对于 transferFrom() 方法而言，源通道 fromChannel 可以是任意的单向字节读通道 ReadableByteChannel。其中，FileChannel、SocketChannel 和 DatagramChannel 等通道实现了 WritableByteChannel 和 ReadableByteChannel 接口，都是同时支持读写的双向通道。为了方便测试，下面给出基于 FileChannel 完成 channel-to-channel 的数据传输示例。</p><p>通过 transferTo() 将 fromChannel 中的数据拷贝到 toChannel</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void transferTo() throws Exception {</span></span>
<span class="line"><span>    try (FileChannel fromChannel = new RandomAccessFile(</span></span>
<span class="line"><span>             getClassPath(SOURCE_FILE), &quot;rw&quot;).getChannel();</span></span>
<span class="line"><span>         FileChannel toChannel = new RandomAccessFile(</span></span>
<span class="line"><span>             getClassPath(TARGET_FILE), &quot;rw&quot;).getChannel()) {</span></span>
<span class="line"><span>        long position = 0L;</span></span>
<span class="line"><span>        long offset = fromChannel.size();</span></span>
<span class="line"><span>        fromChannel.transferTo(position, offset, toChannel);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过 transferFrom() 将 fromChannel 中的数据拷贝到 toChannel</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void transferFrom() throws Exception {</span></span>
<span class="line"><span>    try (FileChannel fromChannel = new RandomAccessFile(</span></span>
<span class="line"><span>             getClassPath(SOURCE_FILE), &quot;rw&quot;).getChannel();</span></span>
<span class="line"><span>         FileChannel toChannel = new RandomAccessFile(</span></span>
<span class="line"><span>             getClassPath(TARGET_FILE), &quot;rw&quot;).getChannel()) {</span></span>
<span class="line"><span>        long position = 0L;</span></span>
<span class="line"><span>        long offset = fromChannel.size();</span></span>
<span class="line"><span>        toChannel.transferFrom(fromChannel, position, offset);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面介绍 transferTo() 和 transferFrom() 方法的底层实现原理，这两个方法也是 java.nio.channels.FileChannel 的抽象方法，由子类 sun.nio.ch.FileChannelImpl.java 实现。transferTo() 和 transferFrom() 底层都是基于 sendfile 实现数据传输的，其中 FileChannelImpl.java 定义了 3 个常量，用于标示当前操作系统的内核是否支持 sendfile 以及 sendfile 的相关特性。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static volatile boolean transferSupported = true;</span></span>
<span class="line"><span>private static volatile boolean pipeSupported = true;</span></span>
<span class="line"><span>private static volatile boolean fileSupported = true;</span></span></code></pre></div><ul><li><code>transferSupported</code>：用于标记当前的系统内核是否支持 sendfile() 调用，默认为 true。</li><li><code>pipeSupported</code>：用于标记当前的系统内核是否支持文件描述符（fd）基于管道（pipe）的 sendfile() 调用，默认为 true。</li><li><code>fileSupported</code>：用于标记当前的系统内核是否支持文件描述符（fd）基于文件（file）的 sendfile() 调用，默认为 true。</li></ul><p>下面以 transferTo() 的源码实现为例。FileChannelImpl 首先执行 transferToDirectly() 方法，以 sendfile 的零拷贝方式尝试数据拷贝。如果系统内核不支持 sendfile，进一步执行 transferToTrustedChannel() 方法，以 mmap 的零拷贝方式进行内存映射，这种情况下目的通道必须是 FileChannelImpl 或者 SelChImpl 类型。如果以上两步都失败了，则执行 transferToArbitraryChannel() 方法，基于传统的 I/O 方式完成读写，具体步骤是初始化一个临时的 DirectBuffer，将源通道 FileChannel 的数据读取到 DirectBuffer，再写入目的通道 WritableByteChannel 里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public long transferTo(long position, long count, WritableByteChannel target)</span></span>
<span class="line"><span>        throws IOException {</span></span>
<span class="line"><span>    // 计算文件的大小</span></span>
<span class="line"><span>    long sz = size();</span></span>
<span class="line"><span>    // 校验起始位置</span></span>
<span class="line"><span>    if (position &gt; sz)</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    int icount = (int)Math.min(count, Integer.MAX_VALUE);</span></span>
<span class="line"><span>    // 校验偏移量</span></span>
<span class="line"><span>    if ((sz - position) &lt; icount)</span></span>
<span class="line"><span>        icount = (int)(sz - position);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((n = transferToDirectly(position, icount, target)) &gt;= 0)</span></span>
<span class="line"><span>        return n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((n = transferToTrustedChannel(position, icount, target)) &gt;= 0)</span></span>
<span class="line"><span>        return n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return transferToArbitraryChannel(position, icount, target);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来重点分析一下 transferToDirectly() 方法的实现，也就是 transferTo() 通过 sendfile 实现零拷贝的精髓所在。可以看到，transferToDirectlyInternal() 方法先获取到目的通道 WritableByteChannel 的文件描述符 targetFD，获取同步锁然后执行 transferToDirectlyInternal() 方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private long transferToDirectly(long position, int icount, WritableByteChannel target)</span></span>
<span class="line"><span>        throws IOException {</span></span>
<span class="line"><span>    // 省略从target获取targetFD的过程</span></span>
<span class="line"><span>    if (nd.transferToDirectlyNeedsPositionLock()) {</span></span>
<span class="line"><span>        synchronized (positionLock) {</span></span>
<span class="line"><span>            long pos = position();</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                return transferToDirectlyInternal(position, icount,</span></span>
<span class="line"><span>                        target, targetFD);</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                position(pos);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        return transferToDirectlyInternal(position, icount, target, targetFD);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终由 transferToDirectlyInternal() 调用本地方法 transferTo0() ，尝试以 sendfile 的方式进行数据传输。如果系统内核完全不支持 sendfile，比如 Windows 操作系统，则返回 UNSUPPORTED 并把 transferSupported 标识为 false。如果系统内核不支持 sendfile 的一些特性，比如说低版本的 Linux 内核不支持 DMA gather copy 操作，则返回 UNSUPPORTED_CASE 并把 pipeSupported 或者 fileSupported 标识为 false。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private long transferToDirectlyInternal(long position, int icount,</span></span>
<span class="line"><span>                                        WritableByteChannel target,</span></span>
<span class="line"><span>                                        FileDescriptor targetFD) throws IOException {</span></span>
<span class="line"><span>    assert !nd.transferToDirectlyNeedsPositionLock() ||</span></span>
<span class="line"><span>            Thread.holdsLock(positionLock);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long n = -1;</span></span>
<span class="line"><span>    int ti = -1;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        begin();</span></span>
<span class="line"><span>        ti = threads.add();</span></span>
<span class="line"><span>        if (!isOpen())</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            n = transferTo0(fd, position, icount, targetFD);</span></span>
<span class="line"><span>        } while ((n == IOStatus.INTERRUPTED) &amp;&amp; isOpen());</span></span>
<span class="line"><span>        if (n == IOStatus.UNSUPPORTED_CASE) {</span></span>
<span class="line"><span>            if (target instanceof SinkChannelImpl)</span></span>
<span class="line"><span>                pipeSupported = false;</span></span>
<span class="line"><span>            if (target instanceof FileChannelImpl)</span></span>
<span class="line"><span>                fileSupported = false;</span></span>
<span class="line"><span>            return IOStatus.UNSUPPORTED_CASE;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (n == IOStatus.UNSUPPORTED) {</span></span>
<span class="line"><span>            transferSupported = false;</span></span>
<span class="line"><span>            return IOStatus.UNSUPPORTED;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return IOStatus.normalize(n);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        threads.remove(ti);</span></span>
<span class="line"><span>        end (n &gt; -1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本地方法（native method）transferTo0() 通过 JNI（Java Native Interface）调用底层 C 的函数，这个 native 函数（Java_sun_nio_ch_FileChannelImpl_transferTo0）同样位于 JDK 源码包下的 native/sun/nio/ch/FileChannelImpl.c 源文件里面。JNI 函数 Java_sun_nio_ch_FileChannelImpl_transferTo0() 基于条件编译对不同的系统进行预编译，下面是 JDK 基于 Linux 系统内核对 transferTo() 提供的调用封装。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#if defined(__linux__) || defined(__solaris__)</span></span>
<span class="line"><span>#include &lt;sys/sendfile.h&gt;</span></span>
<span class="line"><span>#elif defined(_AIX)</span></span>
<span class="line"><span>#include &lt;sys/socket.h&gt;</span></span>
<span class="line"><span>#elif defined(_ALLBSD_SOURCE)</span></span>
<span class="line"><span>#include &lt;sys/types.h&gt;</span></span>
<span class="line"><span>#include &lt;sys/socket.h&gt;</span></span>
<span class="line"><span>#include &lt;sys/uio.h&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define lseek64 lseek</span></span>
<span class="line"><span>#define mmap64 mmap</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>JNIEXPORT jlong JNICALL</span></span>
<span class="line"><span>Java_sun_nio_ch_FileChannelImpl_transferTo0(JNIEnv *env, jobject this,</span></span>
<span class="line"><span>                                            jobject srcFDO,</span></span>
<span class="line"><span>                                            jlong position, jlong count,</span></span>
<span class="line"><span>                                            jobject dstFDO)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    jint srcFD = fdval(env, srcFDO);</span></span>
<span class="line"><span>    jint dstFD = fdval(env, dstFDO);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#if defined(__linux__)</span></span>
<span class="line"><span>    off64_t offset = (off64_t)position;</span></span>
<span class="line"><span>    jlong n = sendfile64(dstFD, srcFD, &amp;offset, (size_t)count);</span></span>
<span class="line"><span>    return n;</span></span>
<span class="line"><span>#elif defined(__solaris__)</span></span>
<span class="line"><span>    result = sendfilev64(dstFD, &amp;sfv, 1, &amp;numBytes);    </span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>#elif defined(__APPLE__)</span></span>
<span class="line"><span>    result = sendfile(srcFD, dstFD, position, &amp;numBytes, NULL, 0);</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对 Linux、Solaris 以及 Apple 系统而言，transferTo0() 函数底层会执行 sendfile64 这个系统调用完成零拷贝操作，sendfile64() 函数的原型如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;sys/sendfile.h&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ssize_t sendfile64(int out_fd, int in_fd, off_t *offset, size_t count);</span></span></code></pre></div><p>下面简单介绍一下 sendfile64() 函数各个参数的含义：</p><ul><li><code>out_fd</code>：待写入的文件描述符</li><li><code>in_fd</code>：待读取的文件描述符</li><li><code>offset</code>：指定 in_fd 对应文件流的读取位置，如果为空，则默认从起始位置开始</li><li><code>count</code>：指定在文件描述符 in_fd 和 out_fd 之间传输的字节数</li></ul><p>在 Linux 2.6.3 之前，out_fd 必须是一个 socket，而从 Linux 2.6.3 以后，out_fd 可以是任何文件。也就是说，sendfile64() 函数不仅可以进行网络文件传输，还可以对本地文件实现零拷贝操作。</p><h2 id="其它的零拷贝实现" tabindex="-1">其它的零拷贝实现 <a class="header-anchor" href="#其它的零拷贝实现" aria-label="Permalink to &quot;其它的零拷贝实现&quot;">​</a></h2><h3 id="netty零拷贝" tabindex="-1">Netty零拷贝 <a class="header-anchor" href="#netty零拷贝" aria-label="Permalink to &quot;Netty零拷贝&quot;">​</a></h3><p>Netty 中的零拷贝和上面提到的操作系统层面上的零拷贝不太一样, 我们所说的 Netty 零拷贝完全是基于（Java 层面）用户态的，它的更多的是偏向于数据操作优化这样的概念，具体表现在以下几个方面：</p><p>Netty 通过 DefaultFileRegion 类对 java.nio.channels.FileChannel 的 tranferTo() 方法进行包装，在文件传输时可以将文件缓冲区的数据直接发送到目的通道（Channel）</p><p>ByteBuf 可以通过 wrap 操作把字节数组、ByteBuf、ByteBuffer 包装成一个 ByteBuf 对象, 进而避免了拷贝操作 ByteBuf 支持 slice 操作, 因此可以将 ByteBuf 分解为多个共享同一个存储区域的 ByteBuf，避免了内存的拷贝 Netty 提供了 CompositeByteBuf 类，它可以将多个 ByteBuf 合并为一个逻辑上的 ByteBuf，避免了各个 ByteBuf 之间的拷贝 其中第 1 条属于操作系统层面的零拷贝操作，后面 3 条只能算用户层面的数据操作优化。</p><h3 id="rocketmq和kafka对比" tabindex="-1">RocketMQ和Kafka对比 <a class="header-anchor" href="#rocketmq和kafka对比" aria-label="Permalink to &quot;RocketMQ和Kafka对比&quot;">​</a></h3><p>RocketMQ 选择了 mmap + write 这种零拷贝方式，适用于业务级消息这种小块文件的数据持久化和传输；而 Kafka 采用的是 sendfile 这种零拷贝方式，适用于系统日志消息这种高吞吐量的大块文件的数据持久化和传输。但是值得注意的一点是，Kafka 的索引文件使用的是 mmap + write 方式，数据文件使用的是 sendfile 方式。</p><p><img src="`+l+'" alt="error.图片加载失败"></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>本文主要整理自 <a href="https://zhuanlan.zhihu.com/p/83398714" target="_blank" rel="noreferrer">https://zhuanlan.zhihu.com/p/83398714</a></li><li>作者：零壹技术栈</li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',94)]))}const g=s(i,[["render",t]]);export{h as __pageData,g as default};
