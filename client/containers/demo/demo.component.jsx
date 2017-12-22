import React from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import {indexState, demoState} from '../../config/stores';
import './demo.scss';

import F2 from '@antv/f2';

import SVG from 'svg.js';

import html2canvas from 'html2canvas';

@observer
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img:''
        };
    }

    componentWillMount() {

    }

    focusTextInput() {
        this.textInput.focus();
    }

    componentDidMount() {
        this.focusTextInput();

        //SVG
        let draw = SVG(this.refs['svgDemo']);
        draw.rect(100, 100).fill('#f06');

        //F2
        const data = [
            { genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 },
        ];
        const chart = new F2.Chart({
            el: this.refs['canvasDemo'], //HTMLElement
            width: 500, // 指定图表宽度
            height: 300 // 指定图表高度
        });
        chart.source(data);
        chart.interval().position('genre*sold').color('genre');
        chart.render();

        //html2canvas
        html2canvas(this.refs['demo'])
            .then((canvas) => {
                this.setState({
                    img: canvas.toDataURL('image/png')
                })
            });
    }

    render() {
        return (
            <div className='demo' ref='demo'>
                <div>Demo Page</div>
                <canvas ref='canvasDemo'/>
                <div ref='svgDemo'/>
                <br/>
                <div>
                    <input ref={input => this.textInput = input}/>
                    <button onClick={() => {
                        demoState.setTxt()
                    }}>点击
                    </button>
                    <h4>{demoState.txt || indexState.container.ruleText}</h4>
                </div>
                <br/>
                <Link to='/'>跳回到首页</Link><br/><br/>
                <div>
                    <button onClick={() => {
                        demoState.getJson()
                    }}>请求Api
                    </button>
                    <h3>{demoState.apiJsonTxt}</h3>
                </div>
                <img src={this.state.img} style={{width:'100%',border:'red solid 5px'}}/>
            </div>
        )
    }
}

export default Index;
