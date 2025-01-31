import{_ as a,a as n}from"./chunks/java-basic-generic-5.CtCCP4dp.js";import{_ as p,c as e,ai as l,o as t}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/java/java-basic-generic-1.png",c="/vitepress-blog-template/images/java/java-basic-generic-2.png",o="/vitepress-blog-template/images/java/java-basic-generic-3.png",k=JSON.parse('{"title":"Java 基础 - 泛型机制详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/basic/java-basic-x-generic.md","filePath":"java/basic/java-basic-x-generic.md","lastUpdated":1737706346000}'),r={name:"java/basic/java-basic-x-generic.md"};function d(u,s,g,h,b,v){return t(),e("div",null,s[0]||(s[0]=[l(`<h1 id="java-基础-泛型机制详解" tabindex="-1">Java 基础 - 泛型机制详解 <a class="header-anchor" href="#java-基础-泛型机制详解" aria-label="Permalink to &quot;Java 基础 - 泛型机制详解&quot;">​</a></h1><blockquote><p>Java泛型这个特性是从JDK 1.5才开始加入的，因此为了兼容之前的版本，Java泛型的实现采取了“<strong>伪泛型</strong>”的策略，即Java在语法上支持泛型，但是在编译阶段会进行所谓的“<strong>类型擦除</strong>”（Type Erasure），将所有的泛型表示（尖括号中的内容）都替换为具体的类型（其对应的原生态类型），就像完全没有泛型一样。本文综合多篇文章后，总结了Java 泛型的相关知识，希望可以提升你对Java中泛型的认知效率。@pdai</p></blockquote><h2 id="为什么会引入泛型" tabindex="-1">为什么会引入泛型 <a class="header-anchor" href="#为什么会引入泛型" aria-label="Permalink to &quot;为什么会引入泛型&quot;">​</a></h2><blockquote><p>泛型的本质是为了参数化类型（在不创建新的类型的情况下，通过泛型指定的不同类型来控制形参具体限制的类型）。也就是说在泛型使用过程中，操作的数据类型被指定为一个参数，这种参数类型可以用在类、接口和方法中，分别被称为泛型类、泛型接口、泛型方法。</p></blockquote><p>引入泛型的意义在于：</p><ul><li><strong>适用于多种数据类型执行相同的代码</strong>（代码复用）</li></ul><p>我们通过一个例子来阐述，先看下下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static int add(int a, int b) {</span></span>
<span class="line"><span>    System.out.println(a + &quot;+&quot; + b + &quot;=&quot; + (a + b));</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static float add(float a, float b) {</span></span>
<span class="line"><span>    System.out.println(a + &quot;+&quot; + b + &quot;=&quot; + (a + b));</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static double add(double a, double b) {</span></span>
<span class="line"><span>    System.out.println(a + &quot;+&quot; + b + &quot;=&quot; + (a + b));</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果没有泛型，要实现不同类型的加法，每种类型都需要重载一个add方法；通过泛型，我们可以复用为一个方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static &lt;T extends Number&gt; double add(T a, T b) {</span></span>
<span class="line"><span>    System.out.println(a + &quot;+&quot; + b + &quot;=&quot; + (a.doubleValue() + b.doubleValue()));</span></span>
<span class="line"><span>    return a.doubleValue() + b.doubleValue();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>泛型中的类型在使用时指定，不需要强制类型转换（<strong>类型安全</strong>，编译器会<strong>检查类型</strong>）</li></ul><p>看下这个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List list = new ArrayList();</span></span>
<span class="line"><span>list.add(&quot;xxString&quot;);</span></span>
<span class="line"><span>list.add(100d);</span></span>
<span class="line"><span>list.add(new Person());</span></span></code></pre></div><p>我们在使用上述list中，list中的元素都是Object类型（无法约束其中的类型），所以在取出集合元素时需要人为的强制类型转化到具体的目标类型，且很容易出现<code>java.lang.ClassCastException</code>异常。</p><p>引入泛型，它将提供类型的约束，提供编译前的检查：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;String&gt; list = new ArrayList&lt;String&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// list中只能放String, 不能放其它类型的元素</span></span></code></pre></div><h2 id="泛型的基本使用" tabindex="-1">泛型的基本使用 <a class="header-anchor" href="#泛型的基本使用" aria-label="Permalink to &quot;泛型的基本使用&quot;">​</a></h2><p>提示</p><p>我们通过一些例子来学习泛型的使用；泛型有三种使用方式，分别为：泛型类、泛型接口、泛型方法。一些例子可以参考《李兴华 - Java实战经典》。@pdai</p><h3 id="泛型类" tabindex="-1">泛型类 <a class="header-anchor" href="#泛型类" aria-label="Permalink to &quot;泛型类&quot;">​</a></h3><ul><li>从一个简单的泛型类看起：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Point&lt;T&gt;{         // 此处可以随便写标识符号，T是type的简称  </span></span>
<span class="line"><span>    private T var ;     // var的类型由T指定，即：由外部指定  </span></span>
<span class="line"><span>    public T getVar(){  // 返回值的类型由外部决定  </span></span>
<span class="line"><span>        return var ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setVar(T var){  // 设置的类型也由外部决定  </span></span>
<span class="line"><span>        this.var = var ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>public class GenericsDemo06{  </span></span>
<span class="line"><span>    public static void main(String args[]){  </span></span>
<span class="line"><span>        Point&lt;String&gt; p = new Point&lt;String&gt;() ;     // 里面的var类型为String类型  </span></span>
<span class="line"><span>        p.setVar(&quot;it&quot;) ;                            // 设置字符串  </span></span>
<span class="line"><span>        System.out.println(p.getVar().length()) ;   // 取得字符串的长度  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>多元泛型</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Notepad&lt;K,V&gt;{       // 此处指定了两个泛型类型  </span></span>
<span class="line"><span>    private K key ;     // 此变量的类型由外部决定  </span></span>
<span class="line"><span>    private V value ;   // 此变量的类型由外部决定  </span></span>
<span class="line"><span>    public K getKey(){  </span></span>
<span class="line"><span>        return this.key ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public V getValue(){  </span></span>
<span class="line"><span>        return this.value ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setKey(K key){  </span></span>
<span class="line"><span>        this.key = key ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setValue(V value){  </span></span>
<span class="line"><span>        this.value = value ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>public class GenericsDemo09{  </span></span>
<span class="line"><span>    public static void main(String args[]){  </span></span>
<span class="line"><span>        Notepad&lt;String,Integer&gt; t = null ;        // 定义两个泛型类型的对象  </span></span>
<span class="line"><span>        t = new Notepad&lt;String,Integer&gt;() ;       // 里面的key为String，value为Integer  </span></span>
<span class="line"><span>        t.setKey(&quot;汤姆&quot;) ;        // 设置第一个内容  </span></span>
<span class="line"><span>        t.setValue(20) ;            // 设置第二个内容  </span></span>
<span class="line"><span>        System.out.print(&quot;姓名；&quot; + t.getKey()) ;      // 取得信息  </span></span>
<span class="line"><span>        System.out.print(&quot;，年龄；&quot; + t.getValue()) ;       // 取得信息  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="泛型接口" tabindex="-1">泛型接口 <a class="header-anchor" href="#泛型接口" aria-label="Permalink to &quot;泛型接口&quot;">​</a></h3><ul><li>简单的泛型接口</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface Info&lt;T&gt;{        // 在接口上定义泛型  </span></span>
<span class="line"><span>    public T getVar() ; // 定义抽象方法，抽象方法的返回值就是泛型类型  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>class InfoImpl&lt;T&gt; implements Info&lt;T&gt;{   // 定义泛型接口的子类  </span></span>
<span class="line"><span>    private T var ;             // 定义属性  </span></span>
<span class="line"><span>    public InfoImpl(T var){     // 通过构造方法设置属性内容  </span></span>
<span class="line"><span>        this.setVar(var) ;    </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setVar(T var){  </span></span>
<span class="line"><span>        this.var = var ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public T getVar(){  </span></span>
<span class="line"><span>        return this.var ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>public class GenericsDemo24{  </span></span>
<span class="line"><span>    public static void main(String arsg[]){  </span></span>
<span class="line"><span>        Info&lt;String&gt; i = null;        // 声明接口对象  </span></span>
<span class="line"><span>        i = new InfoImpl&lt;String&gt;(&quot;汤姆&quot;) ;  // 通过子类实例化对象  </span></span>
<span class="line"><span>        System.out.println(&quot;内容：&quot; + i.getVar()) ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="泛型方法" tabindex="-1">泛型方法 <a class="header-anchor" href="#泛型方法" aria-label="Permalink to &quot;泛型方法&quot;">​</a></h3><p>泛型方法，是在调用方法的时候指明泛型的具体类型。重点看下泛型的方法（图参考自：<a href="https://www.cnblogs.com/iyangyuan/archive/2013/04/09/3011274.html%EF%BC%89" target="_blank" rel="noreferrer">https://www.cnblogs.com/iyangyuan/archive/2013/04/09/3011274.html）</a></p><ul><li>定义泛型方法语法格式</li></ul><p><img src="`+a+'" alt="error.图片加载失败"></p><ul><li>调用泛型方法语法格式</li></ul><p><img src="'+n+`" alt="error.图片加载失败"></p><p>说明一下，定义泛型方法时，必须在返回值前边加一个<code>&lt;T&gt;</code>，来声明这是一个泛型方法，持有一个泛型<code>T</code>，然后才可以用泛型T作为方法的返回值。</p><p><code>Class&lt;T&gt;</code>的作用就是指明泛型的具体类型，而<code>Class&lt;T&gt;</code>类型的变量c，可以用来创建泛型类的对象。</p><p>为什么要用变量c来创建对象呢？既然是泛型方法，就代表着我们不知道具体的类型是什么，也不知道构造方法如何，因此没有办法去new一个对象，但可以利用变量c的newInstance方法去创建对象，也就是利用反射创建对象。</p><p>泛型方法要求的参数是<code>Class&lt;T&gt;</code>类型，而<code>Class.forName()</code>方法的返回值也是<code>Class&lt;T&gt;</code>，因此可以用<code>Class.forName()</code>作为参数。其中，<code>forName()</code>方法中的参数是何种类型，返回的<code>Class&lt;T&gt;</code>就是何种类型。在本例中，<code>forName()</code>方法中传入的是User类的完整路径，因此返回的是<code>Class&lt;User&gt;</code>类型的对象，因此调用泛型方法时，变量c的类型就是<code>Class&lt;User&gt;</code>，因此泛型方法中的泛型T就被指明为User，因此变量obj的类型为User。</p><p>当然，泛型方法不是仅仅可以有一个参数<code>Class&lt;T&gt;</code>，可以根据需要添加其他参数。</p><p><strong>为什么要使用泛型方法呢</strong>？因为泛型类要在实例化的时候就指明类型，如果想换一种类型，不得不重新new一次，可能不够灵活；而泛型方法可以在调用的时候指明类型，更加灵活。</p><h3 id="泛型的上下限" tabindex="-1">泛型的上下限 <a class="header-anchor" href="#泛型的上下限" aria-label="Permalink to &quot;泛型的上下限&quot;">​</a></h3><ul><li><strong>先看下如下的代码，很明显是会报错的</strong> （具体错误原因请参考后文）。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class A{}</span></span>
<span class="line"><span>class B extends A {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 如下两个方法不会报错</span></span>
<span class="line"><span>public static void funA(A a) {</span></span>
<span class="line"><span>    // ...          </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public static void funB(B b) {</span></span>
<span class="line"><span>    funA(b);</span></span>
<span class="line"><span>    // ...             </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 如下funD方法会报错</span></span>
<span class="line"><span>public static void funC(List&lt;A&gt; listA) {</span></span>
<span class="line"><span>    // ...          </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public static void funD(List&lt;B&gt; listB) {</span></span>
<span class="line"><span>    funC(listB); // Unresolved compilation problem: The method doPrint(List&lt;A&gt;) in the type test is not applicable for the arguments (List&lt;B&gt;)</span></span>
<span class="line"><span>    // ...             </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么如何解决呢？</p><p>为了解决泛型中隐含的转换问题，Java泛型加入了类型参数的上下边界机制。<code>&lt;? extends A&gt;</code>表示该类型参数可以是A(上边界)或者A的子类类型。编译时擦除到类型A，即用A类型代替类型参数。这种方法可以解决开始遇到的问题，编译器知道类型参数的范围，如果传入的实例类型B是在这个范围内的话允许转换，这时只要一次类型转换就可以了，运行时会把对象当做A的实例看待。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void funC(List&lt;? extends A&gt; listA) {</span></span>
<span class="line"><span>    // ...          </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public static void funD(List&lt;B&gt; listB) {</span></span>
<span class="line"><span>    funC(listB); // OK</span></span>
<span class="line"><span>    // ...             </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>泛型上下限的引入</strong></li></ul><p>在使用泛型的时候，我们可以为传入的泛型类型实参进行上下边界的限制，如：类型实参只准传入某种类型的父类或某种类型的子类。</p><p>上限</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Info&lt;T extends Number&gt;{    // 此处泛型只能是数字类型</span></span>
<span class="line"><span>    private T var ;        // 定义泛型变量</span></span>
<span class="line"><span>    public void setVar(T var){</span></span>
<span class="line"><span>        this.var = var ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public T getVar(){</span></span>
<span class="line"><span>        return this.var ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public String toString(){    // 直接打印</span></span>
<span class="line"><span>        return this.var.toString() ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class demo1{</span></span>
<span class="line"><span>    public static void main(String args[]){</span></span>
<span class="line"><span>        Info&lt;Integer&gt; i1 = new Info&lt;Integer&gt;() ;        // 声明Integer的泛型对象</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下限</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Info&lt;T&gt;{</span></span>
<span class="line"><span>    private T var ;        // 定义泛型变量</span></span>
<span class="line"><span>    public void setVar(T var){</span></span>
<span class="line"><span>        this.var = var ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public T getVar(){</span></span>
<span class="line"><span>        return this.var ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public String toString(){    // 直接打印</span></span>
<span class="line"><span>        return this.var.toString() ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class GenericsDemo21{</span></span>
<span class="line"><span>    public static void main(String args[]){</span></span>
<span class="line"><span>        Info&lt;String&gt; i1 = new Info&lt;String&gt;() ;        // 声明String的泛型对象</span></span>
<span class="line"><span>        Info&lt;Object&gt; i2 = new Info&lt;Object&gt;() ;        // 声明Object的泛型对象</span></span>
<span class="line"><span>        i1.setVar(&quot;hello&quot;) ;</span></span>
<span class="line"><span>        i2.setVar(new Object()) ;</span></span>
<span class="line"><span>        fun(i1) ;</span></span>
<span class="line"><span>        fun(i2) ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public static void fun(Info&lt;? super String&gt; temp){    // 只能接收String或Object类型的泛型，String类的父类只有Object类</span></span>
<span class="line"><span>        System.out.print(temp + &quot;, &quot;) ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>小结</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?&gt; 无限制通配符</span></span>
<span class="line"><span>&lt;? extends E&gt; extends 关键字声明了类型的上界，表示参数化的类型可能是所指定的类型，或者是此类型的子类</span></span>
<span class="line"><span>&lt;? super E&gt; super 关键字声明了类型的下界，表示参数化的类型可能是指定的类型，或者是此类型的父类</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 使用原则《Effictive Java》</span></span>
<span class="line"><span>// 为了获得最大限度的灵活性，要在表示 生产者或者消费者 的输入参数上使用通配符，使用的规则就是：生产者有上限、消费者有下限</span></span>
<span class="line"><span>1. 如果参数化类型表示一个 T 的生产者，使用 &lt; ? extends T&gt;;</span></span>
<span class="line"><span>2. 如果它表示一个 T 的消费者，就使用 &lt; ? super T&gt;；</span></span>
<span class="line"><span>3. 如果既是生产又是消费，那使用通配符就没什么意义了，因为你需要的是精确的参数类型。</span></span></code></pre></div><ul><li>再看一个实际例子，<strong>加深印象</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private  &lt;E extends Comparable&lt;? super E&gt;&gt; E max(List&lt;? extends E&gt; e1) {</span></span>
<span class="line"><span>    if (e1 == null){</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //迭代器返回的元素属于 E 的某个子类型</span></span>
<span class="line"><span>    Iterator&lt;? extends E&gt; iterator = e1.iterator();</span></span>
<span class="line"><span>    E result = iterator.next();</span></span>
<span class="line"><span>    while (iterator.hasNext()){</span></span>
<span class="line"><span>        E next = iterator.next();</span></span>
<span class="line"><span>        if (next.compareTo(result) &gt; 0){</span></span>
<span class="line"><span>            result = next;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中的类型参数 E 的范围是<code>&lt;E extends Comparable&lt;? super E&gt;&gt;</code>，我们可以分步查看：</p><ul><li><p>要进行比较，所以 E 需要是可比较的类，因此需要 <code>extends Comparable&lt;…&gt;</code>（注意这里不要和继承的 <code>extends</code> 搞混了，不一样）</p></li><li><p><code>Comparable&lt; ? super E&gt;</code> 要对 E 进行比较，即 E 的消费者，所以需要用 super</p></li><li><p>而参数 <code>List&lt; ? extends E&gt;</code> 表示要操作的数据是 E 的子类的列表，指定上限，这样容器才够大</p></li><li><p><strong>多个限制</strong></p></li></ul><p>使用&amp;符号</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Client {</span></span>
<span class="line"><span>    //工资低于2500元的上斑族并且站立的乘客车票打8折</span></span>
<span class="line"><span>    public static &lt;T extends Staff &amp; Passenger&gt; void discount(T t){</span></span>
<span class="line"><span>        if(t.getSalary()&lt;2500 &amp;&amp; t.isStanding()){</span></span>
<span class="line"><span>            System.out.println(&quot;恭喜你！您的车票打八折！&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        discount(new Me());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="泛型数组" tabindex="-1">泛型数组 <a class="header-anchor" href="#泛型数组" aria-label="Permalink to &quot;泛型数组&quot;">​</a></h3><blockquote><p>具体可以参考下文中关于泛型数组的理解。</p></blockquote><p>首先，我们泛型数组相关的申明：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;String&gt;[] list11 = new ArrayList&lt;String&gt;[10]; //编译错误，非法创建 </span></span>
<span class="line"><span>List&lt;String&gt;[] list12 = new ArrayList&lt;?&gt;[10]; //编译错误，需要强转类型 </span></span>
<span class="line"><span>List&lt;String&gt;[] list13 = (List&lt;String&gt;[]) new ArrayList&lt;?&gt;[10]; //OK，但是会有警告 </span></span>
<span class="line"><span>List&lt;?&gt;[] list14 = new ArrayList&lt;String&gt;[10]; //编译错误，非法创建 </span></span>
<span class="line"><span>List&lt;?&gt;[] list15 = new ArrayList&lt;?&gt;[10]; //OK </span></span>
<span class="line"><span>List&lt;String&gt;[] list6 = new ArrayList[10]; //OK，但是会有警告</span></span></code></pre></div><p>那么通常我们如何用呢？</p><ul><li>讨巧的使用场景</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class GenericsDemo30{  </span></span>
<span class="line"><span>    public static void main(String args[]){  </span></span>
<span class="line"><span>        Integer i[] = fun1(1,2,3,4,5,6) ;   // 返回泛型数组  </span></span>
<span class="line"><span>        fun2(i) ;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public static &lt;T&gt; T[] fun1(T...arg){  // 接收可变参数  </span></span>
<span class="line"><span>        return arg ;            // 返回泛型数组  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public static &lt;T&gt; void fun2(T param[]){   // 输出  </span></span>
<span class="line"><span>        System.out.print(&quot;接收泛型数组：&quot;) ;  </span></span>
<span class="line"><span>        for(T t:param){  </span></span>
<span class="line"><span>            System.out.print(t + &quot;、&quot;) ;  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>合理使用</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ArrayWithTypeToken(Class&lt;T&gt; type, int size) {</span></span>
<span class="line"><span>    array = (T[]) Array.newInstance(type, size);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>具体可以查看后文解释。</p><h2 id="深入理解泛型" tabindex="-1">深入理解泛型 <a class="header-anchor" href="#深入理解泛型" aria-label="Permalink to &quot;深入理解泛型&quot;">​</a></h2><p>提示</p><p>我们通过泛型背后的类型擦除以及相关的问题来进一步理解泛型。@pdai</p><h3 id="如何理解java中的泛型是伪泛型-泛型中类型擦除" tabindex="-1">如何理解Java中的泛型是伪泛型？泛型中类型擦除 <a class="header-anchor" href="#如何理解java中的泛型是伪泛型-泛型中类型擦除" aria-label="Permalink to &quot;如何理解Java中的泛型是伪泛型？泛型中类型擦除&quot;">​</a></h3><blockquote><p>Java泛型这个特性是从JDK 1.5才开始加入的，因此为了兼容之前的版本，Java泛型的实现采取了“<strong>伪泛型</strong>”的策略，即Java在语法上支持泛型，但是在编译阶段会进行所谓的“<strong>类型擦除</strong>”（Type Erasure），将所有的泛型表示（尖括号中的内容）都替换为具体的类型（其对应的原生态类型），就像完全没有泛型一样。理解类型擦除对于用好泛型是很有帮助的，尤其是一些看起来“疑难杂症”的问题，弄明白了类型擦除也就迎刃而解了。</p></blockquote><p><strong>泛型的类型擦除原则</strong>是：</p><ul><li>消除类型参数声明，即删除<code>&lt;&gt;</code>及其包围的部分。</li><li>根据类型参数的上下界推断并替换所有的类型参数为原生态类型：如果类型参数是无限制通配符或没有上下界限定则替换为Object，如果存在上下界限定则根据子类替换原则取类型参数的最左边限定类型（即父类）。</li><li>为了保证类型安全，必要时插入强制类型转换代码。</li><li>自动产生“桥接方法”以保证擦除类型后的代码仍然具有泛型的“多态性”。</li></ul><p><strong>那么如何进行擦除的呢</strong>？</p><p>参考自：<a href="http://softlab.sdut.edu.cn/blog/subaochen/2017/01/generics-type-erasure/" target="_blank" rel="noreferrer">http://softlab.sdut.edu.cn/blog/subaochen/2017/01/generics-type-erasure/</a></p><ul><li>擦除类定义中的类型参数 - 无限制类型擦除</li></ul><p>当类定义中的类型参数没有任何限制时，在类型擦除中直接被替换为Object，即形如<code>&lt;T&gt;</code>和<code>&lt;?&gt;</code>的类型参数都被替换为Object。</p><p><img src="`+i+'" alt="error.图片加载失败"></p><ul><li>擦除类定义中的类型参数 - 有限制类型擦除</li></ul><p>当类定义中的类型参数存在限制（上下界）时，在类型擦除中替换为类型参数的上界或者下界，比如形如<code>&lt;T extends Number&gt;</code>和<code>&lt;? extends Number&gt;</code>的类型参数被替换为<code>Number</code>，<code>&lt;? super Number&gt;</code>被替换为Object。</p><p><img src="'+c+'" alt="error.图片加载失败"></p><ul><li>擦除方法定义中的类型参数</li></ul><p>擦除方法定义中的类型参数原则和擦除类定义中的类型参数是一样的，这里仅以擦除方法定义中的有限制类型参数为例。</p><p><img src="'+o+`" alt="error.图片加载失败"></p><h3 id="如何证明类型的擦除呢" tabindex="-1">如何证明类型的擦除呢？ <a class="header-anchor" href="#如何证明类型的擦除呢" aria-label="Permalink to &quot;如何证明类型的擦除呢？&quot;">​</a></h3><blockquote><p>我们通过两个例子证明Java类型的类型擦除</p></blockquote><ul><li>原始类型相等</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ArrayList&lt;String&gt; list1 = new ArrayList&lt;String&gt;();</span></span>
<span class="line"><span>        list1.add(&quot;abc&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ArrayList&lt;Integer&gt; list2 = new ArrayList&lt;Integer&gt;();</span></span>
<span class="line"><span>        list2.add(123);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(list1.getClass() == list2.getClass()); // true</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个例子中，我们定义了两个ArrayList数组，不过一个是<code>ArrayList&lt;String&gt;</code>泛型类型的，只能存储字符串；一个是<code>ArrayList&lt;Integer&gt;</code>泛型类型的，只能存储整数，最后，我们通过list1对象和list2对象的<code>getClass()</code>方法获取他们的类的信息，最后发现结果为true。说明泛型类型String和Integer都被擦除掉了，只剩下原始类型。</p><ul><li>通过反射添加其它类型元素</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ArrayList&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        list.add(1);  //这样调用 add 方法只能存储整形，因为泛型类型的实例为 Integer</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        list.getClass().getMethod(&quot;add&quot;, Object.class).invoke(list, &quot;asd&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = 0; i &lt; list.size(); i++) {</span></span>
<span class="line"><span>            System.out.println(list.get(i));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在程序中定义了一个<code>ArrayList</code>泛型类型实例化为<code>Integer</code>对象，如果直接调用<code>add()</code>方法，那么只能存储整数数据，不过当我们利用反射调用<code>add()</code>方法的时候，却可以存储字符串，这说明了<code>Integer</code>泛型实例在编译之后被擦除掉了，只保留了原始类型。</p><h3 id="如何理解类型擦除后保留的原始类型" tabindex="-1">如何理解类型擦除后保留的原始类型? <a class="header-anchor" href="#如何理解类型擦除后保留的原始类型" aria-label="Permalink to &quot;如何理解类型擦除后保留的原始类型?&quot;">​</a></h3><blockquote><p>在上面，两次提到了原始类型，什么是原始类型？</p></blockquote><p><strong>原始类型</strong> 就是擦除去了泛型信息，最后在字节码中的类型变量的真正类型，无论何时定义一个泛型，相应的原始类型都会被自动提供，类型变量擦除，并使用其限定类型（无限定的变量用Object）替换。</p><ul><li>原始类型Object</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Pair&lt;T&gt; {  </span></span>
<span class="line"><span>    private T value;  </span></span>
<span class="line"><span>    public T getValue() {  </span></span>
<span class="line"><span>        return value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setValue(T  value) {  </span></span>
<span class="line"><span>        this.value = value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Pair的原始类型为:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Pair {  </span></span>
<span class="line"><span>    private Object value;  </span></span>
<span class="line"><span>    public Object getValue() {  </span></span>
<span class="line"><span>        return value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setValue(Object  value) {  </span></span>
<span class="line"><span>        this.value = value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为在<code>Pair&lt;T&gt;</code>中，<code>T</code> 是一个无限定的类型变量，所以用Object替换，其结果就是一个普通的类，如同泛型加入Java语言之前的已经实现的样子。在程序中可以包含不同类型的Pair，如<code>Pair&lt;String&gt;</code>或<code>Pair&lt;Integer&gt;</code>，但是擦除类型后他们的就成为原始的Pair类型了，原始类型都是Object。</p><p>从上面章节，我们也可以明白ArrayList被擦除类型后，原始类型也变为Object，所以通过反射我们就可以存储字符串了。</p><p>如果类型变量有限定，那么原始类型就用第一个边界的类型变量类替换。</p><p>比如: Pair这样声明的话</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Pair&lt;T extends Comparable&gt; {}</span></span></code></pre></div><p>那么原始类型就是Comparable。</p><p>要区分原始类型和泛型变量的类型。</p><p>在调用泛型方法时，可以指定泛型，也可以不指定泛型:</p><ul><li>在不指定泛型的情况下，泛型变量的类型为该方法中的几种类型的同一父类的最小级，直到Object</li><li>在指定泛型的情况下，该方法的几种类型必须是该泛型的实例的类型或者其子类</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {  </span></span>
<span class="line"><span>    public static void main(String[] args) {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /**不指定泛型的时候*/  </span></span>
<span class="line"><span>        int i = Test.add(1, 2); //这两个参数都是Integer，所以T为Integer类型  </span></span>
<span class="line"><span>        Number f = Test.add(1, 1.2); //这两个参数一个是Integer，一个是Float，所以取同一父类的最小级，为Number  </span></span>
<span class="line"><span>        Object o = Test.add(1, &quot;asd&quot;); //这两个参数一个是Integer，一个是String，所以取同一父类的最小级，为Object  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /**指定泛型的时候*/  </span></span>
<span class="line"><span>        int a = Test.&lt;Integer&gt;add(1, 2); //指定了Integer，所以只能为Integer类型或者其子类  </span></span>
<span class="line"><span>        int b = Test.&lt;Integer&gt;add(1, 2.2); //编译错误，指定了Integer，不能为Float  </span></span>
<span class="line"><span>        Number c = Test.&lt;Number&gt;add(1, 2.2); //指定为Number，所以可以为Integer和Float  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //这是一个简单的泛型方法  </span></span>
<span class="line"><span>    public static &lt;T&gt; T add(T x,T y){  </span></span>
<span class="line"><span>        return y;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实在泛型类中，不指定泛型的时候，也差不多，只不过这个时候的泛型为Object，就比如ArrayList中，如果不指定泛型，那么这个ArrayList可以存储任意的对象。</p><ul><li>Object泛型</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {  </span></span>
<span class="line"><span>    ArrayList list = new ArrayList();  </span></span>
<span class="line"><span>    list.add(1);  </span></span>
<span class="line"><span>    list.add(&quot;121&quot;);  </span></span>
<span class="line"><span>    list.add(new Date());  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="如何理解泛型的编译期检查" tabindex="-1">如何理解泛型的编译期检查？ <a class="header-anchor" href="#如何理解泛型的编译期检查" aria-label="Permalink to &quot;如何理解泛型的编译期检查？&quot;">​</a></h3><blockquote><p>既然说类型变量会在编译的时候擦除掉，那为什么我们往 ArrayList 创建的对象中添加整数会报错呢？不是说泛型变量String会在编译的时候变为Object类型吗？为什么不能存别的类型呢？既然类型擦除了，如何保证我们只能使用泛型变量限定的类型呢？</p></blockquote><p>Java编译器是通过先检查代码中泛型的类型，然后在进行类型擦除，再进行编译。</p><p>例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static  void main(String[] args) {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ArrayList&lt;String&gt; list = new ArrayList&lt;String&gt;();  </span></span>
<span class="line"><span>    list.add(&quot;123&quot;);  </span></span>
<span class="line"><span>    list.add(123);//编译错误  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面的程序中，使用add方法添加一个整型，在IDE中，直接会报错，说明这就是在编译之前的检查，因为如果是在编译之后检查，类型擦除后，原始类型为Object，是应该允许任意引用类型添加的。可实际上却不是这样的，这恰恰说明了关于泛型变量的使用，是会在编译之前检查的。</p><p>那么，<strong>这个类型检查是针对谁的呢</strong>？我们先看看参数化类型和原始类型的兼容。</p><p>以 ArrayList举例子，以前的写法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ArrayList list = new ArrayList();</span></span></code></pre></div><p>现在的写法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ArrayList&lt;String&gt; list = new ArrayList&lt;String&gt;();</span></span></code></pre></div><p>如果是与以前的代码兼容，各种引用传值之间，必然会出现如下的情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ArrayList&lt;String&gt; list1 = new ArrayList(); //第一种 情况</span></span>
<span class="line"><span>ArrayList list2 = new ArrayList&lt;String&gt;(); //第二种 情况</span></span></code></pre></div><p>这样是没有错误的，不过会有个编译时警告。</p><p>不过在第一种情况，可以实现与完全使用泛型参数一样的效果，第二种则没有效果。</p><p>因为类型检查就是编译时完成的，new ArrayList()只是在内存中开辟了一个存储空间，可以存储任何类型对象，而真正涉及类型检查的是它的引用，因为我们是使用它引用list1来调用它的方法，比如说调用add方法，所以list1引用能完成泛型类型的检查。而引用list2没有使用泛型，所以不行。</p><p>举例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ArrayList&lt;String&gt; list1 = new ArrayList();  </span></span>
<span class="line"><span>        list1.add(&quot;1&quot;); //编译通过  </span></span>
<span class="line"><span>        list1.add(1); //编译错误  </span></span>
<span class="line"><span>        String str1 = list1.get(0); //返回类型就是String  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ArrayList list2 = new ArrayList&lt;String&gt;();  </span></span>
<span class="line"><span>        list2.add(&quot;1&quot;); //编译通过  </span></span>
<span class="line"><span>        list2.add(1); //编译通过  </span></span>
<span class="line"><span>        Object object = list2.get(0); //返回类型就是Object  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        new ArrayList&lt;String&gt;().add(&quot;11&quot;); //编译通过  </span></span>
<span class="line"><span>        new ArrayList&lt;String&gt;().add(22); //编译错误  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String str2 = new ArrayList&lt;String&gt;().get(0); //返回类型就是String  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上面的例子，我们可以明白，<strong>类型检查就是针对引用的，谁是一个引用，用这个引用调用泛型方法，就会对这个引用调用的方法进行类型检测，而无关它真正引用的对象</strong>。</p><p><strong>泛型中参数话类型为什么不考虑继承关系</strong>？</p><p>在Java中，像下面形式的引用传递是不允许的:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ArrayList&lt;String&gt; list1 = new ArrayList&lt;Object&gt;(); //编译错误  </span></span>
<span class="line"><span>ArrayList&lt;Object&gt; list2 = new ArrayList&lt;String&gt;(); //编译错误</span></span></code></pre></div><ul><li>我们先看第一种情况，将第一种情况拓展成下面的形式：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ArrayList&lt;Object&gt; list1 = new ArrayList&lt;Object&gt;();  </span></span>
<span class="line"><span>list1.add(new Object());  </span></span>
<span class="line"><span>list1.add(new Object());  </span></span>
<span class="line"><span>ArrayList&lt;String&gt; list2 = list1; //编译错误</span></span></code></pre></div><p>实际上，在第4行代码的时候，就会有编译错误。那么，我们先假设它编译没错。那么当我们使用list2引用用get()方法取值的时候，返回的都是String类型的对象（上面提到了，类型检测是根据引用来决定的），可是它里面实际上已经被我们存放了Object类型的对象，这样就会有<code>ClassCastException</code>了。所以为了避免这种极易出现的错误，Java不允许进行这样的引用传递。（这也是泛型出现的原因，就是为了解决类型转换的问题，我们不能违背它的初衷）。</p><ul><li>再看第二种情况，将第二种情况拓展成下面的形式：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ArrayList&lt;String&gt; list1 = new ArrayList&lt;String&gt;();  </span></span>
<span class="line"><span>list1.add(new String());  </span></span>
<span class="line"><span>list1.add(new String());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ArrayList&lt;Object&gt; list2 = list1; //编译错误</span></span></code></pre></div><p>没错，这样的情况比第一种情况好的多，最起码，在我们用list2取值的时候不会出现ClassCastException，因为是从String转换为Object。可是，这样做有什么意义呢，泛型出现的原因，就是为了解决类型转换的问题。</p><p>我们使用了泛型，到头来，还是要自己强转，违背了泛型设计的初衷。所以java不允许这么干。再说，你如果又用list2往里面add()新的对象，那么到时候取得时候，我怎么知道我取出来的到底是String类型的，还是Object类型的呢？</p><p>所以，要格外注意，泛型中的引用传递的问题。</p><h3 id="如何理解泛型的多态-泛型的桥接方法" tabindex="-1">如何理解泛型的多态？泛型的桥接方法 <a class="header-anchor" href="#如何理解泛型的多态-泛型的桥接方法" aria-label="Permalink to &quot;如何理解泛型的多态？泛型的桥接方法&quot;">​</a></h3><blockquote><p>类型擦除会造成多态的冲突，而JVM解决方法就是桥接方法。</p></blockquote><p>现在有这样一个泛型类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Pair&lt;T&gt; {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private T value;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public T getValue() {  </span></span>
<span class="line"><span>        return value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setValue(T value) {  </span></span>
<span class="line"><span>        this.value = value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后我们想要一个子类继承它。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class DateInter extends Pair&lt;Date&gt; {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override  </span></span>
<span class="line"><span>    public void setValue(Date value) {  </span></span>
<span class="line"><span>        super.setValue(value);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override  </span></span>
<span class="line"><span>    public Date getValue() {  </span></span>
<span class="line"><span>        return super.getValue();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个子类中，我们设定父类的泛型类型为<code>Pair&lt;Date&gt;</code>，在子类中，我们覆盖了父类的两个方法，我们的原意是这样的：将父类的泛型类型限定为Date，那么父类里面的两个方法的参数都为Date类型。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Date getValue() {  </span></span>
<span class="line"><span>    return value;  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void setValue(Date value) {  </span></span>
<span class="line"><span>    this.value = value;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以，我们在子类中重写这两个方法一点问题也没有，实际上，从他们的<code>@Override</code>标签中也可以看到，一点问题也没有，实际上是这样的吗？</p><p>分析：实际上，类型擦除后，父类的的泛型类型全部变为了原始类型Object，所以父类编译之后会变成下面的样子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Pair {  </span></span>
<span class="line"><span>    private Object value;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object getValue() {  </span></span>
<span class="line"><span>        return value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setValue(Object  value) {  </span></span>
<span class="line"><span>        this.value = value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再看子类的两个重写的方法的类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override  </span></span>
<span class="line"><span>public void setValue(Date value) {  </span></span>
<span class="line"><span>    super.setValue(value);  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>@Override  </span></span>
<span class="line"><span>public Date getValue() {  </span></span>
<span class="line"><span>    return super.getValue();  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>先来分析setValue方法，父类的类型是Object，而子类的类型是Date，参数类型不一样，这如果实在普通的继承关系中，根本就不会是重写，而是重载。 我们在一个main方法测试一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws ClassNotFoundException {  </span></span>
<span class="line"><span>        DateInter dateInter = new DateInter();  </span></span>
<span class="line"><span>        dateInter.setValue(new Date());                  </span></span>
<span class="line"><span>        dateInter.setValue(new Object()); //编译错误  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果是重载，那么子类中两个setValue方法，一个是参数Object类型，一个是Date类型，可是我们发现，根本就没有这样的一个子类继承自父类的Object类型参数的方法。所以说，却是是重写了，而不是重载了。</p><p><strong>为什么会这样呢</strong>？</p><p>原因是这样的，我们传入父类的泛型类型是Date，<code>Pair&lt;Date&gt;</code>，我们的本意是将泛型类变为如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Pair {  </span></span>
<span class="line"><span>    private Date value;  </span></span>
<span class="line"><span>    public Date getValue() {  </span></span>
<span class="line"><span>        return value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    public void setValue(Date value) {  </span></span>
<span class="line"><span>        this.value = value;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后再子类中重写参数类型为Date的那两个方法，实现继承中的多态。</p><p>可是由于种种原因，虚拟机并不能将泛型类型变为Date，只能将类型擦除掉，变为原始类型Object。这样，我们的本意是进行重写，实现多态。可是类型擦除后，只能变为了重载。这样，类型擦除就和多态有了冲突。JVM知道你的本意吗？知道！！！可是它能直接实现吗，不能！！！如果真的不能的话，那我们怎么去重写我们想要的Date类型参数的方法啊。</p><blockquote><p>于是JVM采用了一个特殊的方法，来完成这项功能，那就是桥方法。</p></blockquote><p>首先，我们用javap -c className的方式反编译下DateInter子类的字节码，结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class com.tao.test.DateInter extends com.tao.test.Pair&lt;java.util.Date&gt; {  </span></span>
<span class="line"><span>  com.tao.test.DateInter();  </span></span>
<span class="line"><span>    Code:  </span></span>
<span class="line"><span>       0: aload_0  </span></span>
<span class="line"><span>       1: invokespecial #8                  // Method com/tao/test/Pair.&quot;&lt;init&gt;&quot;:()V  </span></span>
<span class="line"><span>       4: return  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setValue(java.util.Date);  //我们重写的setValue方法  </span></span>
<span class="line"><span>    Code:  </span></span>
<span class="line"><span>       0: aload_0  </span></span>
<span class="line"><span>       1: aload_1  </span></span>
<span class="line"><span>       2: invokespecial #16                 // Method com/tao/test/Pair.setValue:(Ljava/lang/Object;)V  </span></span>
<span class="line"><span>       5: return  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public java.util.Date getValue();    //我们重写的getValue方法  </span></span>
<span class="line"><span>    Code:  </span></span>
<span class="line"><span>       0: aload_0  </span></span>
<span class="line"><span>       1: invokespecial #23                 // Method com/tao/test/Pair.getValue:()Ljava/lang/Object;  </span></span>
<span class="line"><span>       4: checkcast     #26                 // class java/util/Date  </span></span>
<span class="line"><span>       7: areturn  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public java.lang.Object getValue();     //编译时由编译器生成的桥方法  </span></span>
<span class="line"><span>    Code:  </span></span>
<span class="line"><span>       0: aload_0  </span></span>
<span class="line"><span>       1: invokevirtual #28                 // Method getValue:()Ljava/util/Date 去调用我们重写的getValue方法;  </span></span>
<span class="line"><span>       4: areturn  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setValue(java.lang.Object);   //编译时由编译器生成的桥方法  </span></span>
<span class="line"><span>    Code:  </span></span>
<span class="line"><span>       0: aload_0  </span></span>
<span class="line"><span>       1: aload_1  </span></span>
<span class="line"><span>       2: checkcast     #26                 // class java/util/Date  </span></span>
<span class="line"><span>       5: invokevirtual #30                 // Method setValue:(Ljava/util/Date; 去调用我们重写的setValue方法)V  </span></span>
<span class="line"><span>       8: return  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从编译的结果来看，我们本意重写setValue和getValue方法的子类，竟然有4个方法，其实不用惊奇，最后的两个方法，就是编译器自己生成的桥方法。可以看到桥方法的参数类型都是Object，也就是说，子类中真正覆盖父类两个方法的就是这两个我们看不到的桥方法。而打在我们自己定义的setvalue和getValue方法上面的@Oveerride只不过是假象。而桥方法的内部实现，就只是去调用我们自己重写的那两个方法。</p><p>所以，虚拟机巧妙的使用了桥方法，来解决了类型擦除和多态的冲突。</p><p>不过，要提到一点，这里面的setValue和getValue这两个桥方法的意义又有不同。</p><p>setValue方法是为了解决类型擦除与多态之间的冲突。</p><p>而getValue却有普遍的意义，怎么说呢，如果这是一个普通的继承关系：</p><p>那么父类的getValue方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object getValue() {  </span></span>
<span class="line"><span>    return super.getValue();  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而子类重写的方法是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Date getValue() {  </span></span>
<span class="line"><span>    return super.getValue();  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实这在普通的类继承中也是普遍存在的重写，这就是协变。</p><p>并且，还有一点也许会有疑问，子类中的桥方法<code>Object getValue()</code>和<code>Date getValue()</code>是同时存在的，可是如果是常规的两个方法，他们的方法签名是一样的，也就是说虚拟机根本不能分别这两个方法。如果是我们自己编写Java代码，这样的代码是无法通过编译器的检查的，但是虚拟机却是允许这样做的，因为虚拟机通过参数类型和返回类型来确定一个方法，所以编译器为了实现泛型的多态允许自己做这个看起来“不合法”的事情，然后交给虚拟器去区别。</p><h3 id="如何理解基本类型不能作为泛型类型" tabindex="-1">如何理解基本类型不能作为泛型类型？ <a class="header-anchor" href="#如何理解基本类型不能作为泛型类型" aria-label="Permalink to &quot;如何理解基本类型不能作为泛型类型？&quot;">​</a></h3><blockquote><p>比如，我们没有<code>ArrayList&lt;int&gt;</code>，只有<code>ArrayList&lt;Integer&gt;</code>, 为何？</p></blockquote><p>因为当类型擦除后，ArrayList的原始类型变为Object，但是Object类型不能存储int值，只能引用Integer的值。</p><p>另外需要注意，我们能够使用<code>list.add(1)</code>是因为Java基础类型的自动装箱拆箱操作。</p><h3 id="如何理解泛型类型不能实例化" tabindex="-1">如何理解泛型类型不能实例化？ <a class="header-anchor" href="#如何理解泛型类型不能实例化" aria-label="Permalink to &quot;如何理解泛型类型不能实例化？&quot;">​</a></h3><blockquote><p>不能实例化泛型类型, 这本质上是由于类型擦除决定的：</p></blockquote><p>我们可以看到如下代码会在编译器中报错：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>T test = new T(); // ERROR</span></span></code></pre></div><p>因为在 Java 编译期没法确定泛型参数化类型，也就找不到对应的类字节码文件，所以自然就不行了，此外由于<code>T</code> 被擦除为 <code>Object</code>，如果可以 <code>new T()</code> 则就变成了 <code>new Object()</code>，失去了本意。     如果我们确实需要实例化一个泛型，应该如何做呢？可以通过反射实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static &lt;T&gt; T newTclass (Class &lt; T &gt; clazz) throws InstantiationException, IllegalAccessException {</span></span>
<span class="line"><span>    T obj = clazz.newInstance();</span></span>
<span class="line"><span>    return obj;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="泛型数组-能不能采用具体的泛型类型进行初始化" tabindex="-1">泛型数组：能不能采用具体的泛型类型进行初始化？ <a class="header-anchor" href="#泛型数组-能不能采用具体的泛型类型进行初始化" aria-label="Permalink to &quot;泛型数组：能不能采用具体的泛型类型进行初始化？&quot;">​</a></h3><p>我们先来看下Oracle官网提供的一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;String&gt;[] lsa = new List&lt;String&gt;[10]; // Not really allowed.</span></span>
<span class="line"><span>Object o = lsa;</span></span>
<span class="line"><span>Object[] oa = (Object[]) o;</span></span>
<span class="line"><span>List&lt;Integer&gt; li = new ArrayList&lt;Integer&gt;();</span></span>
<span class="line"><span>li.add(new Integer(3));</span></span>
<span class="line"><span>oa[1] = li; // Unsound, but passes run time store check</span></span>
<span class="line"><span>String s = lsa[1].get(0); // Run-time error ClassCastException.</span></span></code></pre></div><p>由于 JVM 泛型的擦除机制，所以上面代码可以给 <code>oa[1]</code> 赋值为 ArrayList 也不会出现异常，但是在取出数据的时候却要做一次类型转换，所以就会出现 <code>ClassCastException</code>，如果可以进行泛型数组的声明则上面说的这种情况在编译期不会出现任何警告和错误，只有在运行时才会出错，但是泛型的出现就是为了消灭 <code>ClassCastException</code>，所以如果 Java 支持泛型数组初始化操作就是搬起石头砸自己的脚。</p><p>而对于下面的代码来说是成立的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;?&gt;[] lsa = new List&lt;?&gt;[10]; // OK, array of unbounded wildcard type.</span></span>
<span class="line"><span>Object o = lsa;</span></span>
<span class="line"><span>Object[] oa = (Object[]) o;</span></span>
<span class="line"><span>List&lt;Integer&gt; li = new ArrayList&lt;Integer&gt;();</span></span>
<span class="line"><span>li.add(new Integer(3));</span></span>
<span class="line"><span>oa[1] = li; // Correct.</span></span>
<span class="line"><span>Integer i = (Integer) lsa[1].get(0); // OK</span></span></code></pre></div><p>所以说采用通配符的方式初始化泛型数组是允许的，因为对于通配符的方式最后取出数据是要做显式类型转换的，符合预期逻辑。综述就是说Java 的泛型数组初始化时数组类型不能是具体的泛型类型，只能是通配符的形式，因为具体类型会导致可存入任意类型对象，在取出时会发生类型转换异常，会与泛型的设计思想冲突，而通配符形式本来就需要自己强转，符合预期。</p><p>Oracle 官方文档：<a href="https://docs.oracle.com/javase/tutorial/extra/generics/fineprint.html" target="_blank" rel="noreferrer">https://docs.oracle.com/javase/tutorial/extra/generics/fineprint.html在新窗口打开</a></p><p>更进一步的，我们看看如下的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&lt;String&gt;[] list11 = new ArrayList&lt;String&gt;[10]; //编译错误，非法创建 </span></span>
<span class="line"><span>List&lt;String&gt;[] list12 = new ArrayList&lt;?&gt;[10]; //编译错误，需要强转类型 </span></span>
<span class="line"><span>List&lt;String&gt;[] list13 = (List&lt;String&gt;[]) new ArrayList&lt;?&gt;[10]; //OK，但是会有警告 </span></span>
<span class="line"><span>List&lt;?&gt;[] list14 = new ArrayList&lt;String&gt;[10]; //编译错误，非法创建 </span></span>
<span class="line"><span>List&lt;?&gt;[] list15 = new ArrayList&lt;?&gt;[10]; //OK </span></span>
<span class="line"><span>List&lt;String&gt;[] list6 = new ArrayList[10]; //OK，但是会有警告</span></span></code></pre></div><p>因为在 Java 中是不能创建一个确切的泛型类型的数组的，除非是采用通配符的方式且要做显式类型转换才可以。</p><h3 id="泛型数组-如何正确的初始化泛型数组实例" tabindex="-1">泛型数组：如何正确的初始化泛型数组实例？ <a class="header-anchor" href="#泛型数组-如何正确的初始化泛型数组实例" aria-label="Permalink to &quot;泛型数组：如何正确的初始化泛型数组实例？&quot;">​</a></h3><blockquote><p>这个无论我们通过<code>new ArrayList[10]</code> 的形式还是通过泛型通配符的形式初始化泛型数组实例都是存在警告的，也就是说仅仅语法合格，运行时潜在的风险需要我们自己来承担，因此那些方式初始化泛型数组都不是最优雅的方式。</p></blockquote><p>我们在使用到泛型数组的场景下应该尽量使用列表集合替换，此外也可以通过使用 <code>java.lang.reflect.Array.newInstance(Class&lt;T&gt; componentType, int length)</code> 方法来创建一个具有指定类型和维度的数组，如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ArrayWithTypeToken&lt;T&gt; {</span></span>
<span class="line"><span>    private T[] array;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ArrayWithTypeToken(Class&lt;T&gt; type, int size) {</span></span>
<span class="line"><span>        array = (T[]) Array.newInstance(type, size);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void put(int index, T item) {</span></span>
<span class="line"><span>        array[index] = item;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public T get(int index) {</span></span>
<span class="line"><span>        return array[index];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public T[] create() {</span></span>
<span class="line"><span>        return array;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ArrayWithTypeToken&lt;Integer&gt; arrayToken = new ArrayWithTypeToken&lt;Integer&gt;(Integer.class, 100);</span></span>
<span class="line"><span>Integer[] array = arrayToken.create();</span></span></code></pre></div><p>所以使用反射来初始化泛型数组算是优雅实现，因为泛型类型 <code>T</code>在运行时才能被确定下来，我们能创建泛型数组也必然是在 Java 运行时想办法，而运行时能起作用的技术最好的就是反射了。</p><h3 id="如何理解泛型类中的静态方法和静态变量" tabindex="-1">如何理解泛型类中的静态方法和静态变量？ <a class="header-anchor" href="#如何理解泛型类中的静态方法和静态变量" aria-label="Permalink to &quot;如何理解泛型类中的静态方法和静态变量？&quot;">​</a></h3><blockquote><p>泛型类中的静态方法和静态变量不可以使用泛型类所声明的泛型类型参数</p></blockquote><p>举例说明：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test2&lt;T&gt; {    </span></span>
<span class="line"><span>    public static T one;   //编译错误    </span></span>
<span class="line"><span>    public static  T show(T one){ //编译错误    </span></span>
<span class="line"><span>        return null;    </span></span>
<span class="line"><span>    }    </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为泛型类中的泛型参数的实例化是在定义对象的时候指定的，而静态变量和静态方法不需要使用对象来调用。对象都没有创建，如何确定这个泛型参数是何种类型，所以当然是错误的。</p><p>但是要注意区分下面的一种情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test2&lt;T&gt; {    </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static &lt;T &gt;T show(T one){ //这是正确的    </span></span>
<span class="line"><span>        return null;    </span></span>
<span class="line"><span>    }    </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为这是一个泛型方法，在泛型方法中使用的T是自己在方法中定义的 T，而不是泛型类中的T。</p><h3 id="如何理解异常中使用泛型" tabindex="-1">如何理解异常中使用泛型？ <a class="header-anchor" href="#如何理解异常中使用泛型" aria-label="Permalink to &quot;如何理解异常中使用泛型？&quot;">​</a></h3><ul><li><strong>不能抛出也不能捕获泛型类的对象</strong>。事实上，泛型类扩展Throwable都不合法。例如：下面的定义将不会通过编译：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Problem&lt;T&gt; extends Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为什么不能扩展Throwable，因为异常都是在运行时捕获和抛出的，而在编译的时候，泛型信息全都会被擦除掉，那么，假设上面的编译可行，那么，在看下面的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} catch(Problem&lt;Integer&gt; e1) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} catch(Problem&lt;Number&gt; e2) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>类型信息被擦除后，那么两个地方的catch都变为原始类型Object，那么也就是说，这两个地方的catch变的一模一样,就相当于下面的这样</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>try{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} catch(Problem&lt;Object&gt; e1) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} catch(Problem&lt;Object&gt; e2) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个当然就是不行的。</p><ul><li><strong>不能再catch子句中使用泛型变量</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &lt;T extends Throwable&gt; void doWork(Class&lt;T&gt; t) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    } catch(T e) { //编译错误</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为泛型信息在编译的时候已经变为原始类型，也就是说上面的T会变为原始类型Throwable，那么如果可以再catch子句中使用泛型变量，那么，下面的定义呢：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &lt;T extends Throwable&gt; void doWork(Class&lt;T&gt; t){</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } catch(T e) { //编译错误</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } catch(IndexOutOfBounds e) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }                         </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据异常捕获的原则，一定是子类在前面，父类在后面，那么上面就违背了这个原则。即使你在使用该静态方法的使用T是<code>ArrayIndexOutofBounds</code>，在编译之后还是会变成Throwable，<code>ArrayIndexOutofBounds</code>是IndexOutofBounds的子类，违背了异常捕获的原则。所以java为了避免这样的情况，禁止在catch子句中使用泛型变量。</p><ul><li>但是在异常声明中可以使用类型变量。下面方法是合法的。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static&lt;T extends Throwable&gt; void doWork(T t) throws T {</span></span>
<span class="line"><span>    try{</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    } catch(Throwable realCause) {</span></span>
<span class="line"><span>        t.initCause(realCause);</span></span>
<span class="line"><span>        throw t; </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的这样使用是没问题的。</p><h3 id="如何获取泛型的参数类型" tabindex="-1">如何获取泛型的参数类型？ <a class="header-anchor" href="#如何获取泛型的参数类型" aria-label="Permalink to &quot;如何获取泛型的参数类型？&quot;">​</a></h3><blockquote><p>既然类型被擦除了，那么如何获取泛型的参数类型呢？可以通过反射（<code>java.lang.reflect.Type</code>）获取泛型</p></blockquote><p><code>java.lang.reflect.Type</code>是Java中所有类型的公共高级接口, 代表了Java中的所有类型. Type体系中类型的包括：数组类型(GenericArrayType)、参数化类型(ParameterizedType)、类型变量(TypeVariable)、通配符类型(WildcardType)、原始类型(Class)、基本类型(Class), 以上这些类型都实现Type接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class GenericType&lt;T&gt; {</span></span>
<span class="line"><span>    private T data;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public T getData() {</span></span>
<span class="line"><span>        return data;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setData(T data) {</span></span>
<span class="line"><span>        this.data = data;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        GenericType&lt;String&gt; genericType = new GenericType&lt;String&gt;() {};</span></span>
<span class="line"><span>        Type superclass = genericType.getClass().getGenericSuperclass();</span></span>
<span class="line"><span>        //getActualTypeArguments 返回确切的泛型参数, 如Map&lt;String, Integer&gt;返回[String, Integer]</span></span>
<span class="line"><span>        Type type = ((ParameterizedType) superclass).getActualTypeArguments()[0]; </span></span>
<span class="line"><span>        System.out.println(type);//class java.lang.String</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中 <code>ParameterizedType</code>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ParameterizedType extends Type {</span></span>
<span class="line"><span>    // 返回确切的泛型参数, 如Map&lt;String, Integer&gt;返回[String, Integer]</span></span>
<span class="line"><span>    Type[] getActualTypeArguments();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //返回当前class或interface声明的类型, 如List&lt;?&gt;返回List</span></span>
<span class="line"><span>    Type getRawType();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //返回所属类型. 如,当前类型为O&lt;T&gt;.I&lt;S&gt;, 则返回O&lt;T&gt;. 顶级类型将返回null </span></span>
<span class="line"><span>    Type getOwnerType();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><blockquote><p>泛型作为Java基础知识点之一，网上知识点比较多也比较散，本文主要综合了网络上比较好的文章，方便你快速学习。（以下是一部分我参考的链接）</p></blockquote><ul><li><a href="https://blog.csdn.net/sunxianghuang/article/details/51982979" target="_blank" rel="noreferrer">https://blog.csdn.net/sunxianghuang/article/details/51982979</a></li><li><a href="https://blog.csdn.net/LonelyRoamer/article/details/7868820" target="_blank" rel="noreferrer">https://blog.csdn.net/LonelyRoamer/article/details/7868820</a></li><li><a href="https://docs.oracle.com/javase/tutorial/extra/generics/index.html" target="_blank" rel="noreferrer">https://docs.oracle.com/javase/tutorial/extra/generics/index.html</a></li><li><a href="https://blog.csdn.net/s10461/article/details/53941091" target="_blank" rel="noreferrer">https://blog.csdn.net/s10461/article/details/53941091</a></li><li><a href="https://www.cnblogs.com/iyangyuan/archive/2013/04/09/3011274.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/iyangyuan/archive/2013/04/09/3011274.html</a></li><li><a href="https://www.cnblogs.com/rudy-laura/articles/3391013.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/rudy-laura/articles/3391013.html</a></li><li><a href="https://www.jianshu.com/p/986f732ed2f1" target="_blank" rel="noreferrer">https://www.jianshu.com/p/986f732ed2f1</a></li><li><a href="https://blog.csdn.net/u011240877/article/details/53545041" target="_blank" rel="noreferrer">https://blog.csdn.net/u011240877/article/details/53545041</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,240)]))}const T=p(r,[["render",d]]);export{k as __pageData,T as default};
