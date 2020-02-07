import React, { Component } from 'react';
import { Image } from 'react-konva';

export default class AZS_Image extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         _W: this.props._W,
         _H: this.props._H,
         _X: this.props._X,
         _Y: this.props._Y,
         Image: null,
         el: this.props.el,
      };
   }
   componentDidMount() {
      this.loadImage();
   }
   componentDidUpdate(oldProps) {
      if (oldProps.Image !== this.props.Image) {
         this.loadImage();
      }
   }
   componentWillUnmount() {
      this.image.removeEventListener('load', this.handleLoad);
   }
   loadImage() {
      this.image = new window.Image();
      this.image.src = this.props.Image;
      this.image.addEventListener('load', this.handleLoad);
   }
   handleLoad = () => {
      this.setState({ Image: this.image });
   };

   render() {
      
      return (
         <>
            <Image onClick={el => {
               this.props.on_Click != null &&
                  this.props.on_Click(this.state.el)
            }}
               image={this.state.Image}
               width={this.state._W}
               height={this.state._H}
               x={this.state._X}
               y={this.state._Y}
               onMouseover={el => {
                  this.props.show_Message != null &&
                     this.props.show_Message(this.props.message)
               }}
            />
         </>
      );
   }
}