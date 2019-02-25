import React, { Component } from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';


export default class Column extends Component {
  render () {
    // console.log(this.props.tasks.length);
    return (
      <div className={this.props.column.title} style = {this.props.tasks.length === 0 ? {display: 'none'} :  {display: 'block'}}>
        {/*<h3>{this.props.column.title}</h3>*/}
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <div
              className={'test' + (snapshot.isDraggingOver ? '-dragging' : '')}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {this.props.tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} columnId={this.props.column.id}/>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

      </div>
    );
  }
}
