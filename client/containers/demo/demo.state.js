import { observable, action} from 'mobx';
import axios from 'axios';

class demoState{
    constructor(rootStore){
        this.rootStore = rootStore;
        console.log(this.rootStore)
    }
    @observable txt = '';
    @observable apiJsonTxt = '';

    @action setTxt(){
        let ruleTxt = this.rootStore.indexState.container.ruleText;
        if(ruleTxt=='Mobx状态'){
            this.rootStore.indexState.startGame();
        }
        this.txt = '在Demo页面修改首页的Mobx：'+this.rootStore.indexState.container.ruleText;
    }

    @action getJson(){
        axios.get('/user/getUserInfo').then((res)=>{
            this.apiJsonTxt = JSON.stringify(res.data)
        })
    }
}

export default demoState;