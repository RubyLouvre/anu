---
banner:
  name: 'anujs'
  desc: 'the React16-compat mini library'
  btns: 
    - { name: 'Start', href: './en/index.html', primary: true }
    - { name: 'Github >', href: 'https://github.com/RubyLouvre/anu' }
  caption: 'version: v1.4.3'
features: 
  - { name: '优雅', desc: '经过精雕细琢，我们带给大家一个精心设计的、拥有卓越的视觉与交互体验的文档构建工具' }
  - { name: '灵动', desc: '我们拥有非常灵活的 插件机制 与 主题定制 功能，正在努力构建活跃的插件社区。也许初次使用未见其惊艳，但当你灵活使用插件后便会发现她的强大' }
  - { name: '简洁', desc: '以 ‘无形’ 代替 ‘有形’，从开发体验到用户界面的呈现，不断去除冗余的设计，使用户专注于写作与阅读' }
  - { name: '开源', desc: '作为开源项目，我们拥有高质量的代码、完善的自动化测试流程，对社区的需求能够作出积极快速响应' }

footer:
  copyRight:
    name: '司徒正美'
    href: 'https://ymfe.org/'
  links:
    团队网址:
      - { name: 'YMFE', href: 'https://ymfe.org/' }
      - { name: 'YMFE Blog', href: 'https://blog.ymfe.org/' }
    Git仓库:
      - { name: 'Github', href: 'https://github.com/RubyLouvre/anu' }
      - { name: 'Github Issue', href: 'https://github.com/RubyLouvre/anu/issues' }

---

<Homepage banner={banner} features={features} />
<Footer distPath={props.page.distPath} copyRight={props.footer.copyRight} links={props.footer.links} />