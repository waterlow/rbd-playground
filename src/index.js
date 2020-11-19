import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial_data'
import Column from './column'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialData;
  }

  onDragEnd = result => {
    // todo
  }

  render() {
    return (<DragDropContext onDragEnd={this.onDragEnd}>
      {this.state.columnOrder.map(columnId => {
        const column = this.state.columns[columnId];
        const tasks  = column.taskIds.map(i => this.state.tasks[i]);

        return <Column key={columnId} column={column} tasks={tasks}/>
      })}
    </DragDropContext>
)
  }
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
