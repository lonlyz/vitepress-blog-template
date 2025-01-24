import{_ as a,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const k=JSON.parse('{"title":"Java 创建对象的四种方法","description":"","frontmatter":{},"headers":[],"relativePath":"develop/usage/dev-usage-newObj.md","filePath":"develop/usage/dev-usage-newObj.md","lastUpdated":1737706346000}'),l={name:"develop/usage/dev-usage-newObj.md"};function c(t,n,i,r,o,u){return e(),s("div",null,n[0]||(n[0]=[p(`<h1 id="java-创建对象的四种方法" tabindex="-1">Java 创建对象的四种方法 <a class="header-anchor" href="#java-创建对象的四种方法" aria-label="Permalink to &quot;Java 创建对象的四种方法&quot;">​</a></h1><blockquote><p>Java 创建对象的四种方法 @pdai</p></blockquote><h2 id="使用new-方式创建对象" tabindex="-1">使用new 方式创建对象 <a class="header-anchor" href="#使用new-方式创建对象" aria-label="Permalink to &quot;使用new 方式创建对象&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public static Worker createWorker() {  </span></span>
<span class="line"><span>     return new Worker();  </span></span>
<span class="line"><span> }  </span></span>
<span class="line"><span></span></span>
<span class="line"><span> public static Worker createWorker(String name, int age) {  </span></span>
<span class="line"><span>     return new Worker(name, age);  </span></span>
<span class="line"><span> }</span></span></code></pre></div><h2 id="使用反射机制" tabindex="-1">使用反射机制 <a class="header-anchor" href="#使用反射机制" aria-label="Permalink to &quot;使用反射机制&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * 使用反射机制，不带参数 Class 对象的 newInstance() 方法</span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public static Worker createWorker1() {  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        Class clazz = null;  </span></span>
<span class="line"><span>        Worker worker = null;  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            clazz = Class.forName(&quot;com.lou.creation.Worker&quot;);  </span></span>
<span class="line"><span>            worker = (Worker) clazz.newInstance();  </span></span>
<span class="line"><span>        } catch (ClassNotFoundException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (InstantiationException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (IllegalAccessException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        return worker;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     *  使用反射机制 ， Constructor的 newInstance方法</span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public static Worker createWorker2() {  </span></span>
<span class="line"><span>        Worker worker = null;  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            Class clazz = null;  </span></span>
<span class="line"><span>            clazz = Class.forName(&quot;com.lou.creation.Worker&quot;);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>            // 获取不带参数的构造器  </span></span>
<span class="line"><span>            Constructor constructor = clazz.getConstructor();  </span></span>
<span class="line"><span>            // 使用构造器创建对象  </span></span>
<span class="line"><span>            worker = (Worker) constructor.newInstance();  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        } catch (ClassNotFoundException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (InstantiationException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (IllegalAccessException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (SecurityException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (NoSuchMethodException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (IllegalArgumentException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (InvocationTargetException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        return worker;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 使用反射机制 : 带参数的构造函数创建新对象</span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    public static Worker createWorker3(String name, Integer age) {  </span></span>
<span class="line"><span>        Worker worker = null;  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            Class clazz = null;  </span></span>
<span class="line"><span>            clazz = Class.forName(&quot;com.lou.creation.Worker&quot;);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>            // 获取不带参数的构造器  </span></span>
<span class="line"><span>            Constructor constructor = clazz.getConstructor(name.getClass(),  </span></span>
<span class="line"><span>                    age.getClass());  </span></span>
<span class="line"><span>            // 使用构造器创建对象  </span></span>
<span class="line"><span>            worker = (Worker) constructor.newInstance(name, age);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        } catch (ClassNotFoundException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (InstantiationException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (IllegalAccessException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (SecurityException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (NoSuchMethodException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (IllegalArgumentException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (InvocationTargetException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        return worker;  </span></span>
<span class="line"><span>    }</span></span></code></pre></div><h2 id="序列化和反序列化创建对象" tabindex="-1">序列化和反序列化创建对象 <a class="header-anchor" href="#序列化和反序列化创建对象" aria-label="Permalink to &quot;序列化和反序列化创建对象&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /*</span></span>
<span class="line"><span>     * 使用序列化和反序列化创建对象，这种方式其实是根据既有的对象进行复制，这个需要事先将可序列化的对象线存到文件里</span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    @SuppressWarnings(&quot;resource&quot;)  </span></span>
<span class="line"><span>    public static Worker createWorker4(String objectPath) {  </span></span>
<span class="line"><span>        ObjectInput input = null;  </span></span>
<span class="line"><span>        Worker worker = null;  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            input = new ObjectInputStream(new FileInputStream(objectPath));  </span></span>
<span class="line"><span>            worker = (Worker) input.readObject();  </span></span>
<span class="line"><span>        } catch (FileNotFoundException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (IOException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (ClassNotFoundException e) {  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        return worker;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 将创建的对象存入到文件内</span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    public static void storeObject2File(String objectPath) {  </span></span>
<span class="line"><span>        Worker worker = new Worker();  </span></span>
<span class="line"><span>        ObjectOutputStream objectOutputStream;  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            objectOutputStream = new ObjectOutputStream(new FileOutputStream(  </span></span>
<span class="line"><span>                    objectPath));  </span></span>
<span class="line"><span>            objectOutputStream.writeObject(worker);  </span></span>
<span class="line"><span>        } catch (FileNotFoundException e) {  </span></span>
<span class="line"><span>            // TODO Auto-generated catch block  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        } catch (IOException e) {  </span></span>
<span class="line"><span>            // TODO Auto-generated catch block  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }</span></span></code></pre></div><h2 id="深拷贝" tabindex="-1">深拷贝 <a class="header-anchor" href="#深拷贝" aria-label="Permalink to &quot;深拷贝&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span>     * 使用对象的 深拷贝进行复制，创建对象</span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    public static Worker createWorker5(Worker worker) {  </span></span>
<span class="line"><span>        return (Worker) worker.clone();  </span></span>
<span class="line"><span>    }</span></span></code></pre></div><ul><li>worker</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.io.Serializable;  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public class Worker implements Cloneable,Serializable {  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;  </span></span>
<span class="line"><span>    private String name;  </span></span>
<span class="line"><span>    private int age;  </span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>    public Worker()  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        this.name = &quot;&quot;;  </span></span>
<span class="line"><span>        this.age = 0;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>    public Worker(String name,int age)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        this.name = name;  </span></span>
<span class="line"><span>        this.age = age;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>    public void work()  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        System.out.println(name +&quot;is working&quot;);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>    public Worker clone()  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        Worker worker = null;  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            return (Worker) super.clone();  </span></span>
<span class="line"><span>        } catch (CloneNotSupportedException e) {  </span></span>
<span class="line"><span>            // TODO Auto-generated catch block  </span></span>
<span class="line"><span>            e.printStackTrace();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        return worker;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><p><a href="http://blog.csdn.net/luanlouis/article/details/18228199" target="_blank" rel="noreferrer">http://blog.csdn.net/luanlouis/article/details/18228199</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,15)]))}const d=a(l,[["render",c]]);export{k as __pageData,d as default};
