import React, { startTransition } from 'react';
import './style.css';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import "bootstrap/dist/css/bootstrap.min.css";
import $ from 'jquery';
import thunk from 'redux-thunk';
import {PropTypes} from 'prop-types';
import {marked} from 'marked';

//############### Redux part 1 ################################
const ADDED_STRING = 'ADDED_STRING'; //Defining action types

const defaultString = "# Welcome to my React Markdown Previewer!\n\n## This is a sub-heading...\n### And here's some other cool stuff:\n\nHeres some code, `<div></div>`, between 2 backticks.\n\n```\n// this is multi-line code:\n\nfunction anotherExample(firstLine, lastLine) {\n  if (firstLine == '```' && lastLine == '```') {\n    return multiLineCode;\n }\n}\n```\n\nYou can also make text **bold**... whoa!\nOr _italic_.\nOr... wait for it... **_both!_**\nAnd feel free to go crazy ~~crossing stuff out~~.\n\nThere's also [links](https://www.freecodecamp.org), and\n> Block Quotes!\n\nAnd if you want to get really crazy, even tables:\n\nWild Header | Crazy Header | Another Header?\n------------ | ------------- | -------------\nYour content can | be here, and it | can be here....\nAnd here. | Okay. | I think we get it.\n\n- And of course there are lists.\n  - Some are bulleted.\n     - With different indentation levels.\n        - That look like this.\n\n\n1. And there are numbered lists too.\n1. Use just 1s if you want!\n1. And last but not least, let's not forget embedded images:\n\n![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)"; 

//##################For added string text #####################
const addedStringActionCreator = (input) => ({
	type: ADDED_STRING,
	input
});

const addedStringReducer = (state=defaultString, action) => {
	switch(action.type){
		case ADDED_STRING:
			return action.input;
		default:
			return state;
	}
};

const store = createStore(addedStringReducer);
//############### Redux ends ##################################


const buttonCSS = {backgroundColor: "transparent", border: "none", margin: 0, padding: 0}; // this css is for the buttons

//The editor component
const Editor = (props) =>{
	return(
		<>
		<div id="myEditor" className="shadow-lg">
			<div className="myHeader">
				<p><span className="barText">Editor</span><span className="symbol" ><button style={buttonCSS } onClick={props.clickme}>{(props.window)?(<i className="fa-solid fa-minimize"></i>):(<i className="fa-solid fa-maximize"></i>)}</button></span></p>
			</div>
			<textarea id="editor" name="myText" onChange={props.change} value={props.value}  ></textarea>
		</div>
		</>
	);
};
Editor.propTypes={
	value: PropTypes.string.isRequired,
	clickme: PropTypes.func.isRequired,
	change: PropTypes.func.isRequired,
	window: PropTypes.bool.isRequired
};// setting propTypes for Editor component

//The Previwewr Component
const Previewer = (props) => {
	return(
		<>
			<div id="myPreview" className='shadow-lg'>
				<div className="myHeader">
					<p><span className="barText">Previewer</span><span className="symbol"><button style={buttonCSS} onClick={props.clickme}>{(props.window)?(<i className="fa-solid fa-minimize"></i>):(<i className="fa-solid fa-maximize"></i>)}</button></span></p>
				</div>
				<div id="preview" dangerouslySetInnerHTML={{__html: marked.parse(props.input,{gfm: true, breaks: true})}}></div>
			</div>
		</>	
	);
};
Previewer.propTypes = {
	input: PropTypes.string.isRequired,
	clickme: PropTypes.func.isRequired,
	window: PropTypes.bool.isRequired
};//Setting propTypes for previewer component
class Main extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			editorOpen: false,
			previewerOpen: false,
		};
		[this.handleChange, this.handleEditorClick, this.handlePreviewerClick] = [this.handleChange.bind(this), this.handleEditorClick.bind(this), this.handlePreviewerClick.bind(this)];
	}
	//Behaviour of the editor when button is clicked
	handleEditorClick(){
		if(this.state.editorOpen === false){
			$('#editor').addClass('zoomEditor');
			$('#myEditor').addClass('zoomMyEditor');
			$('#myPreview').fadeOut(300);
		}else{
			$('#editor').removeClass('zoomEditor');
			$('#myEditor').removeClass('zoomMyEditor');
			$('#myPreview').fadeIn(300);
		}
		this.setState(state => {
			if(state.editorOpen === false){
				return {editorOpen: true};
			}else{
				return {editorOpen: false};
			}
		});
	}
	//Editor button behaviour ends here

	//Behaviour of the previewer when button is clicked
	handlePreviewerClick(){
		if(this.state.previewerOpen === false){
			$('#myEditor').fadeOut(300);
		}else{
			$('#myEditor').fadeIn(600);
		}
		this.setState(state => {
			if(state.previewerOpen === false){
				return {previewerOpen: true};
			}else{
				return {previewerOpen: false};
			}
		});
	}
	//Previewer behaviour ends here
	
	//Responsible for typing in text
	//Commenting handleChange out will disable typing
	handleChange(event){
		this.props.newInput(event.target.value);
		this.setState({
			input: event.target.value
		});
	}
	//When page first loads background color is set as seen
	componentWillMount(){
		$('body').css("background-color", "#b6ad90")
	}

	render(){
		return (
			<div className='container-fluid'>
				<Editor clickme={this.handleEditorClick} window={this.state.editorOpen} change={this.handleChange} value={this.props.input} />
				<Previewer clickme={this.handlePreviewerClick} input={this.props.input} window={this.state.previewerOpen} />
			</div>
		);
	}
};

//REDUX part 2
const mapStateToProps = (state) =>({
	input: state
});//Converting redux states to properties
//Can be accessed only as props

const mapDispatchToProps = (dispatch) => ({
	newInput: (input) => (dispatch(addedStringActionCreator(input))) 
});// Converting redux Dispatch to props
//Functions can be accessed only as props

const Container = connect(mapStateToProps, mapDispatchToProps)(Main);
//all redux states and dispatch functions will only be accessed in Main
//For any other component to accessed redux property, it must do
//This through the Main stateful component

export default class AppWrapper extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<Provider store={store}>
				<Container />
			</Provider>
		);
	}
};
