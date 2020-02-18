// import { DOMRenderer } from '../../dom/DOMRenderer';
// import Share from './Components/Share';
// import { handleSuccess, handleFail } from '../utils';

// const shareTypes = ['default', 'wechatTimeline', 'wechatFriend', 'qqFriend', 'qZone', 'weibo'];
// let shareIndex = 0;

// function browserShare({ title, path, imageUrl, type = 'default', desc }) {
//   var nativeShare = new NativeShare();
//   nativeShare.setShareData({
//     icon: imageUrl,
//     link: path,
//     title,
//     desc
//   });
//   try {
//     nativeShare.call(type);
//   } catch(e) {
//     React.api.showModal({
//       title: e
//     });
//   }
  
  // TODO: 是否需要降级处理
  // shareIndex++;
  // if (shareIndex >= shareTypes.length) {
  //   console.log(e);
  // } else {
  //   browserShare(title, path, imageUrl, shareTypes[shareIndex]);
  // }
// }

// function share({
//   title = '',
//   path = '',
//   imageUrl = '',
//   desc = '',
//   success = () => {},
//   fail = () => {},
//   complete = () => {}
// } = {}) {
//   return new Promise(function(resolve, reject) {
//     const id = 'h5-api-share',
//       toast = document.getElementById(id);
//     if (!toast) {
//       const container = document.createElement('div');
//       container.id = id;
//       container.style.position = 'fixed';
//       container.style.backgroundColor = 'rgba(0,0,0,0.4)';
//       container.style.width = '100%';
//       container.style.height = '100%';
//       container.addEventListener('click', function(e) {
//         if (e.target.id === id) {
//           container.remove();
//         }
//       });
//       document.body.appendChild(container);
//       DOMRenderer.render(
//         <Share
//           title={title}
//           path={path}
//           imageUrl={imageUrl}
//           desc={desc}
//           success={success}
//           fail={fail}
//           complete={complete}
//           resolve={resolve}
//           reject={reject}
//         />, container);
//     }
//   });
// }

export default {
  // share
};
