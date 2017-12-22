import {observable, action, computed, useStrict} from 'mobx';

class AppState {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable initStore = {};

}

export default AppState;
