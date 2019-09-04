const CanvasContext = function(canvasId) {
    const canvasDom = document.getElementById(canvasId);
    if (!canvasDom || !canvasDom.getContext) {
        console.error('canvasId错误，或浏览器不支持canvas');
    } else {
        this.canvasDom = canvasDom;
        this.width = canvasDom.width;
        this.height = canvasDom.height;
        this.ctx = canvasDom.getContext('2d');
    }
    this.missions = [];
};

CanvasContext.prototype.setTextAlign = function(align) {
    this.missions.push(() => {
        this.ctx.textAlign = align;
    });
};

CanvasContext.prototype.setTextBaseline = function(textBaseline) {
    this.missions.push(() => {
        this.ctx.textBaseline = textBaseline;
    });
};

CanvasContext.prototype.setFillStyle = function(color = 'black') {
    this.missions.push(() => {
        this.ctx.fillStyle = color;
    });
};

CanvasContext.prototype.setStrokeStyle = function(color = 'black') {
    this.missions.push(() => {
        this.ctx.strokeStyle = color;
    });
};

CanvasContext.prototype.setShadow = function(
    offsetX = 0,
    offsetY = 0,
    blur = 0,
    color = 'black'
) {
    this.missions.push(() => {
        this.ctx.shadowOffsetX = offsetX;
        this.ctx.shadowOffsetY = offsetY;
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = color;
    });
};

CanvasContext.prototype.createLinearGradient = function(x0, y0, x1, y1) {
    return this.ctx.createLinearGradient(x0, y0, x1, y1);
};

CanvasContext.prototype.createCircularGradient = function(x, y, r) {
    return this.ctx.createRadialGradient(x, y, 0, x, y, r);
};

CanvasContext.prototype.setLineWidth = function(lineWidth) {
    this.missions.push(() => {
        this.ctx.lineWidth = lineWidth;
    });
};

CanvasContext.prototype.setLineCap = function(lineCap) {
    this.missions.push(() => {
        this.ctx.lineCap = lineCap;
    });
};

CanvasContext.prototype.setLineJoin = function(lineJoin) {
    this.missions.push(() => {
        this.ctx.lineJoin = lineJoin;
    });
};

CanvasContext.prototype.setMiterLimit = function(miterLimit) {
    this.missions.push(() => {
        this.ctx.miterLimit = miterLimit;
    });
};

CanvasContext.prototype.rect = function(x, y, width, height) {
    this.missions.push(() => {
        this.ctx.rect(x, y, width, height);
    });
};

CanvasContext.prototype.fillRect = function(x, y, width, height) {
    this.missions.push(() => {
        this.ctx.fillRect(x, y, width, height);
    });
};

CanvasContext.prototype.strokeRect = function(x, y, width, height) {
    this.missions.push(() => {
        this.ctx.strokeRect(x, y, width, height);
    });
};

CanvasContext.prototype.clearRect = function(x, y, width, height) {
    this.missions.push(() => {
        this.ctx.clearRect(x, y, width, height);
    });
};

CanvasContext.prototype.fill = function() {
    this.missions.push(() => {
        this.ctx.fill();
    });
};

CanvasContext.prototype.stroke = function() {
    this.missions.push(() => {
        this.ctx.stroke();
    });
};

CanvasContext.prototype.beginPath = function() {
    this.missions.push(() => {
        this.ctx.beginPath();
    });
};

CanvasContext.prototype.closePath = function() {
    this.missions.push(() => {
        this.ctx.closePath();
    });
};

CanvasContext.prototype.moveTo = function(x, y) {
    this.missions.push(() => {
        this.ctx.moveTo(x, y);
    });
};

CanvasContext.prototype.lineTo = function(x, y) {
    this.missions.push(() => {
        this.ctx.lineTo(x, y);
    });
};

CanvasContext.prototype.arc = function(
    x,
    y,
    r,
    sAngle,
    eAngle,
    counterclockwise
) {
    this.missions.push(() => {
        this.ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
    });
};

CanvasContext.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.missions.push(() => {
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    });
};

CanvasContext.prototype.clip = function() {
    this.missions.push(() => {
        this.ctx.clip();
    });
};

CanvasContext.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
    this.missions.push(() => {
        this.ctx.quadraticCurveTo(cpx, cpy, x, y);
    });
};

CanvasContext.prototype.scale = function(scaleWidth, scaleHeight) {
    this.missions.push(() => {
        this.ctx.scale(scaleWidth, scaleHeight);
    });
};

CanvasContext.prototype.rotate = function(rotate) {
    this.missions.push(() => {
        this.ctx.rotate(rotate);
    });
};

CanvasContext.prototype.translate = function(x, y) {
    this.missions.push(() => {
        this.ctx.translate(x, y);
    });
};

CanvasContext.prototype.setFontSize = function(fontSize) {
    this.missions.push(() => {
        this.ctx.font = fontSize;
    });
};

CanvasContext.prototype.fillText = function(text, x, y, maxWidth) {
    this.missions.push(() => {
        this.ctx.fillText(text, x, y, maxWidth);
    });
};

CanvasContext.prototype.drawImage = function(
    imageResource,
    dx,
    dy,
    dWidth,
    dHeight,
    sx,
    sy,
    sWidth,
    sHeight
) {
    this.missions.push(() => {
        this.ctx.drawImage(
            imageResource,
            dx,
            dy,
            dWidth,
            dHeight,
            sx,
            sy,
            sWidth,
            sHeight
        );
    });
};

CanvasContext.prototype.setGlobalAlpha = function(alpha) {
    this.missions.push(() => {
        this.ctx.globalAlpha = alpha;
    });
};

CanvasContext.prototype.setLineDash = function(segments, offset) {
    this.missions.push(() => {
        this.ctx.setLineDash(segments, offset);
    });
};

CanvasContext.prototype.transform = function(
    scaleX,
    skewX,
    skewY,
    scaleY,
    translateX,
    translateY
) {
    this.missions.push(() => {
        this.ctx.transform(
            scaleX,
            skewX,
            skewY,
            scaleY,
            translateX,
            translateY
        );
    });
};

CanvasContext.prototype.setTransform = function(
    scaleX,
    skewX,
    skewY,
    scaleY,
    translateX,
    translateY
) {
    this.missions.push(() => {
        this.ctx.setTransform(
            scaleX,
            skewX,
            skewY,
            scaleY,
            translateX,
            translateY
        );
    });
};

CanvasContext.prototype.save = function() {
    this.missions.push(() => {
        this.ctx.save();
    });
};

CanvasContext.prototype.restore = function() {
    this.missions.push(() => {
        this.ctx.restore();
    });
};

CanvasContext.prototype.draw = function(reserve = false, callback = () => {}) {
    if (!reserve) {
        this.height = this.height;
    }
    this.missions.forEach(mission => {
        mission();
    });
    callback();
};

CanvasContext.prototype.measureText = function(text) {
    return this.ctx.measureText(text);
};

function createCanvasContext(canvasId) {
    return new CanvasContext(canvasId);
}

function canvasToTempFilePath() {
    console.warn('暂未实现');
    // const canvasId = options && options.canvasId;
    // const canvasDom = document.getElementById(canvasId);
    // if (!canvasDom || !canvasDom.getContext) {
    //   console.error('canvasId错误，或浏览器不支持canvas');
    // } else {
    //   location.href = canvasDom.toDataURL('image/png').replace("image/png", "image/octet-stream");
    // }
}

export default {
    createCanvasContext,
    canvasToTempFilePath
};
