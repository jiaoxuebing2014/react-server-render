import React, {Children, cloneElement} from 'react';

class Root extends React.Component {
    componentWillMount() {

    }

    render() {
        const {children, ...props} = this.props;
        return (
            <div className='page-content'>
                {Children.map(children, child =>
                    cloneElement(child, {...props})
                )}
            </div>
        )
    }
}

export default Root;
