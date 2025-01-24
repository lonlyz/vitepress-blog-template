import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"安全算法 - 摘要算法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-domain-security-degist.md","filePath":"algorithm/alg-domain-security-degist.md","lastUpdated":1737706346000}'),l={name:"algorithm/alg-domain-security-degist.md"};function i(t,s,c,r,o,d){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="安全算法-摘要算法" tabindex="-1">安全算法 - 摘要算法 <a class="header-anchor" href="#安全算法-摘要算法" aria-label="Permalink to &quot;安全算法 - 摘要算法&quot;">​</a></h1><blockquote><p>本文主要介绍安全算法 - 摘要算法相关的内容。消息摘要算法的主要特征是加密过程不需要密钥，并且经过加密的数据无法被解密，目前可以解密逆向的只有CRC32算法，只有输入相同的明文数据经过相同的消息摘要算法才能得到相同的密文。消息摘要算法不存在密钥的管理与分发问题，适合于分布式网络上使用。@pdai</p></blockquote><h2 id="摘要算法简介" tabindex="-1">摘要算法简介 <a class="header-anchor" href="#摘要算法简介" aria-label="Permalink to &quot;摘要算法简介&quot;">​</a></h2><ul><li>消息摘要算法的主要特征是加密过程不需要密钥，并且经过加密的数据无法被解密</li><li>只有输入相同的明文数据经过相同的消息摘要算法才能得到相同的密文</li><li>消息摘要算法主要应用在“数字签名”领域，作为对明文的摘要算法</li><li>著名的摘要算法有RSA公司的MD5算法和SHA-1算法及其大量的变体</li></ul><h2 id="摘要算法特点" tabindex="-1">摘要算法特点 <a class="header-anchor" href="#摘要算法特点" aria-label="Permalink to &quot;摘要算法特点&quot;">​</a></h2><ul><li>无论输入的消息有多长，计算出来的消息摘要的长度总是固定的</li><li>消息摘要看起来是“伪随机的”。也就是说对相同的信息求摘要结果相同</li><li>消息轻微改变生成的摘要变化会很大</li><li>只能进行正向的信息摘要，而无法从摘要中恢复出任何的消息，甚至根本就找不到任何与原信息相关的信息</li></ul><h2 id="摘要算法应用" tabindex="-1">摘要算法应用 <a class="header-anchor" href="#摘要算法应用" aria-label="Permalink to &quot;摘要算法应用&quot;">​</a></h2><p>消息摘要算法最常用的场景就是数字签名以及数据(密码)加密了。(一般平时做项目用的比较多的就是使用MD5对用户密码进行加密)</p><h2 id="何谓数字签名" tabindex="-1">何谓数字签名 <a class="header-anchor" href="#何谓数字签名" aria-label="Permalink to &quot;何谓数字签名&quot;">​</a></h2><p>数字签名主要用到了非对称密钥加密技术与数字摘要技术。数字签名技术是将摘要信息用发送者的私钥加密，与原文一起传送给接收者。接收者只有用发送者的公钥才能解密被加密的摘要信息，然后用HASH函数对收到的原文产生一个摘要信息，与解密的摘要信息对比。 如果相同，则说明收到的信息是完整的，在传输过程中没有被修改，否则说明信息被修改过.</p><p>因此数字签名能够验证信息的完整性。 数字签名是个加密的过程，数字签名验证是个解密的过程。</p><h2 id="常见消息-数字摘要算法" tabindex="-1">常见消息/数字摘要算法 <a class="header-anchor" href="#常见消息-数字摘要算法" aria-label="Permalink to &quot;常见消息/数字摘要算法&quot;">​</a></h2><h3 id="md5在新窗口打开" tabindex="-1"><a href="https://baike.baidu.com/item/MD5/212708?fr=aladdin" target="_blank" rel="noreferrer">MD5在新窗口打开</a> <a class="header-anchor" href="#md5在新窗口打开" aria-label="Permalink to &quot;[MD5在新窗口打开](https://baike.baidu.com/item/MD5/212708?fr=aladdin)&quot;">​</a></h3><h4 id="简介" tabindex="-1">简介: <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介:&quot;">​</a></h4><p>MD5的作用是让大容量信息在用数字签名软件签署私人密钥前被&quot;压缩&quot;成一种保密的格式 (也就是把一个任意长度的字节串变换成一定长的十六进制数字串)。</p><h4 id="特点" tabindex="-1">特点: <a class="header-anchor" href="#特点" aria-label="Permalink to &quot;特点:&quot;">​</a></h4><ol><li><strong>压缩性</strong> : 任意长度的数据，算出的MD5值长度都是固定的。</li><li><strong>容易计算</strong> : 从原数据计算出MD5值很容易。</li><li><strong>抗修改性</strong> : 对原数据进行任何改动，哪怕只修改1个字节，所得到的MD5值都有很大区别。</li><li><strong>强抗碰撞</strong> : 已知原数据和其MD5值，想找到一个具有相同MD5值的数据(即伪造数据)是非常困难的。</li></ol><h4 id="代码实现" tabindex="-1">代码实现: <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现:&quot;">​</a></h4><p>利用JDK提供java.security.MessageDigest类实现MD5算法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.snailclimb.ks.securityAlgorithm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.security.MessageDigest;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MD5Demo {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // test</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        System.out.println(getMD5Code(&quot;你若安好，便是晴天&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private MD5Demo() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // md5加密</span></span>
<span class="line"><span>    public static String getMD5Code(String message) {</span></span>
<span class="line"><span>        String md5Str = &quot;&quot;;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>        	//创建MD5算法消息摘要</span></span>
<span class="line"><span>            MessageDigest md = MessageDigest.getInstance(&quot;MD5&quot;);</span></span>
<span class="line"><span>            //生成的哈希值的字节数组</span></span>
<span class="line"><span>            byte[] md5Bytes = md.digest(message.getBytes());</span></span>
<span class="line"><span>            md5Str = bytes2Hex(md5Bytes);</span></span>
<span class="line"><span>        }catch(Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return md5Str;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 2进制转16进制</span></span>
<span class="line"><span>    public static String bytes2Hex(byte[] bytes) {</span></span>
<span class="line"><span>        StringBuffer result = new StringBuffer();</span></span>
<span class="line"><span>        int temp;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            for (int i = 0; i &lt; bytes.length; i++) {</span></span>
<span class="line"><span>                temp = bytes[i];</span></span>
<span class="line"><span>                if(temp &lt; 0) {</span></span>
<span class="line"><span>                    temp += 256;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (temp &lt; 16) {</span></span>
<span class="line"><span>                    result.append(&quot;0&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                result.append(Integer.toHexString(temp));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return result.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>6bab82679914f7cb480a120b532ffa80</span></span></code></pre></div><p><strong>注意MessageDigest类的几个方法</strong> :</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static MessageDigest getInstance(String algorithm)//返回实现指定摘要算法的MessageDigest对象</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>byte[] digest(byte[] input)//使用指定的字节数组对摘要执行最终更新，然后完成摘要计算。</span></span></code></pre></div><h4 id="不利用java提供的java-security-messagedigest类实现md5算法" tabindex="-1">不利用Java提供的java.security.MessageDigest类实现MD5算法: <a class="header-anchor" href="#不利用java提供的java-security-messagedigest类实现md5算法" aria-label="Permalink to &quot;不利用Java提供的java.security.MessageDigest类实现MD5算法:&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.snailclimb.ks.securityAlgorithm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MD5{</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *四个链接变量</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private final int A=0x67452301;</span></span>
<span class="line"><span>    private final int B=0xefcdab89;</span></span>
<span class="line"><span>    private final int C=0x98badcfe;</span></span>
<span class="line"><span>    private final int D=0x10325476;</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *ABCD的临时变量</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private int Atemp,Btemp,Ctemp,Dtemp;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *常量ti</span></span>
<span class="line"><span>    *公式:floor(abs(sin(i+1))×(2pow32)</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private final int K[]={</span></span>
<span class="line"><span>        0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,</span></span>
<span class="line"><span>        0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,0x698098d8,</span></span>
<span class="line"><span>        0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,</span></span>
<span class="line"><span>        0xa679438e,0x49b40821,0xf61e2562,0xc040b340,0x265e5a51,</span></span>
<span class="line"><span>        0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,</span></span>
<span class="line"><span>        0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,</span></span>
<span class="line"><span>        0xfcefa3f8,0x676f02d9,0x8d2a4c8a,0xfffa3942,0x8771f681,</span></span>
<span class="line"><span>        0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,</span></span>
<span class="line"><span>        0xbebfbc70,0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,</span></span>
<span class="line"><span>        0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,0xf4292244,</span></span>
<span class="line"><span>        0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,</span></span>
<span class="line"><span>        0xffeff47d,0x85845dd1,0x6fa87e4f,0xfe2ce6e0,0xa3014314,</span></span>
<span class="line"><span>        0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391};</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *向左位移数,计算方法未知</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private final int s[]={7,12,17,22,7,12,17,22,7,12,17,22,7,</span></span>
<span class="line"><span>        12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,</span></span>
<span class="line"><span>        4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,</span></span>
<span class="line"><span>        15,21,6,10,15,21,6,10,15,21,6,10,15,21};</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *初始化函数</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private void init(){</span></span>
<span class="line"><span>        Atemp=A;</span></span>
<span class="line"><span>        Btemp=B;</span></span>
<span class="line"><span>        Ctemp=C;</span></span>
<span class="line"><span>        Dtemp=D;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *移动一定位数</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private    int    shift(int a,int s){</span></span>
<span class="line"><span>        return(a&lt;&lt;s)|(a&gt;&gt;&gt;(32-s));//右移的时候，高位一定要补零，而不是补充符号位</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *主循环</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private void MainLoop(int M[]){</span></span>
<span class="line"><span>        int F,g;</span></span>
<span class="line"><span>        int a=Atemp;</span></span>
<span class="line"><span>        int b=Btemp;</span></span>
<span class="line"><span>        int c=Ctemp;</span></span>
<span class="line"><span>        int d=Dtemp;</span></span>
<span class="line"><span>        for(int i = 0; i &lt; 64; i ++){</span></span>
<span class="line"><span>            if(i&lt;16){</span></span>
<span class="line"><span>                F=(b&amp;c)|((~b)&amp;d);</span></span>
<span class="line"><span>                g=i;</span></span>
<span class="line"><span>            }else if(i&lt;32){</span></span>
<span class="line"><span>                F=(d&amp;b)|((~d)&amp;c);</span></span>
<span class="line"><span>                g=(5*i+1)%16;</span></span>
<span class="line"><span>            }else if(i&lt;48){</span></span>
<span class="line"><span>                F=b^c^d;</span></span>
<span class="line"><span>                g=(3*i+5)%16;</span></span>
<span class="line"><span>            }else{</span></span>
<span class="line"><span>                F=c^(b|(~d));</span></span>
<span class="line"><span>                g=(7*i)%16;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            int tmp=d;</span></span>
<span class="line"><span>            d=c;</span></span>
<span class="line"><span>            c=b;</span></span>
<span class="line"><span>            b=b+shift(a+F+K[i]+M[g],s[i]);</span></span>
<span class="line"><span>            a=tmp;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Atemp=a+Atemp;</span></span>
<span class="line"><span>        Btemp=b+Btemp;</span></span>
<span class="line"><span>        Ctemp=c+Ctemp;</span></span>
<span class="line"><span>        Dtemp=d+Dtemp;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *填充函数</span></span>
<span class="line"><span>    *处理后应满足bits≡448(mod512),字节就是bytes≡56(mode64)</span></span>
<span class="line"><span>    *填充方式为先加一个0,其它位补零</span></span>
<span class="line"><span>    *最后加上64位的原来长度</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private int[] add(String str){</span></span>
<span class="line"><span>        int num=((str.length()+8)/64)+1;//以512位，64个字节为一组</span></span>
<span class="line"><span>        int strByte[]=new int[num*16];//64/4=16，所以有16个整数</span></span>
<span class="line"><span>        for(int i=0;i&lt;num*16;i++){//全部初始化0</span></span>
<span class="line"><span>            strByte[i]=0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int    i;</span></span>
<span class="line"><span>        for(i=0;i&lt;str.length();i++){</span></span>
<span class="line"><span>            strByte[i&gt;&gt;2]|=str.charAt(i)&lt;&lt;((i%4)*8);//一个整数存储四个字节，小端序</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        strByte[i&gt;&gt;2]|=0x80&lt;&lt;((i%4)*8);//尾部添加1</span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>        *添加原长度，长度指位的长度，所以要乘8，然后是小端序，所以放在倒数第二个,这里长度只用了32位</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>        strByte[num*16-2]=str.length()*8;</span></span>
<span class="line"><span>            return strByte;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *调用函数</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    public String getMD5(String source){</span></span>
<span class="line"><span>        init();</span></span>
<span class="line"><span>        int strByte[]=add(source);</span></span>
<span class="line"><span>        for(int i=0;i&lt;strByte.length/16;i++){</span></span>
<span class="line"><span>        int num[]=new int[16];</span></span>
<span class="line"><span>        for(int j=0;j&lt;16;j++){</span></span>
<span class="line"><span>            num[j]=strByte[i*16+j];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        MainLoop(num);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return changeHex(Atemp)+changeHex(Btemp)+changeHex(Ctemp)+changeHex(Dtemp);</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *整数变成16进制字符串</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private String changeHex(int a){</span></span>
<span class="line"><span>        String str=&quot;&quot;;</span></span>
<span class="line"><span>        for(int i=0;i&lt;4;i++){</span></span>
<span class="line"><span>            str+=String.format(&quot;%2s&quot;, Integer.toHexString(((a&gt;&gt;i*8)%(1&lt;&lt;8))&amp;0xff)).replace(&#39; &#39;, &#39;0&#39;);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return str;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>    *单例</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    private static MD5 instance;</span></span>
<span class="line"><span>    public static MD5 getInstance(){</span></span>
<span class="line"><span>        if(instance==null){</span></span>
<span class="line"><span>            instance=new MD5();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return instance;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    private MD5(){};</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    public static void main(String[] args){</span></span>
<span class="line"><span>        String str=MD5.getInstance().getMD5(&quot;你若安好，便是晴天&quot;);</span></span>
<span class="line"><span>        System.out.println(str);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="sha1在新窗口打开" tabindex="-1"><a href="https://baike.baidu.com/item/MD5/212708?fr=aladdin" target="_blank" rel="noreferrer">SHA1在新窗口打开</a> <a class="header-anchor" href="#sha1在新窗口打开" aria-label="Permalink to &quot;[SHA1在新窗口打开](https://baike.baidu.com/item/MD5/212708?fr=aladdin)&quot;">​</a></h3><p>对于长度小于2^64位的消息，SHA1会产生一个160位(40个字符)的消息摘要。当接收到消息的时候，这个消息摘要可以用来验证数据的完整性。在传输的过程中，数据很可能会发生变化，那么这时候就会产生不同的消息摘要。</p><p>SHA1有如下特性:</p><ul><li>不可以从消息摘要中复原信息；</li><li>两个不同的消息不会产生同样的消息摘要,(但会有1x10 ^ 48分之一的机率出现相同的消息摘要,一般使用时忽略)。</li></ul><h4 id="代码实现-1" tabindex="-1">代码实现: <a class="header-anchor" href="#代码实现-1" aria-label="Permalink to &quot;代码实现:&quot;">​</a></h4><p>利用JDK提供java.security.MessageDigest类实现SHA1算法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.snailclimb.ks.securityAlgorithm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.UnsupportedEncodingException;</span></span>
<span class="line"><span>import java.security.MessageDigest;</span></span>
<span class="line"><span>import java.security.NoSuchAlgorithmException;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SHA1Demo {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span>		// TODO Auto-generated method stub</span></span>
<span class="line"><span>		System.out.println(getSha1(&quot;你若安好，便是晴天&quot;));</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static String getSha1(String str) {</span></span>
<span class="line"><span>		if (null == str || 0 == str.length()) {</span></span>
<span class="line"><span>			return null;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		char[] hexDigits = { &#39;0&#39;, &#39;1&#39;, &#39;2&#39;, &#39;3&#39;, &#39;4&#39;, &#39;5&#39;, &#39;6&#39;, &#39;7&#39;, &#39;8&#39;, &#39;9&#39;, &#39;a&#39;, &#39;b&#39;, &#39;c&#39;, &#39;d&#39;, &#39;e&#39;, &#39;f&#39; };</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			//创建SHA1算法消息摘要对象</span></span>
<span class="line"><span>			MessageDigest mdTemp = MessageDigest.getInstance(&quot;SHA1&quot;);</span></span>
<span class="line"><span>			//使用指定的字节数组更新摘要。</span></span>
<span class="line"><span>			mdTemp.update(str.getBytes(&quot;UTF-8&quot;));</span></span>
<span class="line"><span>			//生成的哈希值的字节数组</span></span>
<span class="line"><span>			byte[] md = mdTemp.digest();</span></span>
<span class="line"><span>			//SHA1算法生成信息摘要关键过程</span></span>
<span class="line"><span>			int j = md.length;</span></span>
<span class="line"><span>		    char[] buf = new char[j * 2];</span></span>
<span class="line"><span>			int k = 0;</span></span>
<span class="line"><span>			for (int i = 0; i &lt; j; i++) {</span></span>
<span class="line"><span>				byte byte0 = md[i];</span></span>
<span class="line"><span>				buf[k++] = hexDigits[byte0 &gt;&gt;&gt; 4 &amp; 0xf];</span></span>
<span class="line"><span>				buf[k++] = hexDigits[byte0 &amp; 0xf];</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			return new String(buf);</span></span>
<span class="line"><span>		} catch (NoSuchAlgorithmException e) {</span></span>
<span class="line"><span>			e.printStackTrace();</span></span>
<span class="line"><span>		} catch (UnsupportedEncodingException e) {</span></span>
<span class="line"><span>			e.printStackTrace();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return &quot;0&quot;;</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>结果</strong> :</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>8ce764110a42da9b08504b20e26b19c9e3382414</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,37)]))}const h=n(l,[["render",i]]);export{u as __pageData,h as default};
