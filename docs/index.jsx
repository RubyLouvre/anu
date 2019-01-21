---
banner:
  name: 'anujs'
  desc: 'the React16-compat mini library'
  btns: 
    - { name: 'Start', href: './en/index.html', primary: true }
    - { name: 'Github >', href: 'https://github.com/RubyLouvre/anu' }
  caption: 'version: v1.5.0'
features: 
  - { name: 'Elaborate design', desc: 'Supports all features of React 16, but only 14kb' }
  - { name: 'Backing on React ’s huge biome', desc: 'Run nearly more than 800 official unit tests and 246 antd unit tests!' }
  - { name: 'Excellent browser compatibility', desc: 'No pressure to run in IE6-8' }
  - { name: 'A complete set of solutions', desc: 'Provides powerful status management and routers' }

footer:
  copyRight:
    name: '司徒正美'
    href: 'https://ymfe.org/'
  links:
    About:
      - { name: 'weibo', href: 'https://weibo.com/jslouvre/' }
      - { name: 'blog', href: 'https://www.cnblogs.com/rubylouvre/' }
      - { name: 'twitter', href: 'https://twitter.com/jslouvre' }
      
    Projects:
      - { name: 'mass Framework', href: 'https://github.com/RubyLouvre/mass-Framework' }
      - { name: 'avalon', href: 'https://github.com/RubyLouvre/avalon' }
      - { name: 'anujs', href: 'https://github.com/RubyLouvre/anu/' }

---

<Homepage banner={banner} features={features} />
<Footer distPath={props.page.distPath} copyRight={props.footer.copyRight} links={props.footer.links} />