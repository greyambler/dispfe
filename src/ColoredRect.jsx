import React from 'react';
import ReactDOM from 'react-dom';

import { Stage, Layer, Rect, Circle, Text, Tag, Arrow, Shape, TextPath, Label, Arc, Ellipse } from 'react-konva';
import Konva from 'konva';

class ColoredRect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: 'green',
            label: '',
            x: '',
            y: ''
        };


        this.handleClick = () => {
            this.setState({
                color: Konva.Util.getRandomColor()
            });
        };


    }

    render() {
        return (
            <Rect
                x={20}
                y={20}
                width={50}
                height={50}
                fill={this.state.color}
                shadowBlur={5}
                onClick={this.handleClick}
            />
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: 'green',
            label: '',
            mouse_x: '',
            mouse_y: '',
            label_x: 100,
            label_y: 300
        };

        this._onMouseMove = (e) => {

            console.log('moved mouse = -------------------- ' + 3207);
            console.log(e);
            console.log(e.nativeEvent);
            e.preventDefault;
            this.setState({ mouse_x: e.screenX, mouse_y: e.screenY });
        }

    }



    render() {
        return (
            <div >
                <Stage onMouseMove={this._onMouseMove} width={window.innerWidth} height={window.innerHeight}>
                    <Layer>
                        <Text text="Try click on rect" />
                        <ColoredRect />
                        <Circle
                            x={window.innerWidth / 4}
                            y={window.innerHeight / 4}
                            radius={70}
                            fill={'red'}
                            stroke={'black'}
                            strokeWidth={4}
                            onClick={() => { alert('Cliked me') }}
                        />
                        <Text
                            text={'Test Text position'}
                            x={window.innerWidth / 4}
                            y={window.innerHeight / 4}
                            fontSize={30}
                            fontFamily={'Arial'}
                            fill={'green'}
                            onClick={() => { alert('text??') }}
                        />

                        <Arrow
                            x={window.innerWidth / 4}
                            y={window.innerHeight / 4}
                            points={[0, 0, window.innerWidth / 2, window.innerHeight / 2]}
                            pointerLength={3}
                            pointerWidth={3}
                            fill={'black'}
                            stroke={'blue'}
                            strokeWidth={80}
                            onMouseover={() => {
                                this.setState({
                                    label: 'x=' + this.state.mouse_x + ', ' + 'y= ' + this.state.mouse_y,
                                    label_x: this.state.mouse_x,
                                    label_y: this.state.mouse_y
                                }, () => { console.log('label=' + this.state.label) })
                            }}
                        />

                        <Shape
                            x={5}
                            y={500}
                            fill={'green'}
                            sceneFunc={(context, shape) => {
                                context.beginPath();
                                context.moveTo(200, 50);
                                context.lineTo(420, 80);
                                context.quadraticCurveTo(300, 100, 260, 170);
                                context.closePath();
                                // Konva specific method
                                context.fillStrokeShape(shape);
                            }
                            }
                        />

                        <TextPath
                            x={0}
                            y={50}
                            fill={'#333'}
                            fontSize={16}
                            text={'All the world\'s a stage, and all the men and women merely players.'}
                            data={'M10,10 C0,0 10,150 100,100 S300,150 400,50'}
                        />

                    </Layer>

                    <Layer>


                        <Label
                            x={this.state.label_x}
                            y={this.state.label_y}>

                            <Tag
                                fill={'black'}

                                fontFamily={'Calibri'}
                                fontSize={18}
                                padding={5}
                                pointerDirection={'down'}
                                pointerWidth={10}
                                pointerHeight={10}
                                lineJoin={'round'}
                                shadowColor={'black'}
                                shadowBlur={10}
                                shadowOffset={10}
                                shadowOpacity={0.5}
                            />
                            <Text

                                text={this.state.label}
                                fontFamily={'Calibri'}
                                fontSize={18}
                                padding={5}
                                fill={'white'}
                            />
                        </Label>


                        <Arc
                            x={150}
                            y={window.innerHeight - 200}
                            innerRadius={40}
                            outerRadius={120}
                            angle={60}
                            fill={'red'}
                            stroke={'red'}
                            strokeWidth={4}
                            rotation={0}
                        />

                        <Arc
                            x={150}
                            y={window.innerHeight - 200}
                            innerRadius={40}
                            outerRadius={120}
                            angle={60}
                            fill={'green'}
                            stroke={'green'}
                            strokeWidth={4}
                            rotation={60}
                        />
                        <Arc
                            x={150}
                            y={window.innerHeight - 200}
                            innerRadius={40}
                            outerRadius={120}
                            angle={60}
                            fill={'yellow'}
                            stroke={'yellow'}
                            strokeWidth={4}
                            rotation={120}
                        />

                        <Arc
                            x={150}
                            y={window.innerHeight - 200}
                            innerRadius={40}
                            outerRadius={120}
                            angle={60}
                            fill={'blue'}
                            stroke={'blue'}
                            strokeWidth={4}
                            rotation={180}
                        />

                        <Arc
                            x={150}
                            y={window.innerHeight - 200}
                            innerRadius={40}
                            outerRadius={120}
                            angle={120}
                            fill={'orange'}
                            stroke={'orange'}
                            strokeWidth={4}
                            rotation={60 + 180}
                        />


                        <Ellipse
                            x={400}
                            y={window.innerHeight - 200}
                            radius={{ x: 100, y: 50 }}
                            fill={'yellow'}
                            stroke={'black'}
                            strokeWidth={4}

                        />


                    </Layer>



                </Stage>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('konvaid1')
);