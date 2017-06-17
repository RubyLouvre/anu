/**
 * List核心逻辑,负责管理List组件的内部状态
 */
import ComponentCore from '../../common/ComponentCore';

export default class ListCore extends ComponentCore {

    static guid = -1;

    /**
     * @param dataSource 数据源
     * @param offsetY 列表的初始Y偏移
     * @param infinite 是否是无穷列表
     * @param itemHeight 列表项高度
     * @param visibleSize 保留在列表容器中列表项的数组
     * @description 构造函数,会通过调用refresh方法进行初始化
     */
    constructor({
                    dataSource,
                    offsetY = 0,
                    infinite = true,
                    itemHeight,
                    infiniteSize = 12,
                    staticSectionHeight = 0
                }) {
        super('list');
        // 静态属性
        // 这些属性不会随着父组件render改变
        this.itemHeight = itemHeight;
        // 保存列表项定位信息的表,List组件不定高模式的核心数据结构
        this.positionMap = {};
        // 在refresh中设置的属性可以通过父组件的render改变
        this.refresh({
            dataSource,
            refreshAll: false,
            infiniteSize,
            staticSectionHeight,
            offsetY,
            infinite
        });
    }

    /**
     * @param ds
     * @param refreshAll
     * @param visibleSize
     * @param offsetY
     * @param infinite
     * @param startIndex
     * @returns {ListCore}
     * @description 设置实例属性, 在构造函数中被调用,也会在组件的componentWillReceiveProps回调中调用
     * 可以根据props初始化/重置组件的状态
     */
    refresh({
                dataSource = this.dataSource,
                refreshAll = false,
                infiniteSize = this.visibleSize,
                staticSectionHeight = this.staticSectionHeight,
                offsetY = this.offsetY,
                infinite = this.infinite
            }) {
        if (!Array.isArray(dataSource)) {
            if (typeof dataSource.toArray === 'function') {
                dataSource = dataSource.toArray();
            } else {
                throw new Error('yo-list: dataSource必须为数组或者Immutable List!');
            }
        }

        if (!dataSource.length) {
            throw new Error('yo-list: dataSource不能为空数组!');
        }

        this.WINDOW_HEIGHT = window.screen.height || 736;
        this.infinite = infinite;
        this.VISIBLE_SIZE = infiniteSize;
        this.dataSource = this.renderDataSource(dataSource, refreshAll);
        this.isHeightFixed = this.ifHeightFixed();
        this.direction = this.getDirection(offsetY);
        this.offsetY = offsetY;
        this.startIndex = this.refreshStartIndexByOffsetY(offsetY);
        this.staticSectionHeight = staticSectionHeight;
        this.visibleList = this.getVisibleList(offsetY);
        this.totalHeight = this.getTotalHeight();

        this.emitChange();

        return this;
    }

    /**
     * @param dataSource
     * @returns {boolean}
     * 判断数据源中的元素是否都被计算出(设置了)高度
     */
    ifHeightFixed(dataSource = this.dataSource) {
        return dataSource.every(item => !!this.getAttr(item.srcData, 'height')) || !!this.itemHeight || !this.infinite;
    }

    /**
     * @returns {number}
     * 返回一个guid
     */
    getGuid() {
        return ++ListCore.guid;
    }

    /**
     * @param offsetY
     * @returns {string}
     * 根据传入的offsetY计算出组件滚动的方向
     */
    getDirection(offsetY) {
        return offsetY - this.offsetY >= 0 ? 'down' : 'up';
    }

    /**
     * @param offsetY
     * @returns {number}
     * 根据传入的offsetY计算startIndex,startIndex被用来计算visibleList(无穷模式中保留在容器中的列表项的数组)
     */
    refreshStartIndexByOffsetY(y) {
        const offsetY = y - window.screen.height / 5;

        if (this.infinite && this.isHeightFixed) {
            for (let i = 0; i < this.dataSource.length; i++) {
                const item = this.dataSource[i];
                const itemPosData = this.getItemPositionData(item);
                if (i === 0 && itemPosData.height > offsetY) {
                    return i;
                } else if (i > 0) {
                    const prev = this.dataSource[i - 1];
                    const prevPosData = this.getItemPositionData(prev);
                    if (prevPosData._translateY < offsetY && prevPosData._translateY >= offsetY) {
                        return i;
                    }
                }
            }
        } else if (this.infinite) {
            return this.startIndex ? this.startIndex : 0;
        }

        return 0;
    }

    /**
     * @param offsetY
     * @returns {ListCore}
     * 在列表滚动时,根据offsetY更新visibleList
     */
    onScrollTo(offsetY, manually) {
        this.direction = this.getDirection(offsetY);
        this.offsetY = offsetY;
        if (manually) {
            this.startIndex = 0;
        }
        const cachedIndex = this.startIndex;
        if (this.infinite) {
            this.visibleList = this.getVisibleList(offsetY);
            // 只有当visibleList里面的内容真正发生变化的时候才触发onchange
            // 这样可以确保setState调用次数最少
            if (this.startIndex !== cachedIndex ||
                (this.startIndex === 0 && this.offsetY === 0)
                || manually) {
                this.emitChange();
            }
        }

        return this;
    }

    getItemPositionData(item) {
        const key = this.getAttr(item, 'key');
        return item._type === 'groupTitle' ? item : this.positionMap[key];
    }

    setItemPositionData(item, attr) {
        // grouptitle做特殊处理,因为grouptitle是grouplist组件内部的数据对象,所以不会修改到源数据
        // 与此同时，grouplist需要获取到_translateY这些信息，因此也只能在原来的数据对象上修改
        if (item._type === 'groupTitle') {
            Object.assign(item, attr);
        } else if (this.positionMap[item.key]) {
            Object.assign(this.positionMap[item.key], attr);
        }
    }

    /**
     * @param ds
     * @param refreshAll
     * @returns {Array}
     * 处理数据源
     * 为每个元素的在pos表中的项添加_order(无穷模式下该列表项对应的槽的index),_resolved(是否已经计算出位置),_index(在数据源中的位置)
     * _translateY(无穷列表中元素的translateY)和_bottom(列表项的bottom)
     */
    renderDataSource(ds, refreshAll = false) {
        return ds.map((ditem, i) => {
            let key = this.getAttr(ditem, 'key');
            let renderedItem = {};

            if (key == null) {
                if (this.infinite) {
                    throw new Error('infinite模式的列表数据源的每一项必须有key属性。');
                } else {
                    key = this.getGuid();
                    if (process.env.NODE_ENV === 'dev') {
                        console.warn('Yo-List:列表项没有key属性,将自动添加自增的key。这会使得列表在更新时出现大量的不必要的dom操作，请为每一个列表项指定一个唯一的key。');
                    }
                }
            }

            // 区分groupTitle和item，因为groupTitle是组件添加的，不会影响到源数据，所以可以直接在上面增加属性
            renderedItem = ditem._type !== 'groupTitle' ? {
                // srcData指向源数据
                srcData: ditem,
                key,
                _index: i,
                _type: 'item'
            } : Object.assign(ditem, { srcData: ditem, _index: i }); // 这里给title增加了一个指向自己的指针srcData，这是为了兼容其他普通item的数据格式，而不是在使用它的地方做各种判断

            if (refreshAll) {
                this.setItemPositionData(renderedItem, { _bottom: null, _translateY: null, _order: null });
            }

            let itemPosData = this.getItemPositionData(renderedItem);
            if (!itemPosData) {
                itemPosData = this.positionMap[renderedItem.key] = {};
            }

            const itemHeight = this.getAttr(ditem, 'height');
            const noHeightIdentified = this.itemHeight == null && itemHeight == null && itemPosData.height == null;

            let mergedItemHeight = null;
            if (itemHeight != null) {
                mergedItemHeight = itemHeight;
            } else if (itemPosData.height != null) {
                mergedItemHeight = itemPosData.height;
            } else {
                mergedItemHeight = this.itemHeight;
            }

            if (this.infinite) {
                // 设置height,_order,_resolved和_index
                // 如果这个item具有高度,则直接设为resolved
                this.setItemPositionData(renderedItem, {
                    height: mergedItemHeight,
                    _order: i % this.VISIBLE_SIZE,
                    _resolved: this.infinite && !noHeightIdentified,
                    _index: i
                });
                // 即使这个元素高度确定,之前一个高度为null,也无法算出translateY和bottom
                // 此处再次验证之前一个元素是否为resolve
                if (i > 0) {
                    const prevItemPosData = this.getItemPositionData(ds[i - 1]);
                    if (!prevItemPosData._resolved) {
                        this.setItemPositionData(renderedItem, { _resolved: false });
                    }
                }
                // 第一个item,直接设置_translateY为0
                if (i === 0) {
                    this.setItemPositionData(renderedItem, { _translateY: 0 });
                }
                // 之后的所有item,如果有height,设置它们的_translateY为前一个元素的bottom
                // 设置它们的bottom为_translateY+height
                if (itemPosData._resolved && !itemPosData._bottom) {
                    const _translateY = i === 0 ? 0 : this.getItemPositionData(ds[i - 1])._bottom;
                    const _bottom = _translateY + itemPosData.height;
                    this.setItemPositionData(renderedItem, {
                        _translateY,
                        _bottom
                    });
                } else if (!itemPosData._resolved) { // 不定高的情况
                    if (i > 0) {
                        const prevItemPosData = this.getItemPositionData(ds[i - 1]);
                        if (prevItemPosData._bottom) {
                            this.setItemPositionData(renderedItem, { _translateY: prevItemPosData._bottom });
                        }
                    }
                }
            }

            return renderedItem;
        });
    }

    /**
     * @param i
     * @param borderY
     * @param dataSource
     * @returns {boolean}
     * 根据offsetY计算出刚好跨过offsetY的元素(top在y之上,bottom在y之下),或者是一个没有完成定位的元素
     */
    isBorderItem(i, borderY, dataSource = this.dataSource) {
        const itemPosData = this.getItemPositionData(dataSource[i]);
        return itemPosData._resolved
            && itemPosData._bottom >= borderY
            && itemPosData._translateY <= borderY
            || !itemPosData._resolved;
    }

    /**
     * @param startY
     * @param startIndex
     * @param direction
     * @param dataSource
     * @param VISIBLE_SIZE
     * @returns {Number}
     * 根据当前滚动的方向和y计算出startIndex
     * 缓存了当前的startIndex,这样可以将查找的开销从O(n)降低到O(1),在处理大列表的时候可以提升性能
     */
    getStartItemIndex(startY,
                      sIndex = this.startIndex,
                      direction = this.direction,
                      dataSource = this.dataSource,
                      VISIBLE_SIZE = this.VISIBLE_SIZE) {
        const len = dataSource.length;
        let startIndex = sIndex;
        // 从保存的startIndex开始循环,根据当前滚动的方向的不同,i相应增加/减少
        // 这样可以将查找的时间复杂度从线性降低到常量
        if (direction === 'down' || startIndex === 0) {
            for (let i = startIndex; i < len; i++) {
                if (this.isBorderItem(i, startY)) {
                    startIndex = i;
                    break;
                }
            }
        } else {
            for (let i = startIndex; i >= 0; i--) {
                if (this.isBorderItem(i, startY)) {
                    startIndex = i;
                    break;
                }
            }
        }

        if (startIndex > dataSource.length - VISIBLE_SIZE) {
            startIndex = dataSource.length - VISIBLE_SIZE > 0 ? dataSource.length - VISIBLE_SIZE : 0;
        }

        return startIndex;
    }

    /**
     * @param startIndex
     * @param dataSource
     * @param VISIBLE_SIZE
     * @returns {Number}
     * 根据startIndex算出endIndex
     */
    getEndItemIndex(startIndex,
                    dataSource = this.dataSource,
                    VISIBLE_SIZE = this.VISIBLE_SIZE) {
        return startIndex + VISIBLE_SIZE > dataSource.length ? dataSource.length : startIndex + VISIBLE_SIZE;
    }

    /**
     * @param offsetY
     * @param sIndex
     * @param dataSource
     * @param VISIBLE_SIZE
     * @returns {Array}
     * 根据offsetY算出visibleList
     */
    getVisibleList(offsetY = this.offsetY,
                   sIndex = null,
                   dataSource = this.dataSource) {
        offsetY = offsetY - this.staticSectionHeight;
        let ret = null;

        if (this.infinite) {
            let startY = offsetY - this.WINDOW_HEIGHT / 5;
            startY = startY > 0 ? startY : 0;
            const startIndex = sIndex === null ? this.getStartItemIndex(startY) : sIndex,
                endIndex = this.getEndItemIndex(startIndex);

            ret = [];
            for (let i = startIndex; i < endIndex; i++) {
                const item = this.dataSource[i];
                ret.push({
                    ...item,
                    ...this.getItemPositionData(item)
                });
            }
            this.startIndex = startIndex;
        } else {
            ret = dataSource.slice();
        }

        return ret;
    }

    /**
     * @param dataSource
     * @returns {Object}
     * 获取数据源中第一个还没有resolve的元素
     */
    getFirstNotResolvedItemIndex(dataSource = this.dataSource) {
        return dataSource.findIndex((ditem, i) => {
            if (i > 0) {
                const itemPosData = this.getItemPositionData(ditem);
                const prevItemPosData = this.getItemPositionData(dataSource[i - 1]);
                return !itemPosData._resolved && prevItemPosData._resolved;
            }
            return false;
        });
    }

    /**
     * @param key
     * @param dataSource
     * @returns {Number}
     * 根据key返回一个数据源中的元素
     */
    getItemIndexByKey(key, dataSource = this.dataSource) {
        return dataSource.findIndex((item) => item.key === key);
    }

    /**
     * @param notResolvedItemIndex
     * @param dataSource
     * 更新一个未定位元素的_translateY,它是前一个元素的_bottom
     */
    updateTranslateY(notResolvedItemIndex, dataSource = this.dataSource) {
        const notResolvedItem = dataSource[notResolvedItemIndex];

        if (notResolvedItem) {
            const prevItemIndex = notResolvedItemIndex - 1;
            const prevItem = dataSource[prevItemIndex];
            const prevItemPosData = this.getItemPositionData(prevItem);

            if (prevItemPosData && prevItemPosData._resolved) {
                this.setItemPositionData(notResolvedItem, { _translateY: prevItemPosData._bottom });
                // 同时也需要更新visibleList里面对应item的定位信息
                const visibleListItemToBeUpdated = this.visibleList.find((item) => item.key === notResolvedItem.key);
                if (visibleListItemToBeUpdated) {
                    Object.assign(visibleListItemToBeUpdated, this.getItemPositionData(notResolvedItem));
                }
            }
        }
    }

    /**
     * @param key
     * @param height
     * @param dataSource
     * @returns {ListCore}
     * 不定高模式的核心逻辑,定位一个尚未定位的列表项
     * 在列表项的componentDidUpdate和Mount中被调用,传入已经渲染好的列表项的dom高度,然后更新数据源中对应元素的高度并计算它的定位
     * 在该元素完成定位后,渲染下一个未被定位的列表项,并重复以上逻辑,直到visibleList中所有的项都完成定位
     */
    resolveItem(key, height, dataSource = this.dataSource) {
        const targetIndex = this.getItemIndexByKey(key);
        const targetItem = this.dataSource[targetIndex];
        let _translateY;

        if (targetIndex > 0) {
            const prevItemPosData = this.getItemPositionData(dataSource[targetIndex - 1]);
            _translateY = prevItemPosData._bottom;
        } else {
            _translateY = 0;
        }

        if (_translateY != null) {
            const _bottom = _translateY + height;
            const _resolved = true;
            this.setItemPositionData(targetItem, { _translateY, _bottom, _resolved, height });
            this.visibleList = this.getVisibleList();
            this.totalHeight += height;
            this.updateTranslateY(this.getFirstNotResolvedItemIndex());
            this.emitChange();
        }

        return this;
    }

    /**
     * @param dataSource
     * @returns {Array}
     * 计算列表中所有项的高度,用来refresh Scroller
     */
    getTotalHeight(dataSource = this.dataSource) {
        return dataSource
                .reduce((acc, item) => {
                    let ret = acc;
                    const itemPosData = this.getItemPositionData(item);
                    ret += itemPosData._resolved ? itemPosData.height : 0;
                    return ret;
                }, 0) + this.staticSectionHeight;
    }

    /**
     * @returns {ListCore}
     * 触发组件change事件,组件收到change事件后会执行setState
     */
    emitChange() {
        this.emitEvent('change', this.visibleList, this.totalHeight);
        return this;
    }
}