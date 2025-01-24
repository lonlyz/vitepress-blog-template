import{_ as a}from"./chunks/arch-z-id-3.A5TBFxRu.js";import{_ as s,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"分布式算法 - Snowflake算法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-domain-id-snowflake.md","filePath":"algorithm/alg-domain-id-snowflake.md","lastUpdated":1737706346000}'),i={name:"algorithm/alg-domain-id-snowflake.md"};function t(r,n,c,o,d,h){return l(),p("div",null,n[0]||(n[0]=[e('<h1 id="分布式算法-snowflake算法" tabindex="-1">分布式算法 - Snowflake算法 <a class="header-anchor" href="#分布式算法-snowflake算法" aria-label="Permalink to &quot;分布式算法 - Snowflake算法&quot;">​</a></h1><blockquote><p>Snowflake，雪花算法是由Twitter开源的分布式ID生成算法，以划分命名空间的方式将 64-bit位分割成多个部分，每个部分代表不同的含义。这种就是将64位划分为不同的段，每段代表不同的涵义，基本就是时间戳、机器ID和序列数。为什么如此重要？因为它提供了一种ID生成及生成的思路，当然这种方案就是需要考虑时钟回拨的问题以及做一些 buffer的缓冲设计提高性能。@pdai</p></blockquote><h2 id="雪花算法-snowflake" tabindex="-1">雪花算法-Snowflake <a class="header-anchor" href="#雪花算法-snowflake" aria-label="Permalink to &quot;雪花算法-Snowflake&quot;">​</a></h2><p>Snowflake，雪花算法是由Twitter开源的分布式ID生成算法，以划分命名空间的方式将 64-bit位分割成多个部分，每个部分代表不同的含义。而 Java中64bit的整数是Long类型，所以在 Java 中 SnowFlake 算法生成的 ID 就是 long 来存储的。</p><ul><li><strong>第1位</strong>占用1bit，其值始终是0，可看做是符号位不使用。</li><li><strong>第2位</strong>开始的41位是时间戳，41-bit位可表示2^41个数，每个数代表毫秒，那么雪花算法可用的时间年限是<code>(1L&lt;&lt;41)/(1000L360024*365)</code>=69 年的时间。</li><li><strong>中间的10-bit位</strong>可表示机器数，即2^10 = 1024台机器，但是一般情况下我们不会部署这么台机器。如果我们对IDC（互联网数据中心）有需求，还可以将 10-bit 分 5-bit 给 IDC，分5-bit给工作机器。这样就可以表示32个IDC，每个IDC下可以有32台机器，具体的划分可以根据自身需求定义。</li><li><strong>最后12-bit位</strong>是自增序列，可表示2^12 = 4096个数。</li></ul><p>这样的划分之后相当于<strong>在一毫秒一个数据中心的一台机器上可产生4096个有序的不重复的ID</strong>。但是我们 IDC 和机器数肯定不止一个，所以毫秒内能生成的有序ID数是翻倍的。</p><p><img src="'+a+`" alt="error.图片加载失败"></p><p>Snowflake 的Twitter官方原版是用Scala写的，对Scala语言有研究的同学可以去阅读下，以下是 Java 版本的写法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.jajian.demo.distribute;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p><strong>雪花算法提供了一个很好的设计思想，雪花算法生成的ID是趋势递增，不依赖数据库等第三方系统，以服务的方式部署，稳定性更高，生成ID的性能也是非常高的，而且可以根据自身业务特性分配bit位，非常灵活</strong>。</p><p>但是雪花算法强<strong>依赖机器时钟</strong>，如果机器上时钟回拨，会导致发号重复或者服务会处于不可用状态。如果恰巧回退前生成过一些ID，而时间回退后，生成的ID就有可能重复。官方对于此并没有给出解决方案，而是简单的抛错处理，这样会造成在时间被追回之前的这段时间服务不可用。</p><p>很多其他类雪花算法也是在此思想上的设计然后改进规避它的缺陷，后面介绍的<code>百度 UidGenerator</code> 和 <code>美团分布式ID生成系统 Leaf</code> 中snowflake模式都是在 snowflake 的基础上演进出来的。</p><h2 id="其它相关算法" tabindex="-1">其它相关算法 <a class="header-anchor" href="#其它相关算法" aria-label="Permalink to &quot;其它相关算法&quot;">​</a></h2><p>在如下文章中已经包含了所有主流的全局唯一ID实现方案：</p><ul><li><a href="https://pdai.tech/md/arch/arch-z-id.html#%E5%88%86%E5%B8%83%E5%BC%8F%E7%B3%BB%E7%BB%9F---%E5%85%A8%E5%B1%80%E5%94%AF%E4%B8%80id%E5%AE%9E%E7%8E%B0%E6%96%B9%E6%A1%88" target="_blank" rel="noreferrer">分布式系统 - 全局唯一ID实现方案</a></li></ul><p>这里给出相关的链接：</p><ul><li><a href="https://pdai.tech/md/arch/arch-z-id.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81%E5%85%A8%E5%B1%80%E5%94%AF%E4%B8%80id" target="_blank" rel="noreferrer">为什么需要全局唯一ID</a></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#uuid" target="_blank" rel="noreferrer">UUID</a></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#%E6%95%B0%E6%8D%AE%E5%BA%93%E7%94%9F%E6%88%90" target="_blank" rel="noreferrer">数据库生成</a></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#%E4%BD%BF%E7%94%A8redis%E5%AE%9E%E7%8E%B0" target="_blank" rel="noreferrer">使用redis实现</a></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#%E9%9B%AA%E8%8A%B1%E7%AE%97%E6%B3%95-snowflake" target="_blank" rel="noreferrer">雪花算法-Snowflake</a></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#%E7%99%BE%E5%BA%A6-uidgenerator" target="_blank" rel="noreferrer">百度-UidGenerator</a><ul><li><a href="https://pdai.tech/md/arch/arch-z-id.html#defaultuidgenerator-%E5%AE%9E%E7%8E%B0" target="_blank" rel="noreferrer">DefaultUidGenerator 实现</a></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#cacheduidgenerator-%E5%AE%9E%E7%8E%B0" target="_blank" rel="noreferrer">CachedUidGenerator 实现</a></li></ul></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#%E7%BE%8E%E5%9B%A2leaf" target="_blank" rel="noreferrer">美团Leaf</a><ul><li><a href="https://pdai.tech/md/arch/arch-z-id.html#leaf-segment-%E6%95%B0%E6%8D%AE%E5%BA%93%E6%96%B9%E6%A1%88" target="_blank" rel="noreferrer">Leaf-segment 数据库方案</a></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#leaf-snowflake%E6%96%B9%E6%A1%88" target="_blank" rel="noreferrer">Leaf-snowflake方案</a></li></ul></li><li><a href="https://pdai.tech/md/arch/arch-z-id.html#mist-%E8%96%84%E9%9B%BE%E7%AE%97%E6%B3%95" target="_blank" rel="noreferrer">Mist 薄雾算法</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,20)]))}const I=s(i,[["render",t]]);export{g as __pageData,I as default};
