# nanachi 项目反馈

### 下面是关于您的预编译语言使用情况

<script type="text/javascript" src="https://www.websitegoodies.com/poll.php?id=116285"></script>
<script >
    // 修改提交按钮文案为中文
    document.addEventListener("DOMContentLoaded", function(){
      const els = document.querySelectorAll('form div[align="center"] *');
      if(els.length > 2){
          var button1 = els[0]
          var button2 = els[els.length-1];
          button1.value = "提交投票";
          button1.style.backgroundColor = "#1890ff";
          button1.style.color = "white";
          button1.style.padding = "2px 8px";
          button1.style.cursor = "pointer";
          button2.innerHTML = '查看结果';
      }
    });
</script>

### 下面区域是关于 nanachi 的反馈，如果你有什么意见或建议欢迎在评论区留言:

<div id="gitalk-container"></div>
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css" />
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>

<script>
  const gitalk = new Gitalk({
    clientID: "c94e12373b38435e378a",
    clientSecret: "497ad5ef73ba031b895f56cc1d73d0bf87d981d3",
    repo: "nanachi",
    owner: "RubyLouvre",
    admin: ["RubyLouvre", "xuhen"],
    id: location.pathname,
    distractionFreeMode: false
  });

gitalk.render("gitalk-container");

</script>
