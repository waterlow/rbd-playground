import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset'
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from './initial_data'
import Column from './column'

const Container = styled.div`
  display: flex;
`

class InnerList extends React.PureComponent {
  render() {
    const { column, taskMap, index } = this.props
    const tasks  = column.taskIds.map(i => taskMap[i])

    return <Column column={column} tasks={tasks} index={index}/>
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialData;
  }

  onDragEnd = result => {
    const { destination, source, draggableId, type } = result
    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if(type === 'column') {
      const newColumnOrder = [...this.state.columnOrder]
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      }
      this.setState(newState)
      return
    }

    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    if (start === finish) {
      const column = this.state.columns[source.droppableId]
      const newTaskIds = [...column.taskIds]

      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)
      const newColumn = {
        ...column,
        taskIds: newTaskIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        }
      }

      this.setState(newState)
      return
    }

    const startTaskIds = [...start.taskIds]
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = [...finish.taskIds]
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    }
    this.setState(newState)
  }

  render() {
    return (<DragDropContext onDragEnd={this.onDragEnd}>
      <Droppable
        droppableId="all-columns"
        direction="horizontal"
        type="column"
      >
        {provided => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {this.state.columnOrder.map((columnId, index) => {
              const column = this.state.columns[columnId];

              return <InnerList key={columnId} column={column} taskMap={this.state.tasks} index={index}/>
            })}
            {provided.placeholder}
          </Container>
        )
}
      </Droppable>
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
