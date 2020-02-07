import React from 'react';
import {
  demoAsyncCall, saveToken, RSS_AZS_EDIT, set_Curent_Login,
  get_Curent_Login, refreshPage, createGuid
} from '../core/core_Function.jsx'

/*
import CheckboxTree from 'react-checkbox-tree';

 import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import 'font-awesome/css/font-awesome.min.css';


const nodes = [{
  value: 'mars',
  label: 'Mars',
  children: [
    { value: 'phobos', label: 'Phobos' },
    { value: 'deimos', label: 'Deimos' },
  ],
}];

export default class test_Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      expanded: [],

      seach_Text: "",
    };
  }

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <CheckboxTree nodes={nodes} checked={this.state.checked}
        expanded={this.state.expanded} onCheck={checked => this.setState({ checked })}
        onExpand={expanded => this.setState({ expanded })}
      />


    );
  }
}
 */


export default class test_Check extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);

    this.state = {
      loading: true,

      w_Width: window.innerWidth,
      w_Height: window.innerHeight,
    }
  }
  handleResize() {
    this.setState({ w_Width: window.innerWidth, w_Height: window.innerHeight })
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidMount() {
    demoAsyncCall().then(() => this.setState({ loading: false }));
    window.addEventListener("resize", this.handleResize);
  }
  render() {
    let div_Null_Data = {
      minHeight: this.state.w_Height - 70,
      minWidth: this.state.w_Width - 50,
}

    /***** Ждать *****************/
    const { loading } = this.state;
    if (loading) {
      let stayle_1 = {
        marginTop: '130px',
      }
      return (
        <div align="center">
          <center><h1>Настройки.</h1></center>
          <img src='images/anim_engine.gif' style={stayle_1} />
          <hr width={this.state.w_Width - 50} />
        </div>
      );
    }
    return (
      <div style={div_Null_Data}>
        <center><h2>Настройки</h2></center>
        <hr width={this.state.w_Width - 50} />
      </div>
    );
  }
}