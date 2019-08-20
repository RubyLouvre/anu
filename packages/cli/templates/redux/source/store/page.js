
export function mapStateToProps(state) {
    return {
        value: state.value
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        add: function() {
            dispatch({
                type: 'ADD'
            });
        },
        minus: function() {
            dispatch({
                type: 'MINUS'
            });
        }
    }
}