import{_ as s,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const h=JSON.parse('{"title":"Java 8 - 其它更新: 字符串，base64,...","description":"","frontmatter":{},"headers":[],"relativePath":"java/java8/java8-others.md","filePath":"java/java8/java8-others.md","lastUpdated":1737706346000}'),t={name:"java/java8/java8-others.md"};function l(i,a,o,c,r,d){return p(),n("div",null,a[0]||(a[0]=[e(`<h1 id="java-8-其它更新-字符串-base64" tabindex="-1">Java 8 - 其它更新: 字符串，base64,... <a class="header-anchor" href="#java-8-其它更新-字符串-base64" aria-label="Permalink to &quot;Java 8 - 其它更新: 字符串，base64,...&quot;">​</a></h1><blockquote><p>本文对Java 8 其它更新介绍和解读。@pdai</p></blockquote><h2 id="处理数值" tabindex="-1">处理数值 <a class="header-anchor" href="#处理数值" aria-label="Permalink to &quot;处理数值&quot;">​</a></h2><p>Java8添加了对无符号数的额外支持。Java中的数值总是有符号的，例如，让我们来观察Integer:</p><p>int可表示最多2 ** 32个数。Java中的数值默认为有符号的，所以最后一个二进制数字表示符号(0为正数，1为负数)。所以从十进制的0开始，最大的有符号正整数为2 ** 31 - 1。</p><p>你可以通过Integer.MAX_VALUE来访问它:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>System.out.println(Integer.MAX_VALUE);      // 2147483647</span></span>
<span class="line"><span>System.out.println(Integer.MAX_VALUE + 1);  // -2147483648</span></span></code></pre></div><p>Java8添加了解析无符号整数的支持，让我们看看它如何工作:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>long maxUnsignedInt = (1l &lt;&lt; 32) - 1;</span></span>
<span class="line"><span>String string = String.valueOf(maxUnsignedInt);</span></span>
<span class="line"><span>int unsignedInt = Integer.parseUnsignedInt(string, 10);</span></span>
<span class="line"><span>String string2 = Integer.toUnsignedString(unsignedInt, 10);</span></span></code></pre></div><p>就像你看到的那样，现在可以将最大的无符号数2 ** 32 - 1解析为整数。而且你也可以将这个数值转换回无符号数的字符串表示。</p><p>这在之前不可能使用parseInt完成，就像这个例子展示的那样:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try {</span></span>
<span class="line"><span>    Integer.parseInt(string, 10);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch (NumberFormatException e) {</span></span>
<span class="line"><span>    System.err.println(&quot;could not parse signed int of &quot; + maxUnsignedInt);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个数值不可解析为有符号整数，因为它超出了最大范围2 ** 31 - 1。 算术运算</p><p>Math工具类新增了一些方法来处理数值溢出。这是什么意思呢? 我们已经看到了所有数值类型都有最大值。所以当算术运算的结果不能被它的大小装下时，会发生什么呢?</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>System.out.println(Integer.MAX_VALUE);      // 2147483647</span></span>
<span class="line"><span>System.out.println(Integer.MAX_VALUE + 1);  // -2147483648</span></span></code></pre></div><p>就像你看到的那样，发生了整数溢出，这通常是我们不愿意看到的。</p><p>Java8添加了严格数学运算的支持来解决这个问题。Math扩展了一些方法，它们全部以exact结尾，例如addExact。当运算结果不能被数值类型装下时，这些方法通过抛出ArithmeticException异常来合理地处理溢出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try {</span></span>
<span class="line"><span>    Math.addExact(Integer.MAX_VALUE, 1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch (ArithmeticException e) {</span></span>
<span class="line"><span>    System.err.println(e.getMessage());</span></span>
<span class="line"><span>    // =&gt; integer overflow</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当尝试通过toIntExact将长整数转换为整数时，可能会抛出同样的异常:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try {</span></span>
<span class="line"><span>    Math.toIntExact(Long.MAX_VALUE);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch (ArithmeticException e) {</span></span>
<span class="line"><span>    System.err.println(e.getMessage());</span></span>
<span class="line"><span>    // =&gt; integer overflow</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="处理文件" tabindex="-1">处理文件 <a class="header-anchor" href="#处理文件" aria-label="Permalink to &quot;处理文件&quot;">​</a></h2><p>Files工具类首次在Java7中引入，作为NIO的一部分。JDK8 API添加了一些额外的方法，它们可以将文件用于函数式数据流。让我们深入探索一些代码示例。 列出文件</p><p>Files.list方法将指定目录的所有路径转换为数据流，便于我们在文件系统的内容上使用类似filter和sorted的流操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try (Stream&lt;Path&gt; stream = Files.list(Paths.get(&quot;&quot;))) {</span></span>
<span class="line"><span>    String joined = stream</span></span>
<span class="line"><span>        .map(String::valueOf)</span></span>
<span class="line"><span>        .filter(path -&gt; !path.startsWith(&quot;.&quot;))</span></span>
<span class="line"><span>        .sorted()</span></span>
<span class="line"><span>        .collect(Collectors.joining(&quot;; &quot;));</span></span>
<span class="line"><span>    System.out.println(&quot;List: &quot; + joined);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的例子列出了当前工作目录的所有文件，之后将每个路径都映射为它的字符串表示。之后结果被过滤、排序，最后连接为一个字符串。如果你还不熟悉函数式数据流，你应该阅读我的Java8数据流教程。</p><p>你可能已经注意到，数据流的创建包装在try-with语句中。数据流实现了AutoCloseable，并且这里我们需要显式关闭数据流，因为它基于IO操作。</p><blockquote><p>返回的数据流是DirectoryStream的封装。如果需要及时处理文件资源，就应该使用try-with结构来确保在流式操作完成后，数据流的close方法被调用。</p></blockquote><h2 id="查找文件" tabindex="-1">查找文件 <a class="header-anchor" href="#查找文件" aria-label="Permalink to &quot;查找文件&quot;">​</a></h2><p>下面的例子演示了如何查找在目录及其子目录下的文件:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Path start = Paths.get(&quot;&quot;);</span></span>
<span class="line"><span>int maxDepth = 5;</span></span>
<span class="line"><span>try (Stream&lt;Path&gt; stream = Files.find(start, maxDepth, (path, attr) -&gt;</span></span>
<span class="line"><span>        String.valueOf(path).endsWith(&quot;.js&quot;))) {</span></span>
<span class="line"><span>    String joined = stream</span></span>
<span class="line"><span>        .sorted()</span></span>
<span class="line"><span>        .map(String::valueOf)</span></span>
<span class="line"><span>        .collect(Collectors.joining(&quot;; &quot;));</span></span>
<span class="line"><span>    System.out.println(&quot;Found: &quot; + joined);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>find方法接受三个参数: 目录路径start是起始点，maxDepth定义了最大搜索深度。第三个参数是一个匹配谓词，定义了搜索的逻辑。上面的例子中，我们搜索了所有JavaScirpt文件(以.js结尾的文件名)。</p><p>我们可以使用Files.walk方法来完成相同的行为。这个方法会遍历每个文件，而不需要传递搜索谓词。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Path start = Paths.get(&quot;&quot;);</span></span>
<span class="line"><span>int maxDepth = 5;</span></span>
<span class="line"><span>try (Stream&lt;Path&gt; stream = Files.walk(start, maxDepth)) {</span></span>
<span class="line"><span>    String joined = stream</span></span>
<span class="line"><span>        .map(String::valueOf)</span></span>
<span class="line"><span>        .filter(path -&gt; path.endsWith(&quot;.js&quot;))</span></span>
<span class="line"><span>        .sorted()</span></span>
<span class="line"><span>        .collect(Collectors.joining(&quot;; &quot;));</span></span>
<span class="line"><span>    System.out.println(&quot;walk(): &quot; + joined);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个例子中，我们使用了流式操作filter来完成和上个例子相同的行为。</p><h2 id="读写文件" tabindex="-1">读写文件 <a class="header-anchor" href="#读写文件" aria-label="Permalink to &quot;读写文件&quot;">​</a></h2><p>将文本文件读到内存，以及向文本文件写入字符串在Java 8 中是简单的任务。不需要再去摆弄读写器了。Files.readAllLines从指定的文件把所有行读进字符串列表中。你可以简单地修改这个列表，并且将它通过Files.write写到另一个文件中:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;String&gt; lines = Files.readAllLines(Paths.get(&quot;res/nashorn1.js&quot;));</span></span>
<span class="line"><span>lines.add(&quot;print(&#39;foobar&#39;);&quot;);</span></span>
<span class="line"><span>Files.write(Paths.get(&quot;res/nashorn1-modified.js&quot;), lines);</span></span></code></pre></div><p>要注意这些方法对内存并不十分高效，因为整个文件都会读进内存。文件越大，所用的堆区也就越大。</p><p>你可以使用Files.lines方法来作为内存高效的替代。这个方法读取每一行，并使用函数式数据流来对其流式处理，而不是一次性把所有行都读进内存。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try (Stream&lt;String&gt; stream = Files.lines(Paths.get(&quot;res/nashorn1.js&quot;))) {</span></span>
<span class="line"><span>    stream</span></span>
<span class="line"><span>        .filter(line -&gt; line.contains(&quot;print&quot;))</span></span>
<span class="line"><span>        .map(String::trim)</span></span>
<span class="line"><span>        .forEach(System.out::println);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果你需要更多的精细控制，你需要构造一个新的BufferedReader来代替:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Path path = Paths.get(&quot;res/nashorn1.js&quot;);</span></span>
<span class="line"><span>try (BufferedReader reader = Files.newBufferedReader(path)) {</span></span>
<span class="line"><span>    System.out.println(reader.readLine());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>或者，你需要写入文件时，简单地构造一个BufferedWriter来代替:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Path path = Paths.get(&quot;res/output.js&quot;);</span></span>
<span class="line"><span>try (BufferedWriter writer = Files.newBufferedWriter(path)) {</span></span>
<span class="line"><span>    writer.write(&quot;print(&#39;Hello World&#39;);&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>BufferedReader也可以访问函数式数据流。lines方法在它所有行上面构建数据流:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Path path = Paths.get(&quot;res/nashorn1.js&quot;);</span></span>
<span class="line"><span>try (BufferedReader reader = Files.newBufferedReader(path)) {</span></span>
<span class="line"><span>    long countPrints = reader</span></span>
<span class="line"><span>        .lines()</span></span>
<span class="line"><span>        .filter(line -&gt; line.contains(&quot;print&quot;))</span></span>
<span class="line"><span>        .count();</span></span>
<span class="line"><span>    System.out.println(countPrints);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>目前为止你可以看到Java8提供了三个简单的方法来读取文本文件的每一行，使文件处理更加便捷。</p><p>不幸的是你需要显式使用try-with语句来关闭文件流，这会使示例代码有些凌乱。我期待函数式数据流可以在调用类似count和collect时可以自动关闭，因为你不能在相同数据流上调用终止操作两次。</p><h2 id="java-util-random" tabindex="-1">java.util.Random <a class="header-anchor" href="#java-util-random" aria-label="Permalink to &quot;java.util.Random&quot;">​</a></h2><p>在Java8中java.util.Random类的一个非常明显的变化就是新增了返回随机数流(random Stream of numbers)的一些方法。</p><p>下面的代码是创建一个无穷尽的double类型的数字流，这些数字在0(包括0)和1(不包含1)之间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Random random = new Random();</span></span>
<span class="line"><span>DoubleStream doubleStream = random.doubles();</span></span></code></pre></div><p>下面的代码是创建一个无穷尽的int类型的数字流，这些数字在0(包括0)和100(不包括100)之间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Random random = new Random();</span></span>
<span class="line"><span>IntStream intStream = random.ints(0, 100);</span></span></code></pre></div><p>那么这些无穷尽的数字流用来做什么呢? 接下来，我通过一些案例来分析。记住，这些无穷大的数字流只能通过某种方式被截断(limited)。</p><p>示例1: 创建10个随机的整数流并打印出来:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>intStream.limit(10).forEach(System.out::println);</span></span></code></pre></div><p>示例2: 创建100个随机整数:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    List&lt;Integer&gt; randomBetween0And99 = intStream</span></span>
<span class="line"><span>                                       .limit(100)</span></span>
<span class="line"><span>                                       .boxed()</span></span>
<span class="line"><span>                                       .collect(Collectors.toList());</span></span></code></pre></div><p>对于高斯伪随机数(gaussian pseudo-random values)来说，random.doubles()方法所创建的流不能等价于高斯伪随机数，然而，如果用java8所提供的功能是非常容易实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Random random = new Random();</span></span>
<span class="line"><span>DoubleStream gaussianStream = Stream.generate(random::nextGaussian).mapToDouble(e -&gt; e);</span></span></code></pre></div><p>这里，我使用了Stream.generate api，并传入Supplier 类的对象作为参数，这个对象是通过调用Random类中的方法 nextGaussian()创建另一个高斯伪随机数。</p><p>接下来，我们来对double类型的伪随机数流和double类型的高斯伪随机数流做一个更加有意思的事情，那就是获得两个流的随机数的分配情况。预期的结果是: double类型的伪随机数是均匀的分配的，而double类型的高斯伪随机数应该是正态分布的。</p><p>通过下面的代码，我生成了一百万个伪随机数，这是通过java8提供的api实现的:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Random random = new Random();</span></span>
<span class="line"><span>DoubleStream doubleStream = random.doubles(-1.0, 1.0);</span></span>
<span class="line"><span>LinkedHashMap&lt;Range, Integer&gt; rangeCountMap = doubleStream.limit(1000000)</span></span>
<span class="line"><span>    .boxed()</span></span>
<span class="line"><span>    .map(Ranges::of)</span></span>
<span class="line"><span>    .collect(Ranges::emptyRangeCountMap, (m, e) -&gt; m.put(e, m.get(e) + 1), Ranges::mergeRangeCountMaps);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rangeCountMap.forEach((k, v) -&gt; System.out.println(k.from() + &quot;\\t&quot; + v));</span></span></code></pre></div><p>代码的运行结果如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    -1      49730</span></span>
<span class="line"><span>    -0.9    49931</span></span>
<span class="line"><span>    -0.8    50057</span></span>
<span class="line"><span>    -0.7    50060</span></span>
<span class="line"><span>    -0.6    49963</span></span>
<span class="line"><span>    -0.5    50159</span></span>
<span class="line"><span>    -0.4    49921</span></span>
<span class="line"><span>    -0.3    49962</span></span>
<span class="line"><span>    -0.2    50231</span></span>
<span class="line"><span>    -0.1    49658</span></span>
<span class="line"><span>    0       50177</span></span>
<span class="line"><span>    0.1     49861</span></span>
<span class="line"><span>    0.2     49947</span></span>
<span class="line"><span>    0.3     50157</span></span>
<span class="line"><span>    0.4     50414</span></span>
<span class="line"><span>    0.5     50006</span></span>
<span class="line"><span>    0.6     50038</span></span>
<span class="line"><span>    0.7     49962</span></span>
<span class="line"><span>    0.8     50071</span></span>
<span class="line"><span>    0.9     49695</span></span></code></pre></div><p>为了类比，我们再生成一百万个高斯伪随机数:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Random random = new Random();</span></span>
<span class="line"><span>DoubleStream gaussianStream = Stream.generate(random::nextGaussian).mapToDouble(e -&gt; e);</span></span>
<span class="line"><span>LinkedHashMap&lt;Range, Integer&gt; gaussianRangeCountMap =</span></span>
<span class="line"><span>    gaussianStream</span></span>
<span class="line"><span>            .filter(e -&gt; (e &gt;= -1.0 &amp;&amp; e &lt; 1.0))</span></span>
<span class="line"><span>            .limit(1000000)</span></span>
<span class="line"><span>            .boxed()</span></span>
<span class="line"><span>            .map(Ranges::of)</span></span>
<span class="line"><span>            .collect(Ranges::emptyRangeCountMap, (m, e) -&gt; m.put(e, m.get(e) + 1), Ranges::mergeRangeCountMaps);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>gaussianRangeCountMap.forEach((k, v) -&gt; System.out.println(k.from() + &quot;\\t&quot; + v));</span></span></code></pre></div><p>上面代码输出的结果恰恰与我们预期结果相吻合，即: double类型的伪随机数是均匀的分配的，而double类型的高斯伪随机数应该是正态分布的。</p><p>附: 完整代码可点击这里获取 <a href="https://gist.github.com/bijukunjummen/8129250" target="_blank" rel="noreferrer">https://gist.github.com/bijukunjummen/8129250</a></p><p>译文链接: <a href="http://www.importnew.com/9672.html" target="_blank" rel="noreferrer">http://www.importnew.com/9672.html</a></p><h2 id="java-util-base64" tabindex="-1">java.util.Base64 <a class="header-anchor" href="#java-util-base64" aria-label="Permalink to &quot;java.util.Base64&quot;">​</a></h2><blockquote><p>Java8中java.util.Base64性能比较高，推荐使用。请参考:</p></blockquote><ul><li>性能对比: <a href="https://wizardforcel.gitbooks.io/java8-new-features/content/11.html" target="_blank" rel="noreferrer">https://wizardforcel.gitbooks.io/java8-new-features/content/11.html</a></li><li>源代码: <a href="http://git.oschina.net/benhail/javase8-sample" target="_blank" rel="noreferrer">http://git.oschina.net/benhail/javase8-sample</a></li></ul><p>该类提供了一套静态方法获取下面三种BASE64编解码器:</p><p>1)Basic编码: 是标准的BASE64编码，用于处理常规的需求</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 编码</span></span>
<span class="line"><span>String asB64 = Base64.getEncoder().encodeToString(&quot;some string&quot;.getBytes(&quot;utf-8&quot;));</span></span>
<span class="line"><span>System.out.println(asB64); // 输出为: c29tZSBzdHJpbmc=</span></span>
<span class="line"><span>// 解码</span></span>
<span class="line"><span>byte[] asBytes = Base64.getDecoder().decode(&quot;c29tZSBzdHJpbmc=&quot;);</span></span>
<span class="line"><span>System.out.println(new String(asBytes, &quot;utf-8&quot;)); // 输出为: some string</span></span></code></pre></div><p>2)URL编码: 使用下划线替换URL里面的反斜线“/”</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String urlEncoded = Base64.getUrlEncoder().encodeToString(&quot;subjects?abcd&quot;.getBytes(&quot;utf-8&quot;));</span></span>
<span class="line"><span>System.out.println(&quot;Using URL Alphabet: &quot; + urlEncoded);</span></span>
<span class="line"><span>// 输出为:</span></span>
<span class="line"><span>Using URL Alphabet: c3ViamVjdHM_YWJjZA==</span></span></code></pre></div><p>3)MIME编码: 使用基本的字母数字产生BASE64输出，而且对MIME格式友好: 每一行输出不超过76个字符，而且每行以“\\r\\n”符结束。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>StringBuilder sb = new StringBuilder();</span></span>
<span class="line"><span>for (int t = 0; t &lt; 10; ++t) {</span></span>
<span class="line"><span>  sb.append(UUID.randomUUID().toString());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>byte[] toEncode = sb.toString().getBytes(&quot;utf-8&quot;);</span></span>
<span class="line"><span>String mimeEncoded = Base64.getMimeEncoder().encodeToString(toEncode);</span></span>
<span class="line"><span>System.out.println(mimeEncoded);</span></span></code></pre></div><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><p><a href="https://wizardforcel.gitbooks.io/modern-java/ch7.html" target="_blank" rel="noreferrer">https://wizardforcel.gitbooks.io/modern-java/ch7.html</a></p></li><li><p><a href="http://www.importnew.com/9672.html" target="_blank" rel="noreferrer">http://www.importnew.com/9672.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,85)]))}const g=s(t,[["render",l]]);export{h as __pageData,g as default};
