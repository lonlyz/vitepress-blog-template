import{_ as n,a as s}from"./chunks/java-thread-x-key-final-2.bxy1Sbyd.js";import{_ as p,c as l,ai as i,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/thread/java-thread-x-key-final-3.png",c="/vitepress-blog-template/images/thread/java-thread-x-key-final-4.png",g=JSON.parse('{"title":"关键字: final详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-key-final.md","filePath":"java/thread/java-thread-x-key-final.md","lastUpdated":1737706346000}'),o={name:"java/thread/java-thread-x-key-final.md"};function r(d,a,h,f,u,b){return e(),l("div",null,a[0]||(a[0]=[i(`<h1 id="关键字-final详解" tabindex="-1">关键字: final详解 <a class="header-anchor" href="#关键字-final详解" aria-label="Permalink to &quot;关键字: final详解&quot;">​</a></h1><blockquote><p>final 关键字看上去简单，但是真正深入理解的人可以说少之又少，读完本文你就知道我在说什么了。本文将常规的用法简化，提出一些用法和深入的思考。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解final" tabindex="-1">带着BAT大厂的面试问题去理解final <a class="header-anchor" href="#带着bat大厂的面试问题去理解final" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解final&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解final。@pdai</p><ul><li>所有的final修饰的字段都是编译期常量吗?</li><li>如何理解private所修饰的方法是隐式的final?</li><li>说说final类型的类如何拓展? 比如String是final类型，我们想写个MyString复用所有String中方法，同时增加一个新的toMyString()的方法，应该如何做?</li><li>final方法可以被重载吗? 可以</li><li>父类的final方法能不能够被子类重写? 不可以</li><li>说说final域重排序规则?</li><li>说说final的原理?</li><li>使用 final 的限制条件和局限性?</li><li>看本文最后的一个思考题</li></ul><h2 id="final基础使用" tabindex="-1">final基础使用 <a class="header-anchor" href="#final基础使用" aria-label="Permalink to &quot;final基础使用&quot;">​</a></h2><h3 id="修饰类" tabindex="-1">修饰类 <a class="header-anchor" href="#修饰类" aria-label="Permalink to &quot;修饰类&quot;">​</a></h3><p>当某个类的整体定义为final时，就表明了你不能打算继承该类，而且也不允许别人这么做。即这个类是不能有子类的。</p><p>注意：final类中的所有方法都隐式为final，因为无法覆盖他们，所以在final类中给任何方法添加final关键字是没有任何意义的。</p><blockquote><p>这里顺道说说final类型的类如何拓展? 比如String是final类型，我们想写个MyString复用所有String中方法，同时增加一个新的toMyString()的方法，应该如何做? @pdai</p></blockquote><p>设计模式中最重要的两种关系，一种是继承/实现；另外一种是组合关系。所以当遇到不能用继承的(final修饰的类),应该考虑用组合, 如下代码大概写个组合实现的意思：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* @pdai</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>class MyString{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String innerString;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ...init &amp; other methods</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 支持老的方法</span></span>
<span class="line"><span>    public int length(){</span></span>
<span class="line"><span>        return innerString.length(); // 通过innerString调用老的方法</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 添加新方法</span></span>
<span class="line"><span>    public String toMyString(){</span></span>
<span class="line"><span>        //...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="修饰方法" tabindex="-1">修饰方法 <a class="header-anchor" href="#修饰方法" aria-label="Permalink to &quot;修饰方法&quot;">​</a></h3><blockquote><p>常规的使用就不说了，这里说下:</p></blockquote><ul><li>private 方法是隐式的final</li><li>final方法是可以被重载的</li></ul><h4 id="private-final" tabindex="-1">private final <a class="header-anchor" href="#private-final" aria-label="Permalink to &quot;private final&quot;">​</a></h4><p>类中所有private方法都隐式地指定为final的，由于无法取用private方法，所以也就不能覆盖它。可以对private方法增添final关键字，但这样做并没有什么好处。看下下面的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Base {</span></span>
<span class="line"><span>    private void test() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Son extends Base{</span></span>
<span class="line"><span>    public void test() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Son son = new Son();</span></span>
<span class="line"><span>        Base father = son;</span></span>
<span class="line"><span>        //father.test();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Base和Son都有方法test(),但是这并不是一种覆盖，因为private所修饰的方法是隐式的final，也就是无法被继承，所以更不用说是覆盖了，在Son中的test()方法不过是属于Son的新成员罢了，Son进行向上转型得到father，但是father.test()是不可执行的，因为Base中的test方法是private的，无法被访问到。</p><h4 id="final方法是可以被重载的" tabindex="-1">final方法是可以被重载的 <a class="header-anchor" href="#final方法是可以被重载的" aria-label="Permalink to &quot;final方法是可以被重载的&quot;">​</a></h4><p>我们知道父类的final方法是不能够被子类重写的，那么final方法可以被重载吗? 答案是可以的，下面代码是正确的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FinalExampleParent {</span></span>
<span class="line"><span>    public final void test() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final void test(String str) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="修饰参数" tabindex="-1">修饰参数 <a class="header-anchor" href="#修饰参数" aria-label="Permalink to &quot;修饰参数&quot;">​</a></h3><p>Java允许在参数列表中以声明的方式将参数指明为final，这意味这你无法在方法中更改参数引用所指向的对象。这个特性主要用来向匿名内部类传递数据。</p><h3 id="修饰变量" tabindex="-1">修饰变量 <a class="header-anchor" href="#修饰变量" aria-label="Permalink to &quot;修饰变量&quot;">​</a></h3><blockquote><p>常规的用法比较简单，这里通过下面三个问题进一步说明。</p></blockquote><h4 id="所有的final修饰的字段都是编译期常量吗" tabindex="-1">所有的final修饰的字段都是编译期常量吗? <a class="header-anchor" href="#所有的final修饰的字段都是编译期常量吗" aria-label="Permalink to &quot;所有的final修饰的字段都是编译期常量吗?&quot;">​</a></h4><p>现在来看编译期常量和非编译期常量, 如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>    //编译期常量</span></span>
<span class="line"><span>    final int i = 1;</span></span>
<span class="line"><span>    final static int J = 1;</span></span>
<span class="line"><span>    final int[] a = {1,2,3,4};</span></span>
<span class="line"><span>    //非编译期常量</span></span>
<span class="line"><span>    Random r = new Random();</span></span>
<span class="line"><span>    final int k = r.nextInt();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>k的值由随机数对象决定，所以不是所有的final修饰的字段都是编译期常量，只是k的值在被初始化后无法被更改。</p><h4 id="static-final" tabindex="-1">static final <a class="header-anchor" href="#static-final" aria-label="Permalink to &quot;static final&quot;">​</a></h4><p>一个既是static又是final 的字段只占据一段不能改变的存储空间，它必须在定义的时候进行赋值，否则编译器将不予通过。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.Random;</span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>    static Random r = new Random();</span></span>
<span class="line"><span>    final int k = r.nextInt(10);</span></span>
<span class="line"><span>    static final int k2 = r.nextInt(10); </span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Test t1 = new Test();</span></span>
<span class="line"><span>        System.out.println(&quot;k=&quot;+t1.k+&quot; k2=&quot;+t1.k2);</span></span>
<span class="line"><span>        Test t2 = new Test();</span></span>
<span class="line"><span>        System.out.println(&quot;k=&quot;+t2.k+&quot; k2=&quot;+t2.k2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面代码某次输出结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>k=2 k2=7</span></span>
<span class="line"><span>k=8 k2=7</span></span></code></pre></div><p>我们可以发现对于不同的对象k的值是不同的，但是k2的值却是相同的，这是为什么呢? 因为static关键字所修饰的字段并不属于一个对象，而是属于这个类的。也可简单的理解为static final所修饰的字段仅占据内存的一个一份空间，一旦被初始化之后便不会被更改。</p><h4 id="blank-final" tabindex="-1">blank final <a class="header-anchor" href="#blank-final" aria-label="Permalink to &quot;blank final&quot;">​</a></h4><p>Java允许生成空白final，也就是说被声明为final但又没有给出定值的字段,但是必须在该字段被使用之前被赋值，这给予我们两种选择：</p><ul><li>在定义处进行赋值(这不叫空白final)</li><li>在构造器中进行赋值，保证了该值在被使用前赋值。</li></ul><p>这增强了final的灵活性。</p><p>看下面代码:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>    final int i1 = 1;</span></span>
<span class="line"><span>    final int i2;//空白final</span></span>
<span class="line"><span>    public Test() {</span></span>
<span class="line"><span>        i2 = 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public Test(int x) {</span></span>
<span class="line"><span>        this.i2 = x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到i2的赋值更为灵活。但是请注意，如果字段由static和final修饰，仅能在声明时赋值或声明后在静态代码块中赋值，因为该字段不属于对象，属于这个类。</p><h2 id="final域重排序规则" tabindex="-1">final域重排序规则 <a class="header-anchor" href="#final域重排序规则" aria-label="Permalink to &quot;final域重排序规则&quot;">​</a></h2><p>上面我们聊的final使用，应该属于Java基础层面的，当理解这些后我们就真的算是掌握了final吗? 有考虑过final在多线程并发的情况吗? 在java内存模型中我们知道java内存模型为了能让处理器和编译器底层发挥他们的最大优势，对底层的约束就很少，也就是说针对底层来说java内存模型就是一弱内存数据模型。同时，处理器和编译为了性能优化会对指令序列有编译器和处理器重排序。那么，在多线程情况下,final会进行怎样的重排序? 会导致线程安全的问题吗? 下面，就来看看final的重排序。</p><h3 id="final域为基本类型" tabindex="-1">final域为基本类型 <a class="header-anchor" href="#final域为基本类型" aria-label="Permalink to &quot;final域为基本类型&quot;">​</a></h3><p>先看一段示例性的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FinalDemo {</span></span>
<span class="line"><span>    private int a;  //普通域</span></span>
<span class="line"><span>    private final int b; //final域</span></span>
<span class="line"><span>    private static FinalDemo finalDemo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public FinalDemo() {</span></span>
<span class="line"><span>        a = 1; // 1. 写普通域</span></span>
<span class="line"><span>        b = 2; // 2. 写final域</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void writer() {</span></span>
<span class="line"><span>        finalDemo = new FinalDemo();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void reader() {</span></span>
<span class="line"><span>        FinalDemo demo = finalDemo; // 3.读对象引用</span></span>
<span class="line"><span>        int a = demo.a;    //4.读普通域</span></span>
<span class="line"><span>        int b = demo.b;    //5.读final域</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假设线程A在执行writer()方法，线程B执行reader()方法。</p><h4 id="写final域重排序规则" tabindex="-1">写final域重排序规则 <a class="header-anchor" href="#写final域重排序规则" aria-label="Permalink to &quot;写final域重排序规则&quot;">​</a></h4><p>写final域的重排序规则禁止对final域的写重排序到构造函数之外，这个规则的实现主要包含了两个方面：</p><ul><li>JMM禁止编译器把final域的写重排序到构造函数之外；</li><li>编译器会在final域写之后，构造函数return之前，插入一个storestore屏障。这个屏障可以禁止处理器把final域的写重排序到构造函数之外。</li></ul><p>我们再来分析writer方法，虽然只有一行代码，但实际上做了两件事情：</p><ul><li>构造了一个FinalDemo对象；</li><li>把这个对象赋值给成员变量finalDemo。</li></ul><p>我们来画下存在的一种可能执行时序图，如下：</p><p><img src="`+n+'" alt="error.图片加载失败"></p><p>由于a,b之间没有数据依赖性，普通域(普通变量)a可能会被重排序到构造函数之外，线程B就有可能读到的是普通变量a初始化之前的值(零值)，这样就可能出现错误。而final域变量b，根据重排序规则，会禁止final修饰的变量b重排序到构造函数之外，从而b能够正确赋值，线程B就能够读到final变量初始化后的值。</p><p>因此，写final域的重排序规则可以确保：在对象引用为任意线程可见之前，对象的final域已经被正确初始化过了，而普通域就不具有这个保障。比如在上例，线程B有可能就是一个未正确初始化的对象finalDemo。</p><h4 id="读final域重排序规则" tabindex="-1">读final域重排序规则 <a class="header-anchor" href="#读final域重排序规则" aria-label="Permalink to &quot;读final域重排序规则&quot;">​</a></h4><p>读final域重排序规则为：在一个线程中，初次读对象引用和初次读该对象包含的final域，JMM会禁止这两个操作的重排序。(注意，这个规则仅仅是针对处理器)，处理器会在读final域操作的前面插入一个LoadLoad屏障。实际上，读对象的引用和读该对象的final域存在间接依赖性，一般处理器不会重排序这两个操作。但是有一些处理器会重排序，因此，这条禁止重排序规则就是针对这些处理器而设定的。</p><p>read()方法主要包含了三个操作：</p><ul><li>初次读引用变量finalDemo;</li><li>初次读引用变量finalDemo的普通域a;</li><li>初次读引用变量finalDemo的final域b;</li></ul><p>假设线程A写过程没有重排序，那么线程A和线程B有一种的可能执行时序为下图：</p><p><img src="'+s+`" alt="error.图片加载失败"></p><p>读对象的普通域被重排序到了读对象引用的前面就会出现线程B还未读到对象引用就在读取该对象的普通域变量，这显然是错误的操作。而final域的读操作就“限定”了在读final域变量前已经读到了该对象的引用，从而就可以避免这种情况。</p><p>读final域的重排序规则可以确保：在读一个对象的final域之前，一定会先读这个包含这个final域的对象的引用。</p><h3 id="final域为引用类型" tabindex="-1">final域为引用类型 <a class="header-anchor" href="#final域为引用类型" aria-label="Permalink to &quot;final域为引用类型&quot;">​</a></h3><p>我们已经知道了final域是基本数据类型的时候重排序规则是怎么的了? 如果是引用数据类型了? 我们接着继续来探讨。</p><h4 id="对final修饰的对象的成员域写操作" tabindex="-1">对final修饰的对象的成员域写操作 <a class="header-anchor" href="#对final修饰的对象的成员域写操作" aria-label="Permalink to &quot;对final修饰的对象的成员域写操作&quot;">​</a></h4><p>针对引用数据类型，final域写针对编译器和处理器重排序增加了这样的约束：在构造函数内对一个final修饰的对象的成员域的写入，与随后在构造函数之外把这个被构造的对象的引用赋给一个引用变量，这两个操作是不能被重排序的。注意这里的是“增加”也就说前面对final基本数据类型的重排序规则在这里还是使用。这句话是比较拗口的，下面结合实例来看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FinalReferenceDemo {</span></span>
<span class="line"><span>    final int[] arrays;</span></span>
<span class="line"><span>    private FinalReferenceDemo finalReferenceDemo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public FinalReferenceDemo() {</span></span>
<span class="line"><span>        arrays = new int[1];  //1</span></span>
<span class="line"><span>        arrays[0] = 1;        //2</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void writerOne() {</span></span>
<span class="line"><span>        finalReferenceDemo = new FinalReferenceDemo(); //3</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void writerTwo() {</span></span>
<span class="line"><span>        arrays[0] = 2;  //4</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void reader() {</span></span>
<span class="line"><span>        if (finalReferenceDemo != null) {  //5</span></span>
<span class="line"><span>            int temp = finalReferenceDemo.arrays[0];  //6</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>针对上面的实例程序，线程线程A执行wirterOne方法，执行完后线程B执行writerTwo方法，然后线程C执行reader方法。下图就以这种执行时序出现的一种情况来讨论(耐心看完才有收获)。</p><p><img src="`+t+`" alt="error.图片加载失败"></p><p>由于对final域的写禁止重排序到构造方法外，因此1和3不能被重排序。由于一个final域的引用对象的成员域写入不能与随后将这个被构造出来的对象赋给引用变量重排序，因此2和3不能重排序。</p><h4 id="对final修饰的对象的成员域读操作" tabindex="-1">对final修饰的对象的成员域读操作 <a class="header-anchor" href="#对final修饰的对象的成员域读操作" aria-label="Permalink to &quot;对final修饰的对象的成员域读操作&quot;">​</a></h4><p>JMM可以确保线程C至少能看到写线程A对final引用的对象的成员域的写入，即能看下arrays[0] = 1，而写线程B对数组元素的写入可能看到可能看不到。JMM不保证线程B的写入对线程C可见，线程B和线程C之间存在数据竞争，此时的结果是不可预知的。如果可见的，可使用锁或者volatile。</p><h3 id="关于final重排序的总结" tabindex="-1">关于final重排序的总结 <a class="header-anchor" href="#关于final重排序的总结" aria-label="Permalink to &quot;关于final重排序的总结&quot;">​</a></h3><p>按照final修饰的数据类型分类：</p><ul><li><p>基本数据类型:</p><ul><li><code>final域写</code>：禁止final域写与构造方法重排序，即禁止final域写重排序到构造方法之外，从而保证该对象对所有线程可见时，该对象的final域全部已经初始化过。</li><li><code>final域读</code>：禁止初次读对象的引用与读该对象包含的final域的重排序。</li></ul></li><li><p>引用数据类型：</p><ul><li><code>额外增加约束</code>：禁止在构造函数对一个final修饰的对象的成员域的写入与随后将这个被构造的对象的引用赋值给引用变量 重排序</li></ul></li></ul><h2 id="final再深入理解" tabindex="-1">final再深入理解 <a class="header-anchor" href="#final再深入理解" aria-label="Permalink to &quot;final再深入理解&quot;">​</a></h2><h3 id="final的实现原理" tabindex="-1">final的实现原理 <a class="header-anchor" href="#final的实现原理" aria-label="Permalink to &quot;final的实现原理&quot;">​</a></h3><p>上面我们提到过，写final域会要求编译器在final域写之后，构造函数返回前插入一个StoreStore屏障。读final域的重排序规则会要求编译器在读final域的操作前插入一个LoadLoad屏障。</p><p>很有意思的是，如果以X86处理为例，X86不会对写-写重排序，所以StoreStore屏障可以省略。由于不会对有间接依赖性的操作重排序，所以在X86处理器中，读final域需要的LoadLoad屏障也会被省略掉。也就是说，以X86为例的话，对final域的读/写的内存屏障都会被省略！具体是否插入还是得看是什么处理器</p><h3 id="为什么final引用不能从构造函数中-溢出" tabindex="-1">为什么final引用不能从构造函数中“溢出” <a class="header-anchor" href="#为什么final引用不能从构造函数中-溢出" aria-label="Permalink to &quot;为什么final引用不能从构造函数中“溢出”&quot;">​</a></h3><p>这里还有一个比较有意思的问题：上面对final域写重排序规则可以确保我们在使用一个对象引用的时候该对象的final域已经在构造函数被初始化过了。但是这里其实是有一个前提条件的，也就是：在构造函数，不能让这个被构造的对象被其他线程可见，也就是说该对象引用不能在构造函数中“溢出”。以下面的例子来说：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FinalReferenceEscapeDemo {</span></span>
<span class="line"><span>    private final int a;</span></span>
<span class="line"><span>    private FinalReferenceEscapeDemo referenceDemo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public FinalReferenceEscapeDemo() {</span></span>
<span class="line"><span>        a = 1;  //1</span></span>
<span class="line"><span>        referenceDemo = this; //2</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void writer() {</span></span>
<span class="line"><span>        new FinalReferenceEscapeDemo();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void reader() {</span></span>
<span class="line"><span>        if (referenceDemo != null) {  //3</span></span>
<span class="line"><span>            int temp = referenceDemo.a; //4</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可能的执行时序如图所示：</p><p><img src="`+c+`" alt="error.图片加载失败"></p><p>假设一个线程A执行writer方法另一个线程执行reader方法。因为构造函数中操作1和2之间没有数据依赖性，1和2可以重排序，先执行了2，这个时候引用对象referenceDemo是个没有完全初始化的对象，而当线程B去读取该对象时就会出错。尽管依然满足了final域写重排序规则：在引用对象对所有线程可见时，其final域已经完全初始化成功。但是，引用对象“this”逸出，该代码依然存在线程安全的问题。</p><h3 id="使用-final-的限制条件和局限性" tabindex="-1">使用 final 的限制条件和局限性 <a class="header-anchor" href="#使用-final-的限制条件和局限性" aria-label="Permalink to &quot;使用 final 的限制条件和局限性&quot;">​</a></h3><p>当声明一个 final 成员时，必须在构造函数退出前设置它的值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyClass {</span></span>
<span class="line"><span>  private final int myField = 1;</span></span>
<span class="line"><span>  public MyClass() {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>或者</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyClass {</span></span>
<span class="line"><span>  private final int myField;</span></span>
<span class="line"><span>  public MyClass() {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    myField = 1;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>将指向对象的成员声明为 final 只能将该引用设为不可变的，而非所指的对象。</p><p>下面的方法仍然可以修改该 list。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final List myList = new ArrayList();</span></span>
<span class="line"><span>myList.add(&quot;Hello&quot;);</span></span></code></pre></div><p>声明为 final 可以保证如下操作不合法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>myList = new ArrayList();</span></span>
<span class="line"><span>myList = someOtherList;</span></span></code></pre></div><p>如果一个对象将会在多个线程中访问并且你并没有将其成员声明为 final，则必须提供其他方式保证线程安全。</p><p>&quot; 其他方式 &quot; 可以包括声明成员为 volatile，使用 synchronized 或者显式 Lock 控制所有该成员的访问。</p><h3 id="再思考一个有趣的现象" tabindex="-1">再思考一个有趣的现象： <a class="header-anchor" href="#再思考一个有趣的现象" aria-label="Permalink to &quot;再思考一个有趣的现象：&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>byte b1=1;</span></span>
<span class="line"><span>byte b2=3;</span></span>
<span class="line"><span>byte b3=b1+b2;//当程序执行到这一行的时候会出错，因为b1、b2可以自动转换成int类型的变量，运算时java虚拟机对它进行了转换，结果导致把一个int赋值给byte-----出错</span></span></code></pre></div><p>如果对b1 b2加上final就不会出错</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final byte b1=1;</span></span>
<span class="line"><span>final byte b2=3;</span></span>
<span class="line"><span>byte b3=b1+b2;//不会出错，相信你看了上面的解释就知道原因了。</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://www.jianshu.com/p/1e82c75034b7" target="_blank" rel="noreferrer">https://www.jianshu.com/p/1e82c75034b7</a></li><li>《java并发编程的艺术》</li><li>《疯狂java讲义》</li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,109)]))}const k=p(o,[["render",r]]);export{g as __pageData,k as default};
