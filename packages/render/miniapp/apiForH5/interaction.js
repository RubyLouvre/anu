
import { DOMRenderer } from '../../dom/DOMRenderer';
import Modal from './Components/Modal';
import Toast from './Components/Toast';
import Loading from './Components/Loading';
import ActionSheet from './Components/ActionSheet';

let { render } = DOMRenderer;

// const svg = <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><style/></defs><path d="M16 24l-8 8 20 20 32-32-8-8-24 24" class="transform-group"/></svg>;

var timer;

function showModal({
  title = '',
  content = '',
  showCancel = true,
  cancelText = '取消',
  cancelColor = '#000000',
  confirmText = '确定',
  confirmColor = '#3cc51f',
  success = function() {},
  fail = function() {},
  complete = function() {},
} = {}) {
  return new Promise(function(resolve, reject) {
    const id = 'h5-api-showModal',
      modal = document.getElementById(id);
    cancelText = cancelText.slice(0, 4);
    confirmText = confirmText.slice(0, 4);
    if (!modal) {
      const container = document.createElement('div');
      container.id = id;
      container.style.position = 'fixed';
      container.style.backgroundColor = 'rgba(0,0,0,0)';
      setTimeout(() => {
        container.style.backgroundColor = 'rgba(0,0,0,0.4)';
      }, 0);
      container.style.transition = 'background-color 300ms';
      container.style.width = '100%';
      container.style.height = '100%';
      document.body.appendChild(container);
      render(
        <Modal
          title={title}
          content={content}
          showCancel={showCancel}
          cancelText={cancelText}
          cancelColor={cancelColor}
          confirmText={confirmText}
          confirmColor={confirmColor}
          success={success}
          fail={fail}
          complete={complete}
          resolve={resolve}
          reject={reject}
        />, container);
    }
  });
}

function showToast({
  title = '',
  // icon = svg,
  image = '',
  duration = 1500,
  mask = false,
  success = function() {},
  fail = function() {},
  complete = function() {}
} = {}) {
  return new Promise(function(resolve, reject) {
    const id = 'h5-api-showToast',
      toast = document.getElementById(id);
    if (!toast) {
      const container = document.createElement('div');
      container.id = id;
      container.style.position = 'fixed';
      container.style.width = mask ? '100%' : '120px';
      container.style.height = mask ? '100%' : '120px';
      document.body.appendChild(container);
      render(
        <Toast
          title={title}
          // icon={icon}
          image={image}
          success={success}
          fail={fail}
          complete={complete}
          resolve={resolve}
          reject={reject}
        />, container, function() {
          timer = setTimeout(() => {
            const toast = document.getElementById('h5-api-showToast');
            toast && toast.remove();
          }, duration);
        });
    }
  });
}

function hideToast() {
  const toast = document.getElementById('h5-api-showToast');
  if (toast) {
    toast.remove();
    clearTimeout(timer);
  }
}

function showLoading({
  title = '',
  mask = false,
  success = function() {},
  fail = function() {},
  complete = function() {}
} = {}) {
  return new Promise(function(resolve, reject) {
    const id = 'h5-api-showLoading',
      toast = document.getElementById(id);
    if (!toast) {
      const container = document.createElement('div');
      container.id = id;
      container.style.position = 'fixed';
      container.style.width = mask ? '100%' : '120px';
      container.style.height = mask ? '100%' : '120px';
      document.body.appendChild(container);
      render(
        <Loading
          title={title}
          icon='loading...'
          success={success}
          fail={fail}
          complete={complete}
          resolve={resolve}
          reject={reject}
        />, container);
    }
  });
}

function hideLoading() {
  const loading = document.getElementById('h5-api-showLoading');
  if (loading) {
    loading.remove();
  }
}

function showActionSheet({
  itemList = [],
  itemColor = '#000000',
  cancelButtonText = '取消',
  success = function() {},
  fail = function() {},
  complete = function() {},
} = {}) {
  return new Promise(function(resolve, reject) {
    const id = 'h5-api-showActionSheet',
      modal = document.getElementById(id);
    if (!modal) {
      const container = document.createElement('div');
      container.id = id;
      container.style.position = 'fixed';
      container.style.backgroundColor = 'rgba(0,0,0,0)';
      container.style.transition = 'background-color 300ms';
      setTimeout(() => {
        container.style.backgroundColor = 'rgba(0,0,0,0.4)';
      }, 0);
      container.style.width = '100%';
      container.style.height = '100%';
      container.addEventListener('click', function(e) {
        if (e.target.id === id) {
          container.remove();
          reject({
            errMsg: 'showActionSheet:fail cancel'
          });
        }
      });
      document.body.appendChild(container);
      render(
        <ActionSheet
          itemList={itemList}
          itemColor={itemColor}
          cancelButtonText={cancelButtonText}
          success={success}
          fail={fail}
          complete={complete}
          resolve={resolve}
          reject={reject}
        />, container);
    }
  });
}

export default {
  showModal,
  showToast,
  hideToast,
  showLoading,
  hideLoading,
  showActionSheet
};
