import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const d=JSON.parse('{"title":"安全算法 - 加密算法","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-domain-security-secure.md","filePath":"algorithm/alg-domain-security-secure.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-domain-security-secure.md"};function l(i,n,c,r,y,o){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="安全算法-加密算法" tabindex="-1">安全算法 - 加密算法 <a class="header-anchor" href="#安全算法-加密算法" aria-label="Permalink to &quot;安全算法 - 加密算法&quot;">​</a></h1><blockquote><p>本文主要介绍安全算法之加密算法。 数据加密的基本过程就是对原来为明文的文件或数据按某种算法进行处理，使其成为不可读的一段代码为“密文”，使其只能在输入相应的密钥之后才能显示出原容，通过这样的途径来达到保护数据不被非法人窃取、阅读的目的。 该过程的逆过程为解密，即将该编码信息转化为其原来数据的过程。@pdai</p></blockquote><h2 id="加密算法简介" tabindex="-1">加密算法简介 <a class="header-anchor" href="#加密算法简介" aria-label="Permalink to &quot;加密算法简介&quot;">​</a></h2><ul><li>加密技术包括两个元素: 加密算法和密钥。</li><li>加密算法是将普通的文本(或者可以理解的信息)与一串数字(密钥)的结合，产生不可理解的密文的步骤。</li><li>密钥是用来对数据进行编码和解码的一种算法。</li><li>在安全保密中，可通过适当的密钥加密技术和管理机制来保证网络的信息通讯安全。</li></ul><h2 id="加密算法分类" tabindex="-1">加密算法分类 <a class="header-anchor" href="#加密算法分类" aria-label="Permalink to &quot;加密算法分类&quot;">​</a></h2><p>密钥加密技术的密码体制分为对称密钥体制和非对称密钥体制两种。相应地，对数据加密的技术分为两类，即对称加密(私人密钥加密)和非对称加密(公开密钥加密)。</p><p>对称加密以数据加密标准(DES，Data Encryption Standard)算法为典型代表，非对称加密通常以RSA(Rivest Shamir Adleman)算法为代表。</p><p>对称加密的加密密钥和解密密钥相同。非对称加密的加密密钥和解密密钥不同，加密密钥可以公开而解密密钥需要保密</p><h2 id="加密算法应用" tabindex="-1">加密算法应用 <a class="header-anchor" href="#加密算法应用" aria-label="Permalink to &quot;加密算法应用&quot;">​</a></h2><p>常被用在电子商务或者其他需要保证网络传输安全的范围。</p><h2 id="对称加密" tabindex="-1">对称加密 <a class="header-anchor" href="#对称加密" aria-label="Permalink to &quot;对称加密&quot;">​</a></h2><p>加密密钥和解密密钥相同的加密算法。</p><p>对称加密算法使用起来简单快捷，密钥较短，且破译困难，除了数据加密标准(DES)， 另一个对称密钥加密系统是国际数据加密算法(IDEA)，它比DES的加密性好，而且对计算机功能要求也没有那么高。IDEA加密标准由PGP(Pretty Good Privacy)系统使用。</p><h3 id="des在新窗口打开" tabindex="-1"><a href="https://baike.baidu.com/item/DES" target="_blank" rel="noreferrer">DES在新窗口打开</a> <a class="header-anchor" href="#des在新窗口打开" aria-label="Permalink to &quot;[DES在新窗口打开](https://baike.baidu.com/item/DES)&quot;">​</a></h3><p>DES全称为Data Encryption Standard，即数据加密标准，是一种使用密钥加密的块算法，现在已经过时。</p><h4 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h4><p>DES算法实现 :</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.snailclimb.ks.securityAlgorithm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.UnsupportedEncodingException;</span></span>
<span class="line"><span>import java.security.SecureRandom;</span></span>
<span class="line"><span>import javax.crypto.spec.DESKeySpec;</span></span>
<span class="line"><span>import javax.crypto.SecretKeyFactory;</span></span>
<span class="line"><span>import javax.crypto.SecretKey;</span></span>
<span class="line"><span>import javax.crypto.Cipher;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/</span></span>
<span class="line"><span> * DES加密介绍 DES是一种对称加密算法，所谓对称加密算法即: 加密和解密使用相同密钥的算法。DES加密算法出自IBM的研究，</span></span>
<span class="line"><span> * 后来被美国政府正式采用，之后开始广泛流传，但是近些年使用越来越少，因为DES使用56位密钥，以现代计算能力，</span></span>
<span class="line"><span> * 24小时内即可被破解。虽然如此，在某些简单应用中，我们还是可以使用DES加密算法，本文简单讲解DES的JAVA实现 。</span></span>
<span class="line"><span> * 注意: DES加密和解密过程中，密钥长度都必须是8的倍数</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class DesDemo {</span></span>
<span class="line"><span>	public DesDemo() {</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 测试</span></span>
<span class="line"><span>	public static void main(String args[]) {</span></span>
<span class="line"><span>		// 待加密内容</span></span>
<span class="line"><span>		String str = &quot;cryptology&quot;;</span></span>
<span class="line"><span>		// 密码，长度要是8的倍数</span></span>
<span class="line"><span>		String password = &quot;95880288&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		byte[] result;</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			result = DesDemo.encrypt(str.getBytes(), password);</span></span>
<span class="line"><span>			System.out.println(&quot;加密后: &quot; + result);</span></span>
<span class="line"><span>			byte[] decryResult = DesDemo.decrypt(result, password);</span></span>
<span class="line"><span>			System.out.println(&quot;解密后: &quot; + new String(decryResult));</span></span>
<span class="line"><span>		} catch (UnsupportedEncodingException e2) {</span></span>
<span class="line"><span>			// TODO Auto-generated catch block</span></span>
<span class="line"><span>			e2.printStackTrace();</span></span>
<span class="line"><span>		} catch (Exception e1) {</span></span>
<span class="line"><span>			e1.printStackTrace();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 直接将如上内容解密</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 加密</span></span>
<span class="line"><span>	 * </span></span>
<span class="line"><span>	 * @param datasource</span></span>
<span class="line"><span>	 *            byte[]</span></span>
<span class="line"><span>	 * @param password</span></span>
<span class="line"><span>	 *            String</span></span>
<span class="line"><span>	 * @return byte[]</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static byte[] encrypt(byte[] datasource, String password) {</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			SecureRandom random = new SecureRandom();</span></span>
<span class="line"><span>			DESKeySpec desKey = new DESKeySpec(password.getBytes());</span></span>
<span class="line"><span>			// 创建一个密匙工厂，然后用它把DESKeySpec转换成</span></span>
<span class="line"><span>			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(&quot;DES&quot;);</span></span>
<span class="line"><span>			SecretKey securekey = keyFactory.generateSecret(desKey);</span></span>
<span class="line"><span>			// Cipher对象实际完成加密操作</span></span>
<span class="line"><span>			Cipher cipher = Cipher.getInstance(&quot;DES&quot;);</span></span>
<span class="line"><span>			// 用密匙初始化Cipher对象,ENCRYPT_MODE用于将 Cipher 初始化为加密模式的常量</span></span>
<span class="line"><span>			cipher.init(Cipher.ENCRYPT_MODE, securekey, random);</span></span>
<span class="line"><span>			// 现在，获取数据并加密</span></span>
<span class="line"><span>			// 正式执行加密操作</span></span>
<span class="line"><span>			return cipher.doFinal(datasource); // 按单部分操作加密或解密数据，或者结束一个多部分操作</span></span>
<span class="line"><span>		} catch (Throwable e) {</span></span>
<span class="line"><span>			e.printStackTrace();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return null;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 解密</span></span>
<span class="line"><span>	 * </span></span>
<span class="line"><span>	 * @param src</span></span>
<span class="line"><span>	 *            byte[]</span></span>
<span class="line"><span>	 * @param password</span></span>
<span class="line"><span>	 *            String</span></span>
<span class="line"><span>	 * @return byte[]</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static byte[] decrypt(byte[] src, String password) throws Exception {</span></span>
<span class="line"><span>		// DES算法要求有一个可信任的随机数源</span></span>
<span class="line"><span>		SecureRandom random = new SecureRandom();</span></span>
<span class="line"><span>		// 创建一个DESKeySpec对象</span></span>
<span class="line"><span>		DESKeySpec desKey = new DESKeySpec(password.getBytes());</span></span>
<span class="line"><span>		// 创建一个密匙工厂</span></span>
<span class="line"><span>		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(&quot;DES&quot;);// 返回实现指定转换的</span></span>
<span class="line"><span>																			// Cipher</span></span>
<span class="line"><span>																			// 对象</span></span>
<span class="line"><span>		// 将DESKeySpec对象转换成SecretKey对象</span></span>
<span class="line"><span>		SecretKey securekey = keyFactory.generateSecret(desKey);</span></span>
<span class="line"><span>		// Cipher对象实际完成解密操作</span></span>
<span class="line"><span>		Cipher cipher = Cipher.getInstance(&quot;DES&quot;);</span></span>
<span class="line"><span>		// 用密匙初始化Cipher对象</span></span>
<span class="line"><span>		cipher.init(Cipher.DECRYPT_MODE, securekey, random);</span></span>
<span class="line"><span>		// 真正开始解密操作</span></span>
<span class="line"><span>		return cipher.doFinal(src);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结果:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>加密后: [B@50cbc42f</span></span>
<span class="line"><span>解密后: cryptology</span></span></code></pre></div><h3 id="idea在新窗口打开" tabindex="-1"><a href="https://baike.baidu.com/item/%E5%9B%BD%E9%99%85%E6%95%B0%E6%8D%AE%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95/11048972?fr=aladdin" target="_blank" rel="noreferrer">IDEA在新窗口打开</a> <a class="header-anchor" href="#idea在新窗口打开" aria-label="Permalink to &quot;[IDEA在新窗口打开](https://baike.baidu.com/item/%E5%9B%BD%E9%99%85%E6%95%B0%E6%8D%AE%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95/11048972?fr=aladdin)&quot;">​</a></h3><ul><li>这种算法是在DES算法的基础上发展出来的，类似于三重DES。</li><li>发展IDEA也是因为感到DES具有密钥太短等缺点。</li><li>DEA的密钥为128位，这么长的密钥在今后若干年内应该是安全的。</li><li>在实际项目中用到的很少了解即可。</li></ul><h4 id="代码实现-1" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现-1" aria-label="Permalink to &quot;代码实现&quot;">​</a></h4><p>IDEA算法实现</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.snailclimb.ks.securityAlgorithm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.security.Key;</span></span>
<span class="line"><span>import java.security.Security;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.crypto.Cipher;</span></span>
<span class="line"><span>import javax.crypto.KeyGenerator;</span></span>
<span class="line"><span>import javax.crypto.SecretKey;</span></span>
<span class="line"><span>import javax.crypto.spec.SecretKeySpec;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.commons.codec.binary.Base64;</span></span>
<span class="line"><span>import org.bouncycastle.jce.provider.BouncyCastleProvider;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class IDEADemo {</span></span>
<span class="line"><span>	public static void main(String args[]) {</span></span>
<span class="line"><span>		bcIDEA();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	public static void bcIDEA() {</span></span>
<span class="line"><span>	    String src = &quot;www.xttblog.com security idea&quot;;</span></span>
<span class="line"><span>	    try {</span></span>
<span class="line"><span>	        Security.addProvider(new BouncyCastleProvider());</span></span>
<span class="line"><span>	         </span></span>
<span class="line"><span>	        //生成key</span></span>
<span class="line"><span>	        KeyGenerator keyGenerator = KeyGenerator.getInstance(&quot;IDEA&quot;);</span></span>
<span class="line"><span>	        keyGenerator.init(128);</span></span>
<span class="line"><span>	        SecretKey secretKey = keyGenerator.generateKey();</span></span>
<span class="line"><span>	        byte[] keyBytes = secretKey.getEncoded();</span></span>
<span class="line"><span>	         </span></span>
<span class="line"><span>	        //转换密钥</span></span>
<span class="line"><span>	        Key key = new SecretKeySpec(keyBytes, &quot;IDEA&quot;);</span></span>
<span class="line"><span>	         </span></span>
<span class="line"><span>	        //加密</span></span>
<span class="line"><span>	        Cipher cipher = Cipher.getInstance(&quot;IDEA/ECB/ISO10126Padding&quot;);</span></span>
<span class="line"><span>	        cipher.init(Cipher.ENCRYPT_MODE, key);</span></span>
<span class="line"><span>	        byte[] result = cipher.doFinal(src.getBytes());</span></span>
<span class="line"><span>	        System.out.println(&quot;bc idea encrypt : &quot; + Base64.encodeBase64String(result));</span></span>
<span class="line"><span>	         </span></span>
<span class="line"><span>	        //解密</span></span>
<span class="line"><span>	        cipher.init(Cipher.DECRYPT_MODE, key);</span></span>
<span class="line"><span>	        result = cipher.doFinal(result);</span></span>
<span class="line"><span>	        System.out.println(&quot;bc idea decrypt : &quot; + new String(result));</span></span>
<span class="line"><span>	    } catch (Exception e) {</span></span>
<span class="line"><span>	        e.printStackTrace();</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="非对称加密" tabindex="-1">非对称加密 <a class="header-anchor" href="#非对称加密" aria-label="Permalink to &quot;非对称加密&quot;">​</a></h2><ul><li>与对称加密算法不同，非对称加密算法需要两个密钥: 公开密钥(publickey)和私有密钥 (privatekey)。</li><li>公开密钥与私有密钥是一对，如果用公开密钥对数据进行加密，只有用对应的私有密钥才能解密；</li><li>如果用私有密钥对数据进行加密，那么只有用对应的公开密钥才能解密。</li><li>因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。</li></ul><h3 id="rsa" tabindex="-1">RSA <a class="header-anchor" href="#rsa" aria-label="Permalink to &quot;RSA&quot;">​</a></h3><p>RSA是目前最有影响力和最常用的公钥加密算法。它能够抵抗到目前为止已知的绝大多数密码攻击，已被ISO推荐为公钥数据加密标准。</p><h4 id="代码实现-2" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现-2" aria-label="Permalink to &quot;代码实现&quot;">​</a></h4><p>RAS算法实现:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.snailclimb.ks.securityAlgorithm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.commons.codec.binary.Base64;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.security.*;</span></span>
<span class="line"><span>import java.security.spec.PKCS8EncodedKeySpec;</span></span>
<span class="line"><span>import java.security.spec.X509EncodedKeySpec;</span></span>
<span class="line"><span>import java.util.HashMap;</span></span>
<span class="line"><span>import java.util.Map;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.crypto.Cipher;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/</span></span>
<span class="line"><span> * Created by humf.需要依赖 commons-codec 包</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class RSADemo {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>		Map&lt;String, Key&gt; keyMap = initKey();</span></span>
<span class="line"><span>		String publicKey = getPublicKey(keyMap);</span></span>
<span class="line"><span>		String privateKey = getPrivateKey(keyMap);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		System.out.println(keyMap);</span></span>
<span class="line"><span>		System.out.println(&quot;-----------------------------------&quot;);</span></span>
<span class="line"><span>		System.out.println(publicKey);</span></span>
<span class="line"><span>		System.out.println(&quot;-----------------------------------&quot;);</span></span>
<span class="line"><span>		System.out.println(privateKey);</span></span>
<span class="line"><span>		System.out.println(&quot;-----------------------------------&quot;);</span></span>
<span class="line"><span>		byte[] encryptByPrivateKey = encryptByPrivateKey(&quot;123456&quot;.getBytes(), privateKey);</span></span>
<span class="line"><span>		byte[] encryptByPublicKey = encryptByPublicKey(&quot;123456&quot;, publicKey);</span></span>
<span class="line"><span>		System.out.println(encryptByPrivateKey);</span></span>
<span class="line"><span>		System.out.println(&quot;-----------------------------------&quot;);</span></span>
<span class="line"><span>		System.out.println(encryptByPublicKey);</span></span>
<span class="line"><span>		System.out.println(&quot;-----------------------------------&quot;);</span></span>
<span class="line"><span>		String sign = sign(encryptByPrivateKey, privateKey);</span></span>
<span class="line"><span>		System.out.println(sign);</span></span>
<span class="line"><span>		System.out.println(&quot;-----------------------------------&quot;);</span></span>
<span class="line"><span>		boolean verify = verify(encryptByPrivateKey, publicKey, sign);</span></span>
<span class="line"><span>		System.out.println(verify);</span></span>
<span class="line"><span>		System.out.println(&quot;-----------------------------------&quot;);</span></span>
<span class="line"><span>		byte[] decryptByPublicKey = decryptByPublicKey(encryptByPrivateKey, publicKey);</span></span>
<span class="line"><span>		byte[] decryptByPrivateKey = decryptByPrivateKey(encryptByPublicKey, privateKey);</span></span>
<span class="line"><span>		System.out.println(decryptByPublicKey);</span></span>
<span class="line"><span>		System.out.println(&quot;-----------------------------------&quot;);</span></span>
<span class="line"><span>		System.out.println(decryptByPrivateKey);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static final String KEY_ALGORITHM = &quot;RSA&quot;;</span></span>
<span class="line"><span>	public static final String SIGNATURE_ALGORITHM = &quot;MD5withRSA&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private static final String PUBLIC_KEY = &quot;RSAPublicKey&quot;;</span></span>
<span class="line"><span>	private static final String PRIVATE_KEY = &quot;RSAPrivateKey&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static byte[] decryptBASE64(String key) {</span></span>
<span class="line"><span>		return Base64.decodeBase64(key);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static String encryptBASE64(byte[] bytes) {</span></span>
<span class="line"><span>		return Base64.encodeBase64String(bytes);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 用私钥对信息生成数字签名</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param data</span></span>
<span class="line"><span>	 *            加密数据</span></span>
<span class="line"><span>	 * @param privateKey</span></span>
<span class="line"><span>	 *            私钥</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static String sign(byte[] data, String privateKey) throws Exception {</span></span>
<span class="line"><span>		// 解密由base64编码的私钥</span></span>
<span class="line"><span>		byte[] keyBytes = decryptBASE64(privateKey);</span></span>
<span class="line"><span>		// 构造PKCS8EncodedKeySpec对象</span></span>
<span class="line"><span>		PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);</span></span>
<span class="line"><span>		// KEY_ALGORITHM 指定的加密算法</span></span>
<span class="line"><span>		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);</span></span>
<span class="line"><span>		// 取私钥匙对象</span></span>
<span class="line"><span>		PrivateKey priKey = keyFactory.generatePrivate(pkcs8KeySpec);</span></span>
<span class="line"><span>		// 用私钥对信息生成数字签名</span></span>
<span class="line"><span>		Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);</span></span>
<span class="line"><span>		signature.initSign(priKey);</span></span>
<span class="line"><span>		signature.update(data);</span></span>
<span class="line"><span>		return encryptBASE64(signature.sign());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 校验数字签名</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param data</span></span>
<span class="line"><span>	 *            加密数据</span></span>
<span class="line"><span>	 * @param publicKey</span></span>
<span class="line"><span>	 *            公钥</span></span>
<span class="line"><span>	 * @param sign</span></span>
<span class="line"><span>	 *            数字签名</span></span>
<span class="line"><span>	 * @return 校验成功返回true 失败返回false</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static boolean verify(byte[] data, String publicKey, String sign) throws Exception {</span></span>
<span class="line"><span>		// 解密由base64编码的公钥</span></span>
<span class="line"><span>		byte[] keyBytes = decryptBASE64(publicKey);</span></span>
<span class="line"><span>		// 构造X509EncodedKeySpec对象</span></span>
<span class="line"><span>		X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);</span></span>
<span class="line"><span>		// KEY_ALGORITHM 指定的加密算法</span></span>
<span class="line"><span>		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);</span></span>
<span class="line"><span>		// 取公钥匙对象</span></span>
<span class="line"><span>		PublicKey pubKey = keyFactory.generatePublic(keySpec);</span></span>
<span class="line"><span>		Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);</span></span>
<span class="line"><span>		signature.initVerify(pubKey);</span></span>
<span class="line"><span>		signature.update(data);</span></span>
<span class="line"><span>		// 验证签名是否正常</span></span>
<span class="line"><span>		return signature.verify(decryptBASE64(sign));</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static byte[] decryptByPrivateKey(byte[] data, String key) throws Exception {</span></span>
<span class="line"><span>		// 对密钥解密</span></span>
<span class="line"><span>		byte[] keyBytes = decryptBASE64(key);</span></span>
<span class="line"><span>		// 取得私钥</span></span>
<span class="line"><span>		PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);</span></span>
<span class="line"><span>		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);</span></span>
<span class="line"><span>		Key privateKey = keyFactory.generatePrivate(pkcs8KeySpec);</span></span>
<span class="line"><span>		// 对数据解密</span></span>
<span class="line"><span>		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());</span></span>
<span class="line"><span>		cipher.init(Cipher.DECRYPT_MODE, privateKey);</span></span>
<span class="line"><span>		return cipher.doFinal(data);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 解密&lt;br&gt;</span></span>
<span class="line"><span>	 * 用私钥解密</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param data</span></span>
<span class="line"><span>	 * @param key</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static byte[] decryptByPrivateKey(String data, String key) throws Exception {</span></span>
<span class="line"><span>		return decryptByPrivateKey(decryptBASE64(data), key);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 解密&lt;br&gt;</span></span>
<span class="line"><span>	 * 用公钥解密</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param data</span></span>
<span class="line"><span>	 * @param key</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static byte[] decryptByPublicKey(byte[] data, String key) throws Exception {</span></span>
<span class="line"><span>		// 对密钥解密</span></span>
<span class="line"><span>		byte[] keyBytes = decryptBASE64(key);</span></span>
<span class="line"><span>		// 取得公钥</span></span>
<span class="line"><span>		X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);</span></span>
<span class="line"><span>		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);</span></span>
<span class="line"><span>		Key publicKey = keyFactory.generatePublic(x509KeySpec);</span></span>
<span class="line"><span>		// 对数据解密</span></span>
<span class="line"><span>		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());</span></span>
<span class="line"><span>		cipher.init(Cipher.DECRYPT_MODE, publicKey);</span></span>
<span class="line"><span>		return cipher.doFinal(data);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 加密&lt;br&gt;</span></span>
<span class="line"><span>	 * 用公钥加密</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param data</span></span>
<span class="line"><span>	 * @param key</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static byte[] encryptByPublicKey(String data, String key) throws Exception {</span></span>
<span class="line"><span>		// 对公钥解密</span></span>
<span class="line"><span>		byte[] keyBytes = decryptBASE64(key);</span></span>
<span class="line"><span>		// 取得公钥</span></span>
<span class="line"><span>		X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);</span></span>
<span class="line"><span>		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);</span></span>
<span class="line"><span>		Key publicKey = keyFactory.generatePublic(x509KeySpec);</span></span>
<span class="line"><span>		// 对数据加密</span></span>
<span class="line"><span>		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());</span></span>
<span class="line"><span>		cipher.init(Cipher.ENCRYPT_MODE, publicKey);</span></span>
<span class="line"><span>		return cipher.doFinal(data.getBytes());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 加密&lt;br&gt;</span></span>
<span class="line"><span>	 * 用私钥加密</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param data</span></span>
<span class="line"><span>	 * @param key</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static byte[] encryptByPrivateKey(byte[] data, String key) throws Exception {</span></span>
<span class="line"><span>		// 对密钥解密</span></span>
<span class="line"><span>		byte[] keyBytes = decryptBASE64(key);</span></span>
<span class="line"><span>		// 取得私钥</span></span>
<span class="line"><span>		PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);</span></span>
<span class="line"><span>		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);</span></span>
<span class="line"><span>		Key privateKey = keyFactory.generatePrivate(pkcs8KeySpec);</span></span>
<span class="line"><span>		// 对数据加密</span></span>
<span class="line"><span>		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());</span></span>
<span class="line"><span>		cipher.init(Cipher.ENCRYPT_MODE, privateKey);</span></span>
<span class="line"><span>		return cipher.doFinal(data);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 取得私钥</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param keyMap</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static String getPrivateKey(Map&lt;String, Key&gt; keyMap) throws Exception {</span></span>
<span class="line"><span>		Key key = (Key) keyMap.get(PRIVATE_KEY);</span></span>
<span class="line"><span>		return encryptBASE64(key.getEncoded());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 取得公钥</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param keyMap</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static String getPublicKey(Map&lt;String, Key&gt; keyMap) throws Exception {</span></span>
<span class="line"><span>		Key key = keyMap.get(PUBLIC_KEY);</span></span>
<span class="line"><span>		return encryptBASE64(key.getEncoded());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/</span></span>
<span class="line"><span>	 * 初始化密钥</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 * @throws Exception</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public static Map&lt;String, Key&gt; initKey() throws Exception {</span></span>
<span class="line"><span>		KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);</span></span>
<span class="line"><span>		keyPairGen.initialize(1024);</span></span>
<span class="line"><span>		KeyPair keyPair = keyPairGen.generateKeyPair();</span></span>
<span class="line"><span>		Map&lt;String, Key&gt; keyMap = new HashMap(2);</span></span>
<span class="line"><span>		keyMap.put(PUBLIC_KEY, keyPair.getPublic());// 公钥</span></span>
<span class="line"><span>		keyMap.put(PRIVATE_KEY, keyPair.getPrivate());// 私钥</span></span>
<span class="line"><span>		return keyMap;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结果:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{RSAPublicKey=Sun RSA public key, 1024 bits</span></span>
<span class="line"><span>  modulus: 115328826086047873902606456571034976538836553998745367981848911677968062571831626674499650854318207280419960767020601253071739555161388135589487284843845439403614883967713749605268831336418001722701924537624573180276356615050309809260289965219855862692230362893996010057188170525719351126759886050891484226169</span></span>
<span class="line"><span>  public exponent: 65537, RSAPrivateKey=sun.security.rsa.RSAPrivateCrtKeyImpl@93479}</span></span>
<span class="line"><span>-----------------------------------</span></span>
<span class="line"><span>MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCkO9PBTOFJQTkzznALN62PU7ixd9YFjXrt2dPOGj3wwhymbOU8HLoCztjwpLXHgbpBUJlGmbURV955M1BkZ1kr5dkZYR5x1gO4xOnu8rEipy4AAMcpFttfiarIZrtzL9pKEvEOxABltVN4yzFDr3IjBqY46aHna7YjwhXI0xHieQIDAQAB</span></span>
<span class="line"><span>-----------------------------------</span></span>
<span class="line"><span>MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAKQ708FM4UlBOTPOcAs3rY9TuLF31gWNeu3Z084aPfDCHKZs5TwcugLO2PCktceBukFQmUaZtRFX3nkzUGRnWSvl2RlhHnHWA7jE6e7ysSKnLgAAxykW21+Jqshmu3Mv2koS8Q7EAGW1U3jLMUOvciMGpjjpoedrtiPCFcjTEeJ5AgMBAAECgYAK4sxOa8IjEOexv2U92Rrv/SSo3sCY7Z/QVDft2V9xrewoO9+V9HF/7iYDDWffKYInAiimvVl7JM/iSLxza0ZFv29VMpyDcr4TigYmWwBlk7ZbxSTkqLdNwxxldMmEoTn1py53MUm+1V1K3rzNvJjuZaZFAevU7vUnwQwD+JGQYQJBAM9HBaC+dF3PJ2mkXekHpDS1ZPaSFdrdzd/GvHFi/cJAMM+Uz6PmpkosNXRtOpSYWwlOMRamLZtrHhfQoqSk3S8CQQDK1qL1jGvVdqw5OjqxktR7MmOsWUVZdWiBN+6ojxBgA0yVn0n7vkdAAgEZBj89WG0VHPEu3hd4AgXFZHDfXeDXAkBvSn7nE9t/Et7ihfI2UHgGJO8UxNMfNMB5Skebyb7eMYEDs67ZHdpjMOFypcMyTatzj5wjwQ3zyMvblZX+ONbZAkAX4ysRy9WvL+icXLUo0Gfhkk+WrnSyUldaUGH0y9Rb2kecn0OxN/lgGlxSvB+ac910zRHCOTl+Uo6nbmq0g3PFAkAyqA4eT7G9GXfncakgW1Kdkn72w/ODpozgfhTLNX0SGw1ITML3c4THTtH5h3zLi3AF9zJO2O+K6ajRbV0szHHI</span></span>
<span class="line"><span>-----------------------------------</span></span>
<span class="line"><span>[B@387c703b</span></span>
<span class="line"><span>-----------------------------------</span></span>
<span class="line"><span>[B@224aed64</span></span>
<span class="line"><span>-----------------------------------</span></span>
<span class="line"><span>la4Hc4n/UbeBu0z9iLRuwKVv014SiOJMXkO5qdJvKBsw0MlnsrM+89a3p73yMrb1dAnCU/2kgO0PtFpvmG8pzxTe1u/5nX/25iIyUXALlwVRptJyjzFE83g2IX0XEv/Dxqr1RCRcrMHOLQM0oBoxZCaChmyw1Ub4wsSs6Ndxb9M=</span></span>
<span class="line"><span>-----------------------------------</span></span>
<span class="line"><span>true</span></span>
<span class="line"><span>-----------------------------------</span></span>
<span class="line"><span>[B@c39f790</span></span>
<span class="line"><span>-----------------------------------</span></span>
<span class="line"><span>[B@71e7a66b</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,35)]))}const S=s(t,[["render",l]]);export{d as __pageData,S as default};
