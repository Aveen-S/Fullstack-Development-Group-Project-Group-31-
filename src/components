import Column from './Column';

const statuses = [
  'todo',
  'doing',
  'done',
];

function Board({
  tasks,
  onMoveTask,
  onCreateTask,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-5">

      {statuses.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter(
            (task) =>
              task.status === status
          )}
          onMoveTask={onMoveTask}
          onCreateTask={onCreateTask}
        />
      ))}

    </div>
  );
}

export default Board;
