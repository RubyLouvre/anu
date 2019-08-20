export function mapStateToProps(state) {
    return {
        num: state.value,
        inputVal: state.inputVal
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        change: function(params) {
            dispatch({
                type: 'CHANGE',
                payload: params
            })
        }
    }
}