import React, { Component } from 'react';
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';
import './App.scss';
import AppContext from './app-context';

export default class App extends Component {
  state = {
    tasks: {},
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'uncompleted',
        taskIds: []
      },
      'column-2': {
        id: 'column-2',
        title: 'completed',
        taskIds: []
      },
    },
    columnOrder: ['column-1','column-2'],
  };

  addTask = ()=> {
    if (this.inputElement.value !== '') {
      //form unique id that needs to be implemented in this.state.tasks.id and this.state.columns["column-1"].taskIds
      let key = ''+ Date.now();
      //form tasks obj that will be pushed to state
      let task = {
        [key]: {
          content: this.inputElement.value,
          id: key
        }
      };
      //make copy of out state for immutability
      let newTasks = Object.assign({}, this.state.tasks);
      //copy each task obj to our new state
      newTasks = Object.assign({},newTasks, task);
      //form taskIds array that will be pushed to state
      let newtaskIds = this.state.columns["column-1"].taskIds;
      newtaskIds.push(key);
      this.setState({
        ...this.state,
        columns: {
          ...this.state.columns,
          taskIds:  newtaskIds,
        },
        ...this.state,
        tasks: newTasks,
      });
      this.inputElement.value = '';
    }
  };

  handleKeyPress = (e) => {
    if (e.charCode === 13) {
      this.addTask()
    }
  };

  handleEditTask = (taskId, e) => {
    //update our task obj with value from onChange handler keeping id same
    let newTask = {
        content: e.target.value,
        id: taskId
    };
    //make copy of out state for immutability
    let newTasks = Object.assign({}, this.state.tasks);
    // spread new object find obj key that matches id and change to value to updated
    const newState = {
      ...newTasks,
      [taskId]: newTask
    };
    this.setState({
      tasks:newState
    });
  };

  deleteTask = (id,columnId) => {
    //copy this.state.tasks obj for immutability
    let newTasks = Object.assign({}, this.state.tasks);
    //delete obj value by passed id
    delete newTasks[id];
    //copy taskIds array for immutability
    let newtaskIds = this.state.columns[columnId].taskIds;
    //define index of element in array
    let index = newtaskIds.indexOf(id);
    //delete one item from current index
    newtaskIds.splice(index,1);
    //update state
    this.setState({
      ...this.state,
      columns: {
        ...this.state.columns,
        taskIds:  newtaskIds,
      },
      ...this.state,
      tasks: newTasks,
    });
  };

  changeLists = (taskId,columnId, index) =>{
    let newcolumnId = '';
    if(columnId === 'column-1'){
      newcolumnId = 'column-2';
    }
    else  newcolumnId = 'column-1';
    const start = this.state.columns[columnId];
    const finish = this.state.columns[newcolumnId];
    const startTaskIds = Array.from(start.taskIds);
    //remove dragged task id from this array
    startTaskIds.splice(index, 1);
    //create new start column which contains same props as old one  but with new start id's task array
    const newStart = {
      ...start,
      taskIds:startTaskIds,
    };
    //creating new array for finished task array
    const finishTaskIds = Array.from(finish.taskIds);
    //use splice id operator to insert taskId at the end of array
    finishTaskIds.splice(finishTaskIds.length, 0, taskId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    //create new state obj
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);
  };
  // synchronously update our state to reflect drag&drop results
  onDragEnd = result => {
    const {source, destination, draggableId} = result;
    //if there is no destination we need to do nothing
    if (!destination) {
      return;
    }
    //check if location of a draggable changed
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    //reorder task's id array for the column. We start by retrieving(извлечение) column from the state
    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];
    if (start === finish){
      //this will create new TaskIds array with same content as our last array to avoid state mutation
      const newTaskIds = Array.from(start.taskIds);
      //we now need to move taskId from it's old index to it's new index
      //from this index(current index of an item) we want to remove one item
      newTaskIds.splice(source.index, 1);
      //remove nothing, insert draggableId witch is now taskId
      newTaskIds.splice(destination.index, 0, draggableId);
      //now we create a new column with the same props as an old one but with a new taskIds array
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      //now when we have new column we going to update state. using object spread to maintain old props
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };
      this.setState(newState);
      return;
    }
    //moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    //remove dragged task id from this array
    startTaskIds.splice(source.index, 1);
    //create new start column which contains same props as old one  but with new start id's task array
    const newStart = {
      ...start,
      taskIds:startTaskIds,
    };
    //creating new array for finished task array
    const finishTaskIds = Array.from(finish.taskIds);
    //use splice id operator to insert draggable id at destination index
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    //create new state obj
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);
  };
  //taskIds indicates ownership and maintain order

  render () {
    return (
      <AppContext.Provider value={{ handleEditTask: this.handleEditTask, deleteTask:this.deleteTask, changeLists:this.changeLists }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className='todolist'>
            <div className='todolist_input'>
              <input ref={(a) => this.inputElement = a} onKeyPress={(e) => this.handleKeyPress(e)} type="text"/>
              <a data-tip='submit' data-place="bottom" data-delay-show='1000' data-type="dark"
                 className='todolist_input_add'
                 data-scroll-hide='true'
                 data-effect="solid"
                 onClick={this.addTask} type='submit'
              >
                <i className="fas fa-angle-right arrowRight"/>
              </a>
            </div>
          </div>
          <div className='content'>
            {this.state.columnOrder.map(columnId => {
              const column = this.state.columns[columnId];
              //get tasks associated with that column
              const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
              return <Column key={column.id} column={column} tasks={tasks}/>
            })}
          </div>
        </DragDropContext>
      </AppContext.Provider>
    );
  }
}

