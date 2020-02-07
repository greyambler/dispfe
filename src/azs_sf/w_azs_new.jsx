import React from 'react';

import W_table_azs from './w_table_azs_new.jsx'

const _Debuge = false;


export default class w_azs_new extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            List_dvc_azs: this.props.list_dvc_azs,
        }
    }

    render() {
        return (
            <W_table_azs
                w_Height={this.props.w_Height}
                w_Width={this.props.w_Width}
                history={this.props.history}
                list_fuels={this.props.list_fuels}

                List_dvc_azs={this.state.List_dvc_azs}

                list_book_row={this.props.list_book_row}

            />
        );
    }
}
