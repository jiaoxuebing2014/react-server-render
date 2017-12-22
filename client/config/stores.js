import AppState from '../app.state';
import IndexState from '../containers/index/index.state';
import DemoState from '../containers/demo/demo.state';

class RootStore {
    constructor(){
        this.appState = new AppState(this);
        this.indexState = new IndexState(this);
        this.demoState = new DemoState(this);
    }
}

export default new RootStore();
