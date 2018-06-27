export class Component extends React.Component {
    constructor(props, context) {
        super(props, context)
        if (this.created) {
            this.created()
        }
    }
    componentWillMount() {
        if (this.attached) {
            this.attached()
        }
    }
    componentDidMount() {
        if (this.ready) {
            this.ready()
        }
    }
    componentDidUpdate() {
        var fiber = this._reactInternalFiber;
        if (fiber.index !== fiber.alternate.index && this.moved) {
            this.moved()
        }
    }
    componentWillUnmount() {
        if (this.detached) {
            this.detached()
        }
    }
}

export class App extends React.Component {
    componentDidMount() {
        if (this.onLaunch) {
            this.onLaunch()
        }
    }
}

export class Page extends React.Component {
    componentWillMount() {
        if (this.onLoad) {
            this.onLoad()
        }
    }
    componentDidMount() {
        if (this.onReady) {
            this.onReady()
        }
    }
    componentWillUnmount() {
        if (this.onUnload) {
            this.onUnload()
        }
    }
}