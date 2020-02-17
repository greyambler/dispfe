import React from 'react';
import { demoAsyncCall } from '../core/core_Function.jsx'


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

    // Ждать
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