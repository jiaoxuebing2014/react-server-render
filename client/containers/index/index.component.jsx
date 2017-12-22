import React from 'react';
import {observer} from 'mobx-react';
import {Button,Icon, Grid} from 'antd-mobile';
import './index.scss';
import {indexState} from '../../config/stores';

@observer
class Index extends React.Component {
    constructor(props){
        super(props);
    }

    look=()=>{
        indexState.container.cont = 3;
        indexState.startGame();
        this.setInterFn = setInterval(()=>{
            indexState.container.cont -=1;
            if(indexState.container.cont<=0) {
                this.props.router.push('demo');
            }
        },1000)
    };

    componentWillUnmount(){
        clearInterval(this.setInterFn);
    }

    render() {
        const list = [
            'check-circle', 'check', 'check-circle-o',
            'cross-circle', 'cross', 'cross-circle-o',
            'up', 'down', 'left',
            'right', 'ellipsis',
            'loading',
        ];
        const data = list.map(item => ({
            icon: (<Icon type={item} />),
            text: item,
        }));
        return (
            <div className='page index' >
                <div onClick={this.look}>
                    跳转到Demo页面
                </div>
                <Grid data={data} columnNum={3} hasLine={false} activeStyle={false} />
                <Button>antd Mobile</Button>
                <div><br /><br />{indexState.container.cont}</div>
                <div>{indexState.container.ruleText}</div>
            </div>
        )
    }
}

export default Index;
