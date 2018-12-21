const postCss = require('postcss');

const postCssRemoveComments = postCss.plugin('postcss-plugin-remove-comment', ()=>{
    return (root)=>{
        root.walkComments(comment => {
            comment.remove();
        });
    };
});

module.exports = postCssRemoveComments;