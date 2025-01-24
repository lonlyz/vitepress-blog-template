import{_ as n}from"./chunks/alg-tree-binary-search-1.CP7AUo9_.js";import{_ as a,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/alg/alg-tree-binary-search-0.png",t="/vitepress-blog-template/images/alg/alg-tree-11.png",c="/vitepress-blog-template/images/alg/alg-tree-8.png",r="/vitepress-blog-template/images/alg/alg-tree-10.png",o="/vitepress-blog-template/images/alg/alg-tree-bst-test-1.jpg",d="/vitepress-blog-template/images/alg/alg-tree-bst-test-2.jpg",u="/vitepress-blog-template/images/alg/alg-tree-bst-test-3.jpg",x=JSON.parse('{"title":"树 - 二叉搜索树(BST)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-tree-search.md","filePath":"algorithm/alg-basic-tree-search.md","lastUpdated":1737706346000}'),h={name:"algorithm/alg-basic-tree-search.md"};function g(m,s,b,v,T,y){return l(),p("div",null,s[0]||(s[0]=[e('<h1 id="树-二叉搜索树-bst" tabindex="-1">树 - 二叉搜索树(BST) <a class="header-anchor" href="#树-二叉搜索树-bst" aria-label="Permalink to &quot;树 - 二叉搜索树(BST)&quot;">​</a></h1><blockquote><p>本文主要介绍 二叉树中最基本的二叉查找树（Binary Search Tree），（又：二叉搜索树，二叉排序树）它或者是一棵空树，或者是具有下列性质的二叉树： 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值； 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值； 它的左、右子树也分别为二叉排序树。@pdai</p></blockquote><h2 id="bst的定义" tabindex="-1">BST的定义 <a class="header-anchor" href="#bst的定义" aria-label="Permalink to &quot;BST的定义&quot;">​</a></h2><p>在二叉查找树中:</p><ul><li>若任意节点的左子树不空，则左子树上所有结点的值均小于它的根结点的值；</li><li>任意节点的右子树不空，则右子树上所有结点的值均大于它的根结点的值；</li><li>任意节点的左、右子树也分别为二叉查找树。</li><li>没有键值相等的节点。</li></ul><p><img src="'+n+'" alt="error.图片加载失败"></p><p>动画效果请参考 <a href="https://www.cs.usfca.edu/~galles/visualization/BST.html" target="_blank" rel="noreferrer">BST在新窗口打开</a></p><p><img src="'+i+`" alt="error.图片加载失败"></p><h2 id="bst的实现" tabindex="-1">BST的实现 <a class="header-anchor" href="#bst的实现" aria-label="Permalink to &quot;BST的实现&quot;">​</a></h2><h3 id="节点" tabindex="-1">节点 <a class="header-anchor" href="#节点" aria-label="Permalink to &quot;节点&quot;">​</a></h3><p>BSTree是二叉树，它保存了二叉树的根节点mRoot；mRoot是BSTNode类型，而BSTNode是二叉查找树的节点，它是BSTree的内部类。BSTNode包含二叉查找树的几个基本信息:</p><ul><li>key -- 它是关键字，是用来对二叉查找树的节点进行排序的。</li><li>left -- 它指向当前节点的左孩子。</li><li>right -- 它指向当前节点的右孩子。</li><li>parent -- 它指向当前节点的父结点。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BSTree&lt;T extends Comparable&lt;T&gt;&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private BSTNode&lt;T&gt; mRoot;    // 根结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public class BSTNode&lt;T extends Comparable&lt;T&gt;&gt; {</span></span>
<span class="line"><span>        T key;                // 关键字(键值)</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; left;      // 左孩子</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; right;     // 右孩子</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; parent;    // 父结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public BSTNode(T key, BSTNode&lt;T&gt; parent, BSTNode&lt;T&gt; left, BSTNode&lt;T&gt; right) {</span></span>
<span class="line"><span>            this.key = key;</span></span>
<span class="line"><span>            this.parent = parent;</span></span>
<span class="line"><span>            this.left = left;</span></span>
<span class="line"><span>            this.right = right;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="遍历" tabindex="-1">遍历 <a class="header-anchor" href="#遍历" aria-label="Permalink to &quot;遍历&quot;">​</a></h3><p>这里讲解前序遍历、中序遍历、后序遍历3种方式。</p><h4 id="前序遍历" tabindex="-1">前序遍历 <a class="header-anchor" href="#前序遍历" aria-label="Permalink to &quot;前序遍历&quot;">​</a></h4><p>若二叉树非空，则执行以下操作:</p><ul><li>访问根结点；</li><li>先序遍历左子树；</li><li>先序遍历右子树。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void preOrder(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>    if(tree != null) {</span></span>
<span class="line"><span>        System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>        preOrder(tree.left);</span></span>
<span class="line"><span>        preOrder(tree.right);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void preOrder() {</span></span>
<span class="line"><span>    preOrder(mRoot);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="中序遍历" tabindex="-1">中序遍历 <a class="header-anchor" href="#中序遍历" aria-label="Permalink to &quot;中序遍历&quot;">​</a></h4><p>若二叉树非空，则执行以下操作:</p><ul><li>中序遍历左子树；</li><li>访问根结点；</li><li>中序遍历右子树。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void inOrder(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>    if(tree != null) {</span></span>
<span class="line"><span>        inOrder(tree.left);</span></span>
<span class="line"><span>        System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>        inOrder(tree.right);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void inOrder() {</span></span>
<span class="line"><span>    inOrder(mRoot);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="后序遍历" tabindex="-1">后序遍历 <a class="header-anchor" href="#后序遍历" aria-label="Permalink to &quot;后序遍历&quot;">​</a></h4><p>若二叉树非空，则执行以下操作:</p><ul><li>后序遍历左子树；</li><li>后序遍历右子树；</li><li>访问根结点。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void postOrder(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>    if(tree != null)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        postOrder(tree.left);</span></span>
<span class="line"><span>        postOrder(tree.right);</span></span>
<span class="line"><span>        System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void postOrder() {</span></span>
<span class="line"><span>    postOrder(mRoot);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看看下面这颗树的各种遍历方式:</p><p><img src="`+n+`" alt="error.图片加载失败"></p><p>对于上面的二叉树而言，</p><ul><li>前序遍历结果: 8 3 1 6 4 7 10 14 13</li><li>中序遍历结果: 1 3 4 6 7 8 10 13 14</li><li>后序遍历结果: 1 4 7 6 3 13 14 10 8</li></ul><h3 id="查找" tabindex="-1">查找 <a class="header-anchor" href="#查找" aria-label="Permalink to &quot;查找&quot;">​</a></h3><ul><li>递归版本的代码</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * (递归实现)查找&quot;二叉树x&quot;中键值为key的节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private BSTNode&lt;T&gt; search(BSTNode&lt;T&gt; x, T key) {</span></span>
<span class="line"><span>    if (x==null)</span></span>
<span class="line"><span>        return x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int cmp = key.compareTo(x.key);</span></span>
<span class="line"><span>    if (cmp &lt; 0)</span></span>
<span class="line"><span>        return search(x.left, key);</span></span>
<span class="line"><span>    else if (cmp &gt; 0)</span></span>
<span class="line"><span>        return search(x.right, key);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        return x;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public BSTNode&lt;T&gt; search(T key) {</span></span>
<span class="line"><span>    return search(mRoot, key);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>非递归版本的代码</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * (非递归实现)查找&quot;二叉树x&quot;中键值为key的节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private BSTNode&lt;T&gt; iterativeSearch(BSTNode&lt;T&gt; x, T key) {</span></span>
<span class="line"><span>    while (x!=null) {</span></span>
<span class="line"><span>        int cmp = key.compareTo(x.key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (cmp &lt; 0) </span></span>
<span class="line"><span>            x = x.left;</span></span>
<span class="line"><span>        else if (cmp &gt; 0) </span></span>
<span class="line"><span>            x = x.right;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return x;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public BSTNode&lt;T&gt; iterativeSearch(T key) {</span></span>
<span class="line"><span>    return iterativeSearch(mRoot, key);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="最大值和最小值" tabindex="-1">最大值和最小值 <a class="header-anchor" href="#最大值和最小值" aria-label="Permalink to &quot;最大值和最小值&quot;">​</a></h3><p><img src="`+t+`" alt="error.图片加载失败"></p><ul><li>查找最大结点</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 查找最大结点: 返回tree为根结点的二叉树的最大结点。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private BSTNode&lt;T&gt; maximum(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>    if (tree == null)</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while(tree.right != null)</span></span>
<span class="line"><span>        tree = tree.right;</span></span>
<span class="line"><span>    return tree;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public T maximum() {</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; p = maximum(mRoot);</span></span>
<span class="line"><span>    if (p != null)</span></span>
<span class="line"><span>        return p.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>查找最小结点</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 查找最小结点: 返回tree为根结点的二叉树的最小结点。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private BSTNode&lt;T&gt; minimum(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>    if (tree == null)</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while(tree.left != null)</span></span>
<span class="line"><span>        tree = tree.left;</span></span>
<span class="line"><span>    return tree;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public T minimum() {</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; p = minimum(mRoot);</span></span>
<span class="line"><span>    if (p != null)</span></span>
<span class="line"><span>        return p.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="前驱和后继" tabindex="-1">前驱和后继 <a class="header-anchor" href="#前驱和后继" aria-label="Permalink to &quot;前驱和后继&quot;">​</a></h3><p>节点的前驱: 是该节点的左子树中的最大节点。 节点的后继: 是该节点的右子树中的最小节点。</p><ul><li>查找前驱节点</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 找结点(x)的前驱结点。即，查找&quot;二叉树中数据值小于该结点&quot;的&quot;最大结点&quot;。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public BSTNode&lt;T&gt; predecessor(BSTNode&lt;T&gt; x) {</span></span>
<span class="line"><span>    // 如果x存在左孩子，则&quot;x的前驱结点&quot;为 &quot;以其左孩子为根的子树的最大结点&quot;。</span></span>
<span class="line"><span>    if (x.left != null)</span></span>
<span class="line"><span>        return maximum(x.left);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 如果x没有左孩子。则x有以下两种可能: </span></span>
<span class="line"><span>    // (01) x是&quot;一个右孩子&quot;，则&quot;x的前驱结点&quot;为 &quot;它的父结点&quot;。</span></span>
<span class="line"><span>    // (01) x是&quot;一个左孩子&quot;，则查找&quot;x的最低的父结点，并且该父结点要具有右孩子&quot;，找到的这个&quot;最低的父结点&quot;就是&quot;x的前驱结点&quot;。</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; y = x.parent;</span></span>
<span class="line"><span>    while ((y!=null) &amp;&amp; (x==y.left)) {</span></span>
<span class="line"><span>        x = y;</span></span>
<span class="line"><span>        y = y.parent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return y;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>查找后继节点</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 找结点(x)的后继结点。即，查找&quot;二叉树中数据值大于该结点&quot;的&quot;最小结点&quot;。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public BSTNode&lt;T&gt; successor(BSTNode&lt;T&gt; x) {</span></span>
<span class="line"><span>    // 如果x存在右孩子，则&quot;x的后继结点&quot;为 &quot;以其右孩子为根的子树的最小结点&quot;。</span></span>
<span class="line"><span>    if (x.right != null)</span></span>
<span class="line"><span>        return minimum(x.right);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 如果x没有右孩子。则x有以下两种可能: </span></span>
<span class="line"><span>    // (01) x是&quot;一个左孩子&quot;，则&quot;x的后继结点&quot;为 &quot;它的父结点&quot;。</span></span>
<span class="line"><span>    // (02) x是&quot;一个右孩子&quot;，则查找&quot;x的最低的父结点，并且该父结点要具有左孩子&quot;，找到的这个&quot;最低的父结点&quot;就是&quot;x的后继结点&quot;。</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; y = x.parent;</span></span>
<span class="line"><span>    while ((y!=null) &amp;&amp; (x==y.right)) {</span></span>
<span class="line"><span>        x = y;</span></span>
<span class="line"><span>        y = y.parent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return y;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="插入" tabindex="-1">插入 <a class="header-anchor" href="#插入" aria-label="Permalink to &quot;插入&quot;">​</a></h3><p><img src="`+c+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 将结点插入到二叉树中</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 参数说明: </span></span>
<span class="line"><span> *     tree 二叉树的</span></span>
<span class="line"><span> *     z 插入的结点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void insert(BSTree&lt;T&gt; bst, BSTNode&lt;T&gt; z) {</span></span>
<span class="line"><span>    int cmp;</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; y = null;</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; x = bst.mRoot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 查找z的插入位置</span></span>
<span class="line"><span>    while (x != null) {</span></span>
<span class="line"><span>        y = x;</span></span>
<span class="line"><span>        cmp = z.key.compareTo(x.key);</span></span>
<span class="line"><span>        if (cmp &lt; 0)</span></span>
<span class="line"><span>            x = x.left;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            x = x.right;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    z.parent = y;</span></span>
<span class="line"><span>    if (y==null)</span></span>
<span class="line"><span>        bst.mRoot = z;</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        cmp = z.key.compareTo(y.key);</span></span>
<span class="line"><span>        if (cmp &lt; 0)</span></span>
<span class="line"><span>            y.left = z;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            y.right = z;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* </span></span>
<span class="line"><span> * 新建结点(key)，并将其插入到二叉树中</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 参数说明: </span></span>
<span class="line"><span> *     tree 二叉树的根结点</span></span>
<span class="line"><span> *     key 插入结点的键值</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public void insert(T key) {</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; z=new BSTNode&lt;T&gt;(key,null,null,null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 如果新建结点失败，则返回。</span></span>
<span class="line"><span>    if (z != null)</span></span>
<span class="line"><span>        insert(this, z);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="删除" tabindex="-1">删除 <a class="header-anchor" href="#删除" aria-label="Permalink to &quot;删除&quot;">​</a></h3><p><img src="`+r+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 删除结点(z)，并返回被删除的结点</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 参数说明: </span></span>
<span class="line"><span> *     bst 二叉树</span></span>
<span class="line"><span> *     z 删除的结点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private BSTNode&lt;T&gt; remove(BSTree&lt;T&gt; bst, BSTNode&lt;T&gt; z) {</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; x=null;</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; y=null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((z.left == null) || (z.right == null) )</span></span>
<span class="line"><span>        y = z;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        y = successor(z);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (y.left != null)</span></span>
<span class="line"><span>        x = y.left;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        x = y.right;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (x != null)</span></span>
<span class="line"><span>        x.parent = y.parent;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (y.parent == null)</span></span>
<span class="line"><span>        bst.mRoot = x;</span></span>
<span class="line"><span>    else if (y == y.parent.left)</span></span>
<span class="line"><span>        y.parent.left = x;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        y.parent.right = x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (y != z) </span></span>
<span class="line"><span>        z.key = y.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return y;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* </span></span>
<span class="line"><span> * 删除结点(z)，并返回被删除的结点</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 参数说明: </span></span>
<span class="line"><span> *     tree 二叉树的根结点</span></span>
<span class="line"><span> *     z 删除的结点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public void remove(T key) {</span></span>
<span class="line"><span>    BSTNode&lt;T&gt; z, node; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((z = search(mRoot, key)) != null)</span></span>
<span class="line"><span>        if ( (node = remove(this, z)) != null)</span></span>
<span class="line"><span>            node = null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="打印" tabindex="-1">打印 <a class="header-anchor" href="#打印" aria-label="Permalink to &quot;打印&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * 打印&quot;二叉查找树&quot;</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * key        -- 节点的键值 </span></span>
<span class="line"><span> * direction  --  0，表示该节点是根节点;</span></span>
<span class="line"><span> *               -1，表示该节点是它的父结点的左孩子;</span></span>
<span class="line"><span> *                1，表示该节点是它的父结点的右孩子。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void print(BSTNode&lt;T&gt; tree, T key, int direction) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(tree != null) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(direction==0)    // tree是根节点</span></span>
<span class="line"><span>            System.out.printf(&quot;%2d is root\\n&quot;, tree.key);</span></span>
<span class="line"><span>        else                // tree是分支节点</span></span>
<span class="line"><span>            System.out.printf(&quot;%2d is %2d&#39;s %6s child\\n&quot;, tree.key, key, direction==1?&quot;right&quot; : &quot;left&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        print(tree.left, tree.key, -1);</span></span>
<span class="line"><span>        print(tree.right,tree.key,  1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void print() {</span></span>
<span class="line"><span>    if (mRoot != null)</span></span>
<span class="line"><span>        print(mRoot, mRoot.key, 0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="销毁" tabindex="-1">销毁 <a class="header-anchor" href="#销毁" aria-label="Permalink to &quot;销毁&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * 销毁二叉树</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void destroy(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>    if (tree==null)</span></span>
<span class="line"><span>        return ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (tree.left != null)</span></span>
<span class="line"><span>        destroy(tree.left);</span></span>
<span class="line"><span>    if (tree.right != null)</span></span>
<span class="line"><span>        destroy(tree.right);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tree=null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void clear() {</span></span>
<span class="line"><span>    destroy(mRoot);</span></span>
<span class="line"><span>    mRoot = null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="测试程序" tabindex="-1">测试程序 <a class="header-anchor" href="#测试程序" aria-label="Permalink to &quot;测试程序&quot;">​</a></h2><p>下面对测试程序的流程进行分析！</p><ul><li><p>新建&quot;二叉查找树&quot;root。</p></li><li><p>向二叉查找树中依次插入1,5,4,3,2,6 。如下图所示:</p></li></ul><p><img src="`+o+'" alt="error.图片加载失败"></p><ul><li>遍历和查找</li></ul><p>插入1,5,4,3,2,6之后，得到的二叉查找树如下:</p><p><img src="'+d+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>前序遍历结果: 1 5 4 3 2 6 </span></span>
<span class="line"><span>中序遍历结果: 1 2 3 4 5 6 </span></span>
<span class="line"><span>后序遍历结果: 2 3 4 6 5 1 </span></span>
<span class="line"><span>最小值是1，而最大值是6。</span></span></code></pre></div><ul><li>删除节点4。如下图所示:</li></ul><p><img src="`+u+`" alt="error.图片加载失败"></p><ul><li>重新遍历该二叉查找树。</li></ul><p>中序遍历结果: 1 2 4 5 6</p><h2 id="代码和测试代码" tabindex="-1">代码和测试代码 <a class="header-anchor" href="#代码和测试代码" aria-label="Permalink to &quot;代码和测试代码&quot;">​</a></h2><h3 id="代码实现" tabindex="-1">代码实现 <a class="header-anchor" href="#代码实现" aria-label="Permalink to &quot;代码实现&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Java 语言: 二叉查找树</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2013/11/07</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class BSTree&lt;T extends Comparable&lt;T&gt;&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private BSTNode&lt;T&gt; mRoot;    // 根结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public class BSTNode&lt;T extends Comparable&lt;T&gt;&gt; {</span></span>
<span class="line"><span>        T key;                // 关键字(键值)</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; left;    // 左孩子</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; right;    // 右孩子</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; parent;    // 父结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public BSTNode(T key, BSTNode&lt;T&gt; parent, BSTNode&lt;T&gt; left, BSTNode&lt;T&gt; right) {</span></span>
<span class="line"><span>            this.key = key;</span></span>
<span class="line"><span>            this.parent = parent;</span></span>
<span class="line"><span>            this.left = left;</span></span>
<span class="line"><span>            this.right = right;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public T getKey() {</span></span>
<span class="line"><span>            return key;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public String toString() {</span></span>
<span class="line"><span>            return &quot;key:&quot;+key;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public BSTree() {</span></span>
<span class="line"><span>        mRoot=null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 前序遍历&quot;二叉树&quot;</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void preOrder(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if(tree != null) {</span></span>
<span class="line"><span>            System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>            preOrder(tree.left);</span></span>
<span class="line"><span>            preOrder(tree.right);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void preOrder() {</span></span>
<span class="line"><span>        preOrder(mRoot);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 中序遍历&quot;二叉树&quot;</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void inOrder(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if(tree != null) {</span></span>
<span class="line"><span>            inOrder(tree.left);</span></span>
<span class="line"><span>            System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>            inOrder(tree.right);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void inOrder() {</span></span>
<span class="line"><span>        inOrder(mRoot);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 后序遍历&quot;二叉树&quot;</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void postOrder(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if(tree != null)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            postOrder(tree.left);</span></span>
<span class="line"><span>            postOrder(tree.right);</span></span>
<span class="line"><span>            System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void postOrder() {</span></span>
<span class="line"><span>        postOrder(mRoot);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * (递归实现)查找&quot;二叉树x&quot;中键值为key的节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private BSTNode&lt;T&gt; search(BSTNode&lt;T&gt; x, T key) {</span></span>
<span class="line"><span>        if (x==null)</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int cmp = key.compareTo(x.key);</span></span>
<span class="line"><span>        if (cmp &lt; 0)</span></span>
<span class="line"><span>            return search(x.left, key);</span></span>
<span class="line"><span>        else if (cmp &gt; 0)</span></span>
<span class="line"><span>            return search(x.right, key);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            return x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public BSTNode&lt;T&gt; search(T key) {</span></span>
<span class="line"><span>        return search(mRoot, key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * (非递归实现)查找&quot;二叉树x&quot;中键值为key的节点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private BSTNode&lt;T&gt; iterativeSearch(BSTNode&lt;T&gt; x, T key) {</span></span>
<span class="line"><span>        while (x!=null) {</span></span>
<span class="line"><span>            int cmp = key.compareTo(x.key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (cmp &lt; 0) </span></span>
<span class="line"><span>                x = x.left;</span></span>
<span class="line"><span>            else if (cmp &gt; 0) </span></span>
<span class="line"><span>                x = x.right;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                return x;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public BSTNode&lt;T&gt; iterativeSearch(T key) {</span></span>
<span class="line"><span>        return iterativeSearch(mRoot, key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 查找最小结点: 返回tree为根结点的二叉树的最小结点。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private BSTNode&lt;T&gt; minimum(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if (tree == null)</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(tree.left != null)</span></span>
<span class="line"><span>            tree = tree.left;</span></span>
<span class="line"><span>        return tree;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public T minimum() {</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; p = minimum(mRoot);</span></span>
<span class="line"><span>        if (p != null)</span></span>
<span class="line"><span>            return p.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 查找最大结点: 返回tree为根结点的二叉树的最大结点。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private BSTNode&lt;T&gt; maximum(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if (tree == null)</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while(tree.right != null)</span></span>
<span class="line"><span>            tree = tree.right;</span></span>
<span class="line"><span>        return tree;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public T maximum() {</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; p = maximum(mRoot);</span></span>
<span class="line"><span>        if (p != null)</span></span>
<span class="line"><span>            return p.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 找结点(x)的后继结点。即，查找&quot;二叉树中数据值大于该结点&quot;的&quot;最小结点&quot;。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public BSTNode&lt;T&gt; successor(BSTNode&lt;T&gt; x) {</span></span>
<span class="line"><span>        // 如果x存在右孩子，则&quot;x的后继结点&quot;为 &quot;以其右孩子为根的子树的最小结点&quot;。</span></span>
<span class="line"><span>        if (x.right != null)</span></span>
<span class="line"><span>            return minimum(x.right);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 如果x没有右孩子。则x有以下两种可能: </span></span>
<span class="line"><span>        // (01) x是&quot;一个左孩子&quot;，则&quot;x的后继结点&quot;为 &quot;它的父结点&quot;。</span></span>
<span class="line"><span>        // (02) x是&quot;一个右孩子&quot;，则查找&quot;x的最低的父结点，并且该父结点要具有左孩子&quot;，找到的这个&quot;最低的父结点&quot;就是&quot;x的后继结点&quot;。</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; y = x.parent;</span></span>
<span class="line"><span>        while ((y!=null) &amp;&amp; (x==y.right)) {</span></span>
<span class="line"><span>            x = y;</span></span>
<span class="line"><span>            y = y.parent;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return y;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 找结点(x)的前驱结点。即，查找&quot;二叉树中数据值小于该结点&quot;的&quot;最大结点&quot;。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public BSTNode&lt;T&gt; predecessor(BSTNode&lt;T&gt; x) {</span></span>
<span class="line"><span>        // 如果x存在左孩子，则&quot;x的前驱结点&quot;为 &quot;以其左孩子为根的子树的最大结点&quot;。</span></span>
<span class="line"><span>        if (x.left != null)</span></span>
<span class="line"><span>            return maximum(x.left);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 如果x没有左孩子。则x有以下两种可能: </span></span>
<span class="line"><span>        // (01) x是&quot;一个右孩子&quot;，则&quot;x的前驱结点&quot;为 &quot;它的父结点&quot;。</span></span>
<span class="line"><span>        // (01) x是&quot;一个左孩子&quot;，则查找&quot;x的最低的父结点，并且该父结点要具有右孩子&quot;，找到的这个&quot;最低的父结点&quot;就是&quot;x的前驱结点&quot;。</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; y = x.parent;</span></span>
<span class="line"><span>        while ((y!=null) &amp;&amp; (x==y.left)) {</span></span>
<span class="line"><span>            x = y;</span></span>
<span class="line"><span>            y = y.parent;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return y;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 将结点插入到二叉树中</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     tree 二叉树的</span></span>
<span class="line"><span>     *     z 插入的结点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void insert(BSTree&lt;T&gt; bst, BSTNode&lt;T&gt; z) {</span></span>
<span class="line"><span>        int cmp;</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; y = null;</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; x = bst.mRoot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 查找z的插入位置</span></span>
<span class="line"><span>        while (x != null) {</span></span>
<span class="line"><span>            y = x;</span></span>
<span class="line"><span>            cmp = z.key.compareTo(x.key);</span></span>
<span class="line"><span>            if (cmp &lt; 0)</span></span>
<span class="line"><span>                x = x.left;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                x = x.right;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        z.parent = y;</span></span>
<span class="line"><span>        if (y==null)</span></span>
<span class="line"><span>            bst.mRoot = z;</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            cmp = z.key.compareTo(y.key);</span></span>
<span class="line"><span>            if (cmp &lt; 0)</span></span>
<span class="line"><span>                y.left = z;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                y.right = z;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 新建结点(key)，并将其插入到二叉树中</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     tree 二叉树的根结点</span></span>
<span class="line"><span>     *     key 插入结点的键值</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void insert(T key) {</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; z=new BSTNode&lt;T&gt;(key,null,null,null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 如果新建结点失败，则返回。</span></span>
<span class="line"><span>        if (z != null)</span></span>
<span class="line"><span>            insert(this, z);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 删除结点(z)，并返回被删除的结点</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     bst 二叉树</span></span>
<span class="line"><span>     *     z 删除的结点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private BSTNode&lt;T&gt; remove(BSTree&lt;T&gt; bst, BSTNode&lt;T&gt; z) {</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; x=null;</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; y=null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if ((z.left == null) || (z.right == null) )</span></span>
<span class="line"><span>            y = z;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            y = successor(z);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (y.left != null)</span></span>
<span class="line"><span>            x = y.left;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            x = y.right;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (x != null)</span></span>
<span class="line"><span>            x.parent = y.parent;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (y.parent == null)</span></span>
<span class="line"><span>            bst.mRoot = x;</span></span>
<span class="line"><span>        else if (y == y.parent.left)</span></span>
<span class="line"><span>            y.parent.left = x;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            y.parent.right = x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (y != z) </span></span>
<span class="line"><span>            z.key = y.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return y;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* </span></span>
<span class="line"><span>     * 删除结点(z)，并返回被删除的结点</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * 参数说明: </span></span>
<span class="line"><span>     *     tree 二叉树的根结点</span></span>
<span class="line"><span>     *     z 删除的结点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void remove(T key) {</span></span>
<span class="line"><span>        BSTNode&lt;T&gt; z, node; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if ((z = search(mRoot, key)) != null)</span></span>
<span class="line"><span>            if ( (node = remove(this, z)) != null)</span></span>
<span class="line"><span>                node = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 销毁二叉树</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void destroy(BSTNode&lt;T&gt; tree) {</span></span>
<span class="line"><span>        if (tree==null)</span></span>
<span class="line"><span>            return ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (tree.left != null)</span></span>
<span class="line"><span>            destroy(tree.left);</span></span>
<span class="line"><span>        if (tree.right != null)</span></span>
<span class="line"><span>            destroy(tree.right);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        tree=null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void clear() {</span></span>
<span class="line"><span>        destroy(mRoot);</span></span>
<span class="line"><span>        mRoot = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 打印&quot;二叉查找树&quot;</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * key        -- 节点的键值 </span></span>
<span class="line"><span>     * direction  --  0，表示该节点是根节点;</span></span>
<span class="line"><span>     *               -1，表示该节点是它的父结点的左孩子;</span></span>
<span class="line"><span>     *                1，表示该节点是它的父结点的右孩子。</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void print(BSTNode&lt;T&gt; tree, T key, int direction) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(tree != null) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if(direction==0)    // tree是根节点</span></span>
<span class="line"><span>                System.out.printf(&quot;%2d is root\\n&quot;, tree.key);</span></span>
<span class="line"><span>            else                // tree是分支节点</span></span>
<span class="line"><span>                System.out.printf(&quot;%2d is %2d&#39;s %6s child\\n&quot;, tree.key, key, direction==1?&quot;right&quot; : &quot;left&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            print(tree.left, tree.key, -1);</span></span>
<span class="line"><span>            print(tree.right,tree.key,  1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void print() {</span></span>
<span class="line"><span>        if (mRoot != null)</span></span>
<span class="line"><span>            print(mRoot, mRoot.key, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="测试代码" tabindex="-1">测试代码 <a class="header-anchor" href="#测试代码" aria-label="Permalink to &quot;测试代码&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Java 语言: 二叉查找树</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author skywang</span></span>
<span class="line"><span> * @date 2013/11/07</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class BSTreeTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final int arr[] = {1,5,4,3,2,6};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int i, ilen;</span></span>
<span class="line"><span>        BSTree&lt;Integer&gt; tree=new BSTree&lt;Integer&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.print(&quot;== 依次添加: &quot;);</span></span>
<span class="line"><span>        ilen = arr.length;</span></span>
<span class="line"><span>        for(i=0; i&lt;ilen; i++) {</span></span>
<span class="line"><span>            System.out.print(arr[i]+&quot; &quot;);</span></span>
<span class="line"><span>            tree.insert(arr[i]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.print(&quot;\\n== 前序遍历: &quot;);</span></span>
<span class="line"><span>        tree.preOrder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.print(&quot;\\n== 中序遍历: &quot;);</span></span>
<span class="line"><span>        tree.inOrder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.print(&quot;\\n== 后序遍历: &quot;);</span></span>
<span class="line"><span>        tree.postOrder();</span></span>
<span class="line"><span>        System.out.println();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;== 最小值: &quot;+ tree.minimum());</span></span>
<span class="line"><span>        System.out.println(&quot;== 最大值: &quot;+ tree.maximum());</span></span>
<span class="line"><span>        System.out.println(&quot;== 树的详细信息: &quot;);</span></span>
<span class="line"><span>        tree.print();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.print(&quot;\\n== 删除根节点: &quot;+ arr[3]);</span></span>
<span class="line"><span>        tree.remove(arr[3]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.print(&quot;\\n== 中序遍历: &quot;);</span></span>
<span class="line"><span>        tree.inOrder();</span></span>
<span class="line"><span>        System.out.println();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 销毁二叉树</span></span>
<span class="line"><span>        tree.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="测试结果" tabindex="-1">测试结果 <a class="header-anchor" href="#测试结果" aria-label="Permalink to &quot;测试结果&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>== 依次添加: 1 5 4 3 2 6 </span></span>
<span class="line"><span>== 前序遍历: 1 5 4 3 2 6 </span></span>
<span class="line"><span>== 中序遍历: 1 2 3 4 5 6 </span></span>
<span class="line"><span>== 后序遍历: 2 3 4 6 5 1 </span></span>
<span class="line"><span>== 最小值: 1</span></span>
<span class="line"><span>== 最大值: 6</span></span>
<span class="line"><span>== 树的详细信息: </span></span>
<span class="line"><span>is root</span></span>
<span class="line"><span>is  1&#39;s  right child</span></span>
<span class="line"><span>is  5&#39;s   left child</span></span>
<span class="line"><span>is  4&#39;s   left child</span></span>
<span class="line"><span>is  3&#39;s   left child</span></span>
<span class="line"><span>is  5&#39;s  right child</span></span>
<span class="line"><span></span></span>
<span class="line"><span>== 删除根节点: 3</span></span>
<span class="line"><span>== 中序遍历: 1 2 4 5 6</span></span></code></pre></div><h2 id="bst相关题目" tabindex="-1">BST相关题目 <a class="header-anchor" href="#bst相关题目" aria-label="Permalink to &quot;BST相关题目&quot;">​</a></h2><p>二叉查找树(BST): 根节点大于等于左子树所有节点，小于等于右子树所有节点。</p><p>二叉查找树中序遍历有序。</p><p><strong>修剪二叉查找树</strong></p><p><a href="https://leetcode.com/problems/trim-a-binary-search-tree/description/" target="_blank" rel="noreferrer">669. Trim a Binary Search Tree (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    3</span></span>
<span class="line"><span>   / \\</span></span>
<span class="line"><span>  0   4</span></span>
<span class="line"><span>   \\</span></span>
<span class="line"><span>    2</span></span>
<span class="line"><span>   /</span></span>
<span class="line"><span>  1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  L = 1</span></span>
<span class="line"><span>  R = 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      3</span></span>
<span class="line"><span>     /</span></span>
<span class="line"><span>   2</span></span>
<span class="line"><span>  /</span></span>
<span class="line"><span> 1</span></span></code></pre></div><p>题目描述: 只保留值在 L ~ R 之间的节点</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public TreeNode trimBST(TreeNode root, int L, int R) {</span></span>
<span class="line"><span>    if (root == null) return null;</span></span>
<span class="line"><span>    if (root.val &gt; R) return trimBST(root.left, L, R);</span></span>
<span class="line"><span>    if (root.val &lt; L) return trimBST(root.right, L, R);</span></span>
<span class="line"><span>    root.left = trimBST(root.left, L, R);</span></span>
<span class="line"><span>    root.right = trimBST(root.right, L, R);</span></span>
<span class="line"><span>    return root;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>寻找二叉查找树的第 k 个元素</strong></p><p><a href="https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/" target="_blank" rel="noreferrer">230. Kth Smallest Element in a BST (Medium)在新窗口打开</a></p><p>中序遍历解法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int cnt = 0;</span></span>
<span class="line"><span>private int val;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public int kthSmallest(TreeNode root, int k) {</span></span>
<span class="line"><span>    inOrder(root, k);</span></span>
<span class="line"><span>    return val;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void inOrder(TreeNode node, int k) {</span></span>
<span class="line"><span>    if (node == null) return;</span></span>
<span class="line"><span>    inOrder(node.left, k);</span></span>
<span class="line"><span>    cnt++;</span></span>
<span class="line"><span>    if (cnt == k) {</span></span>
<span class="line"><span>        val = node.val;</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    inOrder(node.right, k);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>递归解法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int kthSmallest(TreeNode root, int k) {</span></span>
<span class="line"><span>    int leftCnt = count(root.left);</span></span>
<span class="line"><span>    if (leftCnt == k - 1) return root.val;</span></span>
<span class="line"><span>    if (leftCnt &gt; k - 1) return kthSmallest(root.left, k);</span></span>
<span class="line"><span>    return kthSmallest(root.right, k - leftCnt - 1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int count(TreeNode node) {</span></span>
<span class="line"><span>    if (node == null) return 0;</span></span>
<span class="line"><span>    return 1 + count(node.left) + count(node.right);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>把二叉查找树每个节点的值都加上比它大的节点的值</strong></p><p><a href="https://leetcode.com/problems/convert-bst-to-greater-tree/description/" target="_blank" rel="noreferrer">Convert BST to Greater Tree (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: The root of a Binary Search Tree like this:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>              5</span></span>
<span class="line"><span>            /   \\</span></span>
<span class="line"><span>           2     13</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output: The root of a Greater Tree like this:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>             18</span></span>
<span class="line"><span>            /   \\</span></span>
<span class="line"><span>          20     13</span></span></code></pre></div><p>先遍历右子树。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int sum = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public TreeNode convertBST(TreeNode root) {</span></span>
<span class="line"><span>    traver(root);</span></span>
<span class="line"><span>    return root;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void traver(TreeNode node) {</span></span>
<span class="line"><span>    if (node == null) return;</span></span>
<span class="line"><span>    traver(node.right);</span></span>
<span class="line"><span>    sum += node.val;</span></span>
<span class="line"><span>    node.val = sum;</span></span>
<span class="line"><span>    traver(node.left);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>二叉查找树的最近公共祖先</strong></p><p><a href="https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/" target="_blank" rel="noreferrer">235. Lowest Common Ancestor of a Binary Search Tree (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>        _______6______</span></span>
<span class="line"><span>      /                \\</span></span>
<span class="line"><span>  ___2__             ___8__</span></span>
<span class="line"><span> /      \\           /      \\</span></span>
<span class="line"><span>0        4         7        9</span></span>
<span class="line"><span>        /  \\</span></span>
<span class="line"><span>       3   5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>For example, the lowest common ancestor (LCA) of nodes 2 and 8 is 6. Another example is LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {</span></span>
<span class="line"><span>    if (root.val &gt; p.val &amp;&amp; root.val &gt; q.val) return lowestCommonAncestor(root.left, p, q);</span></span>
<span class="line"><span>    if (root.val &lt; p.val &amp;&amp; root.val &lt; q.val) return lowestCommonAncestor(root.right, p, q);</span></span>
<span class="line"><span>    return root;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>二叉树的最近公共祖先</strong></p><p><a href="https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/" target="_blank" rel="noreferrer">236. Lowest Common Ancestor of a Binary Tree (Medium) 在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>       _______3______</span></span>
<span class="line"><span>      /              \\</span></span>
<span class="line"><span>  ___5__           ___1__</span></span>
<span class="line"><span> /      \\         /      \\</span></span>
<span class="line"><span>6        2       0        8</span></span>
<span class="line"><span>        /  \\</span></span>
<span class="line"><span>       7    4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>For example, the lowest common ancestor (LCA) of nodes 5 and 1 is 3. Another example is LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {</span></span>
<span class="line"><span>    if (root == null || root == p || root == q) return root;</span></span>
<span class="line"><span>    TreeNode left = lowestCommonAncestor(root.left, p, q);</span></span>
<span class="line"><span>    TreeNode right = lowestCommonAncestor(root.right, p, q);</span></span>
<span class="line"><span>    return left == null ? right : right == null ? left : root;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>从有序数组中构造二叉查找树</strong></p><p><a href="https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/description/" target="_blank" rel="noreferrer">108. Convert Sorted Array to Binary Search Tree (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public TreeNode sortedArrayToBST(int[] nums) {</span></span>
<span class="line"><span>    return toBST(nums, 0, nums.length - 1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private TreeNode toBST(int[] nums, int sIdx, int eIdx){</span></span>
<span class="line"><span>    if (sIdx &gt; eIdx) return null;</span></span>
<span class="line"><span>    int mIdx = (sIdx + eIdx) / 2;</span></span>
<span class="line"><span>    TreeNode root = new TreeNode(nums[mIdx]);</span></span>
<span class="line"><span>    root.left =  toBST(nums, sIdx, mIdx - 1);</span></span>
<span class="line"><span>    root.right = toBST(nums, mIdx + 1, eIdx);</span></span>
<span class="line"><span>    return root;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>根据有序链表构造平衡的二叉查找树</strong></p><p><a href="https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/description/" target="_blank" rel="noreferrer">109. Convert Sorted List to Binary Search Tree (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Given the sorted linked list: [-10,-3,0,5,9],</span></span>
<span class="line"><span></span></span>
<span class="line"><span>One possible answer is: [0,-3,9,-10,null,5], which represents the following height balanced BST:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      0</span></span>
<span class="line"><span>     / \\</span></span>
<span class="line"><span>   -3   9</span></span>
<span class="line"><span>   /   /</span></span>
<span class="line"><span> -10  5</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public TreeNode sortedListToBST(ListNode head) {</span></span>
<span class="line"><span>    if (head == null) return null;</span></span>
<span class="line"><span>    if (head.next == null) return new TreeNode(head.val);</span></span>
<span class="line"><span>    ListNode preMid = preMid(head);</span></span>
<span class="line"><span>    ListNode mid = preMid.next;</span></span>
<span class="line"><span>    preMid.next = null;  // 断开链表</span></span>
<span class="line"><span>    TreeNode t = new TreeNode(mid.val);</span></span>
<span class="line"><span>    t.left = sortedListToBST(head);</span></span>
<span class="line"><span>    t.right = sortedListToBST(mid.next);</span></span>
<span class="line"><span>    return t;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private ListNode preMid(ListNode head) {</span></span>
<span class="line"><span>    ListNode slow = head, fast = head.next;</span></span>
<span class="line"><span>    ListNode pre = head;</span></span>
<span class="line"><span>    while (fast != null &amp;&amp; fast.next != null) {</span></span>
<span class="line"><span>        pre = slow;</span></span>
<span class="line"><span>        slow = slow.next;</span></span>
<span class="line"><span>        fast = fast.next.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return pre;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>在二叉查找树中寻找两个节点，使它们的和为一个给定值</strong></p><p><a href="https://leetcode.com/problems/two-sum-iv-input-is-a-bst/description/" target="_blank" rel="noreferrer">653. Two Sum IV - Input is a BST (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    5</span></span>
<span class="line"><span>   / \\</span></span>
<span class="line"><span>  3   6</span></span>
<span class="line"><span> / \\   \\</span></span>
<span class="line"><span>2   4   7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Target = 9</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output: True</span></span></code></pre></div><p>使用中序遍历得到有序数组之后，再利用双指针对数组进行查找。</p><p>应该注意到，这一题不能用分别在左右子树两部分来处理这种思想，因为两个待求的节点可能分别在左右子树中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean findTarget(TreeNode root, int k) {</span></span>
<span class="line"><span>    List&lt;Integer&gt; nums = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    inOrder(root, nums);</span></span>
<span class="line"><span>    int i = 0, j = nums.size() - 1;</span></span>
<span class="line"><span>    while (i &lt; j) {</span></span>
<span class="line"><span>        int sum = nums.get(i) + nums.get(j);</span></span>
<span class="line"><span>        if (sum == k) return true;</span></span>
<span class="line"><span>        if (sum &lt; k) i++;</span></span>
<span class="line"><span>        else j--;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void inOrder(TreeNode root, List&lt;Integer&gt; nums) {</span></span>
<span class="line"><span>    if (root == null) return;</span></span>
<span class="line"><span>    inOrder(root.left, nums);</span></span>
<span class="line"><span>    nums.add(root.val);</span></span>
<span class="line"><span>    inOrder(root.right, nums);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>在二叉查找树中查找两个节点之差的最小绝对值</strong></p><p><a href="https://leetcode.com/problems/minimum-absolute-difference-in-bst/description/" target="_blank" rel="noreferrer">530. Minimum Absolute Difference in BST (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   1</span></span>
<span class="line"><span>    \\</span></span>
<span class="line"><span>     3</span></span>
<span class="line"><span>    /</span></span>
<span class="line"><span>   2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1</span></span></code></pre></div><p>利用二叉查找树的中序遍历为有序的性质，计算中序遍历中临近的两个节点之差的绝对值，取最小值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int minDiff = Integer.MAX_VALUE;</span></span>
<span class="line"><span>private TreeNode preNode = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public int getMinimumDifference(TreeNode root) {</span></span>
<span class="line"><span>    inOrder(root);</span></span>
<span class="line"><span>    return minDiff;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void inOrder(TreeNode node) {</span></span>
<span class="line"><span>    if (node == null) return;</span></span>
<span class="line"><span>    inOrder(node.left);</span></span>
<span class="line"><span>    if (preNode != null) minDiff = Math.min(minDiff, node.val - preNode.val);</span></span>
<span class="line"><span>    preNode = node;</span></span>
<span class="line"><span>    inOrder(node.right);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>寻找二叉查找树中出现次数最多的值</strong></p><p><a href="https://leetcode.com/problems/find-mode-in-binary-search-tree/description/" target="_blank" rel="noreferrer">501. Find Mode in Binary Search Tree (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   1</span></span>
<span class="line"><span>    \\</span></span>
<span class="line"><span>     2</span></span>
<span class="line"><span>    /</span></span>
<span class="line"><span>   2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>return [2].</span></span></code></pre></div><p>答案可能不止一个，也就是有多个值出现的次数一样多。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int curCnt = 1;</span></span>
<span class="line"><span>private int maxCnt = 1;</span></span>
<span class="line"><span>private TreeNode preNode = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public int[] findMode(TreeNode root) {</span></span>
<span class="line"><span>    List&lt;Integer&gt; maxCntNums = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    inOrder(root, maxCntNums);</span></span>
<span class="line"><span>    int[] ret = new int[maxCntNums.size()];</span></span>
<span class="line"><span>    int idx = 0;</span></span>
<span class="line"><span>    for (int num : maxCntNums) {</span></span>
<span class="line"><span>        ret[idx++] = num;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void inOrder(TreeNode node, List&lt;Integer&gt; nums) {</span></span>
<span class="line"><span>    if (node == null) return;</span></span>
<span class="line"><span>    inOrder(node.left, nums);</span></span>
<span class="line"><span>    if (preNode != null) {</span></span>
<span class="line"><span>        if (preNode.val == node.val) curCnt++;</span></span>
<span class="line"><span>        else curCnt = 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (curCnt &gt; maxCnt) {</span></span>
<span class="line"><span>        maxCnt = curCnt;</span></span>
<span class="line"><span>        nums.clear();</span></span>
<span class="line"><span>        nums.add(node.val);</span></span>
<span class="line"><span>    } else if (curCnt == maxCnt) {</span></span>
<span class="line"><span>        nums.add(node.val);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    preNode = node;</span></span>
<span class="line"><span>    inOrder(node.right, nums);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><blockquote><p>本文主要来源于@skywang12345的<a href="https://www.cnblogs.com/skywang12345/p/3576452.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E9%87%8D%E6%96%B0%E7%BB%84%E7%BB%87%E5%92%8C%E5%A2%9E%E5%8A%A0%E4%BA%86%E5%86%85%E5%AE%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3576452.html，在此基础上重新组织和增加了内容。</a></p></blockquote><p><a href="http://www.sohu.com/a/113502963%5C_464041" target="_blank" rel="noreferrer">http://www.sohu.com/a/113502963\\_464041</a></p><p><a href="https://www.cnblogs.com/QG-whz/p/5168620.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/QG-whz/p/5168620.html</a></p><p><a href="https://blog.csdn.net/isea533/article/details/80345507" target="_blank" rel="noreferrer">https://blog.csdn.net/isea533/article/details/80345507</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,133)]))}const q=a(h,[["render",g]]);export{x as __pageData,q as default};
