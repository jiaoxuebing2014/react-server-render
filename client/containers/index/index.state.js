import { observable, action, computed, useStrict } from 'mobx';

class indexState {
    constructor(rootStore){
        this.rootStore = rootStore;
    }

    @observable container = {
        ruleText	: 'Mobx状态',
        cont        : undefined
    };

    @action startGame(){
        this.container.ruleText = '"修改过的Mobx"';
    };
}

export default indexState;
