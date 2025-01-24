import{_ as s}from"./chunks/arch-z-id-3.A5TBFxRu.js";import{_ as n,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/arch/arch-z-id-1.png",i="/vitepress-blog-template/images/arch/arch-z-id-2.png",o="/vitepress-blog-template/images/arch/arch-z-id-4.png",r="/vitepress-blog-template/images/arch/arch-z-id-5.png",c="/vitepress-blog-template/images/arch/arch-z-id-6.png",d="/vitepress-blog-template/images/arch/arch-z-id-7.png",u="/vitepress-blog-template/images/arch/arch-z-id-8.png",h="/vitepress-blog-template/images/arch/arch-z-id-9.png",g="/vitepress-blog-template/images/arch/arch-z-id-10.png",w=JSON.parse('{"title":"分布式系统 - 全局唯一ID实现方案","description":"","frontmatter":{},"headers":[],"relativePath":"arch/distribute/arch-z-id.md","filePath":"arch/distribute/arch-z-id.md","lastUpdated":1737706346000}'),m={name:"arch/distribute/arch-z-id.md"};function f(b,a,I,k,D,q){return l(),p("div",null,a[0]||(a[0]=[e('<h1 id="分布式系统-全局唯一id实现方案" tabindex="-1">分布式系统 - 全局唯一ID实现方案 <a class="header-anchor" href="#分布式系统-全局唯一id实现方案" aria-label="Permalink to &quot;分布式系统 - 全局唯一ID实现方案&quot;">​</a></h1><blockquote><p>本文主要介绍常见的分布式ID生成方式，大致分类的话可以分为两类：<strong>一种是类DB型的</strong>，根据设置不同起始值和步长来实现趋势递增，需要考虑服务的容错性和可用性; <strong>另一种是类snowflake型</strong>，这种就是将64位划分为不同的段，每段代表不同的涵义，基本就是时间戳、机器ID和序列数。这种方案就是需要考虑时钟回拨的问题以及做一些 buffer的缓冲设计提高性能。@pdai</p></blockquote><h2 id="为什么需要全局唯一id" tabindex="-1">为什么需要全局唯一ID <a class="header-anchor" href="#为什么需要全局唯一id" aria-label="Permalink to &quot;为什么需要全局唯一ID&quot;">​</a></h2><p>传统的单体架构的时候，我们基本是单库然后业务单表的结构。每个业务表的ID一般我们都是从1增，通过AUTO_INCREMENT=1设置自增起始值，但是在分布式服务架构模式下分库分表的设计，使得多个库或多个表存储相同的业务数据。这种情况根据数据库的自增ID就会产生相同ID的情况，不能保证主键的唯一性。</p><p><img src="'+t+`" alt="error.图片加载失败"></p><p>如上图，如果第一个订单存储在 DB1 上则订单 ID 为1，当一个新订单又入库了存储在 DB2 上订单 ID 也为1。我们系统的架构虽然是分布式的，但是在用户层应是无感知的，重复的订单主键显而易见是不被允许的。那么针对分布式系统如何做到主键唯一性呢？</p><h2 id="uuid" tabindex="-1">UUID <a class="header-anchor" href="#uuid" aria-label="Permalink to &quot;UUID&quot;">​</a></h2><p><code>UUID （Universally Unique Identifier）</code>，通用唯一识别码的缩写。UUID是由一组32位数的16进制数字所构成，所以UUID理论上的总数为 <code>16^32=2^128</code>，约等于 <code>3.4 x 10^38</code>。也就是说若每纳秒产生1兆个UUID，要花100亿年才会将所有UUID用完。</p><p>生成的UUID是由 8-4-4-4-12格式的数据组成，其中32个字符和4个连字符&#39; - &#39;，一般我们使用的时候会将连字符删除 uuid.<code>toString().replaceAll(&quot;-&quot;,&quot;&quot;)</code>。</p><p>目前UUID的产生方式有5种版本，每个版本的算法不同，应用范围也不同。</p><ul><li><p><code>基于时间的UUID</code> - 版本1： 这个一般是通过当前时间，随机数，和本地Mac地址来计算出来，可以通过 org.apache.logging.log4j.core.util包中的 UuidUtil.getTimeBasedUuid()来使用或者其他包中工具。由于使用了MAC地址，因此能够确保唯一性，但是同时也暴露了MAC地址，私密性不够好。</p></li><li><p><code>DCE安全的UUID</code> - 版本2 DCE（Distributed Computing Environment）安全的UUID和基于时间的UUID算法相同，但会把时间戳的前4位置换为POSIX的UID或GID。这个版本的UUID在实际中较少用到。</p></li><li><p><code>基于名字的UUID（MD5）</code>- 版本3 基于名字的UUID通过计算名字和名字空间的MD5散列值得到。这个版本的UUID保证了：相同名字空间中不同名字生成的UUID的唯一性；不同名字空间中的UUID的唯一性；相同名字空间中相同名字的UUID重复生成是相同的。</p></li><li><p><code>随机UUID</code> - 版本4 根据随机数，或者伪随机数生成UUID。这种UUID产生重复的概率是可以计算出来的，但是重复的可能性可以忽略不计，因此该版本也是被经常使用的版本。JDK中使用的就是这个版本。</p></li><li><p><code>基于名字的UUID（SHA1）</code> - 版本5 和基于名字的UUID算法类似，只是散列值计算使用SHA1（Secure Hash Algorithm 1）算法。</p></li></ul><p>我们 Java中 JDK自带的 UUID产生方式就是版本4根据随机数生成的 UUID 和版本3基于名字的 UUID，有兴趣的可以去看看它的源码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //获取一个版本4根据随机字节数组的UUID。</span></span>
<span class="line"><span>    UUID uuid = UUID.randomUUID();</span></span>
<span class="line"><span>    System.out.println(uuid.toString().replaceAll(&quot;-&quot;,&quot;&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //获取一个版本3(基于名称)根据指定的字节数组的UUID。</span></span>
<span class="line"><span>    byte[] nbyte = {10, 20, 30};</span></span>
<span class="line"><span>    UUID uuidFromBytes = UUID.nameUUIDFromBytes(nbyte);</span></span>
<span class="line"><span>    System.out.println(uuidFromBytes.toString().replaceAll(&quot;-&quot;,&quot;&quot;));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>得到的UUID结果，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>59f51e7ea5ca453bbfaf2c1579f09f1d</span></span>
<span class="line"><span>7f49b84d0bbc38e9a493718013baace6</span></span></code></pre></div><p>虽然 UUID 生成方便，本地生成没有网络消耗，但是使用起来也有一些缺点，</p><ul><li><strong>不易于存储</strong>：UUID太长，16字节128位，通常以36长度的字符串表示，很多场景不适用。</li><li><strong>信息不安全</strong>：基于MAC地址生成UUID的算法可能会造成MAC地址泄露，暴露使用者的位置。</li><li><strong>对MySQL索引不利</strong>：如果作为数据库主键，在InnoDB引擎下，UUID的无序性可能会引起数据位置频繁变动，严重影响性能，可以查阅 Mysql 索引原理 B+树的知识。</li></ul><h2 id="数据库生成" tabindex="-1">数据库生成 <a class="header-anchor" href="#数据库生成" aria-label="Permalink to &quot;数据库生成&quot;">​</a></h2><p>是不是一定要基于外界的条件才能满足分布式唯一ID的需求呢，我们能不能在我们分布式数据库的基础上获取我们需要的ID？</p><p>由于分布式数据库的起始自增值一样所以才会有冲突的情况发生，那么我们将分布式系统中数据库的同一个业务表的自增ID设计成不一样的起始值，然后设置固定的步长，步长的值即为分库的数量或分表的数量。</p><p>以MySQL举例，利用给字段设置<code>auto_increment_increment</code>和<code>auto_increment_offset</code>来保证ID自增。</p><ul><li><code>auto_increment_offset</code>：表示自增长字段从那个数开始，他的取值范围是1 .. 65535。</li><li><code>auto_increment_increment</code>：表示自增长字段每次递增的量，其默认值是1，取值范围是1 .. 65535。</li></ul><p>假设有三台机器，则DB1中order表的起始ID值为1，DB2中order表的起始值为2，DB3中order表的起始值为3，它们自增的步长都为3，则它们的ID生成范围如下图所示：</p><p><img src="`+i+'" alt="error.图片加载失败"></p><p>通过这种方式明显的优势就是依赖于数据库自身不需要其他资源，并且ID号单调自增，可以实现一些对ID有特殊要求的业务。</p><p>但是缺点也很明显，首先它<strong>强依赖DB</strong>，当DB异常时整个系统不可用。虽然配置主从复制可以尽可能的增加可用性，但是<strong>数据一致性在特殊情况下难以保证</strong>。主从切换时的不一致可能会导致重复发号。还有就是<strong>ID发号性能瓶颈限制在单台MySQL的读写性能</strong>。</p><h2 id="使用redis实现" tabindex="-1">使用redis实现 <a class="header-anchor" href="#使用redis实现" aria-label="Permalink to &quot;使用redis实现&quot;">​</a></h2><p>Redis实现分布式唯一ID主要是通过提供像 <code>INCR</code> 和 <code>INCRBY</code> 这样的自增原子命令，由于Redis自身的单线程的特点所以能保证生成的 ID 肯定是唯一有序的。</p><p>但是单机存在性能瓶颈，无法满足高并发的业务需求，所以可以采用集群的方式来实现。集群的方式又会涉及到和数据库集群同样的问题，所以也需要设置分段和步长来实现。</p><p>为了避免长期自增后数字过大可以通过与当前时间戳组合起来使用，另外为了保证并发和业务多线程的问题可以采用 Redis + Lua的方式进行编码，保证安全。</p><p>Redis 实现分布式全局唯一ID，它的性能比较高，生成的数据是有序的，对排序业务有利，但是同样它依赖于redis，<strong>需要系统引进redis组件，增加了系统的配置复杂性</strong>。</p><p>当然现在Redis的使用性很普遍，所以如果其他业务已经引进了Redis集群，则可以资源利用考虑使用Redis来实现。</p><h2 id="雪花算法-snowflake" tabindex="-1">雪花算法-Snowflake <a class="header-anchor" href="#雪花算法-snowflake" aria-label="Permalink to &quot;雪花算法-Snowflake&quot;">​</a></h2><p>Snowflake，雪花算法是由Twitter开源的分布式ID生成算法，以划分命名空间的方式将 64-bit位分割成多个部分，每个部分代表不同的含义。而 Java中64bit的整数是Long类型，所以在 Java 中 SnowFlake 算法生成的 ID 就是 long 来存储的。</p><ul><li><strong>第1位</strong>占用1bit，其值始终是0，可看做是符号位不使用。</li><li><strong>第2位</strong>开始的41位是时间戳，41-bit位可表示2^41个数，每个数代表毫秒，那么雪花算法可用的时间年限是<code>(1L&lt;&lt;41)/(1000L360024*365)</code>=69 年的时间。</li><li><strong>中间的10-bit位</strong>可表示机器数，即2^10 = 1024台机器，但是一般情况下我们不会部署这么台机器。如果我们对IDC（互联网数据中心）有需求，还可以将 10-bit 分 5-bit 给 IDC，分5-bit给工作机器。这样就可以表示32个IDC，每个IDC下可以有32台机器，具体的划分可以根据自身需求定义。</li><li><strong>最后12-bit位</strong>是自增序列，可表示2^12 = 4096个数。</li></ul><p>这样的划分之后相当于<strong>在一毫秒一个数据中心的一台机器上可产生4096个有序的不重复的ID</strong>。但是我们 IDC 和机器数肯定不止一个，所以毫秒内能生成的有序ID数是翻倍的。</p><p><img src="'+s+`" alt="error.图片加载失败"></p><p>Snowflake 的Twitter官方原版是用Scala写的，对Scala语言有研究的同学可以去阅读下，以下是 Java 版本的写法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.jajian.demo.distribute;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Twitter_Snowflake&lt;br&gt;</span></span>
<span class="line"><span> * SnowFlake的结构如下(每部分用-分开):&lt;br&gt;</span></span>
<span class="line"><span> * 0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 - 000000000000 &lt;br&gt;</span></span>
<span class="line"><span> * 1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0&lt;br&gt;</span></span>
<span class="line"><span> * 41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，而是存储时间截的差值（当前时间截 - 开始时间截)</span></span>
<span class="line"><span> * 得到的值），这里的的开始时间截，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间截，可以使用69年，年T = (1L &lt;&lt; 41) / (1000L * 60 * 60 * 24 * 365) = 69&lt;br&gt;</span></span>
<span class="line"><span> * 10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId&lt;br&gt;</span></span>
<span class="line"><span> * 12位序列，毫秒内的计数，12位的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号&lt;br&gt;</span></span>
<span class="line"><span> * 加起来刚好64位，为一个Long型。&lt;br&gt;</span></span>
<span class="line"><span> * SnowFlake的优点是，整体上按照时间自增排序，并且整个分布式系统内不会产生ID碰撞(由数据中心ID和机器ID作区分)，并且效率较高，经测试，SnowFlake每秒能够产生26万ID左右。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class SnowflakeDistributeId {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ==============================Fields===========================================</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 开始时间截 (2015-01-01)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long twepoch = 1420041600000L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 机器id所占的位数</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long workerIdBits = 5L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 数据标识id所占的位数</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long datacenterIdBits = 5L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 支持的最大机器id，结果是31 (这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long maxWorkerId = -1L ^ (-1L &lt;&lt; workerIdBits);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 支持的最大数据标识id，结果是31</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long maxDatacenterId = -1L ^ (-1L &lt;&lt; datacenterIdBits);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 序列在id中占的位数</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long sequenceBits = 12L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 机器ID向左移12位</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long workerIdShift = sequenceBits;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 数据标识id向左移17位(12+5)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long datacenterIdShift = sequenceBits + workerIdBits;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 时间截向左移22位(5+5+12)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final long sequenceMask = -1L ^ (-1L &lt;&lt; sequenceBits);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 工作机器ID(0~31)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private long workerId;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 数据中心ID(0~31)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private long datacenterId;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 毫秒内序列(0~4095)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private long sequence = 0L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 上次生成ID的时间截</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private long lastTimestamp = -1L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //==============================Constructors=====================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 构造函数</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param workerId     工作ID (0~31)</span></span>
<span class="line"><span>     * @param datacenterId 数据中心ID (0~31)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public SnowflakeDistributeId(long workerId, long datacenterId) {</span></span>
<span class="line"><span>        if (workerId &gt; maxWorkerId || workerId &lt; 0) {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(String.format(&quot;worker Id can&#39;t be greater than %d or less than 0&quot;, maxWorkerId));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (datacenterId &gt; maxDatacenterId || datacenterId &lt; 0) {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(String.format(&quot;datacenter Id can&#39;t be greater than %d or less than 0&quot;, maxDatacenterId));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        this.workerId = workerId;</span></span>
<span class="line"><span>        this.datacenterId = datacenterId;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ==============================Methods==========================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 获得下一个ID (该方法是线程安全的)</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return SnowflakeId</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public synchronized long nextId() {</span></span>
<span class="line"><span>        long timestamp = timeGen();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过这个时候应当抛出异常</span></span>
<span class="line"><span>        if (timestamp &lt; lastTimestamp) {</span></span>
<span class="line"><span>            throw new RuntimeException(</span></span>
<span class="line"><span>                    String.format(&quot;Clock moved backwards.  Refusing to generate id for %d milliseconds&quot;, lastTimestamp - timestamp));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //如果是同一时间生成的，则进行毫秒内序列</span></span>
<span class="line"><span>        if (lastTimestamp == timestamp) {</span></span>
<span class="line"><span>            sequence = (sequence + 1) &amp; sequenceMask;</span></span>
<span class="line"><span>            //毫秒内序列溢出</span></span>
<span class="line"><span>            if (sequence == 0) {</span></span>
<span class="line"><span>                //阻塞到下一个毫秒,获得新的时间戳</span></span>
<span class="line"><span>                timestamp = tilNextMillis(lastTimestamp);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //时间戳改变，毫秒内序列重置</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            sequence = 0L;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //上次生成ID的时间截</span></span>
<span class="line"><span>        lastTimestamp = timestamp;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //移位并通过或运算拼到一起组成64位的ID</span></span>
<span class="line"><span>        return ((timestamp - twepoch) &lt;&lt; timestampLeftShift) //</span></span>
<span class="line"><span>                | (datacenterId &lt;&lt; datacenterIdShift) //</span></span>
<span class="line"><span>                | (workerId &lt;&lt; workerIdShift) //</span></span>
<span class="line"><span>                | sequence;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 阻塞到下一个毫秒，直到获得新的时间戳</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param lastTimestamp 上次生成ID的时间截</span></span>
<span class="line"><span>     * @return 当前时间戳</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected long tilNextMillis(long lastTimestamp) {</span></span>
<span class="line"><span>        long timestamp = timeGen();</span></span>
<span class="line"><span>        while (timestamp &lt;= lastTimestamp) {</span></span>
<span class="line"><span>            timestamp = timeGen();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return timestamp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 返回以毫秒为单位的当前时间</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return 当前时间(毫秒)</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected long timeGen() {</span></span>
<span class="line"><span>        return System.currentTimeMillis();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试的代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    SnowflakeDistributeId idWorker = new SnowflakeDistributeId(0, 0);</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 1000; i++) {</span></span>
<span class="line"><span>        long id = idWorker.nextId();</span></span>
<span class="line"><span>//      System.out.println(Long.toBinaryString(id));</span></span>
<span class="line"><span>        System.out.println(id);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>雪花算法提供了一个很好的设计思想，雪花算法生成的ID是趋势递增，不依赖数据库等第三方系统，以服务的方式部署，稳定性更高，生成ID的性能也是非常高的，而且可以根据自身业务特性分配bit位，非常灵活</strong>。</p><p>但是雪花算法强<strong>依赖机器时钟</strong>，如果机器上时钟回拨，会导致发号重复或者服务会处于不可用状态。如果恰巧回退前生成过一些ID，而时间回退后，生成的ID就有可能重复。官方对于此并没有给出解决方案，而是简单的抛错处理，这样会造成在时间被追回之前的这段时间服务不可用。</p><p>很多其他类雪花算法也是在此思想上的设计然后改进规避它的缺陷，后面介绍的<code>百度 UidGenerator</code> 和 <code>美团分布式ID生成系统 Leaf</code> 中snowflake模式都是在 snowflake 的基础上演进出来的。</p><h2 id="百度-uidgenerator" tabindex="-1">百度-UidGenerator <a class="header-anchor" href="#百度-uidgenerator" aria-label="Permalink to &quot;百度-UidGenerator&quot;">​</a></h2><blockquote><p>百度的 <code>UidGenerator</code> 是百度开源基于Java语言实现的唯一ID生成器，是在雪花算法 snowflake 的基础上做了一些改进。<code>UidGenerator</code>以组件形式工作在应用项目中, 支持自定义workerId位数和初始化策略，适用于docker等虚拟化环境下实例自动重启、漂移等场景。</p></blockquote><p>在实现上，UidGenerator 提供了两种生成唯一ID方式，分别是 <code>DefaultUidGenerator</code> 和 <code>CachedUidGenerator</code>，官方建议如果有<strong>性能考虑</strong>的话使用 <code>CachedUidGenerator</code> 方式实现。</p><p><code>UidGenerator</code> 依然是以划分命名空间的方式将 64-bit位分割成多个部分，只不过它的默认划分方式有别于雪花算法 snowflake。它默认是由 <code>1-28-22-13</code> 的格式进行划分。可根据你的业务的情况和特点，自己调整各个字段占用的位数。</p><ul><li><strong>第1位</strong>仍然占用1bit，其值始终是0。</li><li><strong>第2位</strong>开始的28位是时间戳，28-bit位可表示2^28个数，这里不再是以毫秒而是以秒为单位，每个数代表秒则可用<code>（1L&lt;&lt;28）/ (360024365) ≈ 8.51</code> 年的时间。</li><li>中间的 workId （数据中心+工作机器，可以其他组成方式）则由 <strong>22-bit位</strong>组成，可表示 2^22 = 4194304个工作ID。</li><li>最后由<strong>13-bit位</strong>构成自增序列，可表示2^13 = 8192个数。</li></ul><p><img src="`+o+`" alt="error.图片加载失败"></p><p>其中 workId （机器 id），最多可支持约420w次机器启动。<strong>内置实现为在启动时由数据库分配（表名为 WORKER_NODE），默认分配策略为用后即弃，后续可提供复用策略</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE IF EXISTS WORKER_NODE;</span></span>
<span class="line"><span>CREATE TABLE WORKER_NODE</span></span>
<span class="line"><span>(</span></span>
<span class="line"><span>ID BIGINT NOT NULL AUTO_INCREMENT COMMENT &#39;auto increment id&#39;,</span></span>
<span class="line"><span>HOST_NAME VARCHAR(64) NOT NULL COMMENT &#39;host name&#39;,</span></span>
<span class="line"><span>PORT VARCHAR(64) NOT NULL COMMENT &#39;port&#39;,</span></span>
<span class="line"><span>TYPE INT NOT NULL COMMENT &#39;node type: ACTUAL or CONTAINER&#39;,</span></span>
<span class="line"><span>LAUNCH_DATE DATE NOT NULL COMMENT &#39;launch date&#39;,</span></span>
<span class="line"><span>MODIFIED TIMESTAMP NOT NULL COMMENT &#39;modified time&#39;,</span></span>
<span class="line"><span>CREATED TIMESTAMP NOT NULL COMMENT &#39;created time&#39;,</span></span>
<span class="line"><span>PRIMARY KEY(ID)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span> COMMENT=&#39;DB WorkerID Assigner for UID Generator&#39;,ENGINE = INNODB;</span></span></code></pre></div><h3 id="defaultuidgenerator-实现" tabindex="-1">DefaultUidGenerator 实现 <a class="header-anchor" href="#defaultuidgenerator-实现" aria-label="Permalink to &quot;DefaultUidGenerator 实现&quot;">​</a></h3><p><code>DefaultUidGenerator</code> 就是正常的根据时间戳和机器位还有序列号的生成方式，和雪花算法很相似，对于时钟回拨也只是抛异常处理。仅有一些不同，如<strong>以秒为为单位</strong>而不再是毫秒和支持Docker等虚拟化环境。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected synchronized long nextId() {</span></span>
<span class="line"><span>    long currentSecond = getCurrentSecond();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Clock moved backwards, refuse to generate uid</span></span>
<span class="line"><span>    if (currentSecond &lt; lastSecond) {</span></span>
<span class="line"><span>        long refusedSeconds = lastSecond - currentSecond;</span></span>
<span class="line"><span>        throw new UidGenerateException(&quot;Clock moved backwards. Refusing for %d seconds&quot;, refusedSeconds);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // At the same second, increase sequence</span></span>
<span class="line"><span>    if (currentSecond == lastSecond) {</span></span>
<span class="line"><span>        sequence = (sequence + 1) &amp; bitsAllocator.getMaxSequence();</span></span>
<span class="line"><span>        // Exceed the max sequence, we wait the next second to generate uid</span></span>
<span class="line"><span>        if (sequence == 0) {</span></span>
<span class="line"><span>            currentSecond = getNextSecond(lastSecond);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // At the different second, sequence restart from zero</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        sequence = 0L;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lastSecond = currentSecond;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Allocate bits for UID</span></span>
<span class="line"><span>    return bitsAllocator.allocate(currentSecond - epochSeconds, workerId, sequence);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果你要使用 DefaultUidGenerator 的实现方式的话，以上划分的占用位数可通过 spring 进行参数配置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;bean id=&quot;defaultUidGenerator&quot; class=&quot;com.baidu.fsg.uid.impl.DefaultUidGenerator&quot; lazy-init=&quot;false&quot;&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;workerIdAssigner&quot; ref=&quot;disposableWorkerIdAssigner&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- Specified bits &amp; epoch as your demand. No specified the default value will be used --&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;timeBits&quot; value=&quot;29&quot;/&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;workerBits&quot; value=&quot;21&quot;/&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;seqBits&quot; value=&quot;13&quot;/&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;epochStr&quot; value=&quot;2016-09-20&quot;/&gt;</span></span>
<span class="line"><span>&lt;/bean&gt;</span></span></code></pre></div><h3 id="cacheduidgenerator-实现" tabindex="-1">CachedUidGenerator 实现 <a class="header-anchor" href="#cacheduidgenerator-实现" aria-label="Permalink to &quot;CachedUidGenerator 实现&quot;">​</a></h3><p>而官方建议的性能较高的 <code>CachedUidGenerator</code> 生成方式，是使用 RingBuffer 缓存生成的id。数组每个元素成为一个slot。RingBuffer容量，默认为Snowflake算法中sequence最大值（2^13 = 8192）。可通过 boostPower 配置进行扩容，以提高 RingBuffer 读写吞吐量。</p><p>Tail指针、Cursor指针用于环形数组上读写slot：</p><ul><li><p><strong>Tail指针</strong> 表示Producer生产的最大序号(此序号从0开始，持续递增)。Tail不能超过Cursor，即生产者不能覆盖未消费的slot。当Tail已赶上curosr，此时可通过rejectedPutBufferHandler指定PutRejectPolicy</p></li><li><p><strong>Cursor指针</strong> 表示Consumer消费到的最小序号(序号序列与Producer序列相同)。Cursor不能超过Tail，即不能消费未生产的slot。当Cursor已赶上tail，此时可通过rejectedTakeBufferHandler指定TakeRejectPolicy</p></li></ul><p><img src="`+r+'" alt="error.图片加载失败"></p><p>CachedUidGenerator采用了双RingBuffer，Uid-RingBuffer用于存储Uid、Flag-RingBuffer用于存储Uid状态(是否可填充、是否可消费)。</p><p>由于数组元素在内存中是连续分配的，可最大程度利用CPU cache以提升性能。但同时会带来「伪共享」FalseSharing问题，为此在Tail、Cursor指针、Flag-RingBuffer中采用了CacheLine 补齐方式。</p><p><img src="'+c+'" alt="error.图片加载失败"></p><p><strong>RingBuffer填充时机</strong></p><ul><li><strong>初始化预填充</strong> RingBuffer初始化时，预先填充满整个RingBuffer。</li><li><strong>即时填充</strong> Take消费时，即时检查剩余可用slot量(tail - cursor)，如小于设定阈值，则补全空闲slots。阈值可通过paddingFactor来进行配置，请参考Quick Start中CachedUidGenerator配置。</li><li><strong>周期填充</strong> 通过Schedule线程，定时补全空闲slots。可通过scheduleInterval配置，以应用定时填充功能，并指定Schedule时间间隔。</li></ul><h2 id="美团leaf" tabindex="-1">美团Leaf <a class="header-anchor" href="#美团leaf" aria-label="Permalink to &quot;美团Leaf&quot;">​</a></h2><blockquote><p>Leaf是美团基础研发平台推出的一个分布式ID生成服务，名字取自德国哲学家、数学家莱布尼茨的著名的一句话：“There are no two identical leaves in the world”，世间不可能存在两片相同的叶子。</p></blockquote><p>Leaf 也提供了两种ID生成的方式，分别是 <code>Leaf-segment 数据库方案</code>和 <code>Leaf-snowflake 方案</code>。</p><h3 id="leaf-segment-数据库方案" tabindex="-1">Leaf-segment 数据库方案 <a class="header-anchor" href="#leaf-segment-数据库方案" aria-label="Permalink to &quot;Leaf-segment 数据库方案&quot;">​</a></h3><p>Leaf-segment 数据库方案，是在上文描述的在使用数据库的方案上，做了如下改变：</p><ul><li><p>原方案每次获取ID都得读写一次数据库，造成数据库压力大。改为利用proxy server批量获取，每次获取一个segment(step决定大小)号段的值。用完之后再去数据库获取新的号段，可以大大的减轻数据库的压力。</p></li><li><p>各个业务不同的发号需求用 <code>biz_tag</code>字段来区分，每个biz-tag的ID获取相互隔离，互不影响。如果以后有性能需求需要对数据库扩容，不需要上述描述的复杂的扩容操作，只需要对biz_tag分库分表就行。</p></li></ul><p>数据库表设计如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE TABLE `leaf_alloc` (</span></span>\n<span class="line"><span>  `biz_tag` varchar(128)  NOT NULL DEFAULT &#39;&#39; COMMENT &#39;业务key&#39;,</span></span>\n<span class="line"><span>  `max_id` bigint(20) NOT NULL DEFAULT &#39;1&#39; COMMENT &#39;当前已经分配了的最大id&#39;,</span></span>\n<span class="line"><span>  `step` int(11) NOT NULL COMMENT &#39;初始步长，也是动态调整的最小步长&#39;,</span></span>\n<span class="line"><span>  `description` varchar(256)  DEFAULT NULL COMMENT &#39;业务key的描述&#39;,</span></span>\n<span class="line"><span>  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT &#39;更新时间&#39;,</span></span>\n<span class="line"><span>  PRIMARY KEY (`biz_tag`)</span></span>\n<span class="line"><span>) ENGINE=InnoDB;</span></span></code></pre></div><p>原来获取ID每次都需要写数据库，现在只需要把step设置得足够大，比如1000。那么只有当1000个号被消耗完了之后才会去重新读写一次数据库。读写数据库的频率从1减小到了1/step，大致架构如下图所示：</p><p><img src="'+d+'" alt="error.图片加载失败"></p><p>同时Leaf-segment 为了解决 TP999（满足千分之九百九十九的网络请求所需要的最低耗时）数据波动大，当号段使用完之后还是会hang在更新数据库的I/O上，TP999 数据会出现偶尔的尖刺的问题，提供了双buffer优化。</p><p>简单的说就是，Leaf 取号段的时机是在号段消耗完的时候进行的，也就意味着号段临界点的ID下发时间取决于下一次从DB取回号段的时间，并且在这期间进来的请求也会因为DB号段没有取回来，导致线程阻塞。如果请求DB的网络和DB的性能稳定，这种情况对系统的影响是不大的，但是假如取DB的时候网络发生抖动，或者DB发生慢查询就会导致整个系统的响应时间变慢。</p><p>为了DB取号段的过程能够做到无阻塞，不需要在DB取号段的时候阻塞请求线程，即当号段消费到某个点时就异步的把下一个号段加载到内存中，而不需要等到号段用尽的时候才去更新号段。这样做就可以很大程度上的降低系统的 TP999 指标。详细实现如下图所示：</p><p><img src="'+u+'" alt="error.图片加载失败"></p><p>采用双buffer的方式，Leaf服务内部有两个号段缓存区segment。当前号段已下发10%时，如果下一个号段未更新，则另启一个更新线程去更新下一个号段。当前号段全部下发完后，如果下个号段准备好了则切换到下个号段为当前segment接着下发，循环往复。</p><ul><li>每个biz-tag都有消费速度监控，通常推荐segment长度设置为服务高峰期发号QPS的600倍（10分钟），这样即使DB宕机，Leaf仍能持续发号10-20分钟不受影响。</li><li>每次请求来临时都会判断下个号段的状态，从而更新此号段，所以偶尔的网络抖动不会影响下个号段的更新。</li></ul><p>对于这种方案依然存在一些问题，它<strong>仍然依赖 DB的稳定性，需要采用主从备份的方式提高 DB的可用性</strong>，还有 Leaf-segment方案生成的ID是趋势递增的，这样ID号是可被计算的，例如订单ID生成场景，<strong>通过订单id号相减就能大致计算出公司一天的订单量，这个是不能忍受的</strong>。</p><h3 id="leaf-snowflake方案" tabindex="-1">Leaf-snowflake方案 <a class="header-anchor" href="#leaf-snowflake方案" aria-label="Permalink to &quot;Leaf-snowflake方案&quot;">​</a></h3><p>Leaf-snowflake方案完全沿用 snowflake 方案的bit位设计，对于workerID的分配引入了Zookeeper持久顺序节点的特性自动对snowflake节点配置 wokerID。避免了服务规模较大时，动手配置成本太高的问题。</p><p>Leaf-snowflake是按照下面几个步骤启动的：</p><ul><li>启动Leaf-snowflake服务，连接Zookeeper，在leaf_forever父节点下检查自己是否已经注册过（是否有该顺序子节点）。</li><li>如果有注册过直接取回自己的workerID（zk顺序节点生成的int类型ID号），启动服务。</li><li>如果没有注册过，就在该父节点下面创建一个持久顺序节点，创建成功后取回顺序号当做自己的workerID号，启动服务。</li></ul><p><img src="'+h+'" alt="error.图片加载失败"></p><p>为了减少对 Zookeeper的依赖性，会在本机文件系统上缓存一个workerID文件。当ZooKeeper出现问题，恰好机器出现问题需要重启时，能保证服务能够正常启动。</p><p>上文阐述过在类 snowflake算法上都存在时钟回拨的问题，Leaf-snowflake在解决时钟回拨的问题上是通过校验自身系统时间与 <code>leaf_forever/${self}</code>节点记录时间做比较然后启动报警的措施。</p><p><img src="'+g+`" alt="error.图片加载失败"></p><p>美团官方建议是由于强依赖时钟，对时间的要求比较敏感，<strong>在机器工作时NTP同步也会造成秒级别的回退，建议可以直接关闭NTP同步。要么在时钟回拨的时候直接不提供服务直接返回ERROR_CODE，等时钟追上即可。或者做一层重试，然后上报报警系统，更或者是发现有时钟回拨之后自动摘除本身节点并报警。</strong></p><p>在性能上官方提供的数据目前 Leaf 的性能在4C8G 的机器上QPS能压测到近5w/s，TP999 1ms。</p><h2 id="mist-薄雾算法" tabindex="-1">Mist 薄雾算法 <a class="header-anchor" href="#mist-薄雾算法" aria-label="Permalink to &quot;Mist 薄雾算法&quot;">​</a></h2><blockquote><p>最近有个号称超过snowflake 587倍的ID生成算法，可以参看<a href="https://juejin.im/post/6846687584324681735#heading-5" target="_blank" rel="noreferrer">这里在新窗口打开</a>, 如下内容摘自 <a href="https://github.com/asyncins/mist/tree/master" target="_blank" rel="noreferrer">GitHub中项目README在新窗口打开</a></p></blockquote><p>薄雾算法是不同于 snowflake 的全局唯一 ID 生成算法。相比 snowflake ，薄雾算法具有更高的数值上限和更长的使用期限。</p><p>现在薄雾算法拥有比雪花算法更高的性能！</p><h3 id="考量了什么业务场景和要求呢" tabindex="-1">考量了什么业务场景和要求呢？ <a class="header-anchor" href="#考量了什么业务场景和要求呢" aria-label="Permalink to &quot;考量了什么业务场景和要求呢？&quot;">​</a></h3><p>用到全局唯一 ID 的场景不少，这里引用美团 Leaf 的场景介绍:</p><blockquote><p>在复杂分布式系统中，往往需要对大量的数据和消息进行唯一标识。如在美团点评的金融、支付、餐饮、酒店、猫眼电影等产品的系统中，数据日渐增长，对数据分库分表后需要有一个唯一 ID 来标识一条数据或消息，数据库的自增 ID 显然不能满足需求；特别一点的如订单、骑手、优惠券也都需要有唯一 ID 做标识。此时一个能够生成全局唯一ID 的系统是非常必要的。</p></blockquote><p>引用微信 seqsvr 的场景介绍：</p><blockquote><p>微信在立项之初，就已确立了利用数据版本号实现终端与后台的数据增量同步机制，确保发消息时消息可靠送达对方手机。</p></blockquote><p>爬虫数据服务的场景介绍：</p><blockquote><p>数据来源各不相同，且并发极大的情况下难以生成统一的数据编号，同时数据编号又将作为爬虫下游整个链路的溯源依据，在爬虫业务链路中十分重要。</p></blockquote><p>这里参考美团 <a href="https://tech.meituan.com/2017/04/21/mt-leaf.html" target="_blank" rel="noreferrer">Leaf在新窗口打开</a> 的要求：</p><p>1、全局唯一性：不能出现重复的 ID 号，既然是唯一标识，这是最基本的要求；</p><p>2、趋势递增：在 MySQL InnoDB 引擎中使用的是聚集索引，由于多数 RDBMS 使用 B-tree 的数据结构来存储索引数据，在主键的选择上面我们应该尽量使用有序的主键保证写入性能；</p><p>3、单调递增：保证下一个 ID 一定大于上一个 ID，例如事务版本号、IM 增量消息、排序等特殊需求；</p><p>4、信息安全：如果 ID 是连续的，恶意用户的爬取工作就非常容易做了，直接按照顺序下载指定 URL 即可；如果是订单号就更危险了，竞对可以直接知道我们一天的单量。所以在一些应用场景下，会需要 ID 无规则、不规则；</p><p>可以用“全局不重复，不可猜测且呈递增态势”这句话来概括描述要求。</p><h3 id="薄雾算法的设计思路是怎么样的" tabindex="-1">薄雾算法的设计思路是怎么样的？ <a class="header-anchor" href="#薄雾算法的设计思路是怎么样的" aria-label="Permalink to &quot;薄雾算法的设计思路是怎么样的？&quot;">​</a></h3><p>薄雾算法采用了与 snowflake 相同的位数——64，在考量业务场景和要求后并没有沿用 1-41-10-12 的占位，而是采用了 1-47-8-8 的占位。即：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>* 1      2                                                     48         56       64</span></span>
<span class="line"><span>* +------+-----------------------------------------------------+----------+----------+</span></span>
<span class="line"><span>* retain | increas                                             | salt     | salt |</span></span>
<span class="line"><span>* +------+-----------------------------------------------------+----------+----------+</span></span>
<span class="line"><span>* 0      | 0000000000 0000000000 0000000000 0000000000 0000000 | 00000000 | 00000000 |</span></span>
<span class="line"><span>* +------+-----------------------------------------------------+------------+--------+</span></span></code></pre></div><ul><li>第一段为最高位，占 1 位，保持为 0，使得值永远为正数；</li><li>第二段放置自增数，占 47 位，自增数在高位能保证结果值呈递增态势，遂低位可以为所欲为；</li><li>第三段放置随机因子一，占 8 位，上限数值 255，使结果值不可预测；</li><li>第四段放置随机因子二，占 8 位，上限数值 255，使结果值不可预测；</li></ul><h3 id="薄雾算法生成的数值是什么样的" tabindex="-1">薄雾算法生成的数值是什么样的？ <a class="header-anchor" href="#薄雾算法生成的数值是什么样的" aria-label="Permalink to &quot;薄雾算法生成的数值是什么样的？&quot;">​</a></h3><p>薄雾自增数为 1～10 的运行结果类似如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>171671</span></span>
<span class="line"><span>250611</span></span>
<span class="line"><span>263582</span></span>
<span class="line"><span>355598</span></span>
<span class="line"><span>427749</span></span>
<span class="line"><span>482010</span></span>
<span class="line"><span>581550</span></span>
<span class="line"><span>644278</span></span>
<span class="line"><span>698636</span></span>
<span class="line"><span>762474</span></span></code></pre></div><p>根据运行结果可知，薄雾算法能够满足“全局不重复，不可猜测且呈递增态势”的场景要求。</p><h3 id="薄雾算法-mist-和雪花算法-snowflake-有何区别" tabindex="-1">薄雾算法 mist 和雪花算法 snowflake 有何区别？ <a class="header-anchor" href="#薄雾算法-mist-和雪花算法-snowflake-有何区别" aria-label="Permalink to &quot;薄雾算法 mist 和雪花算法 snowflake 有何区别？&quot;">​</a></h3><p>snowflake 是由 Twitter 公司提出的一种全局唯一 ID 生成算法，它具有“递增态势、不依赖数据库、高性能”等特点，自 snowflake 推出以来备受欢迎，算法被应用于大大小小公司的服务中。snowflake 高位为时间戳的二进制，遂完全受到时间戳的影响，倘若时间回拨（当前服务器时间回到之前的某一时刻），那么 snowflake 有极大概率生成与之前同一时刻的重复 ID，这直接影响整个业务。</p><p>snowflake 受时间戳影响，使用上限不超过 70 年。</p><p>薄雾算法 Mist 由书籍《Python3 反爬虫原理与绕过实战》的作者韦世东综合 <a href="https://github.com/baidu/uid-generator" target="_blank" rel="noreferrer">百度 UidGenerator在新窗口打开</a>、 <a href="https://tech.meituan.com/2017/04/21/mt-leaf.html" target="_blank" rel="noreferrer">美团 Leaf在新窗口打开</a> 和 <a href="https://www.infoq.cn/article/wechat-serial-number-generator-architecture" target="_blank" rel="noreferrer">微信序列号生成器 seqsvr在新窗口打开</a> 中介绍的技术点，同时考虑高性能分布式序列号生成器架构后设计的一款“递增态势、不依赖数据库、高性能且不受时间回拨影响”的全局唯一序列号生成算法。</p><p><img src="http://can.sfhfpc.com/7798.png" alt="mistSturct"></p><p>薄雾算法不受时间戳影响，受到数值大小影响。薄雾算法高位数值上限计算方式为<code>int64(1&lt;&lt;47 - 1)</code>，上限数值<code>140737488355327</code> 百万亿级，假设每天消耗 10 亿，薄雾算法能使用 385+ 年。</p><h3 id="为什么薄雾算法不受时间回拨影响" tabindex="-1">为什么薄雾算法不受时间回拨影响？ <a class="header-anchor" href="#为什么薄雾算法不受时间回拨影响" aria-label="Permalink to &quot;为什么薄雾算法不受时间回拨影响？&quot;">​</a></h3><p>snowflake 受时间回拨影响的根本原因是高位采用时间戳的二进制值，而薄雾算法的高位是按序递增的数值。结果值的大小由高位决定，遂薄雾算法不受时间回拨影响。</p><h3 id="为什么说薄雾算法的结果值不可预测" tabindex="-1">为什么说薄雾算法的结果值不可预测？ <a class="header-anchor" href="#为什么说薄雾算法的结果值不可预测" aria-label="Permalink to &quot;为什么说薄雾算法的结果值不可预测？&quot;">​</a></h3><p>考虑到“不可预测”的要求，薄雾算法的中间位是 8 位随机值，且末 8 位是也是随机值，两组随机值大大增加了预测难度，因此称为结果值不可预测。</p><p>中间位和末位随机值的开闭区间都是 [0, 255]，理论上随机值可以出现 <code>256 * 256</code> 种组合。</p><h3 id="当程序重启-薄雾算法的值会重复吗" tabindex="-1">当程序重启，薄雾算法的值会重复吗？ <a class="header-anchor" href="#当程序重启-薄雾算法的值会重复吗" aria-label="Permalink to &quot;当程序重启，薄雾算法的值会重复吗？&quot;">​</a></h3><p>snowflake 受时间回拨影响，一旦时间回拨就有极大概率生成重复的 ID。薄雾算法中的高位是按序递增的数值，程序重启会造成按序递增数值回到初始值，但由于中间位和末尾随机值的影响，因此不是必定生成（有大概率生成）重复 ID，但递增态势必定受到影响。</p><h3 id="薄雾算法的值会重复-那我要它干嘛" tabindex="-1">薄雾算法的值会重复，那我要它干嘛？ <a class="header-anchor" href="#薄雾算法的值会重复-那我要它干嘛" aria-label="Permalink to &quot;薄雾算法的值会重复，那我要它干嘛？&quot;">​</a></h3><p>1、无论是什么样的全局唯一 ID 生成算法，都会有优点和缺点。在实际的应用当中，没有人会将全局唯一 ID 生成算法完全托付给程序，而是会用数据库存储关键值或者所有生成的值。全局唯一 ID 生成算法大多都采用分布式架构或者主备架构提供发号服务，这时候就不用担心它的重复问题；</p><p>2、生成性能比雪花算法高太多倍；</p><p>3、代码少且简单，在大型应用中，单功能越简单越好；</p><h3 id="是否提供薄雾算法的工程实践或者架构实践" tabindex="-1">是否提供薄雾算法的工程实践或者架构实践？ <a class="header-anchor" href="#是否提供薄雾算法的工程实践或者架构实践" aria-label="Permalink to &quot;是否提供薄雾算法的工程实践或者架构实践？&quot;">​</a></h3><p>是的，作者的另一个项目 <a href="https://github.com/asyncins/medis" target="_blank" rel="noreferrer">Medis在新窗口打开</a> 是薄雾算法与 Redis 的结合，实现了“全局不重复”，你再也不用担心程序重启带来的问题。</p><h3 id="薄雾算法的分布式架构-推荐-cp-还是-ap" tabindex="-1">薄雾算法的分布式架构，推荐 CP 还是 AP？ <a class="header-anchor" href="#薄雾算法的分布式架构-推荐-cp-还是-ap" aria-label="Permalink to &quot;薄雾算法的分布式架构，推荐 CP 还是 AP？&quot;">​</a></h3><p>CAP 是分布式架构中最重要的理论，C 指的是一致性、A 指的是可用性、P 指的是分区容错性。CAP 当中，C 和 A 是互相冲突的，且 P 一定存在，遂我们必须在 CP 和 AP 中选择。<strong>实际上这跟具体的业务需求有关</strong>，但是对于全局唯一 ID 发号服务来说，大多数时候可用性比一致性更重要，也就是选择 AP 会多过选择 CP。至于你怎么选，还是得结合具体的业务场景考虑。</p><h4 id="薄雾算法的性能测试" tabindex="-1">薄雾算法的性能测试 <a class="header-anchor" href="#薄雾算法的性能测试" aria-label="Permalink to &quot;薄雾算法的性能测试&quot;">​</a></h4><p>采用 Golnag（1.14） 自带的 Benchmark 进行测试，测试机硬件环境如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>内存 16 GB 2133 MHz LPDDR3</span></span>
<span class="line"><span>处理器 2.3 GHz 双核Intel Core i5</span></span>
<span class="line"><span>操作系统 macOS Catalina</span></span>
<span class="line"><span>机器 MacBook Pro (13-inch, 2017, Two Thunderbolt 3 ports)</span></span></code></pre></div><p>进行了多轮测试，随机取 3 轮测试结果。以此计算平均值，得 <code>单次执行时间 346 ns/op</code>。以下是随机 3 轮测试的结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>goos: darwin</span></span>
<span class="line"><span>goarch: amd64</span></span>
<span class="line"><span>pkg: mist</span></span>
<span class="line"><span>BenchmarkMain-4          3507442               339 ns/op</span></span>
<span class="line"><span>PASS</span></span>
<span class="line"><span>ok      mist    1.345s</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>goos: darwin</span></span>
<span class="line"><span>goarch: amd64</span></span>
<span class="line"><span>pkg: mist</span></span>
<span class="line"><span>BenchmarkMain-4          3488708               338 ns/op</span></span>
<span class="line"><span>PASS</span></span>
<span class="line"><span>ok      mist    1.382s</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>goos: darwin</span></span>
<span class="line"><span>goarch: amd64</span></span>
<span class="line"><span>pkg: mist</span></span>
<span class="line"><span>BenchmarkMain-4          3434936               360 ns/op</span></span>
<span class="line"><span>PASS</span></span>
<span class="line"><span>ok      mist    1.394s</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>以上基本列出了所有常用的分布式ID生成方式，其实大致分类的话可以分为两类：</p><ul><li><p><strong>一种是类DB型的</strong>，根据设置不同起始值和步长来实现趋势递增，需要考虑服务的容错性和可用性。</p></li><li><p><strong>另一种是类snowflake型</strong>，这种就是将64位划分为不同的段，每段代表不同的涵义，基本就是时间戳、机器ID和序列数。这种方案就是需要考虑时钟回拨的问题以及做一些 buffer的缓冲设计提高性能。</p></li></ul><p>而且可通过将三者（时间戳，机器ID，序列数）划分不同的位数来改变使用寿命和并发数。</p><p>例如对于并发数要求不高、期望长期使用的应用，可增加时间戳位数，减少序列数的位数. 例如配置成<code>{&quot;workerBits&quot;:23,&quot;timeBits&quot;:31,&quot;seqBits&quot;:9}</code>时, 可支持28个节点以整体并发量14400 UID/s的速度持续运行68年。</p><p>对于节点重启频率频繁、期望长期使用的应用, 可增加工作机器位数和时间戳位数, 减少序列数位数. 例如配置成<code>{&quot;workerBits&quot;:27,&quot;timeBits&quot;:30,&quot;seqBits&quot;:6}</code>时, 可支持37个节点以整体并发量2400 UID/s的速度持续运行34年。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>本文前半部分主要转自 JaJian，文章原文链接</p><ul><li><a href="https://juejin.im/post/6847009773536149517" target="_blank" rel="noreferrer">https://juejin.im/post/6847009773536149517</a></li></ul><p>后半部分参考自：</p><ul><li><a href="https://juejin.im/post/6846687584324681735#heading-5" target="_blank" rel="noreferrer">https://juejin.im/post/6846687584324681735#heading-5</a></li></ul><p>在此基础上还参考了</p><ul><li><a href="https://juejin.im/post/6858063069000499208" target="_blank" rel="noreferrer">https://juejin.im/post/6858063069000499208</a></li><li><a href="https://zhuanlan.zhihu.com/p/107939861" target="_blank" rel="noreferrer">https://zhuanlan.zhihu.com/p/107939861</a></li><li><a href="https://juejin.im/post/6844903882196254727" target="_blank" rel="noreferrer">https://juejin.im/post/6844903882196254727</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,161)]))}const C=n(m,[["render",f]]);export{w as __pageData,C as default};
