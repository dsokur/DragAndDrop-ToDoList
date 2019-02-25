import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ReactTooltip from 'react-tooltip';
import AppContext from './app-context';

export default class Task extends Component {
  state = {
    //needs for changing icons from edit to save and for enabling/disabling textarea field for editing
    toggleEdit: true
  };
  static contextType = AppContext;
  //enable task edit, focus on field
  enableTaskEdit = (id) => {
    //enable edit by toggling state
    this.setState(prevState => ({
      toggleEdit: !prevState.toggleEdit
    }));
    //focus on current task by id
    setTimeout(() => {
      document.getElementById(id).focus()
    }, 0);
  };

  render () {
    return (
      <Draggable
        draggableId={this.props.task.id}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            //based on item is dragging or not change class with different styles
            className={'task' + (snapshot.isDragging ? '-dragging' : '')}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <button onClick={() => this.context.changeLists(this.props.task.id,this.props.columnId,this.props.index)} data-tip='Complet'
                    data-for='task_check' className='task_check'
                    data-effect="solid" data-place="bottom" data-delay-show='800'>
              <i className="far fa-circle task_check-circle" color='#4285f4'/>
              <i className="fas fa-check task_check-checkmark" color='#4285f4'/>
              <ReactTooltip id='task_check'/>
            </button>
            <textarea type="text"
                      id={this.props.task.id} /*assign item id as textarea id to capture it by getElement*/
                      value={this.props.task.content}
                      onChange={(e) => this.context.handleEditTask(this.props.task.id, e)} /*transfer element id to editTask method */
                      disabled={this.state.toggleEdit}
            />
            <button onClick={() => this.enableTaskEdit(this.props.task.id)} className='task_edit'>
              {this.state.toggleEdit
                ? <i className="fas fa-edit task_edit-pen" data-for='task_edit-pen' data-tip='Edit'
                     data-effect="solid" data-place="bottom" data-delay-show='800'/>
                : <i className="far fa-save task_edit=save" data-for='task_edit-pen' data-tip='Save'
                     data-effect="solid" data-place="bottom" data-delay-show='800'/>
              }
              <ReactTooltip id='task_edit-pen'/>
              <ReactTooltip id='task_edit-save'/>
            </button>
            <button onClick={() => this.context.deleteTask(this.props.task.id,this.props.columnId)} data-tip='Delete' data-for='task_delete'
                    className='task_delete' data-effect="solid" data-place="bottom" data-delay-show='800'>
              <i className="far fa-trash-alt"/>
              <ReactTooltip id='task_delete'/>
            </button>
          </div>
        )}
      </Draggable>
    );
  }
}

